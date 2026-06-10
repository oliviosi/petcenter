import React from 'react';

type Props = {
  category?: string | null;
  reason?: string | null;
  sentAt?: string | null;
  result?: string | null;
  attempts?: number | null;
};

function formatDateTimeLabel(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function DomainNotificationBanner({ category, reason, sentAt, result, attempts }: Props) {
  if (!category) return null;

  const isDegraded = category.toLowerCase() === 'degraded';

  return (
    <div
      role="status"
      className={
        `w-full p-4 rounded-md border ${isDegraded ? 'bg-error/10 border-error/20 text-error' : 'bg-success/10 border-border-default text-success'}`
      }
    >
      <div className="max-w-4xl mx-auto flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium">
            {isDegraded ? 'Problema detectado no domínio personalizado' : 'Domínio personalizado recuperado'}
          </p>
          {reason && <p className="text-sm mt-1 text-text-secondary">{reason}</p>}
        </div>
        <div className="text-xs text-text-secondary">
          {sentAt && <div>Enviada em: {formatDateTimeLabel(sentAt)}</div>}
          {result && <div>Último resultado: {result}</div>}
          {attempts != null && <div>Tentativas: {attempts}</div>}
        </div>
      </div>
    </div>
  );
}
