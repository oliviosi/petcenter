Ops team,

Branch/PR: openspec/tenant-custom-domain-notifications-extension
PR URL: https://github.com/oliviosi/petcenter/compare/main...openspec/tenant-custom-domain-notifications-extension?expand=1

Summary:
- Adds notification metadata fields to empresas, implements EmailNotificationProvider with retry/backoff, and exposes latest notification info in the public profile DTO.
- Backend unit + integration tests pass locally.

Action required (staging):
1. Backup staging DB.
2. Apply migration script:
   psql "$STAGING_CONN" -f openspec/changes/tenant-custom-domain-notifications-extension/migration.sql
3. Verify columns exist in empresas (see ops_apply_instructions.md).
4. Deploy backend to staging and run smoke tests (see runbook.md for verification steps).

If any issues, revert DB from backup and notify backend-oncall.

Thanks,
Auto-agent
