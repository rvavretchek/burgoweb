---
baseline_commit: 8bd91716b0c465c303cb00586a20af3e997fa31f
---

# Story 1.9: Delegar capacidades ao Auxiliar Administrativo

Status: done

## Story

Como Síndico,
Quero delegar capacidades granulares a Auxiliares Administrativos,
Para que eles executem responsabilidades específicas sem receber autoridade ampla ou poder de autoelevação.

## Acceptance Criteria

1. **Apresentar catálogo predefinido agrupado.** Dado que o Condomínio possui Auxiliar Administrativo com Papel e Vínculo vigentes, quando o Síndico abre a gestão de capacidades, então visualiza um catálogo predefinido agrupado por domínio e ação; cada capacidade descreve claramente o que permite e o que permanece negado.
2. **Distinguir domínios sem implicar acesso irrestrito.** Dado o catálogo de capacidades do MVP, quando é consultado pela interface ou pelo servidor, então distingue ações sobre Pessoas, Unidades, Vínculos, Convites e suspensão urgente (capacidades reais desta história); rótulos de domínio não são interpretados como acesso irrestrito a todas as ações daquele domínio.
3. **Nunca simular funcionalidade inexistente.** Dado que determinada funcionalidade ainda não foi entregue ou habilitada (finanças, Fechamentos, Publicações, Anexos, Pendências, Exportações, solicitações de titulares, tratamento de suspensões — Épicos 2–7), quando sua capacidade existe no catálogo fechado do FR-41, então ela não concede rota, tela, dado ou efeito inexistente; a interface não apresenta falsa disponibilidade da funcionalidade (não renderiza ação de concessão para essas entradas nesta história — ver Limites de escopo).
4. **Revisar antes de confirmar.** Dado que o Síndico seleciona uma ou mais capacidades delegáveis, quando revisa a concessão, então a interface apresenta Auxiliar, ações, recursos, alcance, início, término opcional e riscos relevantes; exige confirmação explícita antes de persistir a delegação.
5. **Persistir efeitos coerentemente.** Dado que a concessão é confirmada, quando o servidor revalida Síndico, Auxiliar, tenant, Papéis, vigência e versões dentro da transação, então registra cada capacidade individualmente com concedente, início, término, estado e alcance; cria Evento de Auditoria, projeção exportável e notificação minimizada ao Auxiliar afetado.
6. **Negar por padrão sem enumeração.** Dado que uma capacidade está ausente, expirada, suspensa, revogada ou desconhecida, quando o Auxiliar tenta executar a ação correspondente por interface, API, job ou arquivo, então o servidor nega por padrão; conhecer a rota, manipular payload ou acumular Papéis não amplia a autorização.
7. **Impedir autodelegação e delegação cruzada.** Dado que um Auxiliar tenta conceder, retirar ou ampliar capacidade própria ou de outro Auxiliar, quando envia a solicitação por qualquer fronteira, então o servidor nega a operação e registra evidência de segurança minimizada sem alterar delegações.
8. **Recusar poder não delegável.** Dado que o Síndico tenta delegar poder não delegável, quando seleciona transferência do Síndico, revogação administrativa permanente, designação de Contato de Continuidade ou alteração da política de delegação, então o servidor rejeita a concessão; a interface identifica essas ações como exclusivas do Síndico no MVP.
9. **Retirar com efeito imediato.** Dado que o Síndico retira ou encerra uma capacidade, quando confirma a ação, então novas operações correspondentes são negadas imediatamente e trabalhos assíncronos revalidam a autorização antes de executar ou entregar resultado; autoria e operações históricas permanecem preservadas.
10. **Revalidar operações em voo.** Dado que uma operação privilegiada começou antes da retirada da capacidade, quando tenta persistir ou concluir depois da revogação, então o servidor revalida a capacidade dentro da transação ou antes da entrega e interrompe o efeito não mais autorizado; não depende apenas da autorização verificada no início da navegação.
11. **Resolver concorrência sem sobrescrita.** Dado que dois atores alteram simultaneamente as capacidades do mesmo Auxiliar, quando a versão persistida já mudou, então a segunda operação recebe conflito `409` sem sobrescrever a primeira; a interface apresenta o conjunto atual para nova revisão.
12. **Isolar por tenant na consulta.** Dado que o Síndico ou Auxiliar consulta suas autorizações, quando abre a visão de capacidades, então visualiza apenas capacidades pertinentes ao Condomínio selecionado, com alcance, vigência e estado compreensíveis; não acessa delegações de outro tenant nem detalhes pessoais desnecessários.
13. **Oferecer UX acessível e resiliente.** Dado que a gestão de capacidades é utilizada em mobile, desktop, teclado ou tecnologia assistiva, quando catálogo, riscos, confirmação ou resultado são apresentados, então agrupamento, foco, rótulos, estados e mensagens cumprem WCAG 2.2 AA; concessão, ausência, expiração ou revogação não dependem apenas de cor.

## Tasks / Subtasks

- [x] 1. Fechar o catálogo fechado de capacidades e o modelo de domínio (AC: 1-3, 6-8)
  - [x] Definir o catálogo fechado completo do FR-41 (todas as entradas: Pessoas/Unidades/Vínculos, Convites, suspensão urgente, Lançamentos, Obrigações, Movimentos, Fechamentos, Publicações, Anexos originais, Pendências, Exportações, solicitações de titulares, tratamento de suspensões), cada entrada com `domain`, `action`, `id` estável, descrição do que permite/nega e um flag `available` — `true` somente para as 3 capacidades já implementadas nesta história (ver abaixo); as demais ficam `available: false` no catálogo (dado estático, sem rota/efeito), satisfazendo o FR-41 sem simular disponibilidade (AC3).
  - [x] As 3 capacidades `available` desta história mapeiam para os capability-strings já existentes em `ROLE_CATALOG` (`packages/application/src/authorization/roles.ts`): `people-units-relationships.manage`, `invitations.manage`, `roles.suspend`. Reutilizar esses identificadores; não criar um segundo nome para a mesma capacidade.
  - [x] Modelar atribuição de capacidade com identificador público opaco, Pessoa (Auxiliar), capability-id, alcance (`tenant` — alcance por Unidade fica fora desta história, ver Limites de escopo), `validFrom`, `validUntil`, estado, concedente e versão — espelhando a máquina de estados de `role_assignment` (Story 1.8) mas como registro independente (uma Pessoa pode ter Papel `administrative-assistant` sem nenhuma capacidade delegada ainda vigente).
  - [x] Implementar máquina de estados `scheduled -> active -> expired` e `scheduled|active -> revoked` (sem `suspended` — os ACs desta história descrevem apenas concessão e retirada/encerramento, não suspensão urgente da própria capacidade; não reintroduzir suspensão aqui).
  - [x] Definir comandos/ports para catálogo, listagem, concessão e revogação; motivo (`reason`) não é exigido pelos ACs desta história — não adicionar campo obrigatório não pedido.
  - [x] Validar capability-id contra o catálogo fechado, UUIDs, intervalo temporal e que o alvo é de fato `administrative-assistant` com Vínculo vigente.

