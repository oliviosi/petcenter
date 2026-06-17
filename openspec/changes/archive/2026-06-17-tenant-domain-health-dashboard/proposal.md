# Proposta: tenant-domain-health-dashboard

## Objetivo

Criar um dashboard por tenant para acompanhar a saúde dos domínios: falhas de notificação, prontidão de certificado e verificação de DNS.

## Por quê

- Reduz tempo de diagnóstico.
- Dá visibilidade operacional por tenant.
- Ajuda suporte e ops a agir antes de impacto no cliente.

## Fontes de dados

- Contadores de métricas expostos pelo backend.
- Tabela `domain_notifications`.
- Dados de tenant/domínio usados para status de certificado e DNS.

## Componentes

- Backend: endpoints para agregação e detalhe.
- Prometheus/Grafana: dashboard operacional.
- Frontend admin: página com visão por tenant.

## Critérios de aceitação

- Exibir métricas por tenant sem cruzar dados entre tenants.
- Mostrar falhas de notificação, prontidão de certificado e status de DNS.
- Dashboard refletir métricas e tabela persistida.
- Administrador conseguir filtrar um tenant e ver o estado atual.

## Riscos

- Divergência entre métricas e banco.
- Consulta lenta em ambiente com muitos tenants.
- Exposição indevida de dados fora do tenant.
