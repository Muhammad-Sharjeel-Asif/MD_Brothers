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
                    { title: 'Paid', value: 'paid' },
                    { title: 'Shipped', value: 'shipped' },
                    { title: 'Delivered', value: 'delivered' },
                    { title: 'Cancelled', value: 'cancelled' },
                ],
                layout: 'radio'
            },
            initialValue: 'pending'
        },
        {
            name: 'paymentMethod',
            type: 'string',
            title: 'Payment Method',
        },
        {
            name: 'orderDate',
            type: 'datetime',
            title: 'Order Date',
            initialValue: () => new Date().toISOString()
        }
    ]
})
