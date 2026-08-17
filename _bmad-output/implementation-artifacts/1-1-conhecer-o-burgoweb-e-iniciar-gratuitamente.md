---
baseline_commit: 8bd91716b0c465c303cb00586a20af3e997fa31f
---

# Story 1.1: Conhecer o Burgoweb e iniciar gratuitamente

Status: done

## Story

Como visitante,
Quero compreender a proposta do Burgoweb e iniciar gratuitamente,
Para que eu possa decidir com segurança se desejo criar minha Conta e meu Condomínio.

## Critérios de Aceitação

1. **Landing pública e promessa correta** — Dado que uma Pessoa acessa o endereço público sem autenticação, quando a landing page é carregada, então ela apresenta, em linguagem simples, que o Burgoweb é gratuito e destinado à organização e transparência de condomínios, e não promete contabilidade, cobrança bancária, certificação jurídica ou funcionalidades fora do MVP.
2. **CTA principal** — Dado que o visitante está na landing page, quando identifica a ação principal, então encontra o CTA **Utilize gratuitamente** com nome e finalidade compreensíveis, e sua ativação inicia a primeira etapa do onboarding sem exigir contato comercial.
3. **Navegação sem efeitos institucionais** — Dado que o visitante ativa o CTA, quando a navegação é concluída, então o sistema apresenta o início do fluxo de criação de Conta e Condomínio, e nenhuma Conta, autoridade ou entidade institucional é criada apenas pela navegação.
4. **Acessibilidade e responsividade** — Dado que a landing page é acessada em viewport móvel ou desktop suportado, quando o visitante navega por teclado ou tecnologia assistiva, então conteúdo, navegação e CTA usam HTML semântico, ordem lógica, foco visível, rótulos compreensíveis e contraste conforme WCAG 2.2 AA, e nenhuma informação ou ação depende exclusivamente de cor, posição ou interação por ponteiro.
5. **Estados seguros** — Dado que recursos essenciais estão carregando ou falham, quando o estado é apresentado, então a interface distingue carregamento, indisponibilidade e recuperação com mensagem acionável, e não exibe stack trace, segredo, configuração interna ou falso estado de sucesso.
6. **Base greenfield** — Dado o desenvolvimento greenfield dentro do repositório existente, quando esta história é implementada, então existe um monorepo executável com as fronteiras iniciais de `apps/web`, `apps/api`, `apps/worker` e pacotes compartilhados previstos pela arquitetura, e `apps/web` não importa código interno, tipos de persistência ou classes de domínio do backend.
7. **Stack reproduzível e smoke test** — Dado a stack fixada pela arquitetura, quando dependências e scripts fundamentais são instalados, então as versões resolvidas ficam registradas no lockfile e o projeto executa build e testes fundamentais de forma reproduzível, e o smoke test cobre build, renderização, hydration e navegação pública com o par TanStack Start/Router efetivamente resolvido.
8. **Protótipo tratado como histórico** — Dado que o protótipo histórico permanece no repositório, quando a nova base greenfield é introduzida, então nenhuma rota, persistência JSON ou comportamento anterior é tratado automaticamente como contrato compatível, e qualquer reutilização ou substituição fica explícita, sem remover o histórico ou os artefatos BMAD.

## Tasks / Subtasks

- [x] 1. Congelar e validar a base técnica greenfield (AC: 6, 7, 8)
  - [x] Registrar no Git o estado anterior antes de qualquer substituição e preservar `_bmad/`, `.agents/`, `_bmad-output/`, `docs/` e o histórico do protótipo.
  - [x] Converter a raiz em workspace/monorepo com `apps/web`, `apps/api`, `apps/worker` e os pacotes compartilhados previstos na seção de estrutura.
  - [x] Instalar em conjunto as versões canônicas de TanStack Start e Router; registrar versões diretas e transitivas no lockfile, sem ranges ambíguos para o par RC.
  - [x] Criar entrypoints mínimos e independentes para web, API e worker e scripts reproduzíveis de desenvolvimento, build, testes e smoke.
  - [x] Aplicar uma regra automatizada de fronteira que impeça `apps/web` de importar internos do backend, Kysely, tipos de persistência ou classes de domínio.
