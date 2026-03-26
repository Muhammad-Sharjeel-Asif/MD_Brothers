import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)"
]);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "m.sharjeelasif1435@gmail.com";

export default clerkMiddleware(async (auth, req) => {
  console.log("MIDDLEWARE RUNNING", req.nextUrl.pathname);

  if (isAdminRoute(req)) {
    try {
      const { userId, redirectToSignIn } = await auth();

      // 1. Not logged in
      if (!userId) {
        return redirectToSignIn();
      }

      // 2. Get full user safely
      const user = await currentUser();

      const email = user?.emailAddresses?.[0]?.emailAddress;

      console.log("Clerk Email:", email); // 🔍 debug

      // 3. Strict check
      if (email !== ADMIN_EMAIL) {
        const url = req.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
      }

      return NextResponse.next();

    } catch (err) {
      console.error("Middleware Error:", err);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

// export const config = {
//   matcher: [
//     "/((?!_next|.*\\..*).*)",
//     "/(api|trpc)(.*)",
//   ],
// };