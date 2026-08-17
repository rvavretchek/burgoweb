---
baseline_commit: 8bd91716b0c465c303cb00586a20af3e997fa31f
---

# Story 1.8: Conceder, suspender e revogar Papéis

Status: done

## Story

Como Síndico,
Quero administrar a vigência dos Papéis subordinados,
Para que cada Pessoa mantenha somente a autoridade institucional necessária ao período correto.

## Acceptance Criteria

1. **Conceder Papel subordinado.** Dado que o Síndico possui autoridade vigente no Condomínio, quando concede um Papel predefinido subordinado a uma Pessoa com Vínculo compatível, então o sistema registra Papel, início, término opcional, estado, concedente e alcance no tenant autorizado; a atribuição não cria capacidades além das previstas no catálogo fechado do Papel e das delegações explícitas já vigentes.
2. **Revisar antes de confirmar.** Durante a preparação da concessão, a interface apresenta Pessoa, Vínculo, Papel, vigência, alcance e efeitos de acesso; distingue claramente Papel institucional, capacidade delegada, Responsável Financeiro e Contato de Continuidade.
3. **Programar início futuro.** Uma atribuição cujo instante inicial ainda não chegou permanece `scheduled` e não autoriza operações. Sua ativação é temporal, idempotente, auditável e usa o fuso IANA configurado do Condomínio.
4. **Rejeitar horário civil ambíguo ou inexistente.** Se data/hora local for ambígua ou inexistente no fuso do Condomínio, a API retorna erro de validação e exige offset explícito ou nova escolha válida; não converte silenciosamente nem agenda a atribuição.
5. **Expirar no instante final.** Ao alcançar o término, novas autorizações baseadas no Papel são negadas imediatamente e sessões alcançadas deixam de autorizar aquele tenant; atribuição, autoria e ações históricas permanecem preservadas.
6. **Suspender em urgência.** Síndico, ou Auxiliar que já possua a capacidade específica vigente, pode suspender Papel subordinado. O servidor revalida capacidade e estado dentro da transação, exige motivo válido, registra autor e instante, bloqueia imediatamente o acesso derivado e invalida as sessões alcançadas naquele tenant.
7. **Impedir abuso pelo Auxiliar.** Auxiliar não pode suspender o próprio Papel, revogar permanentemente qualquer Papel, afetar o Síndico, autoconceder-se capacidade ou contornar as regras por rota, payload, Papéis acumulados ou corrida concorrente.
8. **Restaurar Papel suspenso.** Somente Síndico vigente restaura o Papel mediante confirmação explícita. Período, motivo, autor e histórico da suspensão são preservados; sessões invalidadas não são restauradas e a Pessoa autentica-se novamente quando aplicável.
9. **Revogar permanentemente.** Somente Síndico vigente confirma revogação permanente de Papel subordinado, com motivo obrigatório. A revogação tem efeito imediato, invalida sessões alcançadas e não apaga Pessoa, Vínculo, autoria nem registros produzidos.
10. **Impedir autoação durante revogação.** O Auxiliar alvo não pode confirmar, cancelar ou ampliar a operação sobre si; apenas Síndico vigente confirma a revogação administrativa permanente.
11. **Acumular Papéis sem ampliar implicitamente.** Para cada operação protegida, o servidor calcula a união apenas das capacidades explicitamente autorizadas por atribuições e Vínculos vigentes no Condomínio e, quando aplicável, na Unidade. Papéis `scheduled`, `suspended`, `expired`, `revoked` ou encerrados não contribuem.
12. **Resolver concorrência sem sobrescrita.** Toda mutação recebe `expectedVersion`. Se a versão persistida mudou, a operação retorna `409` com representação atual minimizada e não sobrescreve a decisão anterior; a interface preserva a intenção e apresenta o estado atual para revisão.
13. **Persistir efeitos coerentemente.** Concessão, ativação, suspensão, restauração, expiração e revogação persistem, na mesma unidade transacional, o novo estado, Evento de Auditoria append-only, projeção exportável versionada e item de outbox para notificação. A mensagem à Pessoa afetada não expõe capacidades, dados pessoais ou motivo restrito além do necessário.
14. **Oferecer UX acessível e resiliente.** Em mobile, desktop, teclado, zoom de 200%, reflow de 320 px e tecnologia assistiva, a gestão apresenta estados vazio, carregando, validação, sucesso, conflito, acesso negado, indisponível e offline; vigência, alcance, risco e resultado são compreensíveis, o foco é preservado, as confirmações nomeiam a ação e nenhum estado depende somente de cor, em conformidade com WCAG 2.2 AA.

## Tasks / Subtasks

