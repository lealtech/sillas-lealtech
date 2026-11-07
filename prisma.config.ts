import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl = process.env.DATABASE_URL;
const schema = process.env.POSTGRES_SCHEMA;

/**
 * The PostgreSQL schema is kept in POSTGRES_SCHEMA so there is a single
 * source of truth for both Prisma CLI commands and the runtime adapter.
 */
function buildDatabaseUrl() {
  if (!databaseUrl) {
    return undefined;
  }

  const url = new URL(databaseUrl);

  if (schema) {
    url.searchParams.set("schema", schema);
  }

  return url.toString();
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: buildDatabaseUrl(),
  },
});
