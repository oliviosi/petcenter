import { POST } from "./route";

const { clearAdminSession } = vi.hoisted(() => ({
  clearAdminSession: vi.fn(),
}));

vi.mock("@/lib/adminSession", () => ({
  clearAdminSession,
}));

describe("/admin/signout route", () => {
  beforeEach(() => vi.clearAllMocks());

  it("clears the session and redirects to login", async () => {
    const res = await POST();

    expect(clearAdminSession).toHaveBeenCalled();

    // NextResponse.redirect sets Location header
    const location = res.headers.get("location") || res.headers.get("Location");
    expect(location).toBeTruthy();
    expect(location!.endsWith("/admin/login?reason=session")).toBe(true);
  });
});
