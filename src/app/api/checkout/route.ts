import { NextResponse } from 'next/server'
import { adminClient } from '@/sanity/lib/adminClient'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { customer, items, totalPrice, paymentMethod, idempotencyKey } = body

        if (!idempotencyKey) {
             return NextResponse.json({ success: false, error: 'Idempotency Key required' }, { status: 400 });
        }

        // Idempotency execution: Ensure we aren't creating duplicate orders
        const existingOrder = await adminClient.fetch(`*[_type == "order" && idempotencyKey == $idempotencyKey][0]`, { idempotencyKey });
        if (existingOrder) {
             console.log(`Idempotency check intercepted existing order initialization duplicate: ${existingOrder._id}`);
             return NextResponse.json({ success: true, orderId: existingOrder._id });
        }

        let orderStatus = 'pending'
        let paymentStatus = 'pending'

        if (paymentMethod === 'Cash On Delivery') {
            orderStatus = 'pending_payment'
            paymentStatus = 'pending'
        } else if (paymentMethod === 'Direct Bank Transfer') {
            orderStatus = 'awaiting_bank_transfer'
            paymentStatus = 'pending'
        } else if (paymentMethod === 'JazzCash' || paymentMethod === 'Easypaisa') {
            orderStatus = 'pending_payment'
            paymentStatus = 'pending' // Actual confirmation would update this to completed
        }

        // Create the order document in Sanity
        const order = await adminClient.create({
            _type: 'order',
            customer,
            items: items.map((item: any) => ({
                _key: Math.random().toString(36).substring(2, 9),
                product: {
                    _type: 'reference',
                    _ref: item._id,
                },
                quantity: item.quantity,
                price: item.price,
            })),
            totalPrice,
            paymentMethod,
            paymentStatus,
            transactionId: '',
            status: orderStatus,
            orderDate: new Date().toISOString(),
            idempotencyKey,
        })

        return NextResponse.json({ success: true, orderId: order._id })
    } catch (error) {
        console.error('Error creating order in Sanity:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create order' },
            { status: 500 }
        )
    }
}
