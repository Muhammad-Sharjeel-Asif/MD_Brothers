import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const adminClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // Must be false for writes
    token: process.env.SANITY_API_TOKEN,
})
