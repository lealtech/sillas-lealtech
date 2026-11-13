import { parseCredentials } from "./credentials";
import { verifyPassword } from "./password";

export type AuthenticatedUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
};

export type StoredUser = AuthenticatedUser & {
  passwordHash: string | null;
};

export type UserLookup = (email: string) => Promise<StoredUser | null>;

/**
 * Verifies credentials against a stored user. The lookup is injected so this
 * function stays independent from Prisma and can be unit tested.
 */
export async function authorizeCredentials(
  input: Record<string, unknown> | null | undefined,
  findUser: UserLookup,
): Promise<AuthenticatedUser | null> {
  const parsed = parseCredentials(input);

  if (!parsed.ok) {
    return null;
  }

  const user = await findUser(parsed.credentials.email);

  if (!user?.passwordHash) {
    return null;
  }

  const passwordMatches = await verifyPassword(
    parsed.credentials.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  };
}
