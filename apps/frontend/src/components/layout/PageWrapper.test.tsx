import React from "react";
import { render, screen } from "@testing-library/react";
import { PageWrapper } from "@/components/layout/PageWrapper";

describe("PageWrapper", () => {
  it("renders heading, description and actions with the premium heading class", () => {
    render(
      <PageWrapper
        title="Fila de reservas"
        description="Acompanhe a operação autenticada."
        actions={<button type="button">Atualizar</button>}
      >
        <div>Conteúdo</div>
      </PageWrapper>,
    );

    const heading = screen.getByRole("heading", { name: "Fila de reservas" });

    expect(heading).toHaveClass("font-heading");
    expect(screen.getByText("Acompanhe a operação autenticada.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Atualizar" })).toBeInTheDocument();
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  });
});
