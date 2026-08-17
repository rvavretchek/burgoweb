---
baseline_commit: 8bd91716b0c465c303cb00586a20af3e997fa31f
---

# Story 1.10: Atribuir Responsáveis Financeiros por Unidade

Status: review

## Story

Como Síndico ou Auxiliar com capacidade específica,
Quero atribuir Responsáveis Financeiros às Unidades,
Para que as Pessoas corretas possam acompanhar obrigações privadas sem receber autoridade global no Condomínio.

## Acceptance Criteria

1. **Dado** que o ator possui a capacidade específica de gerir Responsáveis Financeiros **Quando** seleciona uma Pessoa e uma Unidade com Vínculo compatível **Então** o sistema apresenta a atribuição, seu alcance, início, término opcional e efeitos de acesso antes da confirmação **E** diferencia essa atribuição de Papel global e da capacidade genérica de gerir Vínculos.
2. **Dado** que o ator possui apenas capacidade para gerir Pessoas, Unidades ou Vínculos **Quando** tenta atribuir ou remover Responsável Financeiro sem a capacidade específica **Então** o servidor nega a operação **E** nenhuma combinação de rota, payload ou Papel subordinado amplia essa autoridade.
3. **Dado** que uma atribuição válida é confirmada **Quando** o servidor revalida tenant, ator, Pessoa, Unidade, Vínculo, capacidade e versões **Então** registra a relação Pessoa–Unidade com vigência e estado explícitos **E** não eleva o Papel da Pessoa nem concede acesso a outras Unidades.
4. **Dado** que uma Pessoa é Responsável Financeiro por múltiplas Unidades **Quando** consulta seu alcance autorizado **Então** visualiza cada atribuição separadamente com Unidade, vigência e estado **E** uma atribuição não implica acesso às demais Unidades do Condomínio.
5. **Dado** que uma Unidade possui múltiplos Responsáveis Financeiros vigentes **Quando** o sistema resolve sua audiência privada **Então** inclui somente as Pessoas com atribuições ativas e Vínculos válidos para aquela Unidade **E** não transforma a pluralidade de destinatários em audiência coletiva do Condomínio.
6. **Dado** que uma Pessoa possui apenas Papel Morador sem atribuição financeira **Quando** tenta consultar obrigação individual de uma Unidade **Então** o servidor nega o acesso **E** ser Morador, proprietário declarado, ocupante ou destinatário anterior não cria automaticamente responsabilidade financeira no sistema.
7. **Dado** que o produto ainda não entregou as telas de Obrigações Financeiras **Quando** a atribuição é criada **Então** ela permanece válida como autorização explícita para capacidades futuras correspondentes **E** não apresenta dados, rotas ou funcionalidades financeiras inexistentes como disponíveis.
8. **Dado** que a atribuição é concedida ou removida **Quando** a transação é concluída **Então** a Pessoa afetada recebe notificação com Condomínio, Unidade, natureza da alteração, vigência e canal de contestação **E** a notificação não presume consentimento, responsabilidade jurídica ou base legal ainda pendente de parecer.
9. **Dado** que uma atribuição é removida ou expira **Quando** a Pessoa tenta novo acesso baseado nela **Então** o servidor nega imediatamente a consulta ou entrega futura de dados financeiros daquela Unidade **E** preserva histórico da atribuição, autoria e leituras sensíveis auditáveis aplicáveis.
10. **Dado** que o Vínculo relacionado é encerrado **Quando** o encerramento entra em vigor **Então** a atribuição financeira ativa deixa de autorizar novos acessos **E** eventual relação de cobrança pós-saída não é criada automaticamente e permanece condicionada ao parecer jurídico consolidado.
11. **Dado** que um novo ocupante ou Responsável Financeiro é cadastrado para a Unidade **Quando** sua atribuição começa **Então** ele não herda dívida, comunicação privada nem dados pessoais do ocupante anterior por causa da nova relação **E** qualquer acesso histórico futuro deverá obedecer à política jurídica e de retenção aprovada.
12. **Dado** que uma leitura de inadimplência detalhada for implementada e autorizada por esta atribuição **Quando** ocorrer **Então** deve gerar Evento de Auditoria minimizado com ator, Unidade, finalidade, resultado e correlação **E** o evento não copia valores, documentos ou conteúdo pessoal desnecessário.
13. **Dado** que dois atores alteram simultaneamente a mesma atribuição **Quando** a versão persistida já mudou **Então** a segunda operação recebe conflito `409` sem sobrescrever a primeira **E** a interface apresenta o estado atual para nova revisão.
14. **Dado** que a gestão de Responsáveis Financeiros é utilizada em mobile, desktop, teclado ou tecnologia assistiva **Quando** alcance, vigência, confirmação, notificação ou erro são apresentados **Então** foco, rótulos, linguagem e estados cumprem WCAG 2.2 AA **E** a interface deixa claro que a atribuição é restrita à Unidade e não depende apenas de cor.

