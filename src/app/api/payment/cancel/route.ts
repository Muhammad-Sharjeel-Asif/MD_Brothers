import { NextResponse } from 'next/server';
import { adminClient } from '@/sanity/lib/adminClient';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
        }

        // Validate the order exists and hasn't been completed already via webhooks
        const existingOrder = await adminClient.getDocument(orderId);
        
        if (!existingOrder) {
             return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
        }

        if (existingOrder.paymentStatus === 'completed') {
             // Race condition: Webhook already marked it complete before cancellation registered
             return NextResponse.json({ success: true, message: 'Order already completed natively' });
        }

        // Apply cancellation patches securely natively
        await adminClient.patch(orderId).set({
            paymentStatus: 'cancelled',
            status: 'cancelled'
        }).commit();

        console.log(`Order ${orderId} successfully marked as cancelled via user invocation.`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error securely cancelling order:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to terminate order status.' },
            { status: 500 }
        );
    }
}
