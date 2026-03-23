import { defineType } from "sanity"

export const order = defineType({
    name: 'order',
    type: 'document',
    title: 'Order',
    fields: [
        {
            name: 'customer',
            type: 'object',
            title: 'Customer Details',
            fields: [
                { name: 'firstName', type: 'string', title: 'First Name' },
                { name: 'lastName', type: 'string', title: 'Last Name' },
                { name: 'email', type: 'string', title: 'Email' },
                { name: 'phone', type: 'string', title: 'Phone' },
                { name: 'address', type: 'string', title: 'Address' },
                { name: 'city', type: 'string', title: 'City' },
                { name: 'zipCode', type: 'string', title: 'ZIP Code' },
            ]
        },
        {
            name: 'clerkUserId',
            type: 'string',
            title: 'User ID',
            description: 'Clerk user ID for order tracking',
        },
        {
            name: 'items',
            type: 'array',
            title: 'Order Items',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'product', type: 'reference', to: [{ type: 'product' }] },
                        { name: 'quantity', type: 'number' },
                        { name: 'price', type: 'number' }
                    ]
                }
            ]
        },
        {
            name: 'totalPrice',
            type: 'number',
            title: 'Total Price',
        },
        {
            name: 'status',
            type: 'string',
            title: 'Order Status',
            options: {
                list: [
                    { title: 'Pending', value: 'pending' },
                    { title: 'Confirmed', value: 'confirmed' },
                    { title: 'Shipped', value: 'shipped' },
                    { title: 'Out For Delivery', value: 'out_for_delivery' },
                    { title: 'Delivered', value: 'delivered' },
                    { title: 'Cancelled', value: 'cancelled' },
                    { title: 'Pending Payment', value: 'pending_payment' },
                ],
                layout: 'radio'
            },
            initialValue: 'pending'
        },
        {
            name: 'deliveryStatus',
            type: 'string',
            title: 'Delivery Status',
            options: {
                list: [
                    { title: 'Processing', value: 'processing' },
                    { title: 'In Transit', value: 'in_transit' },
                    { title: 'Delivered', value: 'delivered' },
                ],
                layout: 'radio'
            },
            initialValue: 'processing'
        },
        {
            name: 'shippingCost',
            type: 'number',
            title: 'Shipping Cost',
            initialValue: 0
        },
        {
            name: 'trackingId',
            type: 'string',
            title: 'Tracking ID',
        },
        {
            name: 'courierName',
            type: 'string',
            title: 'Courier Name',
        },
        {
            name: 'paymentMethod',
            type: 'string',
            title: 'Payment Method',
        },
        {
            name: 'paymentStatus',
            type: 'string',
            title: 'Payment Status',
            options: {
                list: [
                    { title: 'Pending', value: 'pending' },
                    { title: 'Completed', value: 'completed' },
                    { title: 'Failed', value: 'failed' },
                ],
                layout: 'radio'
            },
            initialValue: 'pending'
        },
        {
            name: 'payfastTransactionId',
            type: 'string',
            title: 'PayFast Transaction ID (pf_payment_id)',
            description: 'Unique PayFast identifier for this transaction',
        },
        {
            name: 'payfastSignature',
            type: 'string',
            title: 'PayFast Signature',
            description: 'Signature hash for verification',
        },
        {
            name: 'deliveryConfirmedAt',
            type: 'datetime',
            title: 'Delivery Confirmed At',
        },
        {
            name: 'deliveryAgent',
            type: 'string',
            title: 'Delivery Agent / Rider',
        },
        {
            name: 'orderDate',
            type: 'datetime',
            title: 'Order Date',
            initialValue: () => new Date().toISOString()
        },
        {
            name: 'createdAt',
            type: 'datetime',
            title: 'Created At',
            initialValue: () => new Date().toISOString()
        }
    ]
})