Rastreabilidade: FR-5, FR-19 parcialmente, FR-41, FR-42, NFR-1–NFR-9, NFR-11, NFR-12, NFR-14, UX-DR9, UX-DR16–UX-DR18, UX-DR22, UX-DR23, AD-4, AD-8, AD-11, AD-14–AD-16, AD-23–AD-26 e gate jurídico consolidado pendente.

## Tasks / Subtasks

- [x] Task 1: Migration tenant 008 — `financial_responsible_assignment` e efeitos transacionais (AC: 3, 4, 5, 8, 9, 10, 13)
  - [x] Criar `migrations/tenant/008_financial_responsibles.sql`: tabela `financial_responsible_assignment(id, public_id, person_id, unit_id, source_relationship_id, valid_from, valid_until, state, granted_by_person_id, version, created_at, updated_at)`, `state CHECK(state IN('scheduled','active','expired','revoked'))` — **sem `suspended`**: nenhum AC pede suspensão temporária, só concessão/remoção/expiração (mesmo raciocínio que levou `capability_grant` a não ter `suspended`; ver `packages/application/src/authorization/capabilities.ts`).
  - [x] Índice único parcial `financial_responsible_active_unique ON financial_responsible_assignment(person_id, unit_id) WHERE state IN('scheduled','active')` — prevenção proativa de duplicata, mesmo padrão de `capability_grant_active_unique` (Story 1.9).
  - [x] Tabelas `financial_responsible_transition` (histórico append-only, `actor_person_id` do ator REAL de cada transição — não repetir o bug corrigido no review da Story 1.9 onde `effects()` atribuía tudo ao concedente original), `financial_responsible_projection` (projeção exportável, upsert por `assignment_id`), `financial_responsible_notification_outbox` (outbox de notificação ao afetado, mesmo formato de `capability_notification_outbox`).
  - [x] `source_relationship_id` referencia `person_unit_relationship(id)` — decisão: **NOT NULL** (não nullable). AC1 exige Vínculo compatível no momento da atribuição; não há cenário nesta história em que uma atribuição exista sem um Vínculo de origem. Necessário para a revalidação de frescor do AC10 (ver Dev Notes).
  - [x] `INSERT INTO schema_version(version, applied_at) VALUES (8, ...)` `ON CONFLICT DO NOTHING`.
  - [x] Atualizar `migrations/tenant/README.md` com a entrada da versão 8.
- [x] Task 2: Domínio — catálogo, capacidade e casos de uso (AC: 1, 2, 3, 4, 8, 9, 12, 13)
  - [x] Adicionar a capacidade `financial-responsibles.manage` a `ROLE_CATALOG.syndic` em `packages/application/src/authorization/roles.ts` (institucional, só o Síndico por padrão).
  - [x] Adicionar a entrada correspondente a `CAPABILITY_CATALOG` em `packages/application/src/authorization/capabilities.ts` com `available: true` — torna automaticamente delegável a um Auxiliar via `capability_grant` (mecanismo já existe desde a Story 1.9; nenhum segundo mecanismo de delegação foi criado).
  - [x] Criado `packages/application/src/finance/financial-responsibles.ts`: tipos (`FinancialResponsibleRecord`, `FinancialResponsibleDraft`, `FinancialResponsibleState`, `FinancialResponsibleRepository`), erros (`FinancialResponsibleValidation`, `FinancialResponsibleConflict`, ambos com `this.name` definido no construtor), máquina de transição (`scheduled→active/revoked`, `active→expired/revoked`), `validateFinancialResponsibleDraft(input, timeZone)` reaproveitando `resolveCivilInstant` de `roles.ts`, casos de uso `ListFinancialResponsibles`/`AssignFinancialResponsible`/`RemoveFinancialResponsible`/`MaterializeFinancialResponsibles`, outbox (`ProcessFinancialResponsibleNotification`).
  - [x] `need(context, 'financial-responsibles.manage')` nos 3 casos de uso mutáveis. AC4 ("consulta seu alcance autorizado") resolvido: `ListFinancialResponsibles` segue o padrão de leitura própria fechado no review da Story 1.9 — sem `financial-responsibles.manage`, a listagem é restrita às próprias atribuições (`selfOnly`); o gate mínimo para isso é `dashboard.read` (não `roles.read` como em 1.9), pois o Responsável Financeiro pode ser um Morador comum, que não possui `roles.read`.
  - [x] Exportado tudo em `packages/application/src/index.ts`.
