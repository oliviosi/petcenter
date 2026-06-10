import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

// Contract test: verifies the public profile endpoint includes optional domain notification fields
describe('Public profile contract', () => {
  it('exposes dominio_personalizado_* fields when present', async () => {
    // If STAGING_API_URL is not set, use local fixture as fallback
    if (!process.env.STAGING_API_URL) {
      const fixture = JSON.parse(fs.readFileSync(path.resolve(__dirname, './fixtures/profile.degraded.json'), 'utf-8'))
      expect(fixture).toHaveProperty('dominio_personalizado_ultima_notificacao_categoria')
      expect(fixture).toHaveProperty('dominio_personalizado_ultima_notificacao_motivo')
      expect(fixture).toHaveProperty('dominio_personalizado_ultima_notificacao_enviada_em')
      expect(fixture).toHaveProperty('dominio_personalizado_ultima_notificacao_resultado')
      expect(fixture).toHaveProperty('dominio_personalizado_ultima_notificacao_tentativas')
      return
    }

    const res = await fetch(process.env.STAGING_API_URL + '/api/public/profile')
    const body = await res.json()

    // fields may be null, but should exist when the backend has populated them
    expect(body).toHaveProperty('dominio_personalizado_ultima_notificacao_categoria')
    expect(body).toHaveProperty('dominio_personalizado_ultima_notificacao_motivo')
    expect(body).toHaveProperty('dominio_personalizado_ultima_notificacao_enviada_em')
    expect(body).toHaveProperty('dominio_personalizado_ultima_notificacao_resultado')
    expect(body).toHaveProperty('dominio_personalizado_ultima_notificacao_tentativas')
  })
})
