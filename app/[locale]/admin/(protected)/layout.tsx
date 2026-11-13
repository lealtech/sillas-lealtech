import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { routing } from "@/i18n/routing";
import { requireAdminSession } from "@/lib/auth/session";

// Every admin screen below this layout needs the request-time session, so the
// segment is allowed to block instead of streaming a static shell.
export const instant = false;

type AdminLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminProtectedLayout({
  children,
  params,
}: AdminLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  await requireAdminSession(locale);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      {children}
    </div>
  );
}
