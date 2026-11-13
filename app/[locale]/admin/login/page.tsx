import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { Link, redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getSession } from "@/lib/auth/session";

import { LoginForm } from "./login-form";

// The page reads the session cookie and search params, so it must run at
// request time instead of producing a static shell.
export const instant = false;

type LoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
};

export async function generateMetadata({
  params,
}: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "Admin.Login" });

  return { title: t("title") };
}

export default async function AdminLoginPage({
  params,
  searchParams,
}: LoginPageProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const session = await getSession();

  if (session?.user) {
    redirect({ href: "/admin", locale });
  }

  const t = await getTranslations({ locale, namespace: "Admin.Login" });
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <main className="w-full max-w-sm rounded-2xl border border-black/[.08] bg-white p-8 shadow-sm dark:border-white/[.145] dark:bg-zinc-950">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {t("title")}
          </h1>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {t("description")}
          </p>
        </div>

        <LoginForm
          callbackUrl={typeof callbackUrl === "string" ? callbackUrl : undefined}
        />

        <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/" className="underline underline-offset-4">
            {t("backToSite")}
          </Link>
        </p>
      </main>
    </div>
  );
}