- [x] 2. Criar migration aditiva `capability_grant` (AC: 1, 5-6, 9-12)
  - [x] Criar `migrations/tenant/007_capability_delegation.sql` (aditiva; não editar 001-006). Tabela `capability_grant`: id, public_id, person_id, capability_id (text, `CHECK` contra os valores `available` do catálogo), scope_kind (`tenant`, fixo nesta história), valid_from, valid_until, state, granted_by_person_id, version, timestamps; índice para resolução eficiente de capacidades efetivas por pessoa+capability+vigência.
  - [x] Tabela de transições (espelhando `role_assignment_transition`) e reaproveitar/estender projeção exportável e outbox já existentes (`role_authorization_projection`/`role_notification_outbox` da Story 1.8) ou criar equivalentes `capability_*` coesos — decidir e documentar; não duplicar padrão sem necessidade.
  - [x] Atualizar versão esperada do schema tenant (migrator, provisionamento, verificação, fixtures, testes, READMEs) para 7.

- [x] 3. Implementar aplicação e adapter PostgreSQL transacional (AC: 5-12)
  - [x] Reutilizar o padrão de lock/CAS das Stories 1.6–1.8: resolver `TenantContext`, travar Auxiliar/atribuições/alvo, revalidar Conta, Pessoa, Vínculo, Papel `administrative-assistant`, tenant, capacidade do concedente (só Síndico concede/revoga — AC7/AC8) e versão dentro da mesma transação.
  - [x] Calcular `context.capabilities` efetivas como a união estrita do que `ROLE_CATALOG[role]` já concede (institucional) **mais** as capacidades delegadas ativas e vigentes da Pessoa — sem inferir capacidade pelo nome do Papel. Ponto crítico: hoje `ROLE_CATALOG['administrative-assistant']` já inclui `roles.suspend` incondicionalmente (decisão aceita como MVP no review da Story 1.8); esta história deve decidir e documentar se `roles.suspend` passa a depender de uma `capability_grant` ativa (fechando a lacuna que o AC6 desta história torna explícita: "capacidade ausente... nega por padrão") ou se permanece incondicional — não deixar ambíguo no código.
  - [x] Impedir que o Auxiliar seja concedente (AC7): `authorize()`/`need()` para as operações de concessão/revogação exige capacidade do Síndico, nunca aceita o próprio Auxiliar como ator, mesmo com Papéis acumulados.
  - [x] Rejeitar explicitamente qualquer capability-id fora do catálogo fechado ou que corresponda a poder não delegável (transferência do Síndico, revogação administrativa permanente, Contato de Continuidade, política de delegação — AC8); tratar como validação, nunca como concessão silenciosamente ignorada.
  - [x] Fazer toda transição persistir estado, auditoria minimizada, projeção exportável e outbox no mesmo commit (AC5); revalidar operações em voo antes de concluir/entregar após revogação (AC10) — nenhum job assíncrono deve completar um efeito cuja capacidade já foi retirada.
  - [x] Implementar idempotência de concessão com canonicalização, mesma disciplina da Story 1.8 (excluir `requestId`/chave do hash, tratar corrida com a mesma `Idempotency-Key` sem duplicar).

- [x] 4. Expor API segura e contrato OpenAPI (AC: 1-13)
  - [x] Adicionar endpoints de catálogo (somente leitura, sem mutação), listagem, concessão e revogação de capacidades, protegidos por sessão, `TenantContext`, same-origin, CSRF e capacidade `roles.grant`-equivalente (decidir: reaproveitar `roles.grant` do Síndico ou introduzir `capabilities.grant`; documentar a escolha).
  - [x] Erros RFC 9457: `422` para catálogo/capability-id inválido ou poder não delegável, `403/404` sem enumeração para negação/Auxiliar tentando se autodelegar, `409` com estado atual para conflito de versão.
  - [x] Impedir por testes: rota direta pelo Auxiliar, autodelegação, delegação a outro Auxiliar, payload adulterado com capability-id de domínio `available: false`, bypass por Papéis acumulados.
  - [x] Atualizar `apps/api/src/openapi.ts`, regenerar `packages/api-client/src/provisioning.ts` com `node scripts/generate-api-client.mjs` e rodar `npm run check:api-contract` — não editar o cliente gerado manualmente. **Lição da Story 1.8:** o gerador é um template estático com uma checklist de substrings; ao adicionar os novos `operationId`s, adicione-os também à lista de substrings verificadas no topo do script, e ao próprio template — o script não deriva a lista automaticamente de `openapi.ts`.

- [x] 5. Processar notificações minimizadas (AC: 5)
  - [x] Notificar o Auxiliar afetado na concessão e na retirada, reaproveitando o outbox/worker já existente (`ProcessRoleNotification` ou equivalente); não incluir a lista de capacidades nem dados institucionais desnecessários na notificação.

