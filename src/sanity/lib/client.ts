import { createClient } from 'next-sanity'
import { apiVersion } from '../env'
import { isSanityConfigured } from '@/lib/env'

export function getSanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!isSanityConfigured()) {
    return null;
  }

  return createClient({
    projectId: projectId!,
    dataset: dataset!,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || apiVersion,
    useCdn: true,
  })
}
