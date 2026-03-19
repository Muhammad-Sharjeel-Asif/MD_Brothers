import { getEnv, requireEnv } from '@/lib/env'

export const apiVersion = getEnv('NEXT_PUBLIC_SANITY_API_VERSION', '2025-01-18')

export const dataset = requireEnv('NEXT_PUBLIC_SANITY_DATASET', 'Sanity Dataset')
export const projectId = requireEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'Sanity Project ID')
