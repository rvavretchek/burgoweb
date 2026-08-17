# Deferred Work

## Deferred from: code review of 1-2-criar-conta-e-condominio-de-forma-segura (2026-07-30)

- `knownResult` só faz polling por ~1s (40×25ms) antes de tratar uma solicitação concorrente em andamento como conflito. [packages/application/src/provisioning/create-condominium.ts:12-23]
- `Argon2PasswordHasher.verify` não tem caminho de fallback para pepper anterior — rotação de pepper bloquearia todas as Contas existentes; ainda não alcançável nesta story (login é Story 1.4). [packages/adapters/src/security/argon2-password-hasher.ts:9-12]
- `argon2.verify` pode lançar exceção em hash malformado em vez de resolver `false`; mesma ressalva de alcançabilidade do item anterior. [packages/adapters/src/security/argon2-password-hasher.ts:10-12]
- `packages/adapters`, `application`, `config`, `api-client`, `test-support` não têm `tsconfig.json`/script de build próprios — checados apenas transitivamente pelos apps que os importam hoje. [packages/*/package.json]
- `scripts/dev.mjs` fixa o nome da distro WSL `Ubuntu` e um mapeamento de drive-letter para `/mnt` — quebra para distro com outro nome ou raiz de automount não padrão. [scripts/dev.mjs:7,64]
- ~~Migrations global/tenant rodam via `pool.query` simples a cada boot, sem advisory lock~~ — endereçado na Story 1.3 (advisory lock `pg_advisory_lock`/`pg_advisory_unlock` em `PostgresGlobalMigrator`); ver nova ressalva sobre falha de unlock na seção de review da Story 1.3.
- `apps/api/src/index.ts`: `await startApi()` de topo sem try/catch explícito depende do comportamento padrão do Node para rejeição não tratada. [apps/api/src/index.ts:6-8]

## Deferred from: code review of 1-3-verificar-o-e-mail-e-ativar-a-gestao-inicial (2026-07-30)

- `scripts/generate-api-client.mjs` continua sendo um "gerador" por grep de substring, agora ampliado com 2 novas operações sem validação estrutural real do contrato. [scripts/generate-api-client.mjs]
- FK circular `verification_tokens.outbox_id`/`email_outbox.verification_id` via `DEFERRABLE INITIALLY DEFERRED` depende de uma ordem de inserção não documentada em `insertVerification`. [migrations/global/002_email_verification_activation.sql:47]
- `RATE_LIMITER` indefinido desativaria o rate limit do `/resend` silenciosamente em vez de falhar fechado; hoje inalcançável pois o composition root real sempre fornece `PostgresRateLimiter`. [apps/api/src/nest-app.ts:76]
- `HttpEmailPort` (Brevo primário) não tem deduplicação real de provedor — trade-off at-least-once explicitamente aceito nas Dev Notes da Story 1.3, com duplicatas detectáveis via `email_delivery_attempts`; registrado apenas para visibilidade. [packages/adapters/src/email/http-email-port.ts:20]
- Sem limite superior de sanidade para TTL/lease/tentativas de e-mail; lease muito pequeno aproxima o intervalo de renovação da duração do lease. [packages/config/src/security-config.ts:15-19]

## Deferred from: code review of 1-5-recuperar-acesso-e-controlar-sessoes (2026-07-31)

- A retenção dos cinco tokens CSRF adicionais ordena somente por `created_at`; rotações no mesmo timestamp podem desempatar pelo hash e excluir o token recém-retornado. É comportamento preexistente da Story 1.4 e deve ganhar ordenação monotônica/identificador próprio. [packages/adapters/src/db/postgres-identity-repository.ts:24]

## Deferred from: code review of 1-6-cadastrar-pessoas-unidades-e-vinculos-temporais (2026-08-04)

_Nota: esta story tem 5 achados `[Review][Decision]` bloqueantes (revogação de acesso morta, idempotência quebrada, AC5 não implementada, sem UI de edição, alegações de gate falsas) e 14 `[Review][Patch]` reais registrados diretamente na story — não replicados aqui. Apenas os itens de risco baixo/escopo não exigido ficam neste arquivo._

- `institutionalRequest` (GET/list) não checa `sameOrigin`, diferente de toda mutação — a Task 6 da própria story só exige isso "nas mutações"; defesa em profundidade, não violação declarada. [apps/api/src/nest-app.ts:98]
- `reason` (motivo de alteração/encerramento) sem validação de tamanho/formato antes de ir para o Evento de Auditoria. [packages/application/src/tenancy/people-units.ts:46-49]
- `normalizeInstitutionalEmail` só normaliza (trim/lowercase), sem checagem de formato/tamanho antes de virar chave de correspondência de duplicidade. [packages/application/src/tenancy/people-units.ts:35]
- ~~`personPublicId`/`unitPublicId`/`recordId` validados só como texto não vazio, não como formato UUID~~ — `recordId` (path) e `cursor` (query) corrigidos na rodada 3 da Story 1.6; `personPublicId`/`unitPublicId` como campos de corpo em `CreateRelationship` continuam validados só como texto não vazio antes do cast `::uuid`. [packages/application/src/tenancy/people-units.ts]
- `401` (sessão expirada) tratado igual a qualquer outro erro em `PeopleUnitsPage.tsx`, sem prompt de novo login dedicado nem limpeza do CSRF cacheado. [apps/web/src/components/PeopleUnitsPage.tsx]

## Deferred from: code review of 1-6-cadastrar-pessoas-unidades-e-vinculos-temporais, rodada 2 (2026-08-06)

_Nota: o achado bloqueante `[Review][Decision]` desta rodada (recorrência do defeito de revogação de acesso morta — `linkAuthorizationSource()` nunca chamado) e os 9 `[Review][Patch]` reais (aplicados e validados nesta rodada) estão registrados diretamente na story — não replicados aqui._

- `UpdatePerson`/`UpdateUnit`/`UpdateRelationship`/`EndRelationship` não têm testes unitários dedicados — só são exercitados pelo único teste grande de integração PostgreSQL. [tests/people-units.test.ts]
- Task 6 exige testar "concorrência" com a mesma `Idempotency-Key`; a suíte atual testa replay sequencial e chaves diferentes em corrida, não duas requisições concorrentes com a mesma chave. [tests/postgres-integration.test.ts]
- `canonicalPayload()` ordena chaves só no nível superior do objeto; se algum comando ganhar campo aninhado no futuro, esse conteúdo cairia silenciosamente fora do hash de idempotência — não alcançável hoje pois todos os comandos são planos. [packages/adapters/src/db/postgres-people-units-repository.ts:30-33]
- Endpoints de listagem (GET) não passam `req.id` como `requestId` para `institutional.execute` — Eventos de Auditoria de acesso negado em operações de listagem podem perder correlação de requisição. [apps/api/src/nest-app.ts]

## Deferred from: code review of 1-6-cadastrar-pessoas-unidades-e-vinculos-temporais, rodada 3 — final (2026-08-07)

_Nota: nenhum achado bloqueante nesta rodada. Os 11 `[Review][Patch]` reais foram aplicados e validados diretamente na story — não replicados aqui._

- `createRelationship` não trava com `FOR UPDATE` a checagem de existência/estado de Pessoa/Unidade, diferente de toda outra mutação do arquivo — TOCTOU latente, hoje inalcançável pois nada transiciona Pessoa/Unidade para `'ended'`. [packages/adapters/src/db/postgres-people-units-repository.ts]
- `InstitucionalConflict` é grafado em português entre irmãs `Institutional*` em inglês — inconsistência cosmética de nomenclatura com raio de blast grande para renomear (usado em muitos arquivos/testes). [packages/application/src/tenancy/people-units.ts]
- A asserção `not.objectContaining` em `tests/people-units.test.ts` que prova "Vínculo não carrega dado que concede acesso" é quase tautológica — só falha se todos os três campos vazarem juntos. [tests/people-units.test.ts]
- Nenhum teste exercita o caminho HTTP real e afirma que `source_relationship_id` permanece `NULL` — nada guarda a decisão de escopo da AC8 contra uma regressão silenciosa futura.
- `institutionalMutation` exige `Idempotency-Key` só em `create*`; `endRelationship` também é `POST` mas fica isento (coberto pelo CAS de `expectedVersion` em vez disso). [apps/api/src/nest-app.ts]
- Linhas de `institutional_idempotency` nunca são varridas se a chave não for reenviada — sem faxina em segundo plano. [packages/adapters/src/db/postgres-people-units-repository.ts]
- `person.state`/`unit.state` modelam transição para `'ended'` que nenhum caso de uso desta story produz — superfície de schema/UI para um estado inalcançável ainda. [migrations/tenant/004_people_units_relationships.sql]
- `EditRelationship`: o estado local `open` não está ligado a `record.state` — formulário de edição aberto continua visível após o Vínculo ser encerrado por outro ator, e o `409` resultante não distingue "alguém alterou" de "isto foi encerrado". [apps/web/src/components/PeopleUnitsPage.tsx]

## Deferred from: code review of 1-6-cadastrar-pessoas-unidades-e-vinculos-temporais, rodada 4 (2026-08-07)

_Itens reencontrados nesta rodada e mantidos nas decisões de deferimento anteriores._

- Commands de Vínculo aceitam `personPublicId`/`unitPublicId` não UUID antes do cast no banco; falha é sanitizada e o risco permanece baixo. [packages/application/src/tenancy/people-units.ts:47]
- `reason` permanece sem limite de tamanho antes de ser persistido no Evento de Auditoria. [packages/application/src/tenancy/people-units.ts:48]
- A suíte institucional ainda não exercita duas chamadas concorrentes com a mesma `Idempotency-Key`; replay sequencial e corrida com chaves distintas cobrem apenas parte do mecanismo. [tests/postgres-integration.test.ts:177]

## Deferred from: code review of 1-7-convidar-pessoas-e-ativar-contas (2026-08-07)

_Nota: esta rodada teve 4 achados `[Review][Decision]` bloqueantes (AC5/`linkAuthorizationSource` não implementado, Papel sem efeito real sobre capacidades, alegações de cobertura de teste do Dev Agent Record não conferindo, reconvite podendo ampliar acesso silenciosamente) e 6 `[Review][Patch]` reais, todos registrados diretamente na story — não replicados aqui. Apenas os itens de risco baixo/escopo não exigido ficam neste arquivo._

- `reissue()` (correção de e-mail) mantém `person_id`/`relationship_id` do Convite anterior e troca só o e-mail, sem revalidar que o novo endereço pertence à Pessoa certa — um typo do Síndico coincidindo com a Conta verificada de um terceiro poderia associar identidade institucional errada; mitigado por exigir e-mail verificado, risco de processo mais que de código. [packages/adapters/src/db/postgres-invitation-repository.ts:21]
- Estado "expirado" na listagem/detalhe é calculado via `CURRENT_TIMESTAMP` do PostgreSQL, enquanto criação/aceitação usam o relógio do processo Node (`this.now()`), sem margem de tolerância entre os dois — sob deriva de relógio entre hosts, o Convite pode aparecer "expirado" na tela do Síndico mas ainda ser aceito com sucesso, ou vice-versa. [packages/adapters/src/db/postgres-invitation-repository.ts]
- Verificação `axe` no Cypress cobre somente a tela de gestão (`mountManagement`); não há varredura equivalente sobre a rota pública `/aceitar-convite`, onde os estados pendente/processando/aceito/indisponível do AC14 realmente acontecem para quem não tem sessão. [cypress/e2e/invitations.cy.js]

## Deferred from: code review of 1-8-conceder-suspender-e-revogar-papeis (2026-08-12)

_Nota: esta rodada teve 3 achados `[Review][Decision]` bloqueantes (AC3/AC4 sem fuso do Condomínio persistido, trilha de auditoria da migração com concedente incorreto, `roles.suspend` incondicional para todo Auxiliar) e 21 `[Review][Patch]` reais, todos registrados diretamente na story — não replicados aqui. Apenas o item de baixo risco/pré-existente fica neste arquivo._

- Outbox de notificação de Papéis pode esfomear tenants — `claim()` itera tenants em `ORDER BY id` fixo sem rotação entre chamadas; padrão pré-existente compartilhado com outros adapters de outbox, não bloqueante para esta story. [packages/adapters/src/db/postgres-role-notification-outbox.ts:6]

## Deferred from: code review of 1-9-delegar-capacidades-ao-auxiliar-administrativo (2026-08-14)

_Nota: esta rodada teve 2 achados `[Review][Decision]` bloqueantes (`people-units-relationships.manage`/`invitations.manage` delegáveis mas funcionalmente inertes; `capabilities.grant` também bloqueia a própria leitura do Auxiliar) e 12 `[Review][Patch]` reais, todos registrados diretamente na story — não replicados aqui. Apenas os itens de baixo risco/pré-existentes ficam neste arquivo._

- `revoke()`'s branch de conflito 409 pode mesclar dados de conflito na seleção errada se o usuário trocar de capacidade selecionada durante uma requisição em voo — mesmo padrão de risco já aceito em `RolesPanel.tsx`. [apps/web/src/components/CapabilitiesPanel.tsx]
- Campo `validUntil` do formulário de concessão sem atributo `min` vinculado a `validFrom` — validação de intervalo só ocorre no servidor. [apps/web/src/components/CapabilitiesPanel.tsx]
- `stateLabels[item.state]` sem fallback para um estado desconhecido/futuro — renderizaria rótulo vazio em vez de um texto seguro. [apps/web/src/components/CapabilitiesPanel.tsx]
- Roteador de capacidade por `.toLowerCase().includes(...)` em `composition-root.ts` é implícito e frágil a operações futuras cujo nome coincida com uma dessas substrings — extensão de um padrão pré-existente da Story 1.8, não uma regressão desta story. [apps/api/src/composition-root.ts]
- Nenhum dos dois `authorize()` (Papéis e capacidades) tem a mitigação de "cost decoy" contra vazamento de timing que `resolveContext()` já implementa — `authorize()` de Papéis nunca teve essa mitigação, mesmo antes desta story. [packages/adapters/src/db/postgres-role-assignment-repository.ts; packages/adapters/src/db/postgres-capability-grant-repository.ts]
- `PostgresCapabilityNotificationOutbox.claim()` não filtra por conta ativa — mesmo padrão/risco já registrado como dívida para o outbox de Papéis na Story 1.8. [packages/adapters/src/db/postgres-capability-notification-outbox.ts]
- Colisão teórica do índice único `capability_grant_transition(grant_id,to_state,occurred_at)` sob duas transições concorrentes para o mesmo estado no mesmo instante de statement — mesmo risco teórico já presente em `role_assignment_transition` desde a Story 1.8. [migrations/tenant/007_capability_delegation.sql]
