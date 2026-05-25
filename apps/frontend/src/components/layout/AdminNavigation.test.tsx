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
  it("renders bookings, professionals and services with active state", () => {
    usePathname.mockReturnValue("/admin/services");

    render(<AdminNavigation />);

    expect(screen.getByRole("link", { name: "Reservas" })).toHaveAttribute(
      "href",
      "/admin/bookings",
    );
    expect(screen.getByRole("link", { name: "Profissionais" })).toHaveAttribute(
      "href",
      "/admin/professionals",
    );
    expect(screen.getByRole("link", { name: "Serviços" })).toHaveAttribute(
      "href",
      "/admin/services",
    );
    expect(screen.getByRole("link", { name: "Serviços" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
