import { NextIntlClientProvider } from "next-intl";
import { render, screen } from "@testing-library/react";

import enMessages from "@/messages/en.json";
import esMessages from "@/messages/es.json";
import ptMessages from "@/messages/pt.json";

import Home from "./page";

describe("Home page", () => {
  it.each([
    ["en", enMessages],
    ["pt", ptMessages],
    ["es", esMessages],
  ] as const)("renders both sentences in %s", (locale, messages) => {
    render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Home />
      </NextIntlClientProvider>,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: messages.HomePage.title,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(messages.HomePage.description),
    ).toBeInTheDocument();
  });
});