- [x] Task 3: Adapter PostgreSQL transacional (AC: 1, 2, 3, 4, 5, 8, 9, 10, 12, 13)
  - [x] `packages/adapters/src/db/postgres-financial-responsible-repository.ts`: `authorize()` (institucional via `ROLE_CATALOG` + fallback delegado via `capability_grant`, schema qualificado explicitamente em `${context.schemaName}.capability_grant`/`${context.schemaName}.role_assignment` desde o início), `list()`, `assign()` (idempotência via `role_command_idempotency` reaproveitada com `operation='financial-responsible-assign'`), `remove()` (CAS por `expectedVersion`, 409 em conflito), `effects()` (com parâmetro `actor` explícito desde o início), `materialize()` (por-tenant try/catch-continue).
  - [x] `assign()` valida que a Pessoa tem `person_unit_relationship` ativo e vigente para a Unidade informada (AC1 "Vínculo compatível") — join real com a tabela, `source_relationship_id` gravado a partir do Vínculo encontrado.
  - [x] Capturar violação do índice único parcial (código Postgres `23505`) e mapear para `FinancialResponsibleConflict`/409 — aplicado desde a primeira versão em `assign()`.
  - [x] `packages/adapters/src/db/postgres-financial-responsible-notification-outbox.ts`: mesmo `claim()`/`finish()` de `postgres-capability-notification-outbox.ts`.
  - [x] Bump de todos os `migration_version!==7` hardcoded para `!==8`/`=8`: `packages/adapters/src/db/postgres-identity-repository.ts` (`resolveContext()`), `packages/adapters/src/db/postgres-verification-repository.ts` (2 checagens), `packages/adapters/src/db/postgres-provisioning-repository.ts` (ativação de tenant). `postgres-tenant-migrator.ts` já computa a versão dinamicamente (corrigido na Story 1.8) — confirmado que continua assim, nenhum hardcode necessário.
- [x] Task 4: Revalidação de frescor contra o Vínculo de origem (AC: 6, 9, 10)
  - [x] Decisão tomada (mais concreta que "preparar o terreno"): `materialize()` do novo repository revalida a cada ciclo se o `person_unit_relationship` referenciado por `source_relationship_id` encerrou (`state='ended'` ou `ends_on<=CURRENT_DATE`) e, se sim, transiciona a atribuição para `revoked` com prioridade sobre a expiração por vigência — gera transição, projeção, auditoria e notificação ao afetado como qualquer outra transição (AC10 satisfeito de forma observável e testável, não apenas documentada).
  - [x] A capacidade `financial-responsibles.manage` em si (quem pode gerir atribuições) já herda a revalidação de frescor da Story 1.9 automaticamente: o fallback delegado de `authorize()` (novo repository) e a união de capacidades delegadas em `resolveContext()` já exigem `role_assignment` de `administrative-assistant` ativo — nenhuma duplicação necessária.
  - [x] Nenhuma leitura financeira real existe ainda (Épico 2); quando existir, deverá consultar o estado JÁ CORRETO de `financial_responsible_assignment.state` (mantido fresco pelo `materialize()` acima) em vez de reimplementar a revalidação.
