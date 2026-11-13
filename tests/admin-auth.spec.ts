import { expect, test } from "@playwright/test";
import "dotenv/config";

const adminEmail = process.env.ADMIN_EMAIL ?? "";
const adminPassword = process.env.ADMIN_PASSWORD ?? "";

test.describe("admin authentication", () => {
  test("redirects anonymous visitors to the localized login page", async ({
    page,
  }) => {
    await page.goto("/en/admin");

    await expect(page).toHaveURL(/\/en\/admin\/login\?callbackUrl=/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Admin sign in" }),
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("renders the login screen in the selected language", async ({ page }) => {
    await page.goto("/pt/admin/login");

    await expect(
      page.getByRole("heading", { level: 1, name: "Entrar no painel" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
  });

  test("rejects invalid credentials", async ({ page }) => {
    await page.goto("/en/admin/login");

    await page.getByLabel("Email").fill(adminEmail);
    await page.getByLabel("Password").fill("definitely-wrong");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Invalid email or password.")).toBeVisible();
    await expect(page).toHaveURL(/\/en\/admin\/login/);
  });

  test("signs in, reaches the dashboard and signs out", async ({ page }) => {
    await page.goto("/pt/admin/login");

    await page.getByLabel("Email").fill(adminEmail);
    await page.getByLabel("Senha").fill(adminPassword);
    await page.getByRole("button", { name: "Entrar" }).click();

    await page.waitForURL("**/pt/admin");
    await expect(
      page.getByRole("heading", { name: "Painel administrativo" }),
    ).toBeVisible();
    await expect(
      page.getByText(`Conectado como ${adminEmail}.`),
    ).toBeVisible();

    // A signed-in user no longer sees the login screen.
    await page.goto("/pt/admin/login");
    await page.waitForURL("**/pt/admin");

    await page.getByRole("button", { name: "Sair" }).click();
    await page.waitForURL("**/pt/admin/login");

    // The session cookie is gone, so protected routes redirect again.
    await page.goto("/pt/admin");
    await expect(page).toHaveURL(/\/pt\/admin\/login/);
  });
});
