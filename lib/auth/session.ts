import "server-only";

import { connection } from "next/server";
import { cache } from "react";

import { auth } from "@/auth";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/**
 * Session lookup memoized for the current request. `connection()` marks the
 * render as request-time before Auth.js touches crypto/cookies, which keeps
 * the prerenderer from evaluating the session during validation.
 */
export const getSession = cache(async () => {
  await connection();

  return auth();
});

/**
 * Returns the current session or redirects to the localized admin login page.
 * Used by the protected admin layout and pages as the authoritative check.
 */
export async function requireAdminSession(locale: Locale) {
  const session = await getSession();

  if (!session?.user) {
    redirect({ href: "/admin/login", locale });

    // `redirect` throws, but not every version types it as `never`.
    throw new Error("Admin redirect failed.");
  }

  return session;
}
