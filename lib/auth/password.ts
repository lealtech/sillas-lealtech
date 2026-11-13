import { compare, hash } from "bcryptjs";

/** bcrypt cost factor used for every stored password. */
export const PASSWORD_HASH_COST = 12;

export function hashPassword(password: string): Promise<string> {
  return hash(password, PASSWORD_HASH_COST);
}

export function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return compare(password, passwordHash);
}
