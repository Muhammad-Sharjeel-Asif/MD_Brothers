import { createClient } from 'next-sanity'
import { apiVersion } from '../env'

export function getSanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  // Temporarily log specifically as requested in Step 4
  console.log("Sanity ENV:", {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  });

  if (!projectId || !dataset) {
    console.warn("Sanity not configured properly: Missing projectId or dataset");
    return null;
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || apiVersion,
    useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  })
}
