import "dotenv/config";

import { seedAdminUser } from "./seed-admin";

try {
  const user = await seedAdminUser();
  console.log(`Admin user ready: ${user.email}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
