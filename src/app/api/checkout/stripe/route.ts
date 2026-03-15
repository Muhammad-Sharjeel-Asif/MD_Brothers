import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminClient } from '@/sanity/lib/adminClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-01-27.acacia' as any,
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, orderId, customerEmail } = body;

        // Fetch prices securely from Sanity
        const itemIds = items.map((item: any) => item._id);
        const products = await adminClient.fetch(`*[_type == "product" && _id in $ids]`, { ids: itemIds });

        const secureItems = items.map((item: any) => {
            const product = products.find((p: any) => p._id === item._id);
            if (!product) {
                throw new Error(`Product not found: ${item.title}`);
            }
            return {
                price_data: {
                    currency: 'pkr',
                    product_data: {
                        name: product.title,
                    },
                    unit_amount: Math.round(product.price * 100), // Secure price from db
                },
                quantity: item.quantity,
            };
        });

        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: secureItems,
            mode: 'payment',
            success_url: `${request.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
            cancel_url: `${request.headers.get('origin')}/checkout/payment-cancelled?order_id=${orderId}`,
            metadata: {
                orderId: orderId,
                customerEmail: customerEmail || 'unknown@example.com',
            },
        });

        await adminClient.patch(orderId).setIfMissing({ paymentLogs: [] }).append('paymentLogs', [{
            _key: Math.random().toString(36).substring(2, 9),
            gateway: 'Stripe',
            eventType: 'payment initiated',
            transactionId: session.id,
            status: 'pending',
            timestamp: new Date().toISOString()
        }]).commit();

        return NextResponse.json({ id: session.id, url: session.url });
    } catch (err: any) {
        console.error('Stripe error:', err);
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        );
    }
}
