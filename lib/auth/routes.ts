import { hasLocale } from "next-intl";

import { routing, type Locale } from "@/i18n/routing";

export const ADMIN_ROOT = "/admin";
export const ADMIN_LOGIN = "/admin/login";

export type LocaleSplit = {
  locale: Locale | null;
  pathname: string;
};

/**
 * Splits a locale-prefixed pathname into its locale and the locale-less path.
 * `/pt/admin` -> `{ locale: "pt", pathname: "/admin" }`
 * `/admin`    -> `{ locale: null, pathname: "/admin" }`
 */
export function splitLocalePath(pathname: string): LocaleSplit {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const [first, ...rest] = normalized.split("/").filter(Boolean);

  if (first && hasLocale(routing.locales, first)) {
    return {
      locale: first,
      pathname: rest.length > 0 ? `/${rest.join("/")}` : "/",
    };
  }

  return { locale: null, pathname: normalized };
}

/** `/admin` and every path below it, except the login screen. */
export function isProtectedAdminPath(pathname: string): boolean {
  const normalized = normalizePath(pathname);
  const isAdmin =
    normalized === ADMIN_ROOT || normalized.startsWith(`${ADMIN_ROOT}/`);

  return isAdmin && normalized !== ADMIN_LOGIN;
}

export function isAdminLoginPath(pathname: string): boolean {
  return normalizePath(pathname) === ADMIN_LOGIN;
}

export function adminLoginPath(
  locale: Locale,
  callbackUrl?: string | null,
): string {
  const path = `/${locale}${ADMIN_LOGIN}`;

  if (!callbackUrl) {
    return path;
  }

  return `${path}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}

/**
 * Only same-locale admin paths are accepted as post-login destinations, which
 * prevents open redirects through a crafted `callbackUrl`.
 */
export function resolveAdminCallbackUrl(
  callbackUrl: unknown,
  locale: Locale,
): string {
  const fallback = `/${locale}${ADMIN_ROOT}`;

  if (
    typeof callbackUrl !== "string" ||
    !callbackUrl.startsWith("/") ||
    callbackUrl.startsWith("//")
  ) {
    return fallback;
  }

  let url: URL;

  try {
    // A fixed base is enough to parse a same-origin relative URL safely.
    url = new URL(callbackUrl, "http://internal.local");
  } catch {
    return fallback;
  }

  const { locale: callbackLocale, pathname } = splitLocalePath(url.pathname);

  if (callbackLocale !== locale || !isProtectedAdminPath(pathname)) {
    return fallback;
  }

  return `/${locale}${pathname}${url.search}`;
}

function normalizePath(pathname: string): string {
  if (!pathname.startsWith("/")) {
    pathname = `/${pathname}`;
  }

  return pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
}