- [x] 2. Implementar a superfície pública e a entrada do onboarding (AC: 1, 2, 3)
  - [x] Criar a rota pública da landing e uma rota pública para o início do onboarding.
  - [x] Escrever conteúdo institucional simples, aderente à proposta e às exclusões descritas em Dev Notes.
  - [x] Implementar o CTA literal **Utilize gratuitamente** como navegação; ele não pode chamar endpoint mutável, provisionar tenant ou persistir Conta, Pessoa, Condomínio ou autoridade.
  - [x] Permitir acesso direto à rota inicial do onboarding sem sessão, exibindo apenas o começo do fluxo; criação efetiva pertence à Story 1.2.
- [x] 3. Aplicar o Design e o Experience Spine (AC: 1, 2, 4)
  - [x] Implementar tokens, tipografia, superfícies, links e CTA segundo o Design Spine, sem gradientes, gamificação ou aparência de ERP contábil/rede social.
  - [x] Entregar paridade funcional mobile/desktop, uma coluna abaixo de 768 px e reflow a 320 CSS px sem rolagem bidimensional.
  - [x] Usar `lang="pt-BR"`, título significativo, landmarks, skip link, exatamente um `h1`, ordem lógica e nomes acessíveis.
  - [x] Garantir foco visível, teclado completo, alvos móveis preferencialmente 44×44 px, contraste, zoom, text spacing, `prefers-reduced-motion` e `forced-colors`.
- [x] 4. Implementar estados resilientes e seguros (AC: 5)
  - [x] Manter geometria estável e nome acessível durante carregamento/transição.
  - [x] Prevenir acionamento duplo durante a transição e manter comportamento equivalente por teclado e ponteiro.
  - [x] Em indisponibilidade ou desconexão, apresentar mensagem acionável e retry seguro; jamais simular sucesso ou revelar detalhes internos.
- [x] 5. Criar a suíte de guardrails (AC: 1–8)
  - [x] Testar conteúdo obrigatório, alegações proibidas e texto/finalidade do CTA.
  - [x] Testar navegação por CTA e acesso direto; afirmar explicitamente zero request mutável e zero criação institucional.
  - [x] Cobrir build de todos os workspaces, renderização servidor, hydration sem mismatch e navegação TanStack.
  - [x] Executar E2E público em desktop e mobile, teclado/foco, estados de erro/retry e smoke dos entrypoints de API e worker.
  - [x] Automatizar verificações de acessibilidade e complementar com revisão humana de teclado, leitor de tela, zoom/reflow, text spacing e alto contraste.
  - [x] Executar `npm test` e `npm run build` antes de concluir e registrar evidências no Dev Agent Record.

### Review Findings

- [x] [Review][Patch] Validar imports relativos e aliases no guardrail de fronteiras; a comparação atual do specifier bruto permite que `apps/web` importe internos do backend [scripts/check-boundaries.mjs:5]
- [x] [Review][Patch] Tornar o E2E autônomo iniciando, aguardando e encerrando o servidor; o runner atual abre o Cypress sem disponibilizar a aplicação [scripts/run-e2e.mjs:10]
- [x] [Review][Patch] Remover a dependência de artefato `dist` preexistente em `npm test`; o teste SSR falha em checkout limpo quando o build ainda não foi executado [tests/ssr-smoke.test.ts:9]
- [x] [Review][Patch] Adicionar auditoria automatizada real de acessibilidade; a busca textual no código-fonte não valida WCAG nem a árvore renderizada [tests/accessibility-contract.test.ts:5]
- [x] [Review][Patch] Exercitar hydration no cliente e detectar mismatch; o smoke atual verifica somente o HTML produzido pelo servidor [tests/ssr-smoke.test.ts:18]
- [x] [Review][Patch] Cobrir o estado de erro da rota e a ação de retry; o E2E atual testa apenas desconexão do navegador [cypress/e2e/public-entry.cy.js:25]
- [x] [Review][Patch] Preservar o nome acessível do CTA e liberar o estado de navegação em falha, cancelamento ou abertura modificada; hoje o rótulo muda e o controle pode permanecer bloqueado [apps/web/src/components/StartCta.tsx:19]
- [x] [Review][Patch] Testar a operação real por teclado com Tab e Enter ou Espaço; `.focus().click()` reproduz acionamento programático por ponteiro [cypress/e2e/public-entry.cy.js:12]
- [x] [Review][Patch] Transformar os diretórios compartilhados previstos em pacotes reais do workspace; atualmente contêm apenas READMEs [package.json:9]
- [x] [Review][Patch] Evitar a dependência rígida de Chrome instalado no host ou provisioná-lo explicitamente para tornar o E2E reproduzível [scripts/run-e2e.mjs:10]