- [x] Task 5: API/OpenAPI/cliente gerado (AC: 1, 2, 3, 4, 8, 9, 13)
  - [x] Rotas em `apps/api/src/nest-app.ts`: `GET/POST /api/v1/tenants/:publicId/financial-responsibles`, `POST .../financial-responsibles/:recordId/remove` — seguindo o padrão de `capability-grants` (Idempotency-Key em `POST` de criação, `sameOrigin`/CSRF em mutações); `FinancialResponsibleConflict`/`FinancialResponsibleValidation` mapeados em `institutionalProblem()`.
  - [x] `institutionalMutation`'s `isCreate` inclui `assignFinancialResponsible`.
  - [x] `apps/api/src/composition-root.ts`: capacidade derivada por operação — `listFinancialResponsibles`→`dashboard.read`, demais operações `financialresponsible`→`financial-responsibles.manage`.
  - [x] `apps/api/src/openapi.ts`: paths + schemas (`FinancialResponsible`, `FinancialResponsiblePage`).
  - [x] `scripts/generate-api-client.mjs`: operationId checks, tipos e métodos (`listFinancialResponsibles`, `assignFinancialResponsible`, `removeFinancialResponsible`); `packages/api-client/src/provisioning.ts` regenerado e validado com `--check`. `npm run build` completo (api-contract + boundaries + todos os workspaces, incluindo `apps/web`) passou sem erros de tipo.
  - [x] `apps/worker/src/composition-root.ts`: `MaterializeFinancialResponsibles`/`ProcessFinancialResponsibleNotification` adicionados ao round-robin de jobs.
- [x] Task 6: UI — `FinancialResponsiblesPanel.tsx` (AC: 1, 2, 3, 4, 8, 9, 13, 14)
  - [x] Criado `apps/web/src/components/FinancialResponsiblesPanel.tsx` só com `@burgoweb/api-client`, seguindo os padrões pós-review de `CapabilitiesPanel.tsx`:
    - focus trap `useEffect` com `[mode, draft]`;
    - `opener.current` capturado do `event.currentTarget` em `openAssign`/`openRemove`;
    - Escape ignorado enquanto `busy===true` (via `busyRef`);
    - `onKeyDown` Enter explícito no botão "Atribuir Responsável Financeiro";
    - `onAccessLost()` chamado em 403/404 tanto em `assign()` quanto em `remove()`;
    - gate de UI por `viewerCapabilities` — decisão (ver Task 2): sem `financial-responsibles.manage`, o painel some as ações de gestão e mostra só as próprias atribuições, com nota explicativa.
  - [x] Renderizado em `apps/web/src/components/PeopleUnitsPage.tsx` junto a `RolesPanel`/`CapabilitiesPanel`, recebendo `people`/`units` já carregados pela página.
  - [x] Intercept de `GET .../financial-responsibles*` adicionado ao helper de mount compartilhado em `cypress/e2e/invitations.cy.js`, `cypress/e2e/people-units-relationships.cy.js`, `cypress/e2e/role-lifecycle.cy.js`, `cypress/e2e/role-lifecycle-active.cy.js`.
- [x] Task 7: Testes em todas as camadas (AC: todos)
  - [x] `tests/financial-responsibles.test.ts`: capacidade dedicada, máquina de estados, `validateFinancialResponsibleDraft`, casos de uso (10 testes, sync/async verificado por assinatura real de cada caso de uso).
  - [x] `tests/api-financial-responsibles.test.ts`: contrato HTTP com as classes de erro REAIS (`FinancialResponsibleValidation`/`FinancialResponsibleConflict` importadas, não `.name` forjado) provando mapeamento para 422/409 sem 500 (6 testes).
  - [x] `tests/migrations-financial-responsibles-contract.test.ts`: padrão `toContain` estabelecido; cobertura REAL de execução+idempotência da migration 008 em `tests/postgres-financial-responsibles-integration.test.ts`, envolvendo a sequência de migrations em `BEGIN`/`COMMIT` explícitos (lição da Story 1.9 aplicada desde a primeira versão).
  - [x] `tests/postgres-financial-responsibles-integration.test.ts`: atribui+remove+conflito de versão+efeitos atômicos; nega atribuição sem Vínculo compatível; materializa agendadas; prova que encerrar o Vínculo de origem invalida a atribuição via `materialize()` (AC10); duas atribuições concorrentes com a MESMA `Idempotency-Key`; capacidade `financial-responsibles.manage` delegada a um Auxiliar autoriza atribuição real; idempotência da migration 008.
  - [x] Novo arquivo de teste real adicionado a `test:integration:raw` em `package.json`.
  - [x] `cypress/e2e/financial-responsibles.cy.js`: revisão antes de confirmar (AC1), remoção com confirmação, conflito 409, perda de acesso concorrente, visão somente-leitura sem `financial-responsibles.manage`, foco/teclado, 320px + axe (7 cenários).
  - [x] Gates de validação executados (ver resultados abaixo).

