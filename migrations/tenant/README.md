# Migrações de tenant

Os scripts são reaplicados em ordem no startup e, por isso, devem permanecer idempotentes.

- `001_identity_pending.sql`: identidade institucional inicial.
- `002_activate_initial_authority.sql`: autoridade inicial do Síndico.
- `003_authorization_context.sql`: capacidades e versão de autorização.
- `004_people_units_relationships.sql`: Pessoas, Unidades, Vínculos temporais, auditoria e idempotência tenant-scoped.
- `005_invitations_capability.sql`: Papéis predefinidos e capacidade de gerir Convites concedida apenas ao Síndico vigente; corrige `authority_assignment_initial_unique` para `WHERE state='active'` (a versão original de 002 bloqueava permanentemente reconvites com o mesmo Papel após um Vínculo encerrado).
### Versão 6 — ciclo de vida de Papéis

Adiciona atribuições acumuláveis sob uma única membership tenant-scoped, máquina temporal, histórico append-only, projeção exportável, idempotência e outbox transacional. Instantes são armazenados em UTC (`timestamptz`); a zona IANA permanece configuração separada do Condomínio.

### Versão 7 — delegação granular de capacidades (`007_capability_delegation.sql`)

Adiciona `capability_grant` (concessões individuais de capacidades delegáveis a Auxiliares Administrativos), com máquina de estados `scheduled -> active -> expired`/`scheduled|active -> revoked`, histórico (`capability_grant_transition`), projeção exportável (`capability_grant_projection`) e outbox de notificação (`capability_notification_outbox`) próprios. O catálogo fechado de capacidades vive em `packages/application/src/authorization/capabilities.ts`, não no banco. `roles.suspend` deixou de ser incondicional para o Auxiliar (removido de `ROLE_CATALOG['administrative-assistant']` em `roles.ts`) e passou a depender de uma `capability_grant` ativa e vigente.

### Versão 8 — Responsáveis Financeiros por Unidade (`008_financial_responsibles.sql`)

Adiciona `financial_responsible_assignment` (atribuição Pessoa↔Unidade da capacidade institucional "responsável financeiro"), com a mesma máquina de estados de `capability_grant` (`scheduled -> active -> expired`/`scheduled|active -> revoked`, sem `suspended`), histórico (`financial_responsible_transition`), projeção exportável (`financial_responsible_projection`) e outbox de notificação (`financial_responsible_notification_outbox`) próprios. `source_relationship_id` referencia o Vínculo (`person_unit_relationship`) que tornou a atribuição possível e é revalidado a cada verificação (encerrar o Vínculo invalida a atribuição imediatamente, mesma lição do caminho delegado de `roles.suspend` na Story 1.9). A capacidade que controla quem pode gerir estas atribuições (`financial-responsibles.manage`) é institucional ao Síndico e delegável a Auxiliares pelo mecanismo já existente de `capability_grant` — nenhuma tabela nova para isso.
