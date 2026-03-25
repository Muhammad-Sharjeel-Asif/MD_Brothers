import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAdminClient } from '@/sanity/lib/adminClient';
import { isPayFastConfigured, getEnv } from '@/lib/env';

export async function POST(request: Request) {
    try {
        const bodyText = await request.text();
        const params = new URLSearchParams(bodyText);
        const data: Record<string, string> = {};

        for (const [key, value] of params.entries()) {
            data[key] = value;
        }

        const signatureFromPayFast = data.signature;
        delete data.signature;

        // 1. Verify Configuration
        if (!isPayFastConfigured()) {
            console.error('PayFast Webhook received but PayFast is not configured.');
            return new Response('Not Configured', { status: 503 });
        }

        // 2. Verify Signature
        const passphrase = getEnv('PAYFAST_PASSPHRASE', '');
        const sortedKeys = Object.keys(data).sort();
        
        let signatureString = sortedKeys.map(key => {
            return `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, '+')}`;
        }).join('&');

        if (passphrase) {
            signatureString += `&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`;
        }

        const generatedSignature = crypto.createHash('md5').update(signatureString).digest('hex');

        if (generatedSignature !== signatureFromPayFast) {
            console.error('PayFast Signature Mismatch!', {
                received: signatureFromPayFast,
                generated: generatedSignature
            });
            return new Response('Invalid Signature', { status: 400 });
        }

        // 3. Process Payment
        const paymentStatus = data.payment_status;
        const orderId = data.m_payment_id;
        const pfPaymentId = data.pf_payment_id;

        if (paymentStatus === 'COMPLETE') {
            const adminClient = getAdminClient();
            if (!adminClient) {
                console.error('Failed to get admin client for PayFast webhook');
                return new Response('Database Error', { status: 500 });
            }

            // Find the order and check if it's already completed to prevent duplicates
            const existingOrder = await adminClient.fetch(`*[_type == "order" && _id == $orderId][0]`, { orderId });
            
            if (!existingOrder) {
                console.error(`PayFast Webhook: Order ${orderId} not found.`);
                return new Response('Order not found', { status: 404 });
            }

            if (existingOrder.paymentStatus === 'completed') {
                console.log(`PayFast Webhook: Order ${orderId} already marked as completed. Skipping.`);
                return new Response('OK', { status: 200 });
            }

            // Update the Sanity Order
            await adminClient.patch(orderId)
                .set({
                    paymentStatus: 'completed',
                    status: 'confirmed', // confirm order once payment is received
                    payfastTransactionId: pfPaymentId,
                    payfastSignature: signatureFromPayFast,
                    lastUpdated: new Date().toISOString()
                })
                .commit();
                
            console.log(`Order ${orderId} successfully completed via PayFast ITN.`);
        } else {
            console.log(`PayFast ITN received for ${orderId} but status is ${paymentStatus}. No action taken.`);
        }

        // PayFast Requires a '200 OK' response for ITN
        return new Response('OK', { status: 200 });

    } catch (error: any) {
        console.error('PayFast ITN error:', error);
        return new Response(error?.message || 'Internal Server Error', { status: 500 });
    }
}
