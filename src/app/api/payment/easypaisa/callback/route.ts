import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminClient } from '@/sanity/lib/adminClient';
import { getEnv } from '@/lib/env';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    let orderIdForRedirect = '';
    
    try {
        const formData = await request.formData();
        
        const payload: Record<string, string> = {};
        formData.forEach((value, key) => {
            payload[key] = value.toString();
        });

        const storeId = getEnv('EASYPAISA_STORE_ID');
        
        if (!storeId) {
             console.error('Easypaisa configuration is missing. Failing callback.');
             return NextResponse.redirect(`${new URL(request.url).origin}/checkout/success?status=error&message=ServerConfigurationError`, 302);
        }
        const orderId = payload['orderRefNum'] || payload['orderId']; // Sometimes returned explicitly or mapped
        const transactionId = payload['transactionId'];
        const responseCode = payload['responseCode'];
        const responseDesc = payload['responseDesc'];
        // original orderId passed might be in a hidden var or fetched through Sanity
        // For simplicity we will assume 'orderRefNum' maps to Sanity's transactionId eventually, and 'orderId' is our sanity doc id

        orderIdForRedirect = orderId; 

        if (payload['storeId'] !== storeId) {
             console.error('Store ID mismatch received from Easypaisa callback');
             return NextResponse.redirect(`${new URL(request.url).origin}/checkout/success?status=error&message=InvalidStoreId`, 302);
        }

        // Check response code: "0000" usually means success in Easypaisa
        if (responseCode === '0000') {
            
            // Duplicate Transaction Protection
            if (orderId) {
                // Fetch existing order securely to prevent double execution
                const existingOrder = await adminClient.getDocument(orderId);
                
                if (existingOrder && existingOrder.paymentStatus === 'completed') {
                    console.log(`Order ${orderId} is already marked as completed. Skipping.`);
                    return NextResponse.redirect(`${new URL(request.url).origin}/checkout/success?order_id=${orderId}&session_id=${transactionId}`, 302);
                }

                // Everything is valid, mark as processed.
                await adminClient.patch(orderId).set({
                    paymentStatus: 'completed',
                    transactionId: transactionId,
                    status: 'processing',
                    gateway: 'Easypaisa',
                    paymentTimestamp: new Date().toISOString(),
                }).setIfMissing({ paymentLogs: [] }).append('paymentLogs', [
                    { _key: crypto.randomUUID(), gateway: 'Easypaisa', eventType: 'webhook received', transactionId: transactionId, status: 'processing', timestamp: new Date().toISOString() },
                    { _key: crypto.randomUUID(), gateway: 'Easypaisa', eventType: 'payment completed', transactionId: transactionId, status: 'success', timestamp: new Date().toISOString() }
                ]).commit();

                console.log(`Easypaisa Order ${orderId} marked as completed.`);
                return NextResponse.redirect(`${new URL(request.url).origin}/checkout/success?order_id=${orderId}&session_id=${transactionId}`, 302);
            }
        } else {
             // Payment Failed / Cancelled
             if (orderId) {
                 await adminClient.patch(orderId).set({
                    paymentStatus: 'failed',
                 }).setIfMissing({ paymentLogs: [] }).append('paymentLogs', [
                    { _key: crypto.randomUUID(), gateway: 'Easypaisa', eventType: 'webhook received', transactionId: transactionId || 'unknown', status: 'failed', timestamp: new Date().toISOString() },
                    { _key: crypto.randomUUID(), gateway: 'Easypaisa', eventType: 'payment failed', transactionId: transactionId || 'unknown', status: 'failed', timestamp: new Date().toISOString() }
                 ]).commit();
             }
             console.error(`Easypaisa Payment failed for order ${orderId}: ${responseDesc}`);
             return NextResponse.redirect(`${new URL(request.url).origin}/checkout/success?order_id=${orderId}&status=failed&message=${encodeURIComponent(responseDesc || 'Payment Failed')}`, 302);
        }

        return NextResponse.redirect(`${new URL(request.url).origin}/checkout`, 302);

    } catch (error: any) {
        console.error('Easypaisa Callback Error:', error);
        return NextResponse.redirect(`${new URL(request.url).origin}/checkout/success?status=error&message=InternalServerError&order_id=${orderIdForRedirect}`, 302);
    }
}
