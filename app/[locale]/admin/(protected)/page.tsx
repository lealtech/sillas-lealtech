import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";
import { requireAdminSession } from "@/lib/auth/session";

import { logout } from "./actions";

export const instant = false;

type AdminPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminDashboardPage({ params }: AdminPageProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const session = await requireAdminSession(locale);
  const t = await getTranslations({ locale, namespace: "Admin.Dashboard" });

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {t("title")}
          </h1>
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {t("description", { email: session.user.email ?? "" })}
          </p>
        </div>

        <form action={logout}>
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="rounded-full border border-solid border-black/[.08] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
          >
            {t("signOut")}
          </button>
        </form>
      </header>

      <section className="rounded-2xl border border-black/[.08] bg-white p-6 text-sm leading-6 text-zinc-600 dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-400">
        {t("emptyState")}
      </section>
    </main>
  );
}
