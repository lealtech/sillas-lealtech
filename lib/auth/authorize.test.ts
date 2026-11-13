import { beforeEach, describe, expect, it, vi } from "vitest";

import { authorizeCredentials, type StoredUser } from "./authorize";
import { verifyPassword } from "./password";

vi.mock("./password", () => ({
  verifyPassword: vi.fn(),
}));

const verifyPasswordMock = vi.mocked(verifyPassword);

const storedUser: StoredUser = {
  id: "user-1",
  name: "Admin",
  email: "admin@example.com",
  image: null,
  passwordHash: "hashed-password",
};

describe("authorizeCredentials", () => {
  beforeEach(() => {
    verifyPasswordMock.mockReset();
  });

  it("returns the authenticated user when the password matches", async () => {
    verifyPasswordMock.mockResolvedValue(true);
    const findUser = vi.fn().mockResolvedValue(storedUser);

    await expect(
      authorizeCredentials(
        { email: "Admin@example.com", password: "secret" },
        findUser,
      ),
    ).resolves.toEqual({
      id: "user-1",
      name: "Admin",
      email: "admin@example.com",
      image: null,
    });
    expect(findUser).toHaveBeenCalledWith("admin@example.com");
  });

  it("returns null when the password does not match", async () => {
    verifyPasswordMock.mockResolvedValue(false);
    const findUser = vi.fn().mockResolvedValue(storedUser);

    await expect(
      authorizeCredentials(
        { email: "admin@example.com", password: "wrong" },
        findUser,
      ),
    ).resolves.toBeNull();
  });

  it("returns null and skips the lookup for invalid input", async () => {
    const findUser = vi.fn();

    await expect(
      authorizeCredentials({ email: "invalid", password: "" }, findUser),
    ).resolves.toBeNull();
    expect(findUser).not.toHaveBeenCalled();
    expect(verifyPasswordMock).not.toHaveBeenCalled();
  });

  it("returns null when the user does not exist", async () => {
    const findUser = vi.fn().mockResolvedValue(null);

    await expect(
      authorizeCredentials(
        { email: "admin@example.com", password: "secret" },
        findUser,
      ),
    ).resolves.toBeNull();
    expect(verifyPasswordMock).not.toHaveBeenCalled();
  });

  it("returns null for users without a password hash", async () => {
    const findUser = vi
      .fn()
      .mockResolvedValue({ ...storedUser, passwordHash: null });

    await expect(
      authorizeCredentials(
        { email: "admin@example.com", password: "secret" },
        findUser,
      ),
    ).resolves.toBeNull();
    expect(verifyPasswordMock).not.toHaveBeenCalled();
  });
});
