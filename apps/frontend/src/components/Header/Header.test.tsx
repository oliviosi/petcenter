import React from "react";
import { render, screen } from "@testing-library/react";

const { getAdminSession } = vi.hoisted(() => ({
  getAdminSession: vi.fn(),
}));

vi.mock("@/lib/adminSession", () => ({
  getAdminSession,
}));

import Header from "./Header";

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows Entrar when no session", async () => {
    getAdminSession.mockResolvedValue(null);

    const element = await Header();
    render(element as React.ReactElement);

    expect(screen.getByText("Petshops")).toBeInTheDocument();
    expect(screen.getByText("Entrar")).toBeInTheDocument();
  });

  it("shows Dashboard and Sair when authenticated", async () => {
    getAdminSession.mockResolvedValue({
      token: "jwt",
      userId: "u",
      empresaId: "e",
    });

    const element = await Header();
    render(element as React.ReactElement);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sair" })).toBeInTheDocument();
  });
});
