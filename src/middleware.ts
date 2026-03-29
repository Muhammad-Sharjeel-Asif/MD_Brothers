import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)"
]);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "m.sharjeelasif1435@gmail.com";

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    try {
      const { userId, redirectToSignIn, sessionClaims } = await auth();

      // Not logged in → redirect to Clerk sign-in
      if (!userId) {
        return redirectToSignIn();
      }

      // Check email from session claims (lighter than currentUser())
      const email =
        (sessionClaims as any)?.email ??
        (sessionClaims as any)?.primary_email_address ??
        null;

      // If email is available in claims, validate admin access
      // Otherwise, let the in-route requireAdmin() handle it (defense-in-depth)
      if (email && email !== ADMIN_EMAIL) {
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