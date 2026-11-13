import { describe, expect, it } from "vitest";

import { hashPassword, verifyPassword } from "./password";

describe("password helpers", () => {
  it("hashes a password and verifies the original value", async () => {
    const passwordHash = await hashPassword("Admin123!");

    expect(passwordHash).not.toBe("Admin123!");
    await expect(verifyPassword("Admin123!", passwordHash)).resolves.toBe(true);
  });

  it("rejects a wrong password", async () => {
    const passwordHash = await hashPassword("Admin123!");

    await expect(verifyPassword("Wrong123!", passwordHash)).resolves.toBe(
      false,
    );
  });
});
