import React from "react";
import { render, screen } from "@testing-library/react";
import { AdminNavigation } from "@/components/layout/AdminNavigation";

const { usePathname } = vi.hoisted(() => ({
  usePathname: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname,
}));

describe("AdminNavigation", () => {
  it("renders bookings, feedback, public profile, professionals and services with active state", () => {
    usePathname.mockReturnValue("/admin/profile");

    render(<AdminNavigation />);

    expect(screen.getByRole("link", { name: "Reservas" })).toHaveAttribute(
      "href",
      "/admin/bookings",
    );
    expect(screen.getByRole("link", { name: "Feedback" })).toHaveAttribute(
      "href",
      "/admin/feedback",
    );
    expect(screen.getByRole("link", { name: "Perfil público" })).toHaveAttribute(
      "href",
      "/admin/profile",
    );
    expect(screen.getByRole("link", { name: "Profissionais" })).toHaveAttribute(
      "href",
      "/admin/professionals",
    );
    expect(screen.getByRole("link", { name: "Serviços" })).toHaveAttribute(
      "href",
      "/admin/services",
    );
    expect(screen.getByRole("link", { name: "Perfil público" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
