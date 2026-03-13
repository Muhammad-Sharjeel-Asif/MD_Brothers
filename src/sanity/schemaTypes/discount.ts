import { defineType } from "sanity"

export const discount = defineType({
    name: 'discount',
    type: 'document',
    title: 'Discount',
    fields: [
        {
            name: 'title',
            type: 'string',
            title: 'Discount Title',
            description: 'e.g., Summer Sale 2024'
        },
        {
            name: 'type',
            type: 'string',
            title: 'Discount Type',
            options: {
                list: [
                    { title: 'Percentage', value: 'percentage' },
                    { title: 'Fixed Amount', value: 'fixed' },
                    { title: 'Bulk Threshold', value: 'bulk' },
                ]
            }
        },
        {
            name: 'value',
            type: 'number',
            title: 'Discount Value',
            description: 'Enter percentage (e.g., 10 for 10%) or fixed amount.'
        },
        {
            name: 'bulkThreshold',
            type: 'number',
            title: 'Bulk Threshold Quantity',
            description: 'Minimum quantity required for bulk discount.',
            hidden: ({ parent }) => parent?.type !== 'bulk'
        },
        {
            name: 'appliesTo',
            type: 'array',
            title: 'Applies To',
            description: 'Select products or categories this discount applies to. Keep empty for store-wide.',
            of: [
                { type: 'reference', to: [{ type: 'product' }, { type: 'category' }] }
            ]
        },
        {
            name: 'activeRange',
            type: 'object',
            title: 'Active Range',
            fields: [
                { name: 'startDate', type: 'datetime', title: 'Start Date' },
                { name: 'endDate', type: 'datetime', title: 'End Date' }
            ]
        },
        {
            name: 'isActive',
            type: 'boolean',
            title: 'Is Active',
            initialValue: true
        }
    ]
})
