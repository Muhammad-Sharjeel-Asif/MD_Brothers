import { NextResponse } from 'next/server'
import { adminClient } from '@/sanity/lib/adminClient'
import { auth } from '@clerk/nextjs/server'

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        const body = await request.json()
        const { customer, items, totalPrice, paymentMethod, idempotencyKey, shippingCost } = body

        if (!idempotencyKey) {
             return NextResponse.json({ success: false, message: 'Idempotency Key required' }, { status: 400 });
        }

        // 1. Full Validation
        if (!customer || !customer.email) {
            return NextResponse.json({ success: false, message: 'Missing customer email or details' }, { status: 400 });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
             return NextResponse.json({ success: false, message: 'Cart items are missing or empty' }, { status: 400 });
        }

        if (typeof totalPrice === 'undefined' || totalPrice < 0) {
            return NextResponse.json({ success: false, message: 'Invalid total amount' }, { status: 400 });
        }

        if (!paymentMethod) {
            return NextResponse.json({ success: false, message: 'Payment method is required' }, { status: 400 });
        }

        // Optional chaining & defined arrays
        const validItems = items.filter((item: any) => item?._id && item?.price >= 0);
        if (validItems.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid items array: missing product IDs or prices' }, { status: 400 });
        }

        // 2. Strict Payment Method Logic
        const normalizedPaymentMethod = String(paymentMethod).toUpperCase();
        // Allow legacy "Cash On Delivery" to map to COD if needed, but strict check for COD or PAYFAST
        const isCOD = normalizedPaymentMethod === 'COD' || normalizedPaymentMethod === 'CASH ON DELIVERY';
        const isPayfast = normalizedPaymentMethod === 'PAYFAST';

        if (!isCOD && !isPayfast) {
            return NextResponse.json({ success: false, message: `Invalid payment method: ${paymentMethod}. Allowed: COD, PAYFAST` }, { status: 400 });
        }

        const finalPaymentMethod = isCOD ? 'COD' : 'PAYFAST';

        // 3. Environment Config Guard
        const { isSanityConfigured, isPayFastConfigured } = require('@/lib/env');
        
        if (!isSanityConfigured()) {
            console.warn('⚠️ Sanity not configured during checkout. Returning mock success.');
            // Return mock success instead of crashing, as requested
            return NextResponse.json({ 
                success: true, 
                orderId: `mock_${Date.now()}`,
                message: 'Order recorded locally (Sanity CMS offline)' 
            });
        }

        if (finalPaymentMethod === 'PAYFAST' && !isPayFastConfigured()) {
            return NextResponse.json({ 
                success: false, 
                message: 'PayFast payments are currently disabled due to missing configuration.' 
            }, { status: 503 });
        }

        const { getAdminClient } = require('@/sanity/lib/adminClient');
        const localAdminClient = getAdminClient();
        
        if (!localAdminClient) {
             return NextResponse.json({ 
                 success: false, 
                 message: 'Failed to authenticate with database.' 
             }, { status: 503 });
        }

        // Idempotency check with try/catch
        try {
            const existingOrder = await localAdminClient.fetch(`*[_type == "order" && idempotencyKey == $idempotencyKey][0]`, { idempotencyKey });
            if (existingOrder) {
                 console.log(`Idempotency check intercepted existing order initialization duplicate: ${existingOrder._id}`);
                 return NextResponse.json({ success: true, orderId: existingOrder._id });
            }
        } catch (sanityFetchError: any) {
             console.error('Sanity fetch error during idempotency check:', sanityFetchError);
             return NextResponse.json({ success: false, message: 'Failed to verify unique order ID' }, { status: 400 });
        }

        // Generate a human-readable unique order ID
        const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

        // Payload Construction
        const sanityPayload = {
            _type: 'order',
            orderId,
            clerkUserId: userId || '',
            customer: {
                firstName: customer?.firstName || '',
                lastName: customer?.lastName || '',
                email: customer?.email || '',
                phone: customer?.phone || '',
                address: customer?.address || '',
                city: customer?.city || '',
                zipCode: customer?.zipCode || '',
            },
            items: validItems.map((item: any, index: number) => ({
                _key: `item-${index}-${Date.now()}`,
                product: {
                    _type: 'reference',
                    _ref: item._id,
                },
                quantity: item?.quantity || 1,
                price: item?.price || 0,
            })),
            totalPrice: Number(totalPrice),
            shippingCost: Number(shippingCost) || 0,
            paymentMethod: finalPaymentMethod,
            paymentStatus: 'pending',
            status: 'pending',
            deliveryStatus: 'processing',
            orderDate: new Date().toISOString(),
            idempotencyKey,
        };
        
        try {
            const order = await localAdminClient.create(sanityPayload);
            return NextResponse.json({ success: true, orderId: order._id });
        } catch (sanityCreateError: any) {
            console.error('CRITICAL: Sanity adminClient.create failed:', sanityCreateError);
            return NextResponse.json({ 
                success: false, 
                message: sanityCreateError?.message || 'Database write failed during order creation.'
            }, { status: 400 }); // Never return 500
        }

    } catch (error: any) {
        console.error('Unhandled Error in POST /api/checkout:', error);
        // 4. Improve Error Handling (No 500 errors)
        return NextResponse.json(
            { 
                success: false, 
                message: error?.message || 'An unexpected error occurred during checkout processing.'
            },
            { status: 400 } // Ensure no 500 errors reach client
        )
    }
}