## Dev Notes

### Escopo e intenção

- Esta é a primeira fatia vertical do Épico 1 e habilita todos os épicos seguintes. Ela entrega descoberta pública, entrada sem efeitos colaterais e o bootstrap arquitetural; não entrega cadastro real.
- A landing deve comunicar: plataforma gratuita de organização e transparência condominial; organização administrativa; acompanhamento de gastos; preservação de documentos/histórico; transparência compreensível; adoção gradual e portabilidade. O núcleo essencial é gratuito e permanente, não um teste temporário.
- Público inicial: condomínios sem estrutura administrativa organizada; o critério não é tipologia física. Cliente institucional é o Condomínio; síndico/responsável é adotante, e moradores, conselho e futuras gestões são beneficiários.
- Tom: claro, confiável, comunitário, prático, acessível, responsável e imparcial. Não usar urgência artificial, jargão técnico/contábil ou alegações de exclusividade.
- Não prometer ou implementar nesta história: ERP completo, contabilidade/folha/escrituração, boleto/Pix/conciliação/integração bancária, certificação jurídica/contábil/eleitoral, app nativo/offline, assembleia/votação, marketplace, multiconomínio avançado, automações complexas, publicidade, planos ou cobrança.
- `Burgoweb` ainda é nome sujeito a validação de marca/domínio/anterioridade; não alegar exclusividade jurídica.

### Guardrails técnicos e arquiteturais

- Arquitetura alvo: frontend/backend separados em monorepo; backend como monólito modular em camadas com ports/adapters. API REST sob `/api/v1`, OpenAPI como contrato, JSON `camelCase`, banco `snake_case`, erros RFC 9457 e correlação por `X-Request-Id`.
- `apps/web` consome somente o cliente TypeScript gerado do OpenAPI. Não pode importar Kysely, adapters, entidades persistentes ou internos de `apps/api`/`apps/worker`.
- API e worker têm composition roots independentes; somente composition roots importam adapters concretos. Nesta história podem ser shells executáveis, sem antecipar domínios das histórias futuras.
- A navegação do CTA é operação local/pública e sem mutação. Não introduzir endpoint de onboarding funcional, armazenamento JSON, criação temporária ou chamada ao protótipo para “aproveitar” comportamento.
- Acesso sem sessão à landing não equivale a conteúdo “público do condomínio”. Não coletar dado pessoal desnecessário, enumerar Conta/Pessoa/Condomínio nem criar autoridade pelo clique.
- Hipóteses de adoção/conversão não são requisitos confirmados. Instrumentação futura não autoriza analytics sensível ou perfilamento.

### Stack e versões fixadas

- Baseline aprovada: Node.js `24.18.0` LTS; TypeScript `7.0.2` condicionado a spike; React `19.2.7`; TanStack Start e Router `1.168.30` RC; Vite `8.1.5`; NestJS/platform-fastify `11.1.20`; Fastify `5.10.0`; PostgreSQL `18.4`; Kysely `0.29.2`; Kysely Codegen `0.20.0`; Vitest `4.1.10`; Cypress `15.19.0`; Testcontainers `12.0.4`.
- A arquitetura é a fonte da versão, mesmo quando uma versão mais nova existir. Não atualizar silenciosamente. TypeScript 7 e o par TanStack RC exigem spike/smoke; falha no gate deve ser registrada e escalada, não contornada com troca unilateral de stack.
- Instalar/congelar TanStack Start e Router juntos, capturar transitivas no lockfile e validar build, SSR, hydration, navegação e Cypress. O frontend moderno baseado em Vite pressupõe browsers com ESM; qualquer necessidade de browsers legados exige decisão explícita, não polyfill improvisado.

### Estrutura de arquivos

Estrutura mínima esperada:

```text
apps/
  web/
  api/
  worker/
packages/
  application/
  adapters/
  api-client/
  config/
  test-support/
migrations/
  global/
  tenant/
infra/
  compose/
  salt/
  observability/
```

