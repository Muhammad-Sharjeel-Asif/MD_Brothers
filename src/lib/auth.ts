import { auth, currentUser, getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";

/**
 * Admin email — the only user allowed to access admin routes.
 * Set ADMIN_EMAIL in .env.local to override.
 */
export const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL,
  "m.sharjeelasif1435@gmail.com",
  "buzzteach07@gmail.com",
  "iqbalasifsheikh0342@gmail.com",
  "mdbrothersedu@gmail.com"
].filter(Boolean) as string[];

/** Shape returned by requireAuth / requireAdmin on success */
export interface AuthContext {
  userId: string;
  email: string;
}

/**
 * Require an authenticated Clerk user.
 * Returns { userId, email } or a 401 NextResponse.
 */
export async function requireAuth(req?: NextRequest): Promise<AuthContext | NextResponse> {
  let userId: string | null = null;
  
  if (req) {
    const authData = getAuth(req);
    userId = authData.userId;
  } else {
    const authData = await auth();
    userId = authData.userId;
  }

  if (!userId) {
    const headerList = headers();
    const hasCookie = (headerList as any).has("cookie");
    const hasAuthHeader = (headerList as any).has("authorization");
    console.warn(`🔐 Auth failed: No userId. Headers confirmed: Cookie=${hasCookie}, Auth=${hasAuthHeader}`);
    
    return NextResponse.json(
      { error: "Authentication required - session not found" },
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
export async function requireAdmin(req?: NextRequest): Promise<AuthContext | NextResponse> {
  const result = await requireAuth(req);

  // If requireAuth already returned an error response, propagate it
  if (result instanceof NextResponse) return result;

  if (!ADMIN_EMAILS.includes(result.email)) {
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