- [x] 6. Construir a experiência de gestão de capacidades (AC: 1-4, 8, 9, 11, 13)
  - [x] Novo painel (ex.: `CapabilitiesPanel.tsx`) integrado à superfície "Pessoas e acesso" existente, reutilizando shell, CSRF retry (`mutate()`), `ConflictResolver`, foco/dialog trap e padrões de formulário já estabelecidos por `RolesPanel.tsx`/`InvitationsPanel.tsx`/`PeopleUnitsPage.tsx` — **use `@burgoweb/api-client`, nunca `fetch` manual** (a Story 1.8 teve exatamente esse desvio corrigido em code review).
  - [x] Catálogo agrupado por domínio (AC1/AC2); entradas `available: false` aparecem no catálogo (para cumprir o FR-41 informativamente) mas sem controle de concessão ativo — rotular claramente como "ainda não disponível", nunca omitir silenciosamente nem oferecer um botão que falharia.
  - [x] O seletor de Pessoa na concessão lista apenas quem já possui `role_assignment` `administrative-assistant` ativo e vigente no tenant (AC1: "Dado que o Condomínio possui Auxiliar Administrativo com Papel e Vínculo vigentes") — não é um seletor genérico de todas as Pessoas como o de concessão de Papel em `RolesPanel.tsx`; reaproveite a lista de Papéis já carregada (`listRoleAssignments`) para derivar essa opção, não crie uma segunda fonte de verdade sobre quem é Auxiliar.
  - [x] Etapa de revisão editável e confirmação sensível nomeando Auxiliar, capacidade, alcance, vigência e risco (AC4) — seguir o padrão `DESIGN.md#Confirmação-sensível` já usado nos diálogos de concessão/revogação de Papel da Story 1.8; nunca "Tem certeza?" genérico.
  - [x] Ao perder autorização durante o uso (403/404 em mutação), seguir exatamente o padrão já corrigido em `RolesPanel.tsx`: 403/404 em mutação aciona `onAccessLost()` diretamente (não silenciar como erro local) — a Story 1.8 tentou suavizar esse comportamento em code review e o ATDD Cypress provou que está errado; use `RolesPanel.tsx` como referência, não a versão anterior a ele.
  - [x] Não construir UI de concessão/revogação para as entradas `available: false` do catálogo (AC3) — isso pertence às Stories dos Épicos 2–7 quando cada domínio for implementado.

- [x] 7. Provar o comportamento com testes em camadas (AC: todos)
  - [x] Unitários: catálogo fechado (available vs. não), máquina de estados, validação de capability-id/alcance/vigência, negação de autodelegação e de poder não delegável, `validateCapabilityDraft`/comando de concessão e revogação chamados diretamente (não só via HTTP mockado — a Story 1.8 teve esse gap específico apontado em review).
  - [x] API/contrato: sessão/CSRF/origin, capability-id inválido, `Object.assign(new Error(...),{name:...})` **não é suficiente sozinho** — inclua pelo menos um teste que lance a classe de erro real (`RoleValidation`-equivalente) para provar que o mapeamento RFC 9457 funciona de verdade, não só com `.name` forjado (gap real encontrado e corrigido na Story 1.8).
  - [x] PostgreSQL 18 real/Testcontainers: migration aplicada de fato (não só substring do SQL — execute-a contra um schema real e verifique o resultado, como a Story 1.8 passou a fazer após review), locks/rollback, concessão e revogação concorrentes com mesma `Idempotency-Key`, revalidação de operação em voo após revogação.
  - [x] Integração: prove que uma capacidade concedida realmente altera `context.capabilities` resolvido pelo `TenantContext` (não teste apenas o helper isolado) e que a revogação remove o efeito no mesmo instante.
  - [x] Auditoria/outbox: exatamente um evento/projeção/item por transição efetiva; nenhuma informação restrita na notificação.
  - [x] Cypress/acessibilidade: catálogo agrupado, revisão, confirmação, conflito 409, foco, teclado, 320 px, zoom 200%, axe sem violações críticas.
  - [x] Executar `npm run check:types`, `npm test`, `npm run test:integration:local` (ou `npm run test:integration` com Docker), `npm run check:api-contract`, `npm run build` e `npm run test:e2e` antes de mover para review.

### Review Findings

