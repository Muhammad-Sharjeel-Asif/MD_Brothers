import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)"
]);

const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL,
  "m.sharjeelasif1435@gmail.com",
  "buzzteach07@gmail.com",
  "iqbalasifsheikh0342@gmail.com",
  "mdbrothersedu@gmail.com"
].filter(Boolean) as string[];

export default clerkMiddleware(async (auth, req) => {
  // Allow OPTIONS requests for preflight checks
  if (req.method === 'OPTIONS') {
    return NextResponse.next();
  }

  if (isAdminRoute(req)) {
    try {
      const { userId, redirectToSignIn, sessionClaims } = await auth();

      // Not logged in
      if (!userId) {
        // For API routes, just allow them to pass through and be handled by the route's requireAdmin()
        // This avoids middleware-level redirect issues for AJAX requests.
        if (req.nextUrl.pathname.startsWith("/api/")) {
          return NextResponse.next();
        }
        return redirectToSignIn();
      }

      // Check email from session claims
      const email =
        (sessionClaims as any)?.email ??
        (sessionClaims as any)?.primary_email_address ??
        null;

      if (email && !ADMIN_EMAILS.includes(email)) {
        // For page routes → redirect to forbidden page
        if (!req.nextUrl.pathname.startsWith("/api/")) {
          const url = req.nextUrl.clone();
          url.pathname = "/forbidden";
          return NextResponse.redirect(url);
        }
        // For API routes → return 403 JSON
        return NextResponse.json(
          { error: "Forbidden — admin access only" },
          { status: 403 }
        );
      }

      return NextResponse.next();
    } catch (err) {
      console.error("Middleware Error:", err);
      // For API routes, return 500 JSON
      if (req.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Internal server error during authentication" },
          { status: 500 }
        );
      }
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};