## Dev Notes

### Contexto crítico para implementação

- **Duas coisas distintas nesta história, não confundir:** (1) uma capacidade nova (`financial-responsibles.manage`) que controla QUEM pode gerir a atribuição — reaproveita 100% o mecanismo de delegação da Story 1.9 (`capability_grant`, `CAPABILITY_CATALOG`, UI de gate por `viewerCapabilities`) sem nenhuma infraestrutura nova; (2) um domínio novo (a própria atribuição Pessoa↔Unidade de responsabilidade financeira) — isso é um conceito novo, não é Papel (Story 1.8) nem capacidade delegada (Story 1.9), é mais parecido estruturalmente com `person_unit_relationship` (Story 1.6) na forma (Pessoa↔Unidade) mas com máquina de estados/CAS/outbox no estilo de `role_assignment`/`capability_grant`.
- **AD-8 é explícito e vinculante:** "Gerenciar responsáveis financeiros exige capacidade própria, distinta de gerenciar vínculos, e atribuição/remoção gera auditoria e notificação ao afetado." [Source: `_bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/ARCHITECTURE-SPINE.md#AD-8`] — não reutilizar `people-units-relationships.manage` para isto; AC1/AC2 também exigem essa distinção explicitamente.
- **Decisão de módulo a registrar (não pré-decidida, mas com recomendação):** a tabela de roteamento da arquitetura mapeia "Financeiro e prestações de contas" para `application/finance` (ligado a AD-8, AD-16) [Source: ARCHITECTURE-SPINE.md, tabela de módulos]. Nenhum módulo `packages/application/src/finance/` existe ainda — esta história cria o primeiro arquivo dele. A alternativa seria colocar em `application/tenancy` junto de `people-units.ts` (mesma forma Pessoa↔Unidade). Recomendação: `application/finance`, pois o Épico 2 inteiro (obrigações, lançamentos, fechamentos) vai se apoiar nesta atribuição como pré-requisito de autorização — registrar a decisão tomada nas Dev Notes/Completion Notes, não deixar implícito.
- **Capacidade nova é automaticamente delegável — não é preciso "ativar" nada além do catálogo:** basta adicionar a entrada a `CAPABILITY_CATALOG` com `available:true` (packages/application/src/authorization/capabilities.ts) e ao `ROLE_CATALOG.syndic` (roles.ts). O mecanismo de `capability_grant` (concessão, revogação, materialização, outbox, UI de gate por `viewerCapabilities`) já existe inteiro desde a Story 1.9 e não precisa de nenhuma extensão para suportar uma nova capacidade — só o catálogo muda. Ver `packages/application/src/authorization/capabilities.ts` e `packages/adapters/src/db/postgres-capability-grant-repository.ts` como referência de leitura obrigatória antes de implementar.
- **Lição da Story 1.9 que esta história deve aplicar desde o início, não descobrir no review:** uma atribuição derivada de outra entidade (aqui: atribuição financeira derivada do Vínculo `person_unit_relationship`) precisa ser revalidada contra o estado ATUAL da entidade de origem, não só contra seu próprio estado — a Story 1.9 teve exatamente esse bug (capacidade delegada sobrevivia à suspensão do Papel de origem) como `[Review][Patch]` confirmado e corrigido depois. AC10 desta história descreve o mesmo requisito para o Vínculo: implementar a revalidação de frescor (`source_relationship_id` ativo e vigente) na primeira versão.
- **Lição da Story 1.9 sobre autoria de auditoria:** `effects()`/transições devem receber o ator REAL (`context.personId`) como parâmetro explícito desde o início — a Story 1.9 atribuiu incorretamente toda revogação ao concedente original por falta desse parâmetro, corrigido só no review.
- **Lição da Story 1.9 sobre qualificação de schema:** se o `authorize()` do novo repository consultar `capability_grant` (fallback delegado) antes de `SET LOCAL search_path` estar em vigor, qualifique a query com `${context.schemaName}.capability_grant` explicitamente — não dependa da ordem de chamada como fonte de correção.
- **Lição da Story 1.9 sobre Cypress cross-spec:** toda spec que monta `PeopleUnitsPage` precisa interceptar o GET do novo painel, incluída ela mesma — essa lacuna já quebrou 3 vezes nesta base (ver Task 6). Adicionar o intercept em TODAS as specs listadas na Task 6 na mesma tarefa em que o painel é criado, não depois.
- Toda autorização é server-side, deny-by-default e revalidada dentro da transação (AD-8). Sessões são globais por Conta; retirar a atribuição invalida o efeito no tenant afetado, não a sessão inteira (AD-9, mesmo modelo de `authorization_version`).
- AC7 e AC12 descrevem comportamento para funcionalidades financeiras que **ainda não existem** (Épico 2). Esta história só cria a atribuição como autorização válida e auditável; não implementar nenhuma tela, rota ou dado de Obrigações/inadimplência — isso é escopo de stories futuras do Épico 2. Não deixar rota, botão ou promessa de funcionalidade inexistente na UI.
- AC10/AC11 mencionam explicitamente o "gate jurídico consolidado pendente" para relação de cobrança pós-saída — não criar nenhuma relação de cobrança automática após encerramento de Vínculo; isso é bloqueado por decisão jurídica ainda não tomada, fora do escopo desta história mesmo que pareça uma extensão natural.

