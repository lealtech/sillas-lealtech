import { describe, expect, it } from "vitest";

import {
  adminLoginPath,
  isAdminLoginPath,
  isProtectedAdminPath,
  resolveAdminCallbackUrl,
  splitLocalePath,
} from "./routes";

describe("splitLocalePath", () => {
  it.each([
    ["/pt/admin/login", { locale: "pt", pathname: "/admin/login" }],
    ["/en", { locale: "en", pathname: "/" }],
    ["/es/admin", { locale: "es", pathname: "/admin" }],
    ["/admin/login", { locale: null, pathname: "/admin/login" }],
    ["/", { locale: null, pathname: "/" }],
  ] as const)("splits %s", (input, expected) => {
    expect(splitLocalePath(input)).toEqual(expected);
  });
});

describe("admin path helpers", () => {
  it.each([
    ["/admin", true],
    ["/admin/", true],
    ["/admin/settings", true],
    ["/admin/login", false],
    ["/admin/login/", false],
    ["/administrator", false],
    ["/", false],
  ])("isProtectedAdminPath(%s) is %s", (pathname, expected) => {
    expect(isProtectedAdminPath(pathname)).toBe(expected);
  });

  it("recognizes the login path", () => {
    expect(isAdminLoginPath("/admin/login")).toBe(true);
    expect(isAdminLoginPath("/admin/login/")).toBe(true);
    expect(isAdminLoginPath("/admin")).toBe(false);
  });

  it("builds a localized login URL with an encoded callback", () => {
    expect(adminLoginPath("pt", "/pt/admin/users?page=2")).toBe(
      "/pt/admin/login?callbackUrl=%2Fpt%2Fadmin%2Fusers%3Fpage%3D2",
    );
    expect(adminLoginPath("en")).toBe("/en/admin/login");
    expect(adminLoginPath("es", null)).toBe("/es/admin/login");
  });
});

describe("resolveAdminCallbackUrl", () => {
  it("keeps same-locale protected admin paths", () => {
    expect(resolveAdminCallbackUrl("/pt/admin/users?page=2", "pt")).toBe(
      "/pt/admin/users?page=2",
    );
  });

  it.each([
    ["missing", undefined],
    ["external", "https://evil.example/admin"],
    ["protocol relative", "//evil.example/admin"],
    ["other locale", "/en/admin/users"],
    ["login page", "/pt/admin/login"],
    ["outside admin", "/pt/checkout"],
  ])("falls back for %s callback URLs", (_label, callbackUrl) => {
    expect(resolveAdminCallbackUrl(callbackUrl, "pt")).toBe("/pt/admin");
  });
});
