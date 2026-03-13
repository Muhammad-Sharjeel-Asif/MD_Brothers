import { defineType } from "sanity"

export const category = defineType({
    name: 'category',
    type: 'document',
    title: 'Category',
    fields: [
        {
            name: 'name',
            type: 'string',
            title: 'Category Name',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'slug',
            type: 'slug',
            title: 'Slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'image',
            type: 'image',
            title: 'Category Image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'description',
            type: 'text',
            title: 'Description',
        },
    ],
})