- [x] 1. Fechar o modelo de domínio e os contratos de autorização (AC: 1, 3-11)
  - [x] Definir catálogo único e fechado dos Papéis MVP (`syndic`, `administrative-assistant`, `councilor`, `resident`) e suas capacidades base; remover a duplicação hoje localizada no adapter de Convites sem alterar o significado dos Convites já aceitos.
  - [x] Modelar atribuição com identificadores públicos opacos, Pessoa, Vínculo/proveniência opcional conforme regra, Papel, alcance, `validFrom`, `validUntil`, estado, concedente, motivo restrito, versão e timestamps.
  - [x] Implementar máquina de estados explícita `scheduled -> active -> expired`, `active -> suspended -> active` e `scheduled|active|suspended -> revoked`, recusando transições inválidas e fazendo prevalecer o estado mais restritivo em corridas.
  - [x] Definir comandos/ports para preview, listagem, concessão, suspensão, restauração, revogação e materialização idempotente de ativação/expiração.
  - [x] Validar motivo na borda (trim, tamanho máximo e formato documentados), UUIDs, intervalo temporal e compatibilidade Pessoa–Vínculo–Papel.

- [x] 2. Criar migrations aditivas e projeção agregada de autorização (AC: 1, 3-13)
  - [x] Criar nova migration tenant; não editar migrations já aplicadas. Normalizar estados atualmente incompatíveis em `authority_assignment` e adicionar histórico/transições, projeção exportável, idempotência e outbox necessários.
  - [x] Resolver explicitamente a incompatibilidade entre múltiplos Papéis e o índice/modelo atual de uma única membership/authority ativa por Conta+tenant. Uma Conta mantém uma membership tenant-scoped e a autorização efetiva agrega todas as atribuições vigentes; não criar uma membership por Papel.
  - [x] Introduzir versão agregada de autorização por membership/tenant (ou mecanismo equivalente documentado) que seja incrementada por toda mudança efetiva de Papel e permita negação imediata sem revogar sessões da Conta em outros Condomínios.
  - [x] Armazenar instantes em `timestamptz`/UTC e o fuso IANA do Condomínio separadamente. A aplicação valida horários civis ambíguos/inexistentes antes de persistir; usar o relógio transacional do banco como autoridade para limites.
  - [x] Atualizar versão esperada do schema tenant em migrator, provisionamento, verificação, identidade, fixtures, testes e READMEs; preservar compatibilidade com tenants existentes via upgrade incremental.

- [x] 3. Implementar aplicação e adapter PostgreSQL transacional (AC: 1, 3-13)
  - [x] Reutilizar o padrão de reautorização sob lock/CAS das Stories 1.6–1.7: resolver `TenantContext`, travar membership/atribuições/alvo, revalidar Conta, Pessoa, Vínculo, tenant, capacidade, vigência, versão e regras ator–alvo dentro da mesma transação.
  - [x] Calcular capacidades como união estrita das atribuições vigentes e do alcance permitido; nunca inferir hierarquia, capacidade pelo nome do Papel, acesso por membership isolada ou autorização a partir de tenant/schema enviados pelo cliente.
  - [x] Preservar `source_relationship_id`: encerramento de Vínculo remove apenas autoridade dele dependente; autoridade inicial e outras atribuições independentes continuam válidas.
  - [x] Fazer toda transição persistir estado, auditoria minimizada, projeção exportável e outbox no mesmo commit; rollback não pode deixar autoridade parcial, Evento órfão ou falsa notificação.
  - [x] Implementar expiração/ativação idempotente no worker e revalidar o tempo também no caminho síncrono de autorização, para que atraso do worker nunca prolongue acesso.
  - [x] Invalidar acesso tenant-scoped por versão/projeção; não revogar indiscriminadamente todas as sessões da Conta. Mudança de privilégio não restaura token/sessão invalidado.
  - [x] Implementar idempotência com canonicalização profunda ou DTO plano, excluindo `requestId` e a chave do hash, e tratar chamadas concorrentes com a mesma chave sem duplicar atribuição, auditoria ou notificação.

- [x] 4. Expor API segura e contrato OpenAPI (AC: 1-13)
  - [x] Adicionar endpoints/comandos de listagem/preview/concessão/suspensão/restauração/revogação, protegidos por sessão, `TenantContext`, same-origin, CSRF e capacidades específicas deny-by-default.
  - [x] Retornar erros RFC 9457 minimizados: `400/422` para contrato/horário inválido, `403/404` sem enumeração, `409` com estado atual permitido e `503` para indisponibilidade recuperável.
  - [x] Impedir por testes rota direta, troca de public ID/tenant, payload adulterado, autoação do Auxiliar, ação contra Síndico, delegação implícita e bypass por Papéis acumulados.
  - [x] Atualizar `apps/api/src/openapi.ts`, regenerar o cliente com o script oficial e executar `check:api-contract`; nunca editar manualmente o cliente gerado.

- [x] 5. Processar notificações minimizadas (AC: 13)
  - [x] Implementar/estender outbox e handler no worker com claim, lease, retry limitado, backoff, idempotência, correlação e redaction conforme os adapters de e-mail existentes.
  - [x] Notificar concessão, suspensão, restauração, expiração e revogação somente após item transacional; não incluir catálogo de capacidades, segredo, motivo restrito nem dados institucionais desnecessários.
  - [x] Não declarar entrega antes da confirmação do `EmailPort`; falha de entrega não reverte a decisão de autorização e permanece observável/reprocessável.

