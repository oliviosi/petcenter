import React from "react";
import { render, screen } from "@testing-library/react";
import { CatalogEmptyState } from "@/components/PublicCatalog/CatalogEmptyState";
import { CatalogListSkeleton } from "@/components/PublicCatalog/CatalogListSkeleton";
import { PublicRequestErrorState } from "@/components/PublicRequestErrorState";

describe("Public catalog states", () => {
  it("renders the empty state message", () => {
    render(<CatalogEmptyState />);

    expect(screen.getByText("Nenhum petshop encontrado")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Limpar filtros" }),
    ).toHaveAttribute("href", "/petshops");
  });

  it("renders the loading skeleton with accessible status text", () => {
    render(<CatalogListSkeleton />);

    expect(screen.getByRole("status", { name: "Carregando petshops" })).toBeInTheDocument();
  });

  it("renders a recoverable error state", () => {
    render(
      <PublicRequestErrorState
        title="Erro ao consultar petshops"
        description="Falha temporária na API."
        onRetry={() => undefined}
      />,
    );

    expect(screen.getByText("Erro ao consultar petshops")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tentar novamente" })).toBeInTheDocument();
  });
});
