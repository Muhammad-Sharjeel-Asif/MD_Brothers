import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Admin email — the only user allowed to access admin routes.
 * Set ADMIN_EMAIL in .env.local to override.
 */
export const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "m.sharjeelasif1435@gmail.com";

/** Shape returned by requireAuth / requireAdmin on success */
export interface AuthContext {
  userId: string;
  email: string;
}

/**
 * Require an authenticated Clerk user.
 * Returns { userId, email } or a 401 NextResponse.
 */
export async function requireAuth(): Promise<AuthContext | NextResponse> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";

  return { userId, email };
}

/**
 * Require an authenticated Clerk user **with admin privileges**.
 * Returns { userId, email } or a 401/403 NextResponse.
 */
export async function requireAdmin(): Promise<AuthContext | NextResponse> {
  const result = await requireAuth();

  // If requireAuth already returned an error response, propagate it
  if (result instanceof NextResponse) return result;

  if (result.email !== ADMIN_EMAIL) {
    return NextResponse.json(
      { error: "Forbidden — admin access only" },
      { status: 403 }
    );
  }

  return result;
}

/**
 * Type guard — true when the auth call succeeded (not an error response).
 */
export function isAuthContext(
  result: AuthContext | NextResponse
): result is AuthContext {
  return !(result instanceof NextResponse);
}
