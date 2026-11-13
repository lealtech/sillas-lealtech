"use server";

import { AuthError } from "next-auth";
import { hasLocale } from "next-intl";

import { signIn } from "@/auth";
import { routing } from "@/i18n/routing";
import { parseCredentials } from "@/lib/auth/credentials";
import { resolveAdminCallbackUrl } from "@/lib/auth/routes";

export type LoginError = "invalidFields" | "invalidCredentials" | "unknownError";

export type LoginState = {
  error?: LoginError;
};

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const requestedLocale = formData.get("locale");
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  const parsed = parseCredentials({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.ok) {
    return { error: "invalidFields" };
  }

  const redirectTo = resolveAdminCallbackUrl(
    formData.get("callbackUrl"),
    locale,
  );

  try {
    await signIn("credentials", {
      email: parsed.credentials.email,
      password: parsed.credentials.password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error:
          error.type === "CredentialsSignin"
            ? "invalidCredentials"
            : "unknownError",
      };
    }

    // Re-throw framework errors such as the redirect thrown on success.
    throw error;
  }

  return {};
}
