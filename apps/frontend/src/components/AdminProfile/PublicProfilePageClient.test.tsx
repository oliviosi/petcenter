import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PublicProfilePageClient } from "@/components/AdminProfile/PublicProfilePageClient";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh,
    replace: vi.fn(),
    push: vi.fn(),
  }),
}));

const baseProfile = {
  id: "3e6d414a-2f4f-4f9c-8d53-09bdb734a7b8",
  name: "Pet Center Vila",
  slug: "",
  description: "",
  city: "",
  neighborhood: "",
  contactSummary: "",
  addressSummary: "",
  isPublished: false,
} as const;

describe("PublicProfilePageClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows publication guidance and storefront cues", async () => {
    render(
      <PublicProfilePageClient
        profile={baseProfile}
        updatePublicProfileAction={vi.fn(async () => ({
          success: true,
          message: "ok",
        }))}
      />,
    );

    expect(screen.getByText("Vitrine fora do catálogo público")).toBeInTheDocument();
    expect(screen.getByText("/petshops/[slug]")).toBeInTheDocument();
    expect(screen.getByText("Oculta")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Publicar vitrine/i }));

    expect(screen.getByText("Faltam campos para liberar a vitrine")).toBeInTheDocument();
    expect(
      screen.getByText("Ainda faltam 6 campo(s) obrigatório(s) para liberar a vitrine."),
    ).toBeInTheDocument();
  });

  it("validates required fields before publishing the storefront", async () => {
    const updatePublicProfileAction = vi.fn();

    render(
      <PublicProfilePageClient
        profile={baseProfile}
        updatePublicProfileAction={updatePublicProfileAction}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /Publicar vitrine/i }));
    await userEvent.click(screen.getByRole("button", { name: "Salvar perfil público" }));

    await waitFor(() => {
      expect(
        screen.getByText("Slug é obrigatório quando a vitrine estiver pública."),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Descrição é obrigatória quando a vitrine estiver pública."),
      ).toBeInTheDocument();
      expect(updatePublicProfileAction).not.toHaveBeenCalled();
    });
  });

  it("surfaces slug conflicts returned by the server action", async () => {
    const updatePublicProfileAction = vi.fn(async () => ({
      success: false as const,
      message: "Slug 'pet-center-vila' já está em uso.",
      fieldErrors: {
        slug: "Slug 'pet-center-vila' já está em uso.",
      },
    }));

    render(
      <PublicProfilePageClient
        profile={{
          ...baseProfile,
          slug: "pet-center-vila",
          description: "Banho e tosa com atendimento humanizado.",
          city: "São Paulo",
          neighborhood: "Vila Mariana",
          contactSummary: "WhatsApp (11) 99999-9999",
          addressSummary: "Rua Exemplo, 123",
          isPublished: true,
        }}
        updatePublicProfileAction={updatePublicProfileAction}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Salvar perfil público" }));

    await waitFor(() => {
      expect(
        screen.getAllByText("Slug 'pet-center-vila' já está em uso.")[0],
      ).toBeInTheDocument();
    });
  });

  it("refreshes the page after a successful profile update", async () => {
    const updatePublicProfileAction = vi.fn(async () => ({
      success: true as const,
      message: "Perfil público salvo com sucesso. A vitrine já pode aparecer no catálogo.",
    }));

    render(
      <PublicProfilePageClient
        profile={{
          ...baseProfile,
          slug: "pet-center-vila",
          description: "Banho e tosa com atendimento humanizado.",
          city: "São Paulo",
          neighborhood: "Vila Mariana",
          contactSummary: "WhatsApp (11) 99999-9999",
          addressSummary: "Rua Exemplo, 123",
          isPublished: true,
        }}
        updatePublicProfileAction={updatePublicProfileAction}
      />,
    );

    await userEvent.clear(screen.getByLabelText(/Cidade/i));
    await userEvent.type(screen.getByLabelText(/Cidade/i), "Santos");
    await userEvent.click(screen.getByRole("button", { name: "Salvar perfil público" }));

    await waitFor(() => {
      expect(updatePublicProfileAction).toHaveBeenCalledWith(
        expect.objectContaining({
          city: "Santos",
          isPublished: true,
        }),
      );
      expect(
        screen.getByText(
          "Perfil público salvo com sucesso. A vitrine já pode aparecer no catálogo.",
        ),
      ).toBeInTheDocument();
      expect(refresh).toHaveBeenCalled();
    });
  });
});
