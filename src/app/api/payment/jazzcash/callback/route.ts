import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminClient } from '@/sanity/lib/adminClient';
import { getEnv } from '@/lib/env';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        
        const payload: Record<string, string> = {};
        formData.forEach((value, key) => {
            payload[key] = value.toString();
        });

        const integritySalt = getEnv('JAZZCASH_INTEGERITY_SALT');
        const merchantId = getEnv('JAZZCASH_MERCHANT_ID');

        // Validate basic configuration
        if (!integritySalt) {
             console.error('Missing JAZZCASH_INTEGERITY_SALT');
             return NextResponse.redirect(`${new URL(request.url).origin}/checkout/success?status=error&message=ServerConfigurationError`, 302);
        }

        if (payload['pp_MerchantID'] !== merchantId) {
             console.error('Merchant ID mismatch received from callback');
             return NextResponse.redirect(`${new URL(request.url).origin}/checkout/success?status=error&message=InvalidMerchant`, 302);
        }

        // Verify Hash Authenticity
        const sortedKeys = Object.keys(payload).sort();
        let hashString = integritySalt;

        sortedKeys.forEach((key) => {
            if (key !== 'pp_SecureHash' && payload[key] !== '' && payload[key] !== null) {
                hashString += '&' + payload[key];
            }
        });

        const calculatedHash = crypto
            .createHmac('sha256', integritySalt)
            .update(hashString)
            .digest('hex')
            .toUpperCase();

        const receivedHash = (payload['pp_SecureHash'] || '').toUpperCase();

        if (calculatedHash !== receivedHash) {
             console.error('JazzCash Hash verification failed.');
             return NextResponse.redirect(`${new URL(request.url).origin}/checkout/success?status=error&message=PaymentVerificationFailed`, 302);
        }

        // Verification successful, check payment status natively
        const orderId = payload['pp_BillReference'];
        const responseCode = payload['pp_ResponseCode'];
        const transactionId = payload['pp_TxnRefNo'];

        if (responseCode === '000') {
            // Payment Success
            if (orderId) {
                const existingOrder = await adminClient.getDocument(orderId);
                if (existingOrder && existingOrder.paymentStatus === 'completed') {
                    console.log(`JazzCash Order ${orderId} is already marked as completed. Skipping.`);
                    return NextResponse.redirect(`${new URL(request.url).origin}/checkout/success?order_id=${orderId}&session_id=${transactionId}`, 302);
                }

                await adminClient.patch(orderId).set({
                    paymentStatus: 'completed',
                    transactionId: transactionId,
                    status: 'processing',
                    gateway: 'JazzCash',
                    paymentTimestamp: new Date().toISOString(),
                }).setIfMissing({ paymentLogs: [] }).append('paymentLogs', [
                    { _key: crypto.randomUUID(), gateway: 'JazzCash', eventType: 'webhook received', transactionId: transactionId, status: 'processing', timestamp: new Date().toISOString() },
                    { _key: crypto.randomUUID(), gateway: 'JazzCash', eventType: 'payment completed', transactionId: transactionId, status: 'success', timestamp: new Date().toISOString() }
                ]).commit();
                console.log(`JazzCash Order ${orderId} marked as completed.`);
                return NextResponse.redirect(`${new URL(request.url).origin}/checkout/success?order_id=${orderId}&session_id=${transactionId}`, 302);
            }
        } else {
             // Payment Failed / Cancelled
             if (orderId) {
                 await adminClient.patch(orderId).set({
                    paymentStatus: 'failed',
                 }).setIfMissing({ paymentLogs: [] }).append('paymentLogs', [
                    { _key: crypto.randomUUID(), gateway: 'JazzCash', eventType: 'webhook received', transactionId: transactionId || 'unknown', status: 'failed', timestamp: new Date().toISOString() },
                    { _key: crypto.randomUUID(), gateway: 'JazzCash', eventType: 'payment failed', transactionId: transactionId || 'unknown', status: 'failed', timestamp: new Date().toISOString() }
                 ]).commit();
             }
             return NextResponse.redirect(`${new URL(request.url).origin}/checkout/success?order_id=${orderId}&status=failed`, 302);
        }

        return NextResponse.redirect(`${new URL(request.url).origin}/checkout`, 302);

    } catch (error: any) {
        console.error('JazzCash Callback Error:', error);
        return NextResponse.redirect(`${new URL(request.url).origin}/checkout/success?status=error&message=InternalServerError`, 302);
    }
}
