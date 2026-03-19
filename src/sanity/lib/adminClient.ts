import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'
import { getEnv } from '@/lib/env'

export const adminClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // Must be false for writes
    token: getEnv('SANITY_API_TOKEN'),
})
