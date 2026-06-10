-- Migration script: add notification metadata columns to empresas
-- Apply this with psql or via your DB migration tooling in staging/production.

BEGIN;

ALTER TABLE empresas
    ADD COLUMN dominio_personalizado_ultima_notificacao_categoria VARCHAR(40),
    ADD COLUMN dominio_personalizado_ultima_notificacao_motivo VARCHAR(300),
    ADD COLUMN dominio_personalizado_ultima_notificacao_enviada_em TIMESTAMPTZ,
    ADD COLUMN dominio_personalizado_ultima_notificacao_resultado VARCHAR(40),
    ADD COLUMN dominio_personalizado_ultima_notificacao_tentativas INTEGER NOT NULL DEFAULT 0;

COMMIT;

-- Rollback (if needed):
-- ALTER TABLE empresas
--    DROP COLUMN dominio_personalizado_ultima_notificacao_categoria,
--    DROP COLUMN dominio_personalizado_ultima_notificacao_motivo,
--    DROP COLUMN dominio_personalizado_ultima_notificacao_enviada_em,
--    DROP COLUMN dominio_personalizado_ultima_notificacao_resultado,
--    DROP COLUMN dominio_personalizado_ultima_notificacao_tentativas;