- Criar apenas os mínimos necessários nesta story; não preencher packages com funcionalidades futuras.
- Arquivos existentes provavelmente atualizados: `package.json`, `package-lock.json`, configs TypeScript/Vite e a superfície atual de `src/`. O plano exato deve ser explicitado no File List.
- `src/App.tsx` atual mistura onboarding, login, pendências e histórico; `src/server/*` implementa Express/JSON e contratos inseguros/incompatíveis. Esses arquivos são protótipo histórico, não ponto de partida contratual. Não migrar comportamento silenciosamente.
- Se arquivos históricos forem realocados/substituídos, preservar a recuperação pelo Git e documentar a decisão. Não remover artefatos BMAD, discovery ou histórico por conveniência.

### Estado atual dos arquivos UPDATE e preservações

- `package.json`/`package-lock.json`: hoje registram React 18, Router DOM 6, Vite 5, Express 4, TS 5 e Vitest 2. Devem passar a workspaces/scripts/pins canônicos, preservando instalação reproduzível.
- `tsconfig.json`, `tsconfig.server.json`, `vite.config.ts`: hoje suportam uma SPA raiz e servidor Express. Devem evoluir para configs por app/package, preservando strictness e builds independentes.
- `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`: hoje formam uma SPA client-only escura com formulários mutáveis e sem roteamento real. A nova web deve entregar SSR/hydration/navegação e landing acessível. Preservar `lang="pt-BR"`, viewport e título significativo; não preservar cadastro imediato, senha temporária ou chamadas ao backend legado.
- `src/server/*.ts` e testes: storage JSON síncrono, CORS irrestrito, `/api`, identidade/tenant vindos do cliente e respostas que podem vazar dados. Não adaptar como contrato compatível. Nesta história, preserve-os como histórico ou substitua-os explicitamente por shells, sem implementar os domínios futuros.
- O fluxo final deve continuar íntegro quando API/worker não oferecem ainda onboarding: landing e rota inicial precisam funcionar sem depender de mutação backend.

### Requisitos de UX e acessibilidade

- Direção visual: sóbria, acolhedora e institucional; sem gradientes. Tokens centrais: `#236F9E` primário, `#19597F` hover, `#F7F9FB` fundo, `#FFFFFF` superfície, `#17212B` texto, `#536270` texto secundário, `#657785` borda, `#6D28D9` foco; Inter com `system-ui`; base 16 px; escala 4/8/12/16/24/32/48; botão 8 px; card 12 px; links sublinhados.
- WCAG 2.2 AA é requisito verificável: texto normal 4,5:1; texto grande e componentes 3:1; foco não oculto; alvo mínimo AA de 24×24 px e preferência de 44×44 px nas ações móveis; nada somente por cor/posição/hover/ponteiro.
- Carregamento não deve anunciar conteúdo pronto. Falha/desconexão deve afirmar que a ação não concluiu, permitir retry e nunca confirmar navegação/gravação inexistente.

### Testes obrigatórios

- Component/unit: copy e exclusões, semântica, CTA literal, estados e prevenção de duplo acionamento.
- Integration: CTA navega à rota correta sem requests mutáveis; acesso direto funciona sem sessão; regra de imports bloqueia web → backend; API/worker têm entrypoints independentes.
- SSR/hydration: HTML inicial útil, hydration sem mismatch e navegação pública real pelo TanStack Router.
- E2E Cypress: viewport móvel/desktop, teclado, foco, retry/indisponibilidade e ausência de efeitos institucionais.
- Acessibilidade: automação (incluindo axe ou equivalente) mais revisão humana; testar 200% zoom, reflow 320 px/400%, text spacing, reduced motion, forced colors e leitor de tela.
- Regressão/build: build e testes de todos os workspaces a partir de instalação limpa/lockfile. O jsdom-only atual é insuficiente.

### Inteligência do Git e da história anterior

- Não há história anterior: esta é a Story 1.1.
- Commits recentes mostram que `b376293` introduziu o protótipo e `8bd9171` consolidou a decomposição mais nova. Logo, planejamento canônico prevalece sobre o código histórico e sobre `epics-and-stories.md` draft.
- O worktree pode conter mudanças do usuário. Preserve alterações não relacionadas; não faça limpeza, reset ou remoção ampla.

### Informação técnica atual

- A documentação oficial do React confirma versionamento semântico no canal estável; isso não autoriza substituir o baseline arquitetural sem decisão: <https://react.dev/community/versioning-policy>.
- A documentação do Vite 5 confirma que o build padrão do protótipo mira browsers com ESM e que suporte legado exige plugin/decisão explícita: <https://v5.vite.dev/guide/>. A base alvo usa Vite 8; valide seu suporte real no spike, sem copiar pressupostos do Vite 5.
- WCAG 2.2 adiciona, entre outros, foco não obscurecido, target size mínimo e autenticação acessível. A especificação normativa é <https://www.w3.org/TR/WCAG22/>.

