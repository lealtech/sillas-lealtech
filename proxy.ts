import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

import { authConfig } from "./auth.config";
import { routing } from "./i18n/routing";
import {
  adminLoginPath,
  isProtectedAdminPath,
  splitLocalePath,
} from "./lib/auth/routes";

const intlMiddleware = createMiddleware(routing);

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { locale, pathname } = splitLocalePath(request.nextUrl.pathname);

  if (locale && isProtectedAdminPath(pathname) && !request.auth) {
    return NextResponse.redirect(
      new URL(adminLoginPath(locale, request.nextUrl.pathname), request.nextUrl),
    );
  }

  return intlMiddleware(request);
});

export const config = {
  // Match all pathnames except API routes, Next.js internals and static files.
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
