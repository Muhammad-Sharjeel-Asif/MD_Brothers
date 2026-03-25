"use server";

import { getSanityClient } from "@/sanity/lib/client";

export async function fetchSanityData(query: string, params: any = {}) {
  const client = getSanityClient();
  
  if (!client) {
    console.warn("Fetch aborted: Sanity client is null. Returning empty result.");
    // Return empty array if it looks like a list query, otherwise null
    return query.trim().startsWith("*") ? [] : null;
  }

  try {
    const data = await client.fetch(query, params);
    return data;
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return null;
  }
}
