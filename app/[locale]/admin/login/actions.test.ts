import { AuthError, CredentialsSignin } from "next-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { signIn } from "@/auth";

import { login } from "./actions";

vi.mock("@/auth", () => ({
  signIn: vi.fn(),
}));

const signInMock = vi.mocked(signIn);

function formData(fields: Record<string, string>): FormData {
  const data = new FormData();

  for (const [key, value] of Object.entries(fields)) {
    data.set(key, value);
  }

  return data;
}

describe("login action", () => {
  beforeEach(() => {
    signInMock.mockReset();
  });

  it("signs in and redirects to the admin dashboard", async () => {
    signInMock.mockResolvedValue(undefined as never);

    const result = await login(
      {},
      formData({
        email: " Admin@Example.com ",
        password: "secret",
        locale: "pt",
      }),
    );

    expect(result).toEqual({});
    expect(signInMock).toHaveBeenCalledWith("credentials", {
      email: "admin@example.com",
      password: "secret",
      redirectTo: "/pt/admin",
    });
  });

  it("honors a same-locale callback URL", async () => {
    signInMock.mockResolvedValue(undefined as never);

    await login(
      {},
      formData({
        email: "admin@example.com",
        password: "secret",
        locale: "en",
        callbackUrl: "/en/admin/users",
      }),
    );

    expect(signInMock).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({ redirectTo: "/en/admin/users" }),
    );
  });

  it("rejects a callback URL from another locale", async () => {
    signInMock.mockResolvedValue(undefined as never);

    await login(
      {},
      formData({
        email: "admin@example.com",
        password: "secret",
        locale: "en",
        callbackUrl: "/pt/admin/users",
      }),
    );

    expect(signInMock).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({ redirectTo: "/en/admin" }),
    );
  });

  it("falls back to the default locale for unknown locales", async () => {
    signInMock.mockResolvedValue(undefined as never);

    await login(
      {},
      formData({
        email: "admin@example.com",
        password: "secret",
        locale: "fr",
      }),
    );

    expect(signInMock).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({ redirectTo: "/en/admin" }),
    );
  });

  it("does not call signIn for invalid fields", async () => {
    const result = await login(
      {},
      formData({ email: "invalid", password: "", locale: "en" }),
    );

    expect(result).toEqual({ error: "invalidFields" });
    expect(signInMock).not.toHaveBeenCalled();
  });

  it("maps credentials errors to an invalid credentials message", async () => {
    signInMock.mockRejectedValue(new CredentialsSignin());

    const result = await login(
      {},
      formData({ email: "admin@example.com", password: "wrong", locale: "en" }),
    );

    expect(result).toEqual({ error: "invalidCredentials" });
  });

  it("maps other auth errors to a generic message", async () => {
    signInMock.mockRejectedValue(new AuthError("Configuration"));

    const result = await login(
      {},
      formData({ email: "admin@example.com", password: "secret", locale: "en" }),
    );

    expect(result).toEqual({ error: "unknownError" });
  });

  it("re-throws non-auth errors", async () => {
    const databaseError = new Error("database down");
    signInMock.mockRejectedValue(databaseError);

    await expect(
      login(
        {},
        formData({
          email: "admin@example.com",
          password: "secret",
          locale: "en",
        }),
      ),
    ).rejects.toBe(databaseError);
  });
});
