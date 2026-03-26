import { defineType } from "sanity"

export const shippingSettings = defineType({
    name: 'shippingSettings',
    type: 'document',
    title: 'Site Settings', // Renamed title for a more global feel
    fields: [
        {
            name: 'deliveryCharges', // Changed to match "Delivery Charges" terminology
            type: 'number',
            title: 'Standard Delivery Charges',
            description: 'The standard shipping fee applied to orders.',
            initialValue: 250,
            validation: (rule) => rule.required().min(0),
        },
        {
            name: 'freeShippingThreshold',
            type: 'number',
            title: 'Free Shipping Threshold',
            description: 'Orders above this amount will have free shipping.',
            initialValue: 5000,
            validation: (rule) => rule.min(0),
        },
        {
            name: 'shippingMessage',
            type: 'string',
            title: 'Shipping Message',
            description: 'Message shown to customers about delivery.',
            initialValue: 'Fast delivery nationwide!',
        }
    ]
})