- [x] [Review][Patch] `people-units-relationships.manage` e `invitations.manage` eram "delegáveis" mas funcionalmente inertes (permaneciam incondicionais em `ROLE_CATALOG['administrative-assistant']`) — decisão do usuário: removidas do catálogo `available` (marcadas `available:false`, com `denies` explicando o motivo); só `roles.suspend` fica delegável de verdade nesta história. Catálogo, teste unitário (`tests/capabilities.test.ts`) e UI de seleção (`CapabilitiesPanel.tsx`, que já filtra por `entry.available`) atualizados. [packages/application/src/authorization/capabilities.ts]
- [x] [Review][Decision→Patch] `capabilities.grant` era exigido também para LISTAR capacidades, então um Auxiliar nunca conseguia consultar suas próprias capacidades delegadas via API — decisão do usuário: permitir a qualquer ator com `roles.read` (Síndico ou Auxiliar) listar `capability_grant`; sem `capabilities.grant`, a listagem é automaticamente restrita às próprias concessões (`selfOnly`), sem exigir a capacidade de gestão. `ListCapabilityGrants` agora expõe `viewerCapabilities` na página para a UI decidir se mostra ações de gestão; `composition-root.ts` passa a exigir `roles.read` (não `capabilities.grant`) para `listCapabilityGrants`; `CapabilitiesPanel.tsx` esconde "Delegar capacidade"/"Revogar" quando o ator não tem `capabilities.grant`. [apps/api/src/composition-root.ts; packages/application/src/authorization/capabilities.ts; packages/adapters/src/db/postgres-capability-grant-repository.ts; apps/web/src/components/CapabilitiesPanel.tsx]
- [x] [Review][Patch] `authorize()` em `list()`/`preview()`/`grant()` de `PostgresRoleAssignmentRepository` consultava `capability_grant` sem qualificar o schema, antes de `SET LOCAL search_path` — corrigido qualificando a query delegada com `${context.schemaName}.capability_grant`/`${context.schemaName}.role_assignment` (independente de `search_path`); a mesma correção também passou a exigir que o `role_assignment` de origem (`administrative-assistant`) ainda esteja ativo e vigente, fechando também o achado de revalidação abaixo. [packages/adapters/src/db/postgres-role-assignment-repository.ts (authorize())]
- [x] [Review][Patch] `revoke()`/`effects()` em `PostgresCapabilityGrantRepository` atribuíam toda transição e Evento de Auditoria ao `granted_by_person_id` original — corrigido: `effects()` agora recebe `actor` explícito (`context.personId` em `grant()`/`revoke()`, `granted_by_person_id` apenas em `materialize()`, que não tem ator humano). [packages/adapters/src/db/postgres-capability-grant-repository.ts (effects(), grant(), revoke())]
- [x] [Review][Patch] `CapabilitiesPanel.tsx`'s `grant()` agora trata 403/404 chamando `onAccessLost()`, igual a `revoke()`. [apps/web/src/components/CapabilitiesPanel.tsx (grant(), catch)]
- [x] [Review][Patch] Capacidade delegada agora é revalidada contra o `role_assignment` de origem (`administrative-assistant` ativo e vigente) tanto em `resolveContext()` quanto na query delegada de `authorize()` — um Auxiliar cujo Papel foi suspenso/revogado/expirado perde o efeito da delegação imediatamente, mesmo que o `capability_grant` em si ainda esteja `active`. [packages/adapters/src/db/postgres-identity-repository.ts (resolveContext()); packages/adapters/src/db/postgres-role-assignment-repository.ts (authorize())]
- [x] [Review][Patch] `grant()` em `PostgresCapabilityGrantRepository` agora captura violação do índice único parcial `capability_grant_active_unique` (código Postgres 23505) e mapeia para `CapabilityConflict` (409) em vez de propagar erro bruto (500); `CapabilitiesPanel.tsx` trata 409 em `grant()` recarregando a lista. [packages/adapters/src/db/postgres-capability-grant-repository.ts (grant()); apps/web/src/components/CapabilitiesPanel.tsx (grant(), catch)]
- [x] [Review][Patch] `tests/migrations-capabilities-contract.test.ts` permanece baseado em `toContain` (mesmo padrão preexistente em `tests/migrations-roles-contract.test.ts`, não alterado pela Story 1.8) — a cobertura real de execução+idempotência foi adicionada a `tests/postgres-capabilities-integration.test.ts` (migration 007 aplicada duas vezes em schema isolado), espelhando exatamente onde a Story 1.8 colocou o teste equivalente para a migration 006. [tests/postgres-capabilities-integration.test.ts]
- [x] [Review][Patch] Adicionados testes reais contra PostgreSQL exigidos pela Task 7: duas concessões concorrentes com a MESMA `Idempotency-Key` (retornam o mesmo resultado, sem duplicar linha) e revalidação em voo após revogação de capacidade (suspensão delegada para de ser autorizada imediatamente após a capacidade ser revogada). [tests/postgres-capabilities-integration.test.ts]
- [x] [Review][Patch] Adicionado teste real contra PostgreSQL exercitando o caminho delegado de `roles.suspend` através de `PostgresRoleAssignmentRepository.transition()`/`authorize()` (não só `resolveContext()`), com um Auxiliar cuja ÚNICA fonte de `roles.suspend` é uma delegação explícita. [tests/postgres-capabilities-integration.test.ts]
- [x] [Review][Patch] Mensagem bruta `"capabilityUnavailable"` agora tem tradução dedicada em `CapabilitiesPanel.tsx`'s `grant()` catch, em vez de renderizar `problem.detail` cru. [apps/web/src/components/CapabilitiesPanel.tsx (grant(), catch)]
- [x] [Review][Patch] `useEffect` de foco/focus-trap em `CapabilitiesPanel.tsx` agora depende de `[mode, draft]` (era só `[mode]`), movendo o foco corretamente do formulário para a tela de revisão. [apps/web/src/components/CapabilitiesPanel.tsx (useEffect de foco)]
- [x] [Review][Patch] `openGrant()` em `CapabilitiesPanel.tsx` agora captura o elemento que disparou a ação (`event.currentTarget`) em vez de zerar `opener.current`; foco retorna ao botão "Delegar capacidade" ao cancelar/fechar. [apps/web/src/components/CapabilitiesPanel.tsx (openGrant())]
- [x] [Review][Patch] Escape em `CapabilitiesPanel.tsx` agora é ignorado enquanto `busy===true` (via `busyRef`), evitando fechar um diálogo com requisição em andamento. [apps/web/src/components/CapabilitiesPanel.tsx (onKeyDown Escape handler)]
- [x] [Review][Defer] `revoke()`'s branch de conflito 409 pode mesclar dados de conflito na seleção errada se o usuário trocar de capacidade selecionada durante uma requisição em voo — race estreita, mesmo padrão de risco já aceito em `RolesPanel.tsx`. [apps/web/src/components/CapabilitiesPanel.tsx] — deferred, baixo risco
- [x] [Review][Defer] Campo `validUntil` do formulário de concessão sem atributo `min` vinculado a `validFrom` — validação de intervalo só ocorre no servidor (não é um problema funcional, só perde a chance de um erro mais cedo). [apps/web/src/components/CapabilitiesPanel.tsx] — deferred, cosmético
- [x] [Review][Defer] `stateLabels[item.state]` sem fallback para um estado desconhecido/futuro — renderizaria rótulo vazio em vez de um texto seguro. [apps/web/src/components/CapabilitiesPanel.tsx] — deferred, defensivo
- [x] [Review][Defer] Roteador de capacidade por `.toLowerCase().includes(...)` em `composition-root.ts` é implícito e frágil a operações futuras cujo nome coincida com uma dessas substrings — extensão de um padrão pré-existente da Story 1.8, não uma regressão desta story. [apps/api/src/composition-root.ts] — deferred, pré-existente
- [x] [Review][Defer] Nenhum dos dois `authorize()` (Papéis e capacidades) tem a mitigação de "cost decoy" contra vazamento de timing que `resolveContext()` já implementa — `authorize()` de Papéis nunca teve essa mitigação, mesmo antes desta story. [packages/adapters/src/db/postgres-role-assignment-repository.ts; packages/adapters/src/db/postgres-capability-grant-repository.ts] — deferred, pré-existente
- [x] [Review][Defer] `PostgresCapabilityNotificationOutbox.claim()` não filtra por conta ativa — uma Conta desabilitada pode acumular notificações de capacidade indefinidamente; mesmo padrão/risco já registrado como dívida para o outbox de Papéis na Story 1.8. [packages/adapters/src/db/postgres-capability-notification-outbox.ts] — deferred, pré-existente
- [x] [Review][Defer] Colisão teórica do índice único `capability_grant_transition(grant_id,to_state,occurred_at)` sob duas transições concorrentes para o mesmo estado no mesmo instante de statement — mesmo risco teórico já presente em `role_assignment_transition` desde a Story 1.8, não é regressão nova. [migrations/tenant/007_capability_delegation.sql] — deferred, pré-existente