### Project Structure Notes

- Não existe `project-context.md`; as fontes normativas desta story são discovery, PRD, Épicos, Architecture Spine e UX Spines.
- `epics-and-stories.md` é draft legado e conflita com a decomposição atual: nele, Story 1.1 era cadastro administrativo. Não usar requisitos daquele rascunho (perfis, nome global único, senha temporária ou painel de pendências).
- `ux.md` está `superseded`; usar `EXPERIENCE.md` e `DESIGN.md`. Spines vencem mocks; landing é `spine-only`, portanto nenhum mock histórico é contrato.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Épico 1, Story 1.1 e Dependências e invariantes de decomposição]
- [Source: `_bmad-output/planning-artifacts/prd.md` — Visão, UJ-1/UJ-5, FR-1–FR-9, NFRs, Escopo e Gates]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/ARCHITECTURE-SPINE.md` — AD-1–AD-3, AD-24, AD-26, Stack e Structural Seed]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/reviews/review-stack.md` — parecer PASS WITH CONDITIONS]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-burgoweb-2026-07-27/EXPERIENCE.md` — Foundation, Acesso sem sessão, Começar, State Patterns, Accessibility Floor, Responsive e UJ-1]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-burgoweb-2026-07-27/DESIGN.md` — Brand & Style, tokens, layout, Button e State panel]
- [Source: `docs/product/discovery/01-identidade-e-proposito.md` — propósito, promessa, categoria, tom e alegações proibidas]
- [Source: `docs/product/discovery/03-segmentos-e-personas.md` — cliente, adotante e beneficiários]
- [Source: `docs/product/discovery/04-necessidades-e-jornadas.md` — Jornada 1]
- [Source: `docs/product/discovery/05-proposta-de-valor-e-diferenciacao.md` — posicionamento e limites]
- [Source: `docs/product/discovery/06-escopo-e-modelo-de-negocio.md` — free-first, publicidade e fora do escopo]
- [Source: `docs/product/discovery/08-decisoes-hipoteses-e-riscos.md` — decisões, hipóteses e riscos]
- [Source: `package.json`, `src/App.tsx`, `src/index.css`, `src/main.tsx`, `src/server/*.ts` — estado do protótipo histórico]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- 2026-07-28 — RED confirmado: `tests/monorepo-structure.test.ts` falhou em 14 verificações antes do scaffold.
- 2026-07-28 — Spike de dependências bloqueado por `npm ERR! ETARGET`: `@tanstack/react-router@1.168.30` não existe no registro npm. Metadados de `@tanstack/react-start@1.168.30` apontam dependência direta para `@tanstack/react-router@1.170.18`. A decisão de reconciliar a versão canônica é necessária antes de gerar o lockfile e validar build/SSR/hydration.
- 2026-07-28 — Proprietário autorizou explicitamente reconciliar o par para Start `1.168.30` + Router `1.170.18`, conforme a dependência publicada do Start.
- 2026-07-28 — Lockfile greenfield regenerado com Node `24.18.0`; árvore React deduplicada em `19.2.7`; build Vite `8.1.5` cliente+SSR e builds API/worker aprovados; 26 testes Vitest aprovados.
- 2026-07-28 — E2E bloqueado após três tentativas: Cypress `15.19.0` inicia no Electron 138, mas seu preprocessor interno falha antes dos testes por ausência de `@babel/preset-typescript`, inclusive com config/spec JavaScript. Dependência adicional requer autorização do proprietário.
- 2026-07-28 — Proprietário autorizou `@babel/preset-typescript@7.28.5`; `npm run test:e2e` estabilizado no Chrome headless com `NODE_PATH` explícito e remoção local de `ELECTRON_RUN_AS_NODE`.
- 2026-07-28 — Revisão adversarial corrigiu 10 achados; `npm run smoke` aprovado com 33 testes Vitest, build de todos os workspaces e 6 cenários Cypress no Electron provisionado, incluindo teclado real, hydration, axe WCAG 2.2 AA e offline/recovery.

### Implementation Plan

