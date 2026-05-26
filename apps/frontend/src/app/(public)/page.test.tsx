import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/(public)/page";

describe("HomePage", () => {
  it("renders a neutral single-petshop shell without promoting catalog discovery as the main path", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        name: "Cada petshop com sua propria entrada publica",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Entrada publica por petshop")).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Abrir catalogo secundario",
      }),
    ).toHaveAttribute("href", "/petshops");
  });
});
