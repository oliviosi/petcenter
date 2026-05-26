import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders a link button when href is provided", () => {
    render(
      <Button href="/petshops" variant="secondary">
        Ver petshops
      </Button>,
    );

    expect(screen.getByRole("link", { name: "Ver petshops" })).toHaveAttribute(
      "href",
      "/petshops",
    );
  });

  it("disables the button while loading", () => {
    render(<Button loading>Salvar</Button>);

    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });
});
