import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Stripe from 'stripe';
import { adminClient } from '@/sanity/lib/adminClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        if (!endpointSecret) {
            console.warn('Stripe webhook secret is missing. Skipping signature verification (Not for production).');
            event = JSON.parse(body) as Stripe.Event;
        } else {
            event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
        }
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const orderId = session.metadata?.orderId;
                const paymentIntentId = session.payment_intent as string;

                if (orderId) {
                    const existingOrder = await adminClient.getDocument(orderId);
                    if (existingOrder && existingOrder.paymentStatus === 'completed') {
                        console.log(`Order ${orderId} already completed. Ignoring webhook duplicate.`);
                        break;
                    }
                    await adminClient.patch(orderId).set({
                        paymentStatus: 'completed',
                        transactionId: paymentIntentId,
                        status: 'processing', // or mapped status based on business logic
                        stripeSessionId: session.id,
                        gateway: 'Stripe',
                        paymentTimestamp: new Date().toISOString(),
                    }).setIfMissing({ paymentLogs: [] }).append('paymentLogs', [
                        { _key: crypto.randomUUID(), gateway: 'Stripe', eventType: 'webhook received', transactionId: session.id, status: 'processing', timestamp: new Date().toISOString() },
                        { _key: crypto.randomUUID(), gateway: 'Stripe', eventType: 'payment completed', transactionId: paymentIntentId, status: 'success', timestamp: new Date().toISOString() }
                    ]).commit();
                    console.log(`Order ${orderId} marked as completed via webhook.`);
                }
                break;
            }
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const orderId = paymentIntent.metadata?.orderId; // Metadata may need to be mapped down to PI if used here

                if (orderId) {
                    await adminClient.patch(orderId).set({
                        paymentStatus: 'failed',
                    }).setIfMissing({ paymentLogs: [] }).append('paymentLogs', [
                        { _key: crypto.randomUUID(), gateway: 'Stripe', eventType: 'webhook received', transactionId: paymentIntent.id, status: 'failed', timestamp: new Date().toISOString() },
                        { _key: crypto.randomUUID(), gateway: 'Stripe', eventType: 'payment failed', transactionId: paymentIntent.id, status: 'failed', timestamp: new Date().toISOString() }
                    ]).commit();
                }
                break;
            }
            default:
                // Unhandled event type
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error) {
        console.error('Error processing webhook event:', error);
        return NextResponse.json({ error: 'Internal server error processing webhook' }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
