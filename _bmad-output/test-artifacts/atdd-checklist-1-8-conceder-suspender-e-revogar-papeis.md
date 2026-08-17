---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04c-aggregate', 'step-05-validate-and-complete']
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-08-10'
storyId: '1.8'
storyKey: '1-8-conceder-suspender-e-revogar-papeis'
primaryLevel: 'API'
storyFile: '_bmad-output/implementation-artifacts/1-8-conceder-suspender-e-revogar-papeis.md'
atddChecklistPath: '_bmad-output/test-artifacts/atdd-checklist-1-8-conceder-suspender-e-revogar-papeis.md'
generatedTestFiles:
  - 'tests/api-roles.test.ts'
  - 'cypress/e2e/role-lifecycle.cy.js'
inputDocuments:
  - '_bmad/tea/config.yaml'
  - '_bmad-output/implementation-artifacts/1-8-conceder-suspender-e-revogar-papeis.md'
  - 'package.json'
  - 'cypress.config.js'
  - 'vitest.config.ts'
  - '.agents/skills/bmad-testarch-atdd/resources/tea-index.csv'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/data-factories.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/component-tdd.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/test-quality.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/test-healing-patterns.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/selector-resilience.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/timing-debugging.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/overview.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/api-request.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/network-recorder.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/auth-session.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/intercept-network-call.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/recurse.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/log.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/file-utils.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/network-error-monitor.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/fixtures-composition.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/playwright-cli.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/test-levels-framework.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/test-priorities-matrix.md'
  - '.agents/skills/bmad-testarch-atdd/resources/knowledge/ci-burn-in.md'
---

# ATDD — Story 1.8: Conceder, suspender e revogar Papéis

> Workflow regenerado em 2026-08-10 após correção da resolução de `python3` para Python 3.14.0.

## Preflight e contexto

- **Stack detectado:** full-stack TypeScript — React/Vite no frontend; NestJS/Fastify, Kysely e PostgreSQL no backend.
- **Frameworks de teste:** Vitest 4.1.10 para testes unitários, de API e integração; Cypress 15.19.0 para E2E.
- **Pré-requisitos:** atendidos. A história está `ready-for-dev`, contém 14 critérios de aceitação claros, os frameworks estão configurados e o ambiente possui scripts de build/teste.
- **Padrões existentes:** testes em `tests/`, testes próximos ao código em `src/**/*.test.ts`, E2E em `cypress/e2e/`, interceptação antes da navegação, seletores semânticos e verificações axe/reflow.
- **Componentes afetados:** domínio de autorização, adapters PostgreSQL, migrations tenant/global, API/OpenAPI/cliente gerado, worker/outbox, painel Pessoas e acesso e resolução de sessão/tenant.
- **Integrações críticas:** relógio transacional PostgreSQL, zona IANA/DST, CAS por `expectedVersion`, idempotência, auditoria append-only, projeção exportável, outbox/e-mail e invalidação tenant-scoped.
- **Flags TEA:** Playwright Utils habilitado; Pact.js Utils desabilitado; automação de browser `auto`; stack configurado como `auto`.
- **Perfil de conhecimento:** UI+API, complementado por padrões backend. O projeto usa Cypress, portanto os conceitos dos utilitários Playwright serão traduzidos aos equivalentes já adotados no repositório, sem introduzir dependência nova.

### Critérios e restrições extraídos

Os 14 ACs cobrem concessão com catálogo fechado, revisão, agendamento temporal, rejeição de horários civis inválidos, expiração, suspensão emergencial, limites do Auxiliar, restauração, revogação, proteção contra autoação, composição estrita de capacidades, concorrência otimista, atomicidade/auditoria/outbox e UX WCAG 2.2 AA. Permanecem fora do escopo Papéis personalizados, delegação granular, Responsável Financeiro, Contato de Continuidade e transferência/recuperação do Síndico.

## Modo de geração

**Geração por IA.** Os critérios e contratos estão claros e a superfície da Story 1.8 ainda não foi implementada para gravação em navegador. Os scaffolds serão deliberadamente vermelhos e usarão Vitest/Cypress conforme os padrões existentes.