- [x] 6. Construir a experiência em “Pessoas e acesso” (AC: 2, 4, 8, 9, 12, 14)
  - [x] Integrar um painel de Papéis à superfície existente de Pessoas/Vínculos/Convites, reutilizando shell, CSRF retry, paginação, `ConflictResolver`, feedback e padrões de formulário já existentes.
  - [x] Exibir catálogo predefinido, Vínculo elegível, alcance, datas, fuso/offset, estado e efeitos. Não oferecer editor de Papel, delegação geral, Responsável Financeiro, Contato de Continuidade ou transferência de Síndico.
  - [x] Usar etapa de revisão editável e confirmação sensível que nomeia a ação, objeto, Condomínio, efeito, alcance, reversibilidade e motivo; nunca usar confirmação genérica “Tem certeza?”.
  - [x] Após perda de autorização, interromper a ação e retirar dados sensíveis de conteúdo, rota, título, breadcrumb, cache e live regions; anunciar uma vez uma mensagem neutra, sem enumeração.
  - [x] Preservar valores de formulário em falhas recuperáveis e conflitos, mover foco para o resumo/controle adequado e identificar estados também por texto/ícone acessível.

- [x] 7. Provar o comportamento com testes em camadas (AC: todos)
  - [x] Unitários: catálogo, união estrita, máquina de estados, intervalos, motivo, canonicalização, DST ambíguo/inexistente, autorização ator–alvo e negação por default.
  - [x] API/contrato: sessão/CSRF/origin, tenant adulterado, UUID inválido, RFC 9457, 409/current, idempotência e respostas sem enumeração.
  - [x] PostgreSQL 18 real/Testcontainers: migration incremental, locks/rollback, múltiplos Papéis, encerramento de Vínculo, revogação seletiva, clock boundary, worker atrasado, suspensão vs. revogação, job vs. ação manual e duas chamadas com mesma Idempotency-Key.
  - [x] Integração: catálogo realmente altera as capacidades resolvidas no `TenantContext`; não aceitar teste apenas de helper. Provar que Papel suspenso/expirado/revogado deixa de autorizar no mesmo instante e que outro Condomínio/Papel/Vínculo independente continua acessível.
  - [x] Auditoria/outbox: exatamente um evento/projeção/item por transição efetiva, nenhum em rollback/conflito e nenhuma informação restrita no payload da notificação/log.
  - [x] Cypress/acessibilidade: preview, confirmação, conflito, foco, teclado, 320 px, zoom 200%, estados completos, perda concorrente de acesso e axe sem violações críticas.
  - [x] Executar `npm test`, `npm run test:integration`, `npm run check:types`, `npm run build` e `npm run test:e2e` antes de mover para review.

### Review Findings

