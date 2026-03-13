import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    const { userId, sessionClaims } = await auth();

    // Check if the user is signed in
    if (!userId) {
      return (await auth()).redirectToSignIn();
    }

    // Check for admin role in metadata or a fallback email
    // Note: sessionClaims.metadata is where Clerk usually stores publicMetadata
    const role = (sessionClaims?.metadata as any)?.role;
    const email = (sessionClaims as any)?.email;
    const authorizedEmails = ['msharjeelasif@gmail.com']; // Example admin email

    if (role !== 'admin' && !authorizedEmails.includes(email)) {
      // Redirect to home if not an admin
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};