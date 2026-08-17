# Supabase Edge Function interfaces

All endpoints accept `POST`, return JSON as `{ "data": ... }` or `{ "error": { "code", "message" } }`, require HTTPS, validate JWTs unless noted, use project secrets, and write an audit record before reporting success. Limits are per authenticated user per minute; production must implement the shared atomic rate-limit hook. The database role below is the application role checked before the function uses the service-role client—not a credential exposed to callers.

| Function | Authentication | Request body | Success body | Required role | Limit | Audit action | Failure behaviour |
|---|---|---|---|---|---:|---|---|
| `verify-purchase` | JWT | `{claim_id}` | `{accepted, request}` | member | 30 | `purchase.verify` | 401/403/422; verification or audit failure makes no approval |
| `manage-entitlement` | JWT | `{id, decision}` | same | admin | 30 | `entitlement.manage` | fail closed; transaction must roll back |
| `manage-role` | JWT | `{id, role, decision}` | same | admin | 30 | `role.manage` | fail closed; never permit self-escalation |
| `moderate-content` | JWT | `{id, decision}` | same | moderator/admin | 30 | `moderation.apply` | content remains unchanged on error |
| `manage-pattern` | JWT | `{id, decision}` | same | pattern_maintainer/admin | 30 | `pattern.manage` | publication/hold remains unchanged |
| `export-private-data` | JWT | `{format}` | export job descriptor | member | 30 | `privacy.export` | no partial public file; signed result expires |
| `delete-account` | JWT | `{confirmation}` | deletion job descriptor | member | 30 | `privacy.delete` | no deletion until identity re-check and transaction succeed |
| `etsy-proxy` | JWT | `{operation, ...parameters}` | allowlisted Etsy response | admin | 30 | `etsy.request` | secrets/redacted upstream errors never returned |
| `etsy-webhook` | provider signature (scaffold currently also JWT-protected) | `{event}` plus signature header | acknowledgement | trusted webhook | provider/IP limits | `etsy.webhook` | reject invalid signature; idempotently retry safe |
| `storage-sign` | JWT | `{bucket,path}` | short-lived signed operation | member plus resource policy | 30 | `storage.sign` | deny non-allowlisted buckets/paths |

The current handlers are compileable boundary scaffolds, not completed business transactions. Claude must replace their placeholder operation with narrow, idempotent RPCs, validate enumerations/UUIDs, and add integration tests. Browser code may call Supabase directly only for reads/writes protected by reviewed RLS. No service-role key, Etsy secret, webhook secret, or private credential may enter `NEXT_PUBLIC_*`, Actions variables, or the Pages artifact.