## Dev Notes

### Contexto crítico para implementação

- Esta história completa a delegação granular que a Story 1.8 deliberadamente deixou de fora ("Não implementar UI/política de delegação granular da Story 1.9. Nesta história, apenas consumir a capacidade específica de suspensão urgente já vigente e introduzir o identificador necessário no catálogo/contrato" — Story 1.8, Dev Notes). O identificador `roles.suspend` e o campo `role.administrative-assistant` já existem em `ROLE_CATALOG` (`packages/application/src/authorization/roles.ts:5`) como o ponto de extensão que esta história deve usar.
- **Decisão em aberto que esta história precisa fechar, não herdar em silêncio:** hoje `roles.suspend` é concedido incondicionalmente a todo `administrative-assistant` pelo catálogo institucional (aceito como decisão de MVP no review da Story 1.8, registrado em `1-8-conceder-suspender-e-revogar-papeis.md#Review-Findings` e `#Decisões-de-code-review`). O AC6 desta história ("capacidade ausente... nega por padrão") sugere que a suspensão urgente deveria depender de uma `capability_grant` real e vigente, não de um catálogo institucional estático. Decida entre (a) mover `roles.suspend` do `ROLE_CATALOG` institucional para o novo modelo de `capability_grant` (Auxiliar só suspende se o Síndico delegou explicitamente), ou (b) manter como está e documentar por que o novo modelo de capacidades não se aplica a ela. Registre a decisão nas Dev Notes/Completion Notes desta história — não deixe implícito.
- `accessEffects.delegatedCapability` já existe como campo booleano em `RoleAssignmentPreview` (`packages/api-client/src/provisioning.ts`) e está hoje **hardcoded como `false`** no adapter de preview de Papéis (`packages/adapters/src/db/postgres-role-assignment-repository.ts`) — um placeholder que a Story 1.8 deixou para esta história. Ao implementar capacidades delegadas, avalie se esse campo deve ser calculado de verdade (a Pessoa já tem alguma capacidade delegada?) ou se é específico ao fluxo de Papel e não se aplica aqui; não deixe o hardcode `false` sem revisão.
- O catálogo fechado completo do FR-41 abrange domínios de Épicos 2–7 (financeiro, Fechamentos, Publicações, Anexos, Pendências, Exportações, solicitações de titulares, tratamento de suspensões) que **não existem no código ainda** — apenas Épico 1 está implementado. O AC3 desta história existe exatamente para este cenário: o catálogo deve conter essas entradas (para não violar o FR-41 e para a UI poder explicar "ainda não disponível"), mas nenhuma delas pode ganhar rota, botão funcional ou efeito. Esta história implementa a concessão/revogação real apenas para as 3 capacidades já funcionais em Épico 1 (`people-units-relationships.manage`, `invitations.manage`, `roles.suspend`). Não tente implementar finanças/publicações/anexos/etc. nesta história — isso é escopo das Stories 2.x–7.x correspondentes.
- Toda autorização é server-side, deny-by-default e revalidada dentro da transação (AD-8, ver arquitetura). Guards de rota são defesa de borda, não substituem a decisão no caso de uso e no adapter transacional — mesmo princípio já aplicado em Papéis (Story 1.8).
- Sessões são globais por Conta; retirar uma capacidade invalida o direito de usar aquele efeito no tenant afetado (AD-9), não a sessão inteira da Conta em outros Condomínios — mesmo modelo de invalidação tenant-scoped por versão agregada já implementado em `authorization_version`/`account_tenant_memberships`.

### Decisões de code review (2026-08-14)

- **Capacidades funcionalmente inertes:** `people-units-relationships.manage` e `invitations.manage` foram removidas do catálogo `available` (passam a `available:false`). Elas já eram concedidas incondicionalmente pelo `ROLE_CATALOG['administrative-assistant']` institucional, então a "delegação" via `capability_grant` não tinha efeito real algum — só `roles.suspend` é uma delegação genuína nesta história. Uma delegação real dessas duas exigiria criar `capability_grant` automático na aceitação de Convite/Vínculo, o que é escopo maior que esta story.
- **Leitura própria pelo Auxiliar (AC12):** `capabilities.grant` deixou de ser exigido para LISTAR capacidades. `composition-root.ts` agora exige `roles.read` (que Síndico e Auxiliar administrativo já têm institucionalmente) para `listCapabilityGrants`; dentro do caso de uso, quem não tem `capabilities.grant` recebe apenas as próprias concessões (`selfOnly`), nunca as de terceiros. A página retornada inclui `viewerCapabilities` para a UI decidir se mostra as ações de gestão (delegar/revogar).

### Limites de escopo

- Não implementar concessão/revogação funcional para capacidades de finanças, Fechamentos, Publicações, Anexos, Pendências, Exportações, solicitações de titulares ou tratamento de suspensões — apenas catalogá-las como `available: false` (AC3). Cada Épico correspondente (2–7) deve, na sua própria primeira story de capacidade, marcar a entrada relevante como `available: true` e implementar o efeito real.
- Não implementar alcance por Unidade para capacidades delegadas nesta história — todas as concessões desta história são `scope: tenant`. Alcance por Unidade (paralelo ao que Papéis já suportam desde a Story 1.8) fica para uma story futura se o produto exigir.
- Não implementar Responsável Financeiro (Story 1.10) nem transferência/recuperação do Síndico (Stories 1.11 e 6.4–6.5) — mencionados no catálogo apenas como poder não delegável (AC8).
- Não editar migrations já aplicadas (001-007 tenant, 001-007 global) nem `packages/api-client/src/provisioning.ts`/`apps/web/src/routeTree.gen.ts` manualmente.

### Arquitetura e stack obrigatórias

