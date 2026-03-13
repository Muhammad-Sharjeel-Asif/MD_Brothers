import { NextResponse } from 'next/server'
import { adminClient } from '@/sanity/lib/adminClient'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { customer, items, totalPrice, paymentMethod } = body

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
            status: 'pending',
            orderDate: new Date().toISOString(),
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
