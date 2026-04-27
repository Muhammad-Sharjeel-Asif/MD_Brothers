import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

/**
 * A custom hook that provides a secure fetch wrapper for admin API calls.
 * It automatically injects the Clerk Bearer token into the Authorization header.
 */
export function useAdminAuth() {
  const { getToken } = useAuth();

  const authenticatedFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers || {});
      
      return fetch(url, {
        ...options,
        headers,
        credentials: "include", // Ensure session cookies are sent
      });
    },
    [getToken]
  );

  return { authenticatedFetch, getToken };
}
