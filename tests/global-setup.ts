import { execSync } from "node:child_process";

/**
 * Ensures the credentials used by the login tests exist. Runs the same script
 * developers use locally so the seed logic has a single source of truth.
 */
export default function globalSetup() {
  execSync("npm run admin:create", { stdio: "inherit" });
}
