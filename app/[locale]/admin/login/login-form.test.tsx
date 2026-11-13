import { NextIntlClientProvider } from "next-intl";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import enMessages from "@/messages/en.json";
import esMessages from "@/messages/es.json";
import ptMessages from "@/messages/pt.json";
import type { Locale } from "@/i18n/routing";

import { login, type LoginState } from "./actions";
import { LoginForm } from "./login-form";

vi.mock("./actions", () => ({
  login: vi.fn(),
}));

const loginMock = vi.mocked(login);

function renderForm(
  locale: Locale,
  messages: typeof enMessages,
  callbackUrl?: string,
) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LoginForm callbackUrl={callbackUrl} />
    </NextIntlClientProvider>,
  );
}

describe("LoginForm", () => {
  beforeEach(() => {
    loginMock.mockReset();
  });

  it.each([
    ["en", enMessages],
    ["pt", ptMessages],
    ["es", esMessages],
  ] as const)("renders the %s labels", (locale, messages) => {
    renderForm(locale, messages);

    expect(screen.getByLabelText(messages.Admin.Login.emailLabel)).toBeInTheDocument();
    expect(
      screen.getByLabelText(messages.Admin.Login.passwordLabel),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: messages.Admin.Login.submit }),
    ).toBeInTheDocument();
  });

  it("submits the credentials, locale and callback URL", async () => {
    const user = userEvent.setup();
    loginMock.mockResolvedValue({});
    renderForm("pt", ptMessages, "/pt/admin/users");

    await user.type(
      screen.getByLabelText(ptMessages.Admin.Login.emailLabel),
      "admin@example.com",
    );
    await user.type(
      screen.getByLabelText(ptMessages.Admin.Login.passwordLabel),
      "secret",
    );
    await user.click(
      screen.getByRole("button", { name: ptMessages.Admin.Login.submit }),
    );

    await waitFor(() => expect(loginMock).toHaveBeenCalledTimes(1));

    const [, formData] = loginMock.mock.calls[0];
    expect(formData.get("email")).toBe("admin@example.com");
    expect(formData.get("password")).toBe("secret");
    expect(formData.get("locale")).toBe("pt");
    expect(formData.get("callbackUrl")).toBe("/pt/admin/users");
  });

  it("shows the translated error returned by the action", async () => {
    const user = userEvent.setup();
    loginMock.mockResolvedValue({ error: "invalidCredentials" });
    renderForm("es", esMessages);

    await user.type(
      screen.getByLabelText(esMessages.Admin.Login.emailLabel),
      "admin@example.com",
    );
    await user.type(
      screen.getByLabelText(esMessages.Admin.Login.passwordLabel),
      "wrong",
    );
    await user.click(
      screen.getByRole("button", { name: esMessages.Admin.Login.submit }),
    );

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent(esMessages.Admin.Login.invalidCredentials);
  });

  it("disables the button while the action is pending", async () => {
    const user = userEvent.setup();
    let resolveAction: (state: LoginState) => void = () => {};
    loginMock.mockReturnValue(
      new Promise<LoginState>((resolve) => {
        resolveAction = resolve;
      }),
    );
    renderForm("en", enMessages);

    await user.type(
      screen.getByLabelText(enMessages.Admin.Login.emailLabel),
      "admin@example.com",
    );
    await user.type(
      screen.getByLabelText(enMessages.Admin.Login.passwordLabel),
      "secret",
    );
    await user.click(
      screen.getByRole("button", { name: enMessages.Admin.Login.submit }),
    );

    expect(
      screen.getByRole("button", { name: enMessages.Admin.Login.submitting }),
    ).toBeDisabled();

    resolveAction({});
  });
});