## Estratégia de testes

| AC | Cenário primário e riscos | Melhor nível | Prioridade |
|---|---|---|---|
| 1 | Conceder Papel compatível sem capacidades implícitas; rejeitar catálogo/Vínculo/tenant inválidos | Unit + API + PostgreSQL | P0 |
| 2 | Preview diferencia Papel, delegação, Responsável Financeiro e continuidade | Cypress | P1 |
| 3 | Manter `scheduled` sem autorização e ativar uma vez no instante correto | Unit + PostgreSQL/worker | P0 |
| 4 | Rejeitar horário civil ambíguo/inexistente; aceitar instante com offset inequívoco | Unit + API | P0 |
| 5 | Negar exatamente em `validUntil`, invalidar apenas o tenant e preservar histórico | PostgreSQL + API | P0 |
| 6 | Suspender com reautorização sob lock, motivo válido, auditoria e invalidação imediata | PostgreSQL + API | P0 |
| 7 | Bloquear autoação, alvo Síndico, payload/tenant adulterado, acúmulo e corrida | Unit + API + PostgreSQL | P0 |
| 8 | Restaurar somente por Síndico e preservar período/histórico sem restaurar sessão | API + PostgreSQL + Cypress | P1 |
| 9 | Revogar permanentemente com motivo, efeito imediato e preservação institucional | API + PostgreSQL + Cypress | P0 |
| 10 | Impedir confirmação/cancelamento/ampliação pelo Auxiliar alvo | API + Cypress | P0 |
| 11 | Unir apenas capacidades explícitas e vigentes, respeitando tenant/Unidade/proveniência | Unit + integração | P0 |
| 12 | Retornar 409/current sem sobrescrita; preservar intenção e foco na UI | PostgreSQL + API + Cypress | P0 |
| 13 | Commit atômico de estado/auditoria/projeção/outbox; rollback sem órfãos e payload redigido | PostgreSQL + worker | P0 |
| 14 | Estados completos, teclado, foco, 320 px, zoom 200%, texto/ícone e axe | Cypress | P1 |

### Cobertura sem duplicação

- Funções puras e máquina de estados ficam em testes unitários; os testes de API verificam bordas HTTP e autorização, sem repetir todas as combinações puras.
- PostgreSQL prova locks, CAS, relógio, atomicidade, isolamento tenant e idempotência real; doubles não serão usados como evidência desses comportamentos.
- Cypress cobre somente jornadas e acessibilidade observáveis, usando interceptações para estados difíceis; não revalida internals do domínio.
- Todos os arquivos gerados importarão módulos/rotas ainda inexistentes ou conterão expectativas incompatíveis com o baseline, garantindo a fase vermelha antes da implementação.

## TDD Red Phase (estado atual)

Scaffolds de aceitação gerados e mantidos desativados:

- API: 16 cenários com `test.skip()` em `tests/api-roles.test.ts`.
- E2E: 9 cenários com `test.skip()` em `cypress/e2e/role-lifecycle.cy.js`.
- Fixtures mínimas: `tests/fixtures/role-atdd-data.ts`.
- Total: 25 cenários — P0: 18; P1: 7; P2/P3: 0.
- Cobertura: AC 1–14, com lógica pura/concorrência/atomicidade aprofundadas nos testes de implementação previstos pela estratégia.
- Execução de geração: AGENT-TEAM (API + E2E), aproximadamente 50% mais rápida que execução sequencial.

### Endpoints esperados

- `GET /api/v1/tenants/:tenantId/role-assignments`
- `POST /api/v1/tenants/:tenantId/role-assignments/preview`
- `POST /api/v1/tenants/:tenantId/role-assignments`
- `POST /api/v1/tenants/:tenantId/role-assignments/:assignmentId/suspend`
- `POST /api/v1/tenants/:tenantId/role-assignments/:assignmentId/restore`
- `POST /api/v1/tenants/:tenantId/role-assignments/:assignmentId/revoke`

### Ativação por tarefa

