import { describe, expect, it } from "vitest";

import { parseCredentials } from "./credentials";

describe("parseCredentials", () => {
  it("normalizes the email and keeps the password", () => {
    expect(
      parseCredentials({ email: "  Admin@Example.COM ", password: "secret" }),
    ).toEqual({
      ok: true,
      credentials: { email: "admin@example.com", password: "secret" },
    });
  });

  it.each([
    ["missing input", undefined],
    ["empty email", { email: "", password: "secret" }],
    ["invalid email", { email: "not-an-email", password: "secret" }],
    ["empty password", { email: "admin@example.com", password: "" }],
    ["non-string password", { email: "admin@example.com", password: 123 }],
  ])("rejects %s", (_label, input) => {
    expect(parseCredentials(input as Record<string, unknown> | undefined)).toEqual(
      { ok: false },
    );
  });
});
