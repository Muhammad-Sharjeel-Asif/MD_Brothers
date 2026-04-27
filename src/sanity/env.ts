import { getEnv, requireEnv } from '@/lib/env'

export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-18'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''

if (!projectId && typeof window !== 'undefined') {
    console.warn("⚠️ NEXT_PUBLIC_SANITY_PROJECT_ID is missing in client-side environment.");
}
