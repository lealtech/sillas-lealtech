import { hashPassword } from "../lib/auth/password";
import { createPrismaClient } from "../lib/prisma-client";

export type SeededAdmin = {
  id: string;
  email: string;
};

/**
 * Creates or updates the admin account configured through ADMIN_EMAIL,
 * ADMIN_PASSWORD and the optional ADMIN_NAME variables.
 */
export async function seedAdminUser(
  env: NodeJS.ProcessEnv = process.env,
): Promise<SeededAdmin> {
  const email = env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = env.ADMIN_PASSWORD;
  const name = env.ADMIN_NAME?.trim() || null;

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set to create an admin user.",
    );
  }

  const passwordHash = await hashPassword(password);
  const prisma = createPrismaClient(env.DATABASE_URL, env.POSTGRES_SCHEMA);

  try {
    return await prisma.user.upsert({
      where: { email },
      create: { email, name, passwordHash },
      update: { name, passwordHash },
      select: { id: true, email: true },
    });
  } finally {
    await prisma.$disconnect();
  }
}
