import { ApiRequestError } from "@/lib/api";
import { submitAdminLoginAction } from "@/app/admin/login/actions";

const { login, setAdminSession, clearAdminSession } = vi.hoisted(() => ({
  login: vi.fn(),
  setAdminSession: vi.fn(),
  clearAdminSession: vi.fn(),
}));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");

  return {
    ...actual,
    api: {
      ...actual.api,
      login,
    },
  };
});

vi.mock("@/lib/adminSession", () => ({
  setAdminSession,
  clearAdminSession,
}));

describe("submitAdminLoginAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns validation errors when credentials are incomplete", async () => {
    const result = await submitAdminLoginAction({
      email: "",
      password: "",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      throw new Error("Expected validation failure.");
    }

    expect(result.fieldErrors?.email).toBe("Informe um e-mail válido.");
    expect(result.fieldErrors?.password).toBe("Senha é obrigatória.");
    expect(login).not.toHaveBeenCalled();
  });

  it("stores the session and returns the dashboard redirect on success", async () => {
    login.mockResolvedValue({
      token: "jwt-token",
      userId: "88a9f13d-5466-4ef5-a598-0973caf56f2d",
      empresaId: "03690d11-26c8-4dc8-b312-c46ce5d4fe08",
    });

    const result = await submitAdminLoginAction({
      email: "admin@petcenter.dev",
      password: "super-segura",
    });

    expect(login).toHaveBeenCalledWith({
      email: "admin@petcenter.dev",
      password: "super-segura",
    });
    expect(setAdminSession).toHaveBeenCalledWith({
      token: "jwt-token",
      userId: "88a9f13d-5466-4ef5-a598-0973caf56f2d",
      empresaId: "03690d11-26c8-4dc8-b312-c46ce5d4fe08",
    });
    expect(result).toEqual({
      success: true,
      redirectTo: "/admin/bookings",
    });
  });

  it("returns API error messages for invalid credentials", async () => {
    login.mockRejectedValue(
      new ApiRequestError({
        title: "Credenciais inválidas.",
        status: 401,
      }),
    );

    const result = await submitAdminLoginAction({
      email: "admin@petcenter.dev",
      password: "invalida",
    });

    expect(result).toEqual({
      success: false,
      message: "Credenciais inválidas.",
      fieldErrors: {},
    });
  });
});
