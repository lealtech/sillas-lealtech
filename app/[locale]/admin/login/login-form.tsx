"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState } from "react";

import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

const fieldClassName =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none transition-colors focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-400 dark:focus:ring-zinc-800";

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const t = useTranslations("Admin.Login");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex w-full flex-col gap-5" noValidate>
      <input type="hidden" name="locale" value={locale} />
      {callbackUrl ? (
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
      ) : null}

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t("emailLabel")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={t("emailPlaceholder")}
          className={fieldClassName}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t("passwordLabel")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder={t("passwordPlaceholder")}
          className={fieldClassName}
        />
      </div>

      {state.error ? (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
        >
          {t(state.error)}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
