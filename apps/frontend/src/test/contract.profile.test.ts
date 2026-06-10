import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const notificationFields = [
  "dominio_personalizado_ultima_notificacao_categoria",
  "dominio_personalizado_ultima_notificacao_motivo",
  "dominio_personalizado_ultima_notificacao_enviada_em",
  "dominio_personalizado_ultima_notificacao_resultado",
  "dominio_personalizado_ultima_notificacao_tentativas",
] as const;

function readFixtureProfile() {
  const fixturePath = path.resolve(process.cwd(), "src/test/fixtures/profile.degraded.json");

  return JSON.parse(readFileSync(fixturePath, "utf-8")) as Record<string, unknown>;
}

function expectNotificationFields(profile: Record<string, unknown>) {
  for (const field of notificationFields) {
    expect(profile).toHaveProperty(field);
  }
}

describe("Public profile contract", () => {
  it("exposes dominio_personalizado_* fields when present", async () => {
    if (!process.env.STAGING_API_URL) {
      expectNotificationFields(readFixtureProfile());
      return;
    }

    const response = await fetch(new URL("/api/public/profile", process.env.STAGING_API_URL));
    expect(response.ok).toBe(true);

    const body = (await response.json()) as Record<string, unknown>;
    expectNotificationFields(body);
  });
});
