import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-01-27.acacia',
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, orderId } = body;

        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map((item: any) => ({
                price_data: {
                    currency: 'pkr',
                    product_data: {
                        name: item.title,
                    },
                    unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents/smallest currency unit
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `${request.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
            cancel_url: `${request.headers.get('origin')}/checkout`,
            metadata: {
                orderId: orderId,
            },
        });

        return NextResponse.json({ id: session.id, url: session.url });
    } catch (err: any) {
        console.error('Stripe error:', err);
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        );
    }
}