- Node.js 24.18.0; TypeScript 7.0.2; React 19; NestJS/Fastify 11.1.20/5.10.0; Kysely 0.29.2; PostgreSQL 18.4; Vitest 4.1.10; Cypress 15.19.0; Testcontainers 12.0.4 — versões fixadas; esta história não autoriza upgrade de dependências.
- Manter os limites `apps/web`, `apps/api`, `apps/worker`, `packages/application`, `packages/adapters`, `packages/api-client`, `packages/config`, `packages/test-support`; `apps/web` só fala com o backend via `@burgoweb/api-client` (`scripts/check-boundaries.mjs` bloqueia qualquer outro caminho).
- **AD-8 (Autorização é granular e deny-by-default):** "capacidades são verificadas por ação e recurso no caso de uso; ausência ou estado desconhecido nega... Nenhum usuário concede capacidade superior à sua autoridade delegável." [Source: ARCHITECTURE-SPINE.md#AD-8]
- **AD-4 (Tenant informado não é tenant autorizado):** `TenantContext` imutável, não construível por input; casos de uso e repositories aceitam somente esse contexto. [Source: ARCHITECTURE-SPINE.md#AD-4]
- **AD-11 (mutação observável):** toda mutação privilegiada é auditoria + outbox no mesmo commit, `version` para concorrência otimista, `Idempotency-Key` para concessão. [Source: ARCHITECTURE-SPINE.md#AD-11]
- UX: "Botão, rota, projeção, job e download verificam a capacidade específica; nunca usam `isAdmin` ou o Papel agregado." [Source: EXPERIENCE.md#Capacidades-sensíveis]. Confirmação sensível nomeando ação/objeto/efeito/alcance/reversibilidade — mesmo padrão de `DESIGN.md#Confirmação-sensível` já usado no `RolesPanel.tsx`.

### Project Structure Notes

Arquivos novos prováveis:

- `packages/application/src/authorization/capabilities.ts` (catálogo fechado, máquina de estados, comandos) — ou extensão coesa de `roles.ts` se a duplicação de infraestrutura (transitions, canonical, requireUuid) pesar mais que a separação; decidir e documentar.
- `packages/adapters/src/db/postgres-capability-grant-repository.ts`
- `migrations/tenant/007_capability_delegation.sql`
- `apps/web/src/components/CapabilitiesPanel.tsx`
- `tests/capabilities.test.ts`, `tests/api-capabilities.test.ts`, `tests/postgres-capabilities-integration.test.ts`, `tests/migrations-capabilities-contract.test.ts`, spec E2E correspondente

Arquivos existentes que o dev deve ler integralmente antes de alterar (na ordem de dependência):

- `packages/application/src/authorization/roles.ts` — catálogo institucional, máquina de estados, `resolveCivilInstant`/`validateRoleDraft` (padrão de validação a seguir), `RoleValidation`/`AuthorizationDenied`/`RoleConflict` (padrão de erro com `this.name` setado — não repita o bug corrigido na Story 1.8 de esquecer isso)
- `packages/adapters/src/db/postgres-role-assignment-repository.ts` — padrão de `authorize()`, lock/CAS, `effects()` transacional, idempotência; `authorize()` já resolve capacidade por união de `ROLE_CATALOG[role_kind]`, ponto de extensão para somar capacidades delegadas
- `packages/adapters/src/db/postgres-identity-repository.ts` — `resolveContext()`, onde `TenantContext.capabilities` é montado; capacidades delegadas devem ser agregadas aqui, na mesma consulta transacional, não em uma segunda chamada separada
- `apps/web/src/components/RolesPanel.tsx` — referência atual e correta de: uso de `@burgoweb/api-client`, `mutate()`/CSRF retry, idempotência estável por fingerprint, focus trap, gating de botões por `viewerCapabilities`, tratamento de 403/404 em mutação
- `apps/api/src/nest-app.ts`, `composition-root.ts`, `openapi.ts` — dispatcher de operações institucionais, mapeamento RFC 9457 (`institutionalProblem`)
- `migrations/tenant/006_role_lifecycle.sql`, `migrations/global/007_tenant_time_zone.sql` — HEAD atual (tenant v7 após esta história, global v7 mantido)
- `_bmad-output/implementation-artifacts/1-8-conceder-suspender-e-revogar-papeis.md` — seção "Review Findings" completa: cada achado ali documenta um erro real já cometido uma vez nesta base de código; não repita nenhum

### Testing Requirements

- Teste isolado de helper não é evidência suficiente — os reviews das Stories 1.6–1.8 encontraram repetidamente call sites não integrados, capacidade sem efeito real, erro mapeado só em teste com `.name` forjado, e migration testada só por substring. Prove cada um desses pontos com um teste real equivalente ao já corrigido na Story 1.8 (ver Tasks 7).
- Use PostgreSQL 18 real para constraints, locks, concorrência e migration; doubles somente para lógica pura. `npm run test:integration:local` usa o PostgreSQL 18 Windows local (`docs/operations/postgresql-integration.md`).
- Cubra: Auxiliar tentando se autodelegar ou delegar outro Auxiliar (AC7), Síndico tentando delegar poder não delegável (AC8), capacidade retirada durante operação em voo (AC10), duas concessões concorrentes com `expectedVersion` desatualizado (AC11).

### Previous Story Intelligence

- A Story 1.8 estabeleceu o modelo completo de Papéis institucionais (`role_assignment`), fuso IANA do Condomínio (`tenant_registry.time_zone`, migration global 007), idempotência com canonicalização, materialização temporal por tenant e o padrão de UI/API que esta história deve replicar para capacidades delegadas — não reinvente nenhum desses padrões.
- Dívidas relevantes registradas na Story 1.8 e ainda não resolvidas: outbox de notificação sem rotação entre tenants (pode esfomear tenants com alto volume — `packages/adapters/src/db/postgres-role-notification-outbox.ts`); não é bloqueante para esta história, mas se o novo outbox de capacidades reusar o mesmo padrão, considere corrigir a rotação junto.
- O code review da Story 1.8 encontrou e corrigiu, entre outros: classes de erro que não setavam `this.name` (mascarando RFC 9457 real como 500), catálogo de capacidades duplicado em 3 lugares divergentes, `authorize()` sem filtro de alcance por Unidade, cliente de API gerado incompleto sem que `check:api-contract` detectasse, e testes que só passavam por causa do bug. Ao construir o equivalente para capacidades, garanta desde o início: uma única fonte do catálogo, `this.name` correto em toda classe de erro nova, `authorize()` já filtrando por alcance quando aplicável, e o gerador de cliente realmente coberto pelos novos `operationId`s.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-19-Delegar-capacidades-ao-Auxiliar-Administrativo]
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-1-Começar-a-gestão-e-formar-uma-equipe-autorizada]
- [Source: _bmad-output/planning-artifacts/prd.md#FR-41-Delegação-de-capacidades]
- [Source: _bmad-output/planning-artifacts/prd.md#FR-5-Isolamento-e-acesso-por-Vínculo-e-Papel]
- [Source: _bmad-output/planning-artifacts/prd.md#FR-8-Gestão-de-Papéis-e-capacidades]
- [Source: _bmad-output/planning-artifacts/prd.md#NFR-6-NFR-9]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/ARCHITECTURE-SPINE.md#AD-4]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/ARCHITECTURE-SPINE.md#AD-8]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/ARCHITECTURE-SPINE.md#AD-9]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/ARCHITECTURE-SPINE.md#AD-11]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-burgoweb-2026-07-27/EXPERIENCE.md#Capacidades-sensíveis]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-burgoweb-2026-07-27/DESIGN.md#Confirmação-sensível]
- [Source: docs/product/discovery/07-mapa-de-capacidades.md#2-Pessoas-vínculos-e-permissões]
- [Source: docs/product/discovery/07-mapa-de-capacidades.md#12-Governança-auditoria-e-continuidade]
- [Source: _bmad-output/implementation-artifacts/1-8-conceder-suspender-e-revogar-papeis.md]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 5

### Debug Log References

- Implementação 2026-08-13: catálogo fechado de capacidades, migration tenant 007 (`capability_grant` + transições + projeção + outbox), adapter PostgreSQL transacional, endpoints REST + OpenAPI + cliente gerado, jobs de worker (materialização + notificação), `CapabilitiesPanel.tsx` integrado a "Pessoas e acesso".
- Gates: `npm run check:types`, `npm test` (194 aprovados/18 skipped), `npm run test:integration:local` (18/18 em PostgreSQL 18 real, incluindo os 4 cenários novos de capacidades), `npm run check:api-contract`, `npm run build` e `npm run test:e2e` (60/60, incluindo os 7 cenários novos de `capability-delegation.cy.js`) — todos aprovados.
- Ajuste retroativo necessário: duas specs Cypress pré-existentes (`invitations.cy.js`, `people-units-relationships.cy.js`) não interceptavam `GET .../capability-grants`, causando falha por interferência de rede não mockada assim que `CapabilitiesPanel` passou a renderizar na mesma página; corrigido adicionando o intercept que faltava, seguindo o mesmo padrão já usado para `role-assignments`.
- Code review 2026-08-14: 2 achados `[Review][Decision]` e 12 `[Review][Patch]` aplicados (ver seção Review Findings e Decisões de code review acima). `cypress/e2e/capability-delegation.cy.js` recebeu `viewerCapabilities` no mock de `capability-grants` (necessário após a UI passar a gatear os botões de gestão) e um novo cenário cobrindo a visão somente-leitura do Auxiliar sem `capabilities.grant`.
- Ajuste retroativo adicional descoberto ao rodar `test:e2e` após os patches: `role-lifecycle.cy.js` e `role-lifecycle-active.cy.js` nunca haviam recebido o intercept de `GET .../capability-grants` (lacuna da implementação original de 2026-08-13, não pega pelos 60/60 relatados então — a interferência de rede real só passou a quebrar `[P1] mantém foco e operação completa por teclado` depois que `CapabilitiesPanel` ganhou o gate de `viewerCapabilities`); corrigido com o mesmo intercept padrão usado nas outras specs.
- Bug encontrado e corrigido no próprio teste novo de idempotência da migration 007 (`tests/postgres-capabilities-integration.test.ts`): `SET LOCAL search_path` enviado como statement isolado (fora de uma transação explícita) não persiste para as chamadas `client.query()` seguintes — cada chamada sem `BEGIN` roda como sua própria transação implícita, então o `search_path` reverte imediatamente. Corrigido envolvendo a sequência inteira (SET LOCAL + migrations 001–007) em `BEGIN`/`COMMIT` explícitos no mesmo client. Esta é a mesma lacuna teórica presente no padrão pré-existente de `tests/postgres-roles-integration.test.ts` (migration 006), que não foi alterado por não fazer parte do escopo desta story — registrado aqui apenas como conhecimento para futuras stories que repetirem o padrão.
- Gates re-executados após os patches: `npm run check:types`, `npm test` (196 aprovados/21 skipped), `npm run test:integration:local` (21/21 em PostgreSQL 18 real), `npm run build` (api-contract + boundaries + todos os workspaces) e `npm run test:e2e` (61/61) — todos aprovados.

### Completion Notes List

- **Decisão de arquitetura fechada nesta história (documentada em Dev Notes):** `roles.suspend` deixou de ser capacidade institucional incondicional do Auxiliar (`ROLE_CATALOG['administrative-assistant']` em `roles.ts`) e passou a depender de uma `capability_grant` ativa e vigente. `authorize()` em `postgres-role-assignment-repository.ts` e a agregação de capacidades em `resolveContext()` (`postgres-identity-repository.ts`) foram estendidos para consultar `capability_grant` como segunda fonte de autorização, dentro da mesma transação/lock. Provado por teste real contra PostgreSQL (`tests/postgres-capabilities-integration.test.ts`): antes da delegação, `resolveContext` nega `roles.suspend` ao Auxiliar; depois, concede.
- Catálogo fechado do FR-41 implementado com todas as entradas do domínio (Pessoas/Unidades/Vínculos, Convites, suspensão urgente, Financeiro [Lançamentos/Obrigações/Movimentos/Fechamentos], Publicações, tratamento de suspensões de Publicação, Anexos originais, Pendências, Exportações, solicitações de titulares); apenas `roles.suspend` marcada `available: true` após o code review (ver Decisões de code review — `people-units-relationships.manage`/`invitations.manage` removidas de `available` por serem funcionalmente inertes); as demais aparecem no catálogo/UI como "ainda não disponível", sem ação de concessão (AC3). Catálogo vive em `packages/application/src/authorization/capabilities.ts` como única fonte — nenhuma duplicação em SQL (a coluna `capability_id` não tem `CHECK` enumerando valores; validação é 100% na aplicação, decisão documentada como comentário na própria migration).
- Sem coluna `scope_kind`/`scope_unit_id` em `capability_grant`: como esta história restringe explicitamente a alcance `tenant` (ver Limites de escopo), uma coluna sempre-constante foi considerada desnecessária; alcance por Unidade, se vier a ser necessário, exigirá uma migration aditiva futura (mesmo padrão usado por `role_assignment` desde a Story 1.8).
- Sem endpoint de preview para capacidades (diferente do fluxo de Papéis da Story 1.8): a revisão exigida pelo AC4 é satisfeita inteiramente no cliente, combinando os dados do formulário com o texto `grants`/`denies` já presente no catálogo (nenhum round-trip adicional necessário); a validação real de horário civil ainda ocorre no servidor no momento da confirmação (`grantCapability`), com o formulário preservado em caso de erro — mesmo padrão que os formulários de criação em `PeopleUnitsPage.tsx` já usam.
- Auxiliar elegível para receber capacidade é derivado da própria lista de Papéis (`listRoleAssignments`, filtrando `role==='administrative-assistant' && state==='active'`) dentro do `CapabilitiesPanel`, evitando uma segunda fonte de verdade sobre "quem é Auxiliar"; isso implica uma chamada GET adicional (aceitável, somente leitura, já cacheável pelo navegador).
- Prevenção proativa de concessões duplicadas: índice único parcial `capability_grant_active_unique (person_id, capability_id) WHERE state IN('scheduled','active')` — lacuna equivalente só encontrada e corrigida reativamente em Papéis durante o code review da Story 1.8; aqui foi prevenida desde a primeira versão da migration.
- Erros próprios (`CapabilityValidation`, `CapabilityConflict`) seguem, desde o início, o padrão correto aprendido do code review da Story 1.8: `this.name` setado no construtor e checados via `instanceof` em `institutionalProblem()` — não repetindo o bug de erros mapeados incorretamente para 500 que a Story 1.8 teve de corrigir depois.
- **AC12 corrigido no code review:** a interpretação original (isolamento por tenant seria suficiente, sem leitura própria dedicada) deixava o Auxiliar sem nenhum caminho funcional para consultar suas próprias capacidades via API, já que `listCapabilityGrants` exigia `capabilities.grant`. Corrigido: `composition-root.ts` passa a exigir apenas `roles.read` para listar, e `ListCapabilityGrants` restringe automaticamente a listagem às próprias concessões (`selfOnly`) quando o ator não tem `capabilities.grant`. Não foi criada uma tela separada — o Auxiliar usa a mesma tela `CapabilitiesPanel`, que agora esconde as ações de gestão (delegar/revogar) quando `viewerCapabilities` não inclui `capabilities.grant`.
- Todos os 40 itens de Tasks/Subtasks concluídos; todos os 13 ACs cobertos por pelo menos um teste real (unitário de domínio, API com classes de erro reais — não só `.name` forjado —, PostgreSQL 18 real, ou Cypress).

### File List

- `_bmad-output/implementation-artifacts/1-9-delegar-capacidades-ao-auxiliar-administrativo.md` (novo)
- `apps/api/src/composition-root.ts`
- `apps/api/src/nest-app.ts`
- `apps/api/src/openapi.ts`
- `apps/web/src/components/CapabilitiesPanel.tsx` (novo)
- `apps/web/src/components/PeopleUnitsPage.tsx`
- `apps/worker/src/composition-root.ts`
- `cypress/e2e/capability-delegation.cy.js` (novo)
- `cypress/e2e/invitations.cy.js`
- `cypress/e2e/people-units-relationships.cy.js`
- `cypress/e2e/role-lifecycle.cy.js`
- `cypress/e2e/role-lifecycle-active.cy.js`
- `migrations/tenant/007_capability_delegation.sql` (novo)
- `migrations/tenant/README.md`
- `package.json`
- `packages/adapters/src/db/postgres-capability-grant-repository.ts` (novo)
- `packages/adapters/src/db/postgres-capability-notification-outbox.ts` (novo)
- `packages/adapters/src/db/postgres-identity-repository.ts`
- `packages/adapters/src/db/postgres-role-assignment-repository.ts`
- `packages/adapters/src/index.ts`
- `packages/api-client/src/provisioning.ts` (regenerado)
- `packages/application/src/authorization/capabilities.ts` (novo)
- `packages/application/src/authorization/roles.ts`
- `packages/application/src/index.ts`
- `scripts/generate-api-client.mjs`
- `tests/api-capabilities.test.ts` (novo)
- `tests/capabilities.test.ts` (novo)
- `tests/migrations-capabilities-contract.test.ts` (novo)
- `tests/postgres-capabilities-integration.test.ts` (novo)
- `tests/postgres-integration.test.ts`
- `tests/postgres-roles-integration.test.ts`
- `tests/roles.test.ts`

## Change Log

- 2026-08-13: implementação completa da Story 1.9 — catálogo fechado de capacidades, migration tenant 007, adapter transacional, API/OpenAPI/cliente, jobs de worker, `CapabilitiesPanel.tsx`, testes em todas as camadas (194 unitários/API, 18/18 PostgreSQL real, 60/60 Cypress); Story movida para review.
- 2026-08-14: code review — 2 decisões resolvidas (catálogo `available` restrito a `roles.suspend`; leitura própria de capacidades sem `capabilities.grant`) e 12 patches aplicados: qualificação de schema + revalidação de frescor em `authorize()`/`resolveContext()`; autoria correta em `revoke()`/`effects()`; `onAccessLost()` em `grant()`; `CapabilityConflict` em violação de índice único; testes reais de migration 007, concorrência de Idempotency-Key, revalidação pós-revoke e suspensão delegada ponta-a-ponta; correções de foco/acessibilidade em `CapabilitiesPanel.tsx`. Status → done.
