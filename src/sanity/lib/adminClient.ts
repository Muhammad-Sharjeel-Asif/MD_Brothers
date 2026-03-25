import { createClient } from 'next-sanity'
import { apiVersion } from '../env'
import { isSanityConfigured } from '@/lib/env'

export function getAdminClient() {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    const token = process.env.SANITY_API_TOKEN;

    if (!isSanityConfigured() || !token) {
        return null;
    }

    return createClient({
        projectId: projectId!,
        dataset: dataset!,
        apiVersion,
        useCdn: false, // Must be false for writes
        token,
    })
}

// Keep export for backward compatibility if needed, but mark as deprecated or use the function
export const adminClient = {
    withConfig: (config: any) => {
        const client = getAdminClient();
        if (!client) {
            console.warn("Admin client requested but configuration is missing.");
            // Return a dummy object with fetch/create that return null/error to avoid crashes
            return {
                fetch: async () => null,
                create: async () => { throw new Error("Sanity not configured") }
            } as any;
        }
        return client.withConfig(config);
    },
    fetch: async (query: string, params: any = {}, options: any = {}) => {
        return getAdminClient()?.fetch(query, params, options) || null;
    },
    create: async (doc: any, options: any = {}) => {
        const client = getAdminClient();
        if (!client) throw new Error("Sanity not configured");
        return client.create(doc, options);
    },
    patch: (id: string) => {
        const client = getAdminClient();
        if (!client) throw new Error("Sanity not configured");
        return client.patch(id);
    }
}
