-- Migration: create domain_notifications table for tenant domain health dashboard
-- Path: openspec/changes/tenant-domain-health-dashboard/migration.sql

BEGIN;

CREATE TABLE IF NOT EXISTS domain_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid NOT NULL,
    category varchar(50) NOT NULL, -- e.g., 'degraded' | 'recovered'
    reason text NULL,
    payload jsonb NULL,
    sent_at timestamptz NULL,
    outcome varchar(20) NULL, -- 'success'|'failure'|'pending'
    attempts integer DEFAULT 0 NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Foreign key to empresas if table exists (safe: only add FK if empresas.id exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'empresas') THEN
        ALTER TABLE domain_notifications
        ADD CONSTRAINT fk_domain_notifications_empresas FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE;
    END IF;
END$$;

CREATE INDEX IF NOT EXISTS idx_domain_notifications_empresa_id ON domain_notifications(empresa_id);
CREATE INDEX IF NOT EXISTS idx_domain_notifications_created_at ON domain_notifications(created_at DESC);

COMMIT;
