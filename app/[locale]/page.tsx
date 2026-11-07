import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const localeLabels: Record<Locale, string> = {
  en: "English",
  pt: "Português",
  es: "Español",
};

export default function Home() {
  const t = useTranslations("HomePage");
  const activeLocale = useLocale();

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-10 px-6 py-16 sm:px-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="max-w-xl text-3xl font-semibold leading-10 tracking-tight text-black sm:text-4xl dark:text-zinc-50">
            {t("title")}
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {t("description")}
          </p>
        </div>

        <nav aria-label="Language" className="flex gap-2">
          {routing.locales.map((locale) => (
            <Link
              key={locale}
              href="/"
              locale={locale}
              aria-current={locale === activeLocale ? "true" : undefined}
              className={`rounded-full border border-solid px-4 py-2 text-sm font-medium transition-colors ${
                locale === activeLocale
                  ? "border-transparent bg-foreground text-background"
                  : "border-black/[.08] hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
              }`}
            >
              {localeLabels[locale]}
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}
