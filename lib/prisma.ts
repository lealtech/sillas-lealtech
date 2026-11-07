import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
const schema = process.env.POSTGRES_SCHEMA;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

if (!schema) {
  throw new Error("POSTGRES_SCHEMA is not set.");
}

function createPrismaClient() {
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

const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
