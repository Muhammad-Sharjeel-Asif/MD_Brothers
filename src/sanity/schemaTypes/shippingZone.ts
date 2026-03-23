import { defineType } from "sanity"

export const shippingZone = defineType({
    name: 'shippingZone',
    type: 'document',
    title: 'Shipping Zone',
    fields: [
        {
            name: 'zoneName',
            type: 'string',
            title: 'Zone Name',
            description: 'Name of the shipping zone (e.g. Karachi, Punjab, Nationwide).',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'cities',
            type: 'array',
            title: 'Cities',
            description: 'List of cities covered by this zone.',
            of: [{ type: 'string' }],
            validation: (Rule) => Rule.required().min(1),
        },
        {
            name: 'shippingCost',
            type: 'number',
            title: 'Shipping Cost',
            description: 'Shipping charge for this specific zone.',
            validation: (Rule) => Rule.required().min(0),
        },
        {
            name: 'deliveryTimeEstimate',
            type: 'string',
            title: 'Delivery Time Estimate',
            description: 'Estimated delivery time (e.g. 1-2 days, 3-5 days).',
            validation: (Rule) => Rule.required(),
        }
    ]
})
