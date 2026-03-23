import { defineType } from "sanity"

export const shippingSettings = defineType({
    name: 'shippingSettings',
    type: 'document',
    title: 'Shipping Settings',
    fields: [
        {
            name: 'baseShippingCharge',
            type: 'number',
            title: 'Base Shipping Charge',
            description: 'The starting shipping fee for any order.',
            initialValue: 0,
        },
        {
            name: 'perOrderCharge',
            type: 'number',
            title: 'Per-Order Shipping Charge',
            description: 'Additional fixed charge applied to every order.',
            initialValue: 0,
        },
        {
            name: 'freeShippingThreshold',
            type: 'number',
            title: 'Free Shipping Threshold',
            description: 'Orders above this amount will have free shipping.',
            initialValue: 5000,
        },
        {
            name: 'shippingMessage',
            type: 'string',
            title: 'Shipping Message',
            description: 'Optional message to show on the cart/checkout page.',
            initialValue: 'Fast delivery nationwide!',
        }
    ]
})