### Aprendizados da Story 1.9 (arquivo anterior, `1-9-delegar-capacidades-ao-auxiliar-administrativo.md`)

- `CapabilitiesPanel.tsx` é a referência de UI mais próxima e mais recentemente corrigida — leia-a por completo (pós-review) antes de escrever `FinancialResponsiblesPanel.tsx`, incluindo os 12 patches aplicados no review (foco, `opener`, Escape/busy, `onAccessLost`, mensagens de erro).
- `postgres-capability-grant-repository.ts` é a referência de adapter mais próxima (mesma forma: catálogo fechado na aplicação sem `CHECK` no banco, `effects()` transacional, idempotência via tabela genérica, `materialize()` por-tenant).
- Testes de integração real contra PostgreSQL exigem `BEGIN`/`COMMIT` explícitos ao redor de sequências multi-`client.query()` que dependem de `SET LOCAL search_path` — descoberto e corrigido nesta história ao escrever o teste de idempotência da migration 007; migration 008 desta história deve nascer já correta.
- Duas decisões de review da Story 1.9 mudaram o modelo de leitura própria de `capability_grant` (Auxiliar pode listar as próprias concessões sem `capabilities.grant`, via `roles.read` + `selfOnly`) — avaliar se AC4 desta história ("consulta seu alcance autorizado") pede o mesmo para o próprio Responsável Financeiro consultando suas Unidades, e decidir/documentar explicitamente (não repetir a lacuna de AC12 da Story 1.9 que só foi fechada no review).

### Project Structure Notes

