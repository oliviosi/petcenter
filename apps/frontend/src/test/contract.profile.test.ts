import { describe, it, expect } from 'vitest'
import fetch from 'node-fetch'

// Contract test: verifies the public profile endpoint includes optional domain notification fields
describe('Public profile contract', () => {
  it('exposes dominio_personalizado_* fields when present', async () => {
    const res = await fetch(process.env.STAGING_API_URL + '/api/public/profile')
    const body = await res.json()

    // fields may be null, but should exist when the backend has populated them
    expect(body).toHaveProperty('dominio_personalizado_ultima_notificacao_categoria')
    expect(body).toHaveProperty('dominio_personalizado_ultima_notificacao_motivo')
    expect(body).toHaveProperty('dominio_personalizado_ultima_notificacao_resultado')
    expect(body).toHaveProperty('dominio_personalizado_ultima_notificacao_tentativas')
  })
})
