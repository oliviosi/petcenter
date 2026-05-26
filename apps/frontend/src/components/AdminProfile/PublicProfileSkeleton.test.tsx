import React from "react";
import { render, screen } from "@testing-library/react";
import { PublicProfileSkeleton } from "@/components/AdminProfile/PublicProfileSkeleton";

describe("PublicProfileSkeleton", () => {
  it("renders a loading state shaped like the storefront profile console", () => {
    render(<PublicProfileSkeleton />);

    expect(
      screen.getByRole("status", { name: "Carregando perfil público" }),
    ).toBeInTheDocument();
  });
});
