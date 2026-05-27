import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PublicProfilePageClient } from "@/components/AdminProfile/PublicProfilePageClient";

const refresh = vi.fn();
const writeText = vi.fn();
const formatDateTimeLabel = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));

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
  customDomain: {
    desiredDomain: null,
    activeDomain: null,
    status: "removed" as const,
    failureMessage: null,
    lastAttemptAt: null,
    nextRetryAt: null,
    verifiedAt: null,
    activatedAt: null,
  },
  isPublished: false,
} as const;

describe("PublicProfilePageClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_APP_URL = "https://petcenter.test";
    Object.assign(navigator, {
      clipboard: {
        writeText,
      },
    });
  });

  it("shows unavailable guidance when there is no fallback slug or active custom domain", async () => {
    render(
      <PublicProfilePageClient
        profile={baseProfile}
        updatePublicProfileAction={vi.fn(async () => ({
          success: true,
          message: "ok",
        }))}
      />,
    );

    expect(screen.getByText("Vitrine fora da experiencia publica principal")).toBeInTheDocument();
    expect(
      screen.getByText("Defina um slug ou ative um domínio para gerar o link canônico"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Defina um slug ou ative um domínio para montar o link público completo.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Fallback compartilhado")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Copiar link" })).not.toBeInTheDocument();

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

  it("keeps the shared-host fallback explicit while a custom domain is pending", () => {
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
          customDomain: {
            desiredDomain: "agenda.petcenter-vila.com",
            activeDomain: null,
            status: "pending_setup",
            failureMessage: null,
            lastAttemptAt: null,
            nextRetryAt: "2026-01-12T18:30:00Z",
            verifiedAt: null,
            activatedAt: null,
          },
          isPublished: true,
        }}
        updatePublicProfileAction={vi.fn(async () => ({
          success: true,
          message: "ok",
        }))}
      />,
    );

    expect(screen.getByText("Fallback ativo para compartilhamento")).toBeInTheDocument();
    expect(screen.getByText("Compartilhe agora")).toBeInTheDocument();
    expect(screen.getAllByText("https://petcenter.test/petshops/pet-center-vila")[0]).toBeInTheDocument();
    expect(screen.getAllByText("agenda.petcenter-vila.com")).toHaveLength(2);
    expect(screen.getByText("CNAME")).toBeInTheDocument();
    expect(screen.getByText("petcenter.test")).toBeInTheDocument();
    expect(
      screen.getByText(
        "O domínio desejado foi salvo, mas o host compartilhado continua canônico até o DNS ficar pronto e a ativação acontecer.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Automação do domínio personalizado")).toBeInTheDocument();
    expect(
      screen.getAllByText(
        `A próxima tentativa automática está prevista para ${formatDateTimeLabel("2026-01-12T18:30:00Z")}.`,
      )[0],
    ).toBeInTheDocument();
  });

  it("shows automated verification progress while the shared host remains canonical", () => {
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
          customDomain: {
            desiredDomain: "agenda.petcenter-vila.com",
            activeDomain: null,
            status: "verifying",
            failureMessage: null,
            lastAttemptAt: "2026-01-12T17:00:00Z",
            nextRetryAt: "2026-01-12T18:00:00Z",
            verifiedAt: null,
            activatedAt: null,
          },
          isPublished: true,
        }}
        updatePublicProfileAction={vi.fn(async () => ({
          success: true,
          message: "ok",
        }))}
      />,
    );

    expect(screen.getByText("Fallback ativo para compartilhamento")).toBeInTheDocument();
    expect(
      screen.getByText(
        "A verificação automática está em andamento. O host compartilhado segue como URL canônica até a ativação do domínio.",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText("https://petcenter.test/petshops/pet-center-vila")[0]).toBeInTheDocument();
    expect(
      screen.getAllByText(
        `Última checagem automática em ${formatDateTimeLabel("2026-01-12T17:00:00Z")}.`,
      )[0],
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(
        `Se o DNS ainda não estiver pronto, a próxima tentativa automática está prevista para ${formatDateTimeLabel("2026-01-12T18:00:00Z")}.`,
      )[0],
    ).toBeInTheDocument();
    expect(screen.getByText("Domínio verificado em")).toBeInTheDocument();
    expect(screen.getByText("Ainda não verificado")).toBeInTheDocument();
  });

  it("shows recoverable verification failures and keeps the shared host as fallback", () => {
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
          customDomain: {
            desiredDomain: "agenda.petcenter-vila.com",
            activeDomain: null,
            status: "failed",
            failureMessage:
              "Não encontramos o CNAME esperado apontando para petcenter.test.",
            lastAttemptAt: "2026-01-12T17:15:00Z",
            nextRetryAt: "2026-01-12T19:15:00Z",
            verifiedAt: null,
            activatedAt: null,
          },
          isPublished: true,
        }}
        updatePublicProfileAction={vi.fn(async () => ({
          success: true,
          message: "ok",
        }))}
      />,
    );

    expect(screen.getAllByText("Falha recuperável")[0]).toBeInTheDocument();
    expect(
      screen.getByText(
        "A última tentativa automática falhou. O host compartilhado segue como URL canônica até a próxima verificação bem-sucedida.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Não encontramos o CNAME esperado apontando para petcenter.test."),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(
        `Depois de corrigir o DNS, aguarde a próxima tentativa automática em ${formatDateTimeLabel("2026-01-12T19:15:00Z")}.`,
      )[0],
    ).toBeInTheDocument();
    expect(screen.getByText("Ainda não ativado")).toBeInTheDocument();
    expect(screen.getAllByText("https://petcenter.test/petshops/pet-center-vila")[0]).toBeInTheDocument();
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
      expect(screen.getAllByText("Slug 'pet-center-vila' já está em uso.")[0]).toBeInTheDocument();
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
          desiredCustomDomain: "",
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

  it("allows copying the active canonical storefront link when the custom domain is active", async () => {
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
          customDomain: {
            desiredDomain: "agenda.petcenter-vila.com",
            activeDomain: "agenda.petcenter-vila.com",
            status: "active",
            failureMessage: null,
            lastAttemptAt: "2026-01-12T17:30:00Z",
            nextRetryAt: null,
            verifiedAt: "2026-01-12T17:30:00Z",
            activatedAt: "2026-01-12T17:31:00Z",
          },
          isPublished: true,
        }}
        updatePublicProfileAction={vi.fn(async () => ({
          success: true,
          message: "ok",
        }))}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Copiar link" }));

    expect(writeText).toHaveBeenCalledWith("https://agenda.petcenter-vila.com");
    expect(screen.getByRole("link", { name: "Abrir vitrine" })).toHaveAttribute(
      "href",
      "https://agenda.petcenter-vila.com",
    );
    expect(screen.getByText("Domínio canônico ativo")).toBeInTheDocument();
    expect(screen.getByText("Link copiado para compartilhar com clientes.")).toBeInTheDocument();
    expect(
      screen.getAllByText(
        `Ativação registrada em ${formatDateTimeLabel("2026-01-12T17:31:00Z")}.`,
      )[0],
    ).toBeInTheDocument();
  });
});