- Preservar integralmente o protótipo raiz e introduzir a base greenfield em workspaces paralelos.
- Validar primeiro estrutura/pinagem, depois landing/onboarding, estados e acessibilidade, encerrando com build SSR, regressão e Cypress.
- Manter API e worker como shells sem domínio mutável e bloquear imports web → backend por script executável no build.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- História preparada com base na decomposição, arquitetura e UX vigentes; fontes legadas conflitantes foram explicitamente excluídas.
- Implementação iniciada e mantida em `in-progress`; nenhuma tarefa foi marcada completa porque o gate obrigatório de instalação/build está bloqueado pela versão inexistente do Router.
- O bloqueio do Router foi resolvido e os gates build/SSR/unit/integration passaram; a conclusão segue retida exclusivamente pelo gate E2E do Cypress.
- Monorepo greenfield entregue com Node `24.18.0`, React `19.2.7`, TanStack Start `1.168.30`, Router compatível `1.170.18`, Vite `8.1.5`, Vitest `4.1.10` e Cypress `15.19.0`, todos registrados no lockfile.
- Landing pública e `/comecar` entregues sem mutações, com estados offline/recuperação, prevenção de duplo acionamento, semântica, responsividade e guardrails WCAG 2.2 AA.
- Validação final: `npm run build` aprovado (cliente, SSR, typecheck, API, worker e fronteiras); `npm test` aprovado (5 arquivos/26 testes); `npm run test:e2e` aprovado no Chrome 149 (4 cenários desktop/mobile/offline/recuperação).
- Revisão concluída: guardrails reconhecem imports relativos e aliases; E2E realiza build e gerencia seu servidor; SSR não depende de `dist` anterior; hydration, erro/retry, teclado e axe possuem cobertura comportamental; CTA preserva nome e estado; pacotes compartilhados são workspaces reais.
- Evidência final da revisão: `npm run smoke` aprovado (6 arquivos/33 testes Vitest e 6/6 cenários Cypress no Electron 138).

### File List

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vitest.config.ts`
- `cypress.config.js`
- `apps/web/package.json`
- `apps/web/tsconfig.json`
- `apps/web/vite.config.ts`
- `apps/web/src/router.tsx`
- `apps/web/src/routeTree.gen.ts`
- `apps/web/src/styles.css`
- `apps/web/src/routes/__root.tsx`
- `apps/web/src/routes/index.tsx`
- `apps/web/src/routes/comecar.tsx`
- `apps/web/src/content/landing.ts`
- `apps/web/src/content/landing.test.ts`
- `apps/web/src/components/LandingPage.tsx`
- `apps/web/src/components/OnboardingStartPage.tsx`
- `apps/web/src/components/StartCta.tsx`
- `apps/api/package.json`
- `apps/api/tsconfig.json`
- `apps/api/src/index.ts`
- `apps/worker/package.json`
- `apps/worker/tsconfig.json`
- `apps/worker/src/index.ts`
- `packages/application/README.md`
- `packages/adapters/README.md`
- `packages/api-client/README.md`
- `packages/config/README.md`
- `packages/test-support/README.md`
- `packages/application/package.json`
- `packages/application/src/index.ts`
- `packages/adapters/package.json`
- `packages/adapters/src/index.ts`
- `packages/api-client/package.json`
- `packages/api-client/src/index.ts`
- `packages/config/package.json`
- `packages/config/src/index.ts`
- `packages/test-support/package.json`
- `packages/test-support/src/index.ts`
- `migrations/global/README.md`
- `migrations/tenant/README.md`
- `infra/compose/README.md`
- `infra/salt/README.md`
- `infra/observability/README.md`
- `scripts/check-boundaries.mjs`
- `scripts/run-e2e.mjs`
- `scripts/serve-built.mjs`
- `tests/boundaries.test.ts`
- `tests/error-state.test.tsx`
- `tests/monorepo-structure.test.ts`
- `tests/entrypoints.test.ts`
- `tests/ssr-smoke.test.ts`
- `tests/accessibility-contract.test.ts`
- `cypress/e2e/public-entry.cy.js`

### Change Log

- 2026-07-28 — Implementada Story 1.1: bootstrap greenfield, landing pública, entrada sem efeitos do onboarding, UX acessível/responsiva, estados resilientes e suíte completa de guardrails.
- 2026-07-28 — Code review concluído: 10 achados corrigidos, smoke integral aprovado e história promovida para `done`.