- [x] [Review][Patch] AC3/AC4 exigem fuso IANA do Condomínio persistido — decisão do usuário: adicionar coluna de fuso IANA ao Condomínio (schema), capturar no onboarding/configuração, e validar horário civil ambíguo/inexistente no servidor contra esse fuso declarado em vez do fuso do navegador do operador. Hoje nenhuma coluna de fuso por Condomínio existe em nenhuma migration; o cliente deriva o fuso via `Intl.DateTimeFormat().resolvedOptions().timeZone` e o servidor só verifica presença de offset explícito, sem validar ambiguidade real. [apps/web/src/components/RolesPanel.tsx:136; packages/application/src/authorization/roles.ts (validateRoleDraft); schema do Condomínio]
- [x] [Review][Patch] Trilha de auditoria da migração registra concedente self-granted para atribuições pré-existentes — decisão do usuário: manter `granted_by_person_id = person_id` para linhas migradas por `006_role_lifecycle.sql` (não há dado real de concedente para restaurar, pois `authority_assignment` nunca registrou o concedente), documentando essa limitação explicitamente como comentário SQL na migration e nas Dev Notes. [migrations/tenant/006_role_lifecycle.sql:55]
- [x] [Review][Patch] Erros de Papel sempre retornam 500 em vez de RFC 9457 — `RoleValidation`, `AuthorizationDenied` e `RoleConflict` estendem `Error` sem definir `this.name`; `institutionalProblem()` só testa `e?.name==='X'` (sem `instanceof`), então nenhum erro real dessas classes é reconhecido e todos caem no branch genérico 500. Quebra o contrato HTTP de AC4/AC6/AC7/AC9/AC10/AC12; os testes só passam porque forjam `.name` como propriedade própria. [packages/application/src/authorization/roles.ts:25-27; apps/api/src/nest-app.ts:166]
- [x] [Review][Patch] Cliente de API gerado não tem os 6 métodos de Papéis — `packages/api-client/src/provisioning.ts` não referencia nenhuma das seis operações de `role-assignments` declaradas em `openapi.ts`; `scripts/generate-api-client.mjs` grava um template estático que nunca foi atualizado, então `check:api-contract`/`npm run build` passam mesmo com o cliente incompleto (Task 4.4 marcada como concluída indevidamente). [packages/api-client/src/provisioning.ts; scripts/generate-api-client.mjs]
- [x] [Review][Patch] `RolesPanel.tsx` contorna o `@burgoweb/api-client` com `fetch()` manual — viola a regra do CLAUDE.md de que `apps/web` só pode falar com o backend via cliente gerado; mesma causa raiz do item anterior. [apps/web/src/components/RolesPanel.tsx:30,38]
- [x] [Review][Patch] Catálogo de capacidades duplicado em 3 lugares e já divergente — `ROLE_CATALOG` canônico (roles.ts) vs. array SQL manual em `authorize()` (que já importa `ROLE_CATALOG` mas não o reutiliza) vs. terceiro `CASE role_kind WHEN...` em `resolveContext` (não importa o catálogo, já sem as capacidades marcadoras `role.*`). [packages/adapters/src/db/postgres-role-assignment-repository.ts:80-81; packages/adapters/src/db/postgres-identity-repository.ts:41]
- [x] [Review][Patch] `authorize()` não filtra por `scope_kind`/`scope_unit_id` — um Auxiliar com alcance de Unidade obtém poder de suspensão em todo o tenant em vez de restrito à sua Unidade. [packages/adapters/src/db/postgres-role-assignment-repository.ts:70-82]
- [x] [Review][Patch] Concessão não é resiliente a duplo clique — `grant()` gera `crypto.randomUUID()` novo a cada chamada, o botão de confirmação não tem guarda de estado ocupado/desabilitado, e não há índice único no banco impedindo duas atribuições ativas simultâneas para a mesma Pessoa+Papel+alcance. [apps/web/src/components/RolesPanel.tsx:154-168,400; migrations/tenant/006_role_lifecycle.sql]
- [x] [Review][Patch] Papéis com alcance de Unidade são inalcançáveis pela UI — a preparação do rascunho fixa `scope: { type: "tenant" }` e o painel não recebe a lista de Unidades. [apps/web/src/components/RolesPanel.tsx:133]
- [x] [Review][Patch] Branch de conflito 409 não atualiza a cópia `selected` do diálogo aberto — reenviar reutiliza a versão desatualizada e conflita indefinidamente. [apps/web/src/components/RolesPanel.tsx (change(), branch 409)]
- [x] [Review][Patch] `token()` não verifica `response.ok` antes de ler `csrfToken` — risco da string literal "undefined" ser armazenada e enviada como cabeçalho CSRF real. [apps/web/src/components/RolesPanel.tsx (token())]
- [x] [Review][Patch] 403 de CSRF expirado é tratado como perda total de acesso em vez de novo envio com token atualizado, ao contrário de `PeopleUnitsPage.mutate()`. [apps/web/src/components/RolesPanel.tsx (grant()/change() catch)]
- [x] [Review][Patch] Negação de uma única capacidade aciona `onAccessLost()` e limpa a página inteira, agravado por `AuthorizationDenied` mapear para 404 em vez de 403. [apps/web/src/components/RolesPanel.tsx (change() catch); apps/api/src/nest-app.ts:166]
- [x] [Review][Patch] Diálogos de suspensão/restauração/revogação sem focus trap — Tab pode sair do modal, violando AC14/WCAG 2.2 AA. [apps/web/src/components/RolesPanel.tsx (markup dos diálogos)]
- [x] [Review][Patch] Linha de Papel do síndico sem rótulo e com botões Suspender/Revogar sem efeito (servidor sempre rejeita). [apps/web/src/components/RolesPanel.tsx (roleLabels, ações da lista)]
- [x] [Review][Patch] Botões de auto-suspensão/autorrevogação sempre renderizados para a própria linha do ator, mesmo sendo sempre rejeitados pelo servidor. [apps/web/src/components/RolesPanel.tsx (ações da lista)]
- [x] [Review][Patch] Validação do motivo de suspensão inconsistente com a de revogação — só revogação trava o envio por `trim().length<8`; suspensão confia só no `minLength` nativo (conta espaços), permitindo motivo só de espaços passar no cliente e falhar no servidor. [apps/web/src/components/RolesPanel.tsx:424-451]
- [x] [Review][Patch] `validateReason()` mede `.length` (unidades UTF-16) enquanto o CHECK do banco usa `char_length()` (pontos de código) — motivo com caractere fora do plano básico pode passar no domínio e violar o CHECK do banco sem tratamento. [packages/application/src/authorization/roles.ts:33; migrations/tenant/006_role_lifecycle.sql:16]
- [x] [Review][Patch] `materialize()` roda a varredura de todos os tenants em uma única transação com locks `FOR UPDATE` mantidos o tempo todo — falha em um tenant bloqueia/reverte ativação/expiração de todos os demais no ciclo. [packages/adapters/src/db/postgres-role-assignment-repository.ts (materialize())]
- [x] [Review][Patch] `load()` sem branch explícito para 401 (sessão expirada), ao contrário de outras páginas que pedem nova autenticação. [apps/web/src/components/RolesPanel.tsx (load())]
- [x] [Review][Patch] `migration_version=6` hardcoded em `migrateRegisteredTenants()`, desconectado da detecção dinâmica de versão usada no resto da classe. [packages/adapters/src/db/postgres-tenant-migrator.ts:57]
- [x] [Review][Patch] `tests/roles.test.ts` nunca exercita `validateRoleDraft` nem chama `GrantRoleAssignment`/`ChangeRole.execute()` diretamente — regras de validação só são alcançadas indiretamente por testes mockados ou de banco real. [tests/roles.test.ts]
- [x] [Review][Patch] `tests/migrations-roles-contract.test.ts` só verifica substring no texto SQL — nunca executa a migration nem checa idempotência. [tests/migrations-roles-contract.test.ts]
- [x] [Review][Defer] Outbox de notificação pode esfomear tenants — `claim()` itera tenants em `ORDER BY id` fixo sem rotação; padrão pré-existente compartilhado com outros adapters de outbox, não bloqueante para esta story. [packages/adapters/src/db/postgres-role-notification-outbox.ts:6] — deferred, pre-existing

