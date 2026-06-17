import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/(public)/page";
import { ApiRequestError } from "@/lib/api";

const { getHeaderValue, getPublicPetshopByHost, useRouter } = vi.hoisted(() => ({
  getHeaderValue: vi.fn(),
  getPublicPetshopByHost: vi.fn(),
  useRouter: vi.fn(() => ({ replace: vi.fn(), push: vi.fn() })),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));


  getHeaderValue: vi.fn(),
  getPublicPetshopByHost: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: async () => ({
    get: getHeaderValue,
  }),
}));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");

  return {
    ...actual,
    api: {
      ...actual.api,
      getPublicPetshopByHost,
    },
  };
});

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_APP_URL = "https://petcenter.test";
  });

  it("renders a neutral single-petshop shell without promoting catalog discovery as the main path", async () => {
    getHeaderValue.mockImplementation((name: string) =>
      name === "host" ? "petcenter.test" : null,
    );

    render(await HomePage());

    expect(
      screen.getByRole("heading", {
        name: "Cada petshop com sua propria entrada publica",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Entrada publica por petshop")).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Sou cliente — Entrar / Criar conta",
      }),
    ).toHaveAttribute("href", "/login");

    expect(
      screen.getByRole("link", {
        name: "Sou dono de petshop — Cadastre sua loja",
      }),
    ).toHaveAttribute("href", "/register");
    expect(getPublicPetshopByHost).not.toHaveBeenCalled();
  });

  it("resolves an active custom domain directly into the storefront shell", async () => {
    getHeaderValue.mockImplementation((name: string) =>
      name === "host" ? "agenda.petcenter-vila.com" : null,
    );
    getPublicPetshopByHost.mockResolvedValueOnce({
      id: "12f7cc46-43f4-47d9-bf45-d582adf66b5b",
      name: "Pet Center Vila",
      slug: "pet-center-vila",
      description: "Banho e tosa com atendimento humanizado.",
      city: "São Paulo",
      neighborhood: "Vila Mariana",
      contactSummary: "WhatsApp (11) 99999-9999",
      addressSummary: "Rua Exemplo, 123",
      averageRating: 4.8,
      feedbackCount: 25,
      professionals: [
        {
          id: "9ef53224-8d69-4d4f-b035-e532ed93b4fe",
          name: "Ana",
          specialty: "Banho",
        },
      ],
      services: [
        {
          id: "a10d1301-7ee9-47e0-bac5-55ab2c77de91",
          name: "Banho",
          durationMinutes: 60,
          basePrice: 90,
        },
      ],
    });

    render(await HomePage());

    expect(screen.getByRole("heading", { name: "Pet Center Vila" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver horarios disponiveis" })).toHaveAttribute(
      "href",
      "/book?serviceId=a10d1301-7ee9-47e0-bac5-55ab2c77de91",
    );
  });

  it("falls back to the neutral shell when the shared host cannot be inferred", async () => {
    process.env.NEXT_PUBLIC_APP_URL = "";
    getHeaderValue.mockImplementation((name: string) =>
      name === "host" ? "agenda.petcenter-vila.com" : null,
    );

    render(await HomePage());

    expect(
      screen.getByRole("heading", {
        name: "Cada petshop com sua propria entrada publica",
      }),
    ).toBeInTheDocument();
    expect(getPublicPetshopByHost).not.toHaveBeenCalled();
  });
});
