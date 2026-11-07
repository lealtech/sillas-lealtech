import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "pt", "es"],
  defaultLocale: "en",
  // Detect the browser's Accept-Language header and remember the user's
  // choice in the NEXT_LOCALE cookie. Unsupported languages fall back to English.
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