- Novo módulo de domínio: `packages/application/src/finance/financial-responsibles.ts` (decisão a confirmar, ver acima).
- Novo adapter: `packages/adapters/src/db/postgres-financial-responsible-repository.ts`, `packages/adapters/src/db/postgres-financial-responsible-notification-outbox.ts`.
- Nova migration: `migrations/tenant/008_financial_responsibles.sql` (schema-per-tenant, versão 8).
- Novo componente: `apps/web/src/components/FinancialResponsiblesPanel.tsx`, renderizado em `PeopleUnitsPage.tsx`.
- `apps/web` só pode importar `@burgoweb/api-client` para falar com o backend — `scripts/check-boundaries.mjs` falha o build caso contrário.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.10] — user story, ACs, rastreabilidade.
- [Source: _bmad-output/planning-artifacts/epics.md#FR-41] — delegação granular de capacidades (Story 1.9, mecanismo reaproveitado).
- [Source: _bmad-output/planning-artifacts/epics.md#FR-42] — capacidade específica de gerir Responsáveis Financeiros.
- [Source: _bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/ARCHITECTURE-SPINE.md#AD-4] — TenantContext imutável, não construível por input.
- [Source: _bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/ARCHITECTURE-SPINE.md#AD-8] — autorização granular, capacidade própria para Responsáveis Financeiros.
- [Source: _bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/ARCHITECTURE-SPINE.md#AD-11] — toda mutação é transação observável, `version`/409, `Idempotency-Key`.
- [Source: _bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/ARCHITECTURE-SPINE.md#AD-14] — leituras sensíveis auditadas e minimizadas.
- [Source: _bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/ARCHITECTURE-SPINE.md#AD-16] — dinheiro/tempo sem representações ambíguas (aplica-se a stories futuras do Épico 2, não a esta).
- [Source: _bmad-output/implementation-artifacts/1-9-delegar-capacidades-ao-auxiliar-administrativo.md] — mecanismo de delegação de capacidades a reaproveitar; Review Findings como catálogo de bugs a não repetir.
- [Source: packages/application/src/authorization/capabilities.ts] — catálogo, máquina de estados, `validateCapabilityDraft`, casos de uso — molde estrutural direto.
- [Source: packages/adapters/src/db/postgres-capability-grant-repository.ts] — molde de adapter transacional direto.
- [Source: migrations/tenant/007_capability_delegation.sql] — molde de migration direto.

## Dev Agent Record

### Agent Model Used

Claude Sonnet 5

### Debug Log References

- Implementação 2026-08-16: capacidade dedicada `financial-responsibles.manage` (catálogo + `ROLE_CATALOG.syndic`), novo módulo de domínio `packages/application/src/finance/financial-responsibles.ts`, migration tenant 008 (`financial_responsible_assignment` + transições + projeção + outbox), adapter PostgreSQL transacional, endpoints REST + OpenAPI + cliente gerado, jobs de worker (materialização + notificação), `FinancialResponsiblesPanel.tsx` integrado a "Pessoas e acesso".
- Gates: `npm run check:types`, `npm test` (209/210 aprovados — 1 falha isolada de timeout por contenção de recursos, confirmada como flaky ao reexecutar sozinha com sucesso, não uma regressão real), `npm run test:integration:local` (28/28 em PostgreSQL 18 real, incluindo os 7 cenários novos de Responsáveis Financeiros), `npm run build` (api-contract + boundaries + todos os workspaces) e `npm run test:e2e` (68/68, incluindo os 7 cenários novos de `financial-responsibles.cy.js`) — todos aprovados.
- Ajuste retroativo necessário ao subir a versão de schema tenant para 8: bump de `migration_version!==7` para `!==8` em `postgres-identity-repository.ts`, `postgres-verification-repository.ts` (2 checagens) e `postgres-provisioning-repository.ts`, e dos literais `migration_version=7` hardcoded em `tests/postgres-capabilities-integration.test.ts`, `tests/postgres-roles-integration.test.ts` e `tests/postgres-integration.test.ts` — a mesma lição documentada na Story 1.9 se repetiu; `postgres-tenant-migrator.ts` já computava a versão dinamicamente e não precisou de ajuste.

### Completion Notes List

- **Decisão de módulo confirmada:** o domínio de Responsáveis Financeiros foi criado em `packages/application/src/finance/financial-responsibles.ts` (não em `application/tenancy`), seguindo a recomendação da arquitetura ("Financeiro e prestações de contas" → `application/finance`, AD-8/AD-16) — primeiro arquivo desse módulo; o Épico 2 vai se apoiar nele.
- **Capacidade nova reaproveita 100% o mecanismo de delegação da Story 1.9:** `financial-responsibles.manage` foi adicionada a `CAPABILITY_CATALOG` (`available:true`) e a `ROLE_CATALOG.syndic`; nenhuma extensão do mecanismo de `capability_grant` foi necessária. Provado por teste real contra PostgreSQL: um Auxiliar sem a capacidade institucional, mas com uma `capability_grant` ativa de `financial-responsibles.manage`, consegue atribuir Responsável Financeiro de verdade.
- **AC10 implementado de forma concreta, não apenas documentada:** `materialize()` do novo repository revalida a cada ciclo se o `person_unit_relationship` de origem (`source_relationship_id`) encerrou e, se sim, transiciona a atribuição para `revoked` com prioridade sobre a expiração por vigência — gera transição, projeção, auditoria e notificação como qualquer outra transição. Provado por teste real contra PostgreSQL (encerrar o Vínculo e materializar leva a atribuição a `revoked`).
- **AC4 ("consulta seu alcance autorizado") resolvido desde a primeira versão, não deixado para um review:** `ListFinancialResponsibles` segue o mesmo padrão de leitura própria fechado no review da Story 1.9, mas com o gate mínimo em `dashboard.read` (não `roles.read`), pois o Responsável Financeiro pode ser um Morador comum sem `roles.read`. A página retorna `viewerCapabilities` para a UI decidir se mostra as ações de gestão.
- Todas as 5 lições explícitas da Story 1.9 (qualificação de schema, autoria real em `effects()`, `BEGIN`/`COMMIT` explícito em testes de idempotência de migration, `onAccessLost()` em ambos os fluxos de mutação, foco/`opener`/Escape-enquanto-busy no painel) foram aplicadas desde a primeira versão do código, não descobertas em review.
- AC7/AC12 (leitura financeira real) e AC10/AC11 (relação de cobrança pós-saída) permanecem deliberadamente fora de escopo — nenhuma tela, rota ou dado financeiro inexistente foi criado; a atribuição fica registrada como autorização válida para quando o Épico 2 implementar a leitura real.
- Todos os 7 itens de Tasks/Subtasks concluídos; todos os 14 ACs cobertos por pelo menos um teste real (unitário de domínio, API com classes de erro reais, PostgreSQL 18 real, ou Cypress).

### File List

- `_bmad-output/implementation-artifacts/1-10-atribuir-responsaveis-financeiros-por-unidade.md` (novo)
- `apps/api/src/composition-root.ts`
- `apps/api/src/nest-app.ts`
- `apps/api/src/openapi.ts`
- `apps/web/src/components/FinancialResponsiblesPanel.tsx` (novo)
- `apps/web/src/components/PeopleUnitsPage.tsx`
- `apps/worker/src/composition-root.ts`
- `cypress/e2e/financial-responsibles.cy.js` (novo)
- `cypress/e2e/invitations.cy.js`
- `cypress/e2e/people-units-relationships.cy.js`
- `cypress/e2e/role-lifecycle-active.cy.js`
- `cypress/e2e/role-lifecycle.cy.js`
- `migrations/tenant/008_financial_responsibles.sql` (novo)
- `migrations/tenant/README.md`
- `package.json`
- `packages/adapters/src/db/postgres-financial-responsible-notification-outbox.ts` (novo)
- `packages/adapters/src/db/postgres-financial-responsible-repository.ts` (novo)
- `packages/adapters/src/db/postgres-identity-repository.ts`
- `packages/adapters/src/db/postgres-provisioning-repository.ts`
- `packages/adapters/src/db/postgres-verification-repository.ts`
- `packages/adapters/src/index.ts`
- `packages/api-client/src/provisioning.ts` (regenerado)
- `packages/application/src/authorization/capabilities.ts`
- `packages/application/src/authorization/roles.ts`
- `packages/application/src/finance/financial-responsibles.ts` (novo)
- `packages/application/src/index.ts`
- `scripts/generate-api-client.mjs`
- `tests/api-financial-responsibles.test.ts` (novo)
- `tests/capabilities.test.ts`
- `tests/financial-responsibles.test.ts` (novo)
- `tests/migrations-financial-responsibles-contract.test.ts` (novo)
- `tests/postgres-capabilities-integration.test.ts`
- `tests/postgres-financial-responsibles-integration.test.ts` (novo)
- `tests/postgres-integration.test.ts`
- `tests/postgres-roles-integration.test.ts`

## Change Log

- 2026-08-16: implementação completa da Story 1.10 — capacidade dedicada `financial-responsibles.manage` (reaproveitando a delegação da Story 1.9), domínio novo em `application/finance`, migration tenant 008, adapter transacional com revalidação de frescor contra o Vínculo de origem (AC10), API/OpenAPI/cliente, jobs de worker, `FinancialResponsiblesPanel.tsx`, testes em todas as camadas (16 unitários/domínio, 6 API, 28/28 PostgreSQL real, 68/68 Cypress). Story movida para review.