## Dev Notes

### ATDD Artifacts

- Checklist: `_bmad-output/test-artifacts/atdd-checklist-1-8-conceder-suspender-e-revogar-papeis.md`
- API tests: `tests/api-roles.test.ts`
- E2E tests: `cypress/e2e/role-lifecycle.cy.js`
- Fixtures: `tests/fixtures/role-atdd-data.ts`

### Decisões de code review (2026-08-12)

- **Fuso do Condomínio (AC3/AC4):** adicionada coluna `time_zone` a `burgoweb_global.tenant_registry` (migration `007_tenant_time_zone.sql`, default `America/Sao_Paulo`), exposta em `TenantContext`/`DashboardResponse`. `validateRoleDraft` agora resolve o horário civil informado (string local sem offset) contra esse fuso declarado do Condomínio via `resolveCivilInstant`, rejeitando horário ambíguo/inexistente; o cliente não decide mais o fuso pelo navegador do operador.
- **Auditoria da migração 006 (granted_by_person_id):** decisão de produto — manter `granted_by_person_id = person_id` para atribuições pré-existentes migradas (não há concedente real registrado em `authority_assignment`); documentado como comentário SQL na migration. Atribuições novas sempre recebem o concedente real.

### Contexto crítico para implementação

- Esta história completa a gestão do ciclo de vida de Papéis iniciada pelos Convites da Story 1.7. Ela depende das sessões e do `TenantContext` das Stories 1.4–1.5, de Pessoa/Unidade/Vínculo/CAS/proveniência da 1.6 e das atribuições/memberships da 1.7.
- O modelo atual pressupõe uma única authority/membership ativa por Conta+tenant, enquanto o AC 11 exige Papéis acumuláveis. A implementação deve manter uma membership tenant-scoped e agregar atribuições vigentes, com uma versão agregada de autorização. Simplesmente remover o índice único ou criar uma membership por Papel quebrará seleção de tenant, sessão e revogação seletiva.
- Sessões atuais são globais por Conta. “Revogar sessões alcançadas” significa invalidar o direito de usar o tenant afetado, preservando outros Condomínios; não significa apagar toda sessão da Conta. A checagem síncrona de versão/vigência é a garantia imediata; o worker materializa/propaga efeitos, mas não é a autoridade exclusiva.
- `authority_assignment` e membership possuem estados parcialmente divergentes no schema atual. Faça migration aditiva e uma máquina de estados única; não reescreva migrations antigas nem apague atribuições históricas.
- O catálogo de Papel/capacidades hoje existe dentro do adapter de Convites. Extraia uma fonte canônica reutilizável pela aceitação de Convites e pela gestão de Papéis; um Papel selecionado sem efeito real nas capacidades é falha de implementação.
- Preserve o caminho `linkAuthorizationSource`/`source_relationship_id` estabelecido nas Stories 1.6–1.7. O fim de um Vínculo não pode retirar autoridade independente nem deixar acesso dependente ativo.
- O PostgreSQL aceita horários locais ambíguos/inexistentes usando heurísticas. Valide na aplicação usando zona IANA e offset explícito; persista o instante inequívoco em UTC e mantenha a zona do Condomínio para apresentação.
- Toda autorização é server-side, deny-by-default e revalidada dentro da transação. Guards/decorators de rota são defesa de borda, não substituem a decisão no caso de uso e no adapter transacional.
- Motivo de suspensão/revogação é dado restrito: limite e valide o texto; registre-o apenas onde autorizado. Notificação e erro público não devem reproduzi-lo.

### Limites de escopo

