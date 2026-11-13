import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

/**
 * Creates a Prisma client bound to the configured PostgreSQL schema. Kept free
 * of `server-only` so maintenance scripts can reuse it.
 */
export function createPrismaClient(
  connectionString: string | undefined = process.env.DATABASE_URL,
  schema: string | undefined = process.env.POSTGRES_SCHEMA,
) {
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set.");
  }

  if (!schema) {
    throw new Error("POSTGRES_SCHEMA is not set.");
  }

  const adapter = new PrismaPg(
    {
      connectionString,
      // Keep raw SQL queries ($queryRaw) on the same schema as Prisma models.
      options: `-c search_path="${schema}"`,
    },
    { schema },
  );

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export type AppPrismaClient = ReturnType<typeof createPrismaClient>;
