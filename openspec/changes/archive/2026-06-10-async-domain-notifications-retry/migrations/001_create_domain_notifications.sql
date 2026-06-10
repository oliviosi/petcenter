-- Migration: create domain_notifications table

CREATE TABLE IF NOT EXISTS domain_notifications (
    notification_id uuid PRIMARY KEY,
    empresa_id uuid NOT NULL,
    domain varchar(255) NOT NULL,
    state varchar(50) NOT NULL,
    reason text,
    status varchar(20) NOT NULL DEFAULT 'pending',
    attempts int NOT NULL DEFAULT 0,
    last_attempt_at timestamptz,
    next_attempt_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_domain_notifications_empresa_id ON domain_notifications (empresa_id);
CREATE INDEX IF NOT EXISTS idx_domain_notifications_status ON domain_notifications (status);
