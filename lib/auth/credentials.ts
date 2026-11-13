export type Credentials = {
  email: string;
  password: string;
};

export type CredentialsParseResult =
  | { ok: true; credentials: Credentials }
  | { ok: false };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Normalizes and validates credentials submitted by the login form. It does
 * not enforce a password policy: existing accounts may predate any policy.
 */
export function parseCredentials(
  input: Record<string, unknown> | null | undefined,
): CredentialsParseResult {
  const email =
    typeof input?.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input?.password === "string" ? input.password : "";

  if (!EMAIL_PATTERN.test(email) || password.length === 0) {
    return { ok: false };
  }

  return { ok: true, credentials: { email, password } };
}