- Não implementar Papéis personalizados (fora do MVP).
- Não implementar UI/política de delegação granular da Story 1.9. Nesta história, apenas consumir a capacidade específica de suspensão urgente já vigente e introduzir o identificador necessário no catálogo/contrato.
- Não implementar Responsável Financeiro (Story 1.10), Contato de Continuidade (Epic 6) nem transferência/recuperação do Síndico (Stories 1.11 e 6.4–6.5).
- Não reutilizar o endpoint legado `PATCH /api/condominiums/:id/users/:userId/role`, o modelo `admin/member`, `actorUserId` informado pelo cliente ou persistência JSON de `src/`; o baseline válido é o monorepo greenfield.
- Não editar arquivos gerados (`packages/api-client/src/provisioning.ts`, `apps/web/src/routeTree.gen.ts`) manualmente.

### Arquitetura e stack obrigatórias

- Node.js 24.18.0; TypeScript 7.0.2; React 19; NestJS/Fastify 11.1.20/5.10.0; Kysely 0.29.2; PostgreSQL 18.4; Vitest 4.1.10; Cypress 15.19.0; Testcontainers 12.0.4, conforme versões fixadas no repositório e na arquitetura.
- Manter os limites `apps/web`, `apps/api`, `apps/worker`, `packages/application`, `packages/adapters`, `packages/api-client`, `packages/config` e `packages/test-support`.
- NestJS documenta autorização por claims/permissões como alternativa ao RBAC básico. Isso corresponde ao contrato do Burgoweb: rotas exigem capacidades, e Papéis apenas originam capacidades; a decisão final continua tenant-scoped e transacional.
- PostgreSQL armazena `timestamp with time zone` internamente como UTC e usa a base IANA, mas resolve entradas inválidas/ambíguas por heurística. Por isso o contrato explícito do AC 4 deve ser aplicado antes da persistência.

### Project Structure Notes

Arquivos novos prováveis:

- `packages/application/src/authorization/roles.ts` (ou módulo vertical equivalente)
- `packages/adapters/src/db/postgres-role-assignment-repository.ts`
- `packages/adapters/src/db/postgres-role-notification-outbox.ts` (ou extensão coesa do outbox existente)
- `migrations/tenant/006_role_lifecycle.sql` e, apenas se necessário ao desenho de versão/invalidação, migration global seguinte
- `apps/web/src/components/RolesPanel.tsx`
- `tests/roles.test.ts`, `tests/api-roles.test.ts`, `tests/migrations-roles-contract.test.ts` e specs E2E correspondentes

Arquivos existentes que o dev deve ler integralmente antes de alterar:

- `packages/application/src/tenancy/tenancy.ts`, `packages/application/src/invitations/invitations.ts`, `packages/application/src/index.ts`
- `packages/adapters/src/db/postgres-identity-repository.ts`, `postgres-invitation-repository.ts`, `postgres-people-units-repository.ts`, `postgres-tenant-migrator.ts`, `postgres-provisioning-repository.ts`, `postgres-verification-repository.ts`, exports do pacote e adapters de outbox/e-mail
- `migrations/tenant/003_authorization_context.sql`, `004_people_units_relationships.sql`, `005_invitations_capability.sql`, `migrations/global/003_sessions_memberships.sql`, `005_relationship_authorization_provenance.sql` e READMEs de migrations
- `apps/api/src/composition-root.ts`, `nest-app.ts`, `openapi.ts`; `apps/worker/src/composition-root.ts`
- `apps/web/src/components/PeopleUnitsPage.tsx`, `InvitationsPanel.tsx`, estilos e rota `condominios_.$publicId.pessoas.tsx`
- testes de tenancy, people/units, invitations, security, accessibility, PostgreSQL integration e API contract

Se a implementação adotar nomes/paths diferentes, mantenha o módulo vertical coeso e registre a decisão no File List/Completion Notes; não espalhe regras de Papel entre controllers, UI e adapters.

### Testing Requirements

- Teste isolado de helper não é evidência suficiente. Os reviews das Stories 1.6–1.7 encontraram call sites não integrados, Papel sem efeito nas capacidades, reconvite ampliando acesso, CSRF ausente e alegações de cobertura sem teste correspondente.
- Use PostgreSQL 18 real para constraints, locks, fonte de tempo, isolamento, rollback, concorrência e migration; doubles somente para lógica pura.
- Cubra limites exatamente no `validFrom`/`validUntil`, mudança de fuso/DST, estado mais restritivo, acumulação, proveniência e acesso cruzado entre tenants.
- Teste a UI por teclado e tecnologia assistiva, não somente snapshots/seletores; inclua foco após conflito/erro e limpeza de dados após revogação concorrente.

### Previous Story Intelligence

- A Story 1.7 estabeleceu aceitação de Convite transacional, catálogo fechado, criação conjunta de `authority_assignment` e `account_tenant_membership`, proveniência pelo Vínculo, outbox e idempotência. Estenda esses contratos; não crie um segundo modelo de autoridade.
- O caminho canônico de proveniência é `linkAuthorizationSourceInTransaction`. Encerrar Vínculo atualiza apenas authorities/memberships derivadas e sincroniza `authorization_version`.
- O índice de atribuição ativa já precisou ser corrigido para permitir reconvite após `ended`; desenhe os novos índices pela máquina de estados completa e prove concessão posterior a expiração/revogação.
- Dívidas relevantes registradas: motivo sem limite, UUID validado apenas pelo cast, canonicalização apenas top-level, ausência de teste concorrente com mesma Idempotency-Key, possível clock drift Node/Postgres e falta de limpeza das chaves de idempotência. Não replique essas falhas na 1.8.

