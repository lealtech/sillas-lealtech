"use server";

import { hasLocale } from "next-intl";

import { signOut } from "@/auth";
import { routing } from "@/i18n/routing";

export async function logout(formData: FormData) {
  const requestedLocale = formData.get("locale");
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  await signOut({ redirectTo: `/${locale}/admin/login` });
}