1. Remova `test.skip()` apenas do cenário da tarefa corrente.
2. Execute o teste e confirme a falha pelo comportamento ainda ausente (RED).
3. Implemente o mínimo necessário e execute novamente até passar (GREEN).
4. Refatore mantendo o teste verde; depois avance ao próximo cenário.

Não ative todos os scaffolds de uma vez. Os testes de API pressupõem a extensão do composition root/Nest para operações de Papel; os E2E pressupõem o painel “Papéis e acesso”.

## Mocks e requisitos de UI

Os E2E interceptam, sempre antes de `cy.visit`, dashboard, sessão, Pessoas, Unidades, Vínculos, Convites, listagem de Papéis e as seis operações de Papel. Devem existir respostas de sucesso e RFC 9457 para validação `422`, conflito `409`, acesso negado `403/404` e indisponibilidade `503`.

O projeto privilegia seletores por papel, rótulo e texto acessível em vez de `data-testid`. A implementação deve fornecer nomes acessíveis estáveis para: “Conceder Papel”, Pessoa, Vínculo, Papel institucional, início/fim de vigência, motivos de suspensão/revogação, dialogs sensíveis e seus botões de confirmação. Se um controle não puder ser identificado semanticamente, adicione `data-testid` apenas como último recurso.

## Checklist de implementação (GREEN)

- [ ] Criar catálogo fechado, agregação estrita de capacidades e máquina temporal; ativar os cenários API correspondentes.
- [ ] Criar migration aditiva, CAS/locks, relógio transacional, auditoria/projeção/outbox e testes PostgreSQL específicos.
- [ ] Implementar listagem, preview, concessão, suspensão, restauração e revogação no application layer e composition root.
- [ ] Expor endpoints seguros com sessão, same-origin, CSRF, idempotência e RFC 9457; regenerar o cliente OpenAPI.
- [ ] Implementar worker idempotente para ativação/expiração e notificações redigidas.
- [ ] Construir o painel “Papéis e acesso”, dialogs sensíveis, conflito recuperável e limpeza após perda de acesso.
- [ ] Ativar gradualmente os 16 cenários API e os 9 E2E, sempre confirmando RED → GREEN → REFACTOR.
- [ ] Executar regressão completa exigida pela story antes de mover para review.

Estimativa de esforço de testes: 5–8 dias de engenharia, devido a concorrência PostgreSQL real, DST, worker/outbox, segurança multi-tenant e acessibilidade.

## Comandos de execução

```powershell
npm test -- tests/api-roles.test.ts
npm run test:e2e -- --spec cypress/e2e/role-lifecycle.cy.js
npx cypress open --e2e
npm test
npm run test:integration
npm run check:types
npm run build
npm run test:e2e
```

## Validação do workflow

- Pré-requisitos, story, frameworks, padrões existentes e conhecimento obrigatório: validados.
- Metadados e handoff: registrados no frontmatter e na seção ATDD da story.
- RED: 25/25 cenários usam literalmente `test.skip()`, sem asserções-placeholder.
- Network-first: aplicado em todos os E2E.
- Dados: fixture determinística e isolada criada; IDs fixos são intencionais para mocks sem persistência e sem colisão. `faker` não foi introduzido porque não é dependência do projeto e estes scaffolds não criam estado real.
- Component tests: N/A nesta etapa; a jornada crítica é coberta por Cypress e a lógica por API/unit/integration conforme a estratégia.
- Browser recording/sessions: N/A; geração por IA, sem sessão de navegador aberta.
- Artefatos temporários dos workers não são entregáveis; os resultados relevantes foram agregados neste checklist e nos arquivos finais.

### Evidência da regeneração

- `python3`: resolvido para Python 3.14.0; resolvedor de customização executado com sucesso.
- Vitest: 1 arquivo e 16 testes coletados, todos skipped como previsto.
- TypeScript: `npm run check:types` aprovado após validação dos mocks RED.
- Cypress: 9 cenários com `test.skip()` literal, sem Testing Library; sintaxe ECMAScript aprovada.
- Contagem estrutural: 25 ocorrências de `test.skip()`, zero `it.skip()` e zero asserções-placeholder.