### Git Intelligence Summary

- Os commits recentes (`8bd9171`, `0b98be0`) documentam épicos; `b376293` contém o protótipo legado. Eles não representam a implementação das Stories 1.1–1.7.
- O baseline real está no worktree atual em `apps/`, `packages/`, `migrations/` e `tests/`. Use os artefatos de implementação e o código presente como evidência; não conclua que algo inexiste apenas porque não aparece no Git recente.

### Latest Technical Information

- Manter as versões pinadas; esta história não autoriza upgrade de dependências.
- A documentação oficial do NestJS recomenda claims/permissões quando a decisão é “o que o sujeito pode fazer”, adequada ao catálogo de capacidades: https://docs.nestjs.com/security/authorization
- A documentação oficial do PostgreSQL explica armazenamento UTC, zonas IANA e regras de DST: https://www.postgresql.org/docs/current/datatype-datetime.html
- A própria documentação do PostgreSQL registra que timestamps inválidos/ambíguos recebem offsets por heurística, reforçando a rejeição explícita exigida pelo AC 4: https://www.postgresql.org/docs/18/datetime-invalid-input.html

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-18-Conceder-suspender-e-revogar-Papéis]
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-1-Começar-a-gestão-e-formar-uma-equipe-autorizada]
- [Source: _bmad-output/planning-artifacts/prd.md#3-Glossário-operacional]
- [Source: _bmad-output/planning-artifacts/prd.md#FR-5-Isolamento-e-acesso-por-Vínculo-e-Papel]
- [Source: _bmad-output/planning-artifacts/prd.md#FR-8-Gestão-de-Papéis-e-capacidades]
- [Source: _bmad-output/planning-artifacts/prd.md#FR-22-Histórico-institucional]
- [Source: _bmad-output/planning-artifacts/prd.md#FR-41-Delegação-de-capacidades]
- [Source: _bmad-output/planning-artifacts/prd.md#FR-45-Eventos-de-Auditoria]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/ARCHITECTURE-SPINE.md#Invariantes]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-burgoweb-2026-07-27/EXPERIENCE.md#Pessoas-e-acesso]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-burgoweb-2026-07-27/DESIGN.md#Confirmação-sensível]
- [Source: docs/product/discovery/03-segmentos-e-personas.md#Modelo-de-participação]
- [Source: docs/product/discovery/07-mapa-de-capacidades.md#Pessoas-vínculos-e-papéis]
- [Source: _bmad-output/implementation-artifacts/1-7-convidar-pessoas-e-ativar-contas.md]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Análise do Épico 1, PRD, discovery canônico, arquitetura, UX, Story 1.7, código atual, migrations, testes e cinco commits recentes.
- Pesquisa técnica limitada à documentação oficial do NestJS e PostgreSQL; nenhuma dependência foi alterada.
- Implementação 2026-08-10: RED confirmado em `tests/roles.test.ts` e `tests/migrations-roles-contract.test.ts`; GREEN com 9 testes ativos específicos e 2 E2E ativos.
- Gates: `npm test` 151 aprovados/27 skipped; `npm run check:types` aprovado; `npm run build` aprovado; spec E2E 1.8 com 2/2 aprovados.
- PostgreSQL real retomado em 2026-08-10 pelo serviço Windows `postgresql-x64-18-burgoweb`: o gate canônico executou 12/12 testes em PostgreSQL 18, incluindo um cenário transacional específico da Story 1.8.
- A execução real identificou e corrigiu: preservação dos marcadores `role.*` de Convites aceitos, versão tenant 6 no provisionamento/verificação, ativação da atribuição inicial e lock inválido no lado anulável de `LEFT JOIN`.

 - Validação final parcial em 2026-08-10: `npm run check:types`, `npm test` (151 aprovados), `npm run test:integration` (13/13 em PostgreSQL 18), `npm run build` e `npm run test:e2e` (44 aprovados) executados com sucesso.
- A materialização temporal passou a registrar, no mesmo commit, estado anterior/novo, auditoria, projeção, outbox e sincronização da versão agregada de autorização.

### Completion Notes List

- Validação final em 2026-08-10: `npm run check:types`, `npm test`, `npm run test:integration` (13/13 em PostgreSQL 18), `npm run build` e `npm run test:e2e` (53/53, sem pending/skipped) aprovados.
- Convites aceitos reutilizam a única membership tenant-scoped da Conta/Pessoa, agregam capacidades e criam atribuições de Papel independentes.
- A reautorização PostgreSQL deriva capacidades das atribuições efetivas sob lock, sem bypass por contexto em memória.

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Story validada para implementação, com riscos estruturais de múltiplos Papéis, temporalidade e invalidação tenant-scoped explicitados.
- Implementado catálogo canônico fechado, máquina temporal, união estrita de capacidades, contratos/use cases e validações de borda.
- Implementada migration tenant 006 aditiva, adapter PostgreSQL com lock/CAS/idempotência/auditoria/projeção/outbox, resolução tenant-scoped e integração com Convites.
- Expostas seis operações HTTP seguras, contrato OpenAPI e cliente regenerado pelo script oficial.
- Integrados worker de materialização temporal, outbox de notificação minimizada e painel acessível “Papéis e acesso”.
- Gate PostgreSQL resolvido e documentado: `npm run test:integration` agora seleciona automaticamente o serviço Windows, URL externa ou Testcontainers e não confunde coleta `skipped` com sucesso.
- Formulários `datetime-local` convertem horário civil válido para instante UTC antes do preview e recusam normalização silenciosa de horário inexistente.
- Os 25 scaffolds ATDD da Story 1.8 foram ativados e concluídos: 16/16 cenários de API e 9/9 cenários Cypress, sem `pending` ou `skipped` na execução focada.
- A experiência passou a preservar intenção em conflitos, controlar foco/teclado, apresentar confirmação contextual, oferecer recuperação e retirar rota, título, cache visual e dados sensíveis após perda concorrente de acesso.

### File List

- `_bmad-output/implementation-artifacts/1-8-conceder-suspender-e-revogar-papeis.md` (novo)
- `README.md`
- `apps/api/src/composition-root.ts`
- `apps/api/src/nest-app.ts`
- `apps/api/src/openapi.ts`
- `apps/web/src/components/PeopleUnitsPage.tsx`
- `apps/web/src/components/AuthenticatedPages.tsx`
- `apps/web/src/components/RolesPanel.tsx` (novo)
- `apps/worker/src/composition-root.ts`
- `cypress/e2e/invitations.cy.js`
- `cypress/e2e/role-lifecycle-active.cy.js` (novo)
- `cypress/e2e/people-units-relationships.cy.js`
- `cypress/e2e/role-lifecycle.cy.js`
- `docs/operations/postgresql-integration.md`
- `migrations/global/007_tenant_time_zone.sql` (novo — code review: fuso IANA do Condomínio)
- `migrations/global/README.md`
- `migrations/tenant/006_role_lifecycle.sql` (novo)
- `migrations/tenant/README.md`
- `packages/adapters/src/db/postgres-identity-repository.ts`
- `packages/adapters/src/db/postgres-invitation-repository.ts`
- `packages/adapters/src/db/postgres-provisioning-repository.ts`
- `packages/adapters/src/db/postgres-role-assignment-repository.ts` (novo)
- `packages/adapters/src/db/postgres-role-notification-outbox.ts` (novo)
- `packages/adapters/src/db/postgres-tenant-migrator.ts`
- `packages/adapters/src/db/postgres-verification-repository.ts`
- `packages/adapters/src/index.ts`
- `packages/api-client/src/provisioning.ts` (regenerado)
- `packages/application/src/authorization/roles.ts` (novo)
- `packages/application/src/index.ts`
- `packages/application/src/tenancy/tenancy.ts`
- `package.json`
- `scripts/generate-api-client.mjs`
- `scripts/run-postgres-integration.mjs` (novo)
- `scripts/run-postgres-integration.ps1`
- `tests/api-roles-active.test.ts` (novo)
- `tests/api-roles.test.ts`
- `tests/invitations.test.ts`
- `tests/migrations-roles-contract.test.ts` (novo)
- `tests/people-units.test.ts`
- `tests/postgres-integration.test.ts`
- `tests/postgres-roles-integration.test.ts` (novo)
- `tests/roles.test.ts` (novo)
- `tests/tenancy.test.ts`

## Change Log

- 2026-08-10: auditoria final corrigiu múltiplos Papéis em uma membership e reautorização PostgreSQL; os 25 ATDD são testes ativos explícitos e a Story foi movida para review.

- 2026-08-10: implementação funcional da Story 1.8 iniciada.
- 2026-08-10: gate PostgreSQL real corrigido e aprovado (12/12); runner canônico e documentação operacional adicionados para impedir falso sucesso por testes `skipped`.
- 2026-08-10: materialização temporal transacional corrigida; gate PostgreSQL ampliado para 13/13 e regressão completa aprovada.
- 2026-08-10: 25 cenários ATDD antes ignorados ativados e aprovados; suíte E2E completa aprovada com 53/53 cenários.
- 2026-08-13: code review corrigiu 23 patches (RFC 9457 real, catálogo/scope unificados, cliente de API completo, RolesPanel migrado para `@burgoweb/api-client`, fuso IANA do Condomínio com validação real de ambiguidade, idempotência de concessão, materialize por tenant, testes reais de `validateRoleDraft`/`GrantRoleAssignment`/`ChangeRole` e de migração contra PostgreSQL real, entre outros) e resolveu 3 decisões bloqueantes; `npm run check:types`, `npm test` (178 aprovados), `npm run test:integration:local` (14/14), `npm run check:api-contract`, `npm run build` e `npm run test:e2e` (53/53) aprovados após as correções.
