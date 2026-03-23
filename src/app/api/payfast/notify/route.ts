import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminClient } from '@/sanity/lib/adminClient';

export async function POST(request: Request) {
    try {
        const bodyText = await request.text();
        const params = new URLSearchParams(bodyText);
        const data: Record<string, string> = {};

        for (const [key, value] of params.entries()) {
            data[key] = value;
        }

        const signatureFromPayFast = data.signature;
        delete data.signature; // Remove signature to calculate our own hash

        // 1. Verify Signature
        const passphrase = process.env.PAYFAST_PASSPHRASE || '';
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
            // We still return 200 to acknowledge receipt to PayFast, but we don't process it.
            return NextResponse.json({ error: 'Invalid Signature' }, { status: 400 });
        }

        // 2. Validate Payment Status
        const paymentStatus = data.payment_status;
        const orderId = data.m_payment_id;
        const pfPaymentId = data.pf_payment_id;
        const amountGross = data.amount_gross;

        if (paymentStatus === 'COMPLETE') {
            // Find the order
            const existingOrder = await adminClient.fetch(`*[_type == "order" && _id == $orderId][0]`, { orderId });
            
            if (!existingOrder) {
                console.error(`PayFast Webhook: Order ${orderId} not found.`);
                return new Response('Order not found', { status: 404 });
            }

            // Optional: verify amountGross is similar to existingOrder.totalPrice 
            // parseFloat(amountGross) >= existingOrder.totalPrice

            // Update the Sanity Order
            await adminClient.patch(orderId)
                .set({
                    paymentStatus: 'completed',
                    status: 'confirmed',
                    payfastTransactionId: pfPaymentId,
                    payfastSignature: signatureFromPayFast,
                })
                .commit();
                
            console.log(`Order ${orderId} successfully completed via PayFast.`);
        } else {
            console.log(`PayFast ITN for ${orderId}: Payment Status is ${paymentStatus}`);
            // Depending on architecture, you can handle 'FAILED' or 'PENDING' statuses.
        }

        // PayFast Requires a '200 OK' response for ITN
        return new Response('OK', { status: 200 });

    } catch (error) {
        console.error('PayFast ITN error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
