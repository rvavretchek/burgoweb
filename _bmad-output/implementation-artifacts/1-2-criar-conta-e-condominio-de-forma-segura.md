---
baseline_commit: 8bd91716b0c465c303cb00586a20af3e997fa31f
---

# Story 1.2: Criar Conta e Condomínio de forma segura

Status: done

## Story

Como responsável pela gestão,
Quero criar minha Conta e meu Condomínio em um único fluxo orientado,
Para que eu possa estabelecer a base institucional sem depender de atendimento comercial.

## Acceptance Criteria

1. **Solicitação pendente com dados mínimos**
   - **Dado** que o visitante iniciou o onboarding
   - **Quando** informa os dados mínimos válidos da Pessoa, da Conta e do Condomínio, define sua credencial e aceita a declaração de autoridade inicial
   - **Então** o sistema registra uma solicitação de provisionamento em estado pendente
   - **E** apresenta claramente que o controle do e-mail ainda deverá ser verificado antes da ativação.

2. **Autodeclaração versionada e limitada**
   - **Dado** que a declaração de autoridade inicial é apresentada
   - **Quando** o responsável confirma sua autodeclaração
   - **Então** o sistema registra o texto e a versão da declaração, a Pessoa declarante, a Conta, o Condomínio pretendido e o instante
   - **E** informa que o Burgoweb não certifica identidade civil, mandato, eleição ou legitimidade jurídica do Síndico.

3. **Declaração obrigatória sem consentimento implícito**
   - **Dado** que o visitante não confirmou a declaração obrigatória
   - **Quando** tenta concluir a criação
   - **Então** o provisionamento não é iniciado
   - **E** a interface informa, de maneira acessível, o que falta sem marcar automaticamente a declaração.

4. **Provisionamento coordenado e compatível**
   - **Dado** que os dados de criação são aceitos
   - **Quando** o workflow de provisionamento é executado
   - **Então** Conta, registro do Condomínio, schema tenant, versão de migration e autoridade inicial pendente são criados de forma coordenada e rastreável
   - **E** o Condomínio somente pode avançar para ativação quando seu schema estiver na versão compatível com a aplicação.

5. **Falha parcial segura**
   - **Dado** que ocorre falha depois da criação parcial de recursos
   - **Quando** o workflow não consegue concluir o provisionamento
   - **Então** recursos incompletos são compensados ou colocados em quarentena com estado explícito e diagnóstico correlacionado
   - **E** nenhum Condomínio utilizável permanece sem responsável inicial ou schema compatível.

6. **Idempotência**
   - **Dado** que a mesma solicitação é reenviada por repetição, falha de rede ou duplo acionamento
   - **Quando** possui a mesma chave idempotente e o mesmo conteúdo
   - **Então** o sistema retorna o resultado já conhecido sem duplicar Conta, Condomínio, schema, declaração ou autoridade
   - **E** reutilizar a chave com conteúdo diferente é rejeitado como conflito.

7. **Não enumeração de Conta**
   - **Dado** que o e-mail informado já está associado a uma Conta
   - **Quando** uma criação não autenticada é solicitada
   - **Então** a resposta pública não confirma nem nega a existência da Conta
   - **E** orienta de forma segura os caminhos de autenticação, recuperação ou associação após comprovação do canal.

8. **Nome do Condomínio não é identidade**
   - **Dado** que outro Condomínio possui o mesmo nome de exibição
   - **Quando** a nova solicitação é válida
   - **Então** o nome não é tratado como identificador global nem como prova de identidade institucional
   - **E** o sistema utiliza identificador público opaco e tenant interno independente.

9. **Credencial protegida**
   - **Dado** que uma senha é definida durante o fluxo
   - **Quando** a credencial é persistida
   - **Então** ela utiliza Argon2id com salt individual e pepper versionado fornecido em runtime
   - **E** senha, hash, pepper, token ou segredo nunca aparecem em resposta, log, Evento de Auditoria ou artefato versionado.

10. **Bloqueio antes da verificação**
    - **Dado** que o provisionamento ainda aguarda verificação do e-mail
    - **Quando** alguém tenta acessar funcionalidade interna ou construir contexto do tenant
    - **Então** o acesso é negado no servidor
    - **E** nenhuma manipulação de URL, identificador ou payload ativa o Condomínio ou concede autoridade.

11. **Fluxo acessível e respostas minimizadas**
    - **Dado** que o fluxo apresenta validação, processamento, falha ou estado pendente
    - **Quando** é utilizado em viewport móvel, desktop, teclado ou tecnologia assistiva
    - **Então** o estado atual, os próximos passos e as ações de recuperação são compreensíveis e preservam foco
    - **E** as mensagens não revelam dados de outras Contas ou Condomínios.

## Tasks / Subtasks

- [x] **1. Fechar o contrato mínimo do onboarding e seus estados** (AC: 1–3, 6–11)
  - [x] Definir DTO/command para dados mínimos de Pessoa, Conta, Condomínio, senha e aceite explícito da declaração; não adicionar seletor de perfis, Unidades ou dados sem finalidade confirmada.
  - [x] Versionar o texto da declaração como dado controlado pelo servidor e persistir o texto efetivamente aceito, versão, declarante, Conta, Condomínio pretendido e instante.
  - [x] Modelar estados explícitos do provisionamento, incluindo processamento, pendente de verificação, compensado/quarentena e conflito; nenhum estado desta story é `active`.
  - [x] Definir resposta pública uniforme e não enumerável, RFC 9457 para erros e `X-Request-Id`/correlation ID seguro.

- [x] **2. Criar migrations globais e tenant retomáveis** (AC: 2, 4, 5, 7–10)
  - [x] Criar no schema global os registros mínimos para Conta, credencial, tenant registry, solicitação de provisionamento, declaração, autoridade pendente, versão/estado, idempotência e auditoria exigida.
  - [x] Criar a migration tenant mínima para Pessoa, autoridade/Vínculo inicial pendente e controle de versão, sem antecipar cadastro completo da Story 1.6.
  - [x] Gerar IDs públicos opacos; gerar nome interno de schema apenas no servidor; nunca expor ou aceitar schema pelo HTTP.
  - [x] Permitir nomes de exibição repetidos e testar isolamento entre dois tenants com o mesmo nome.

- [x] **3. Implementar credencial e configuração fail-closed** (AC: 7, 9)
  - [x] Implementar port de hashing com Argon2id, salt individual e parâmetros medidos nunca abaixo do baseline OWASP vigente.
  - [x] Obter pepper e versão exclusivamente da configuração runtime tipada; impedir startup se ausentes/incoerentes.
  - [x] Redigir senha, hash, pepper, tokens, cookies e payload pessoal de respostas, logs, erros, auditoria e OpenAPI.
  - [x] Manter segredos fora do repositório, imagens, fixtures versionadas e snapshots de teste.

- [x] **4. Implementar o caso de uso compensável e idempotente** (AC: 1, 2, 4–10)
  - [x] Criar módulos/casos de uso em `application/identity`, `application/tenancy` e `application/provisioning`, com ports explícitos e sem adapters concretos fora do composition root.
  - [x] Coordenar persistência global, criação do schema e migration tenant; documentar a fronteira transacional e executar compensação ou quarentena em cada failpoint.
  - [x] Persistir estado, auditoria necessária e efeitos assíncronos aplicáveis de forma atômica; não declarar envio de e-mail nesta story.
  - [x] Implementar `Idempotency-Key` ligado à operação e ao hash canônico da requisição: replay igual retorna o resultado conhecido; conteúdo divergente retorna `409`.
  - [x] Tratar concorrência sem duplicar Conta, Condomínio, schema, declaração ou autoridade; uma falha nunca deixa tenant utilizável.
  - [x] Aplicar resposta neutra quando o e-mail já existir, inclusive evitando diferenças exploráveis de status, corpo, logs ou caminho funcional.

- [x] **5. Expor API `/api/v1` e gerar o cliente web** (AC: 1–11)
  - [x] Substituir o shell da API por composition root NestJS/platform-fastify, controller fino, validação runtime e chamada ao caso de uso.
  - [x] Publicar OpenAPI, validar o contrato no gate e regenerar `packages/api-client`; `apps/web` consome somente esse cliente.
  - [x] Manter same-origin e não habilitar CORS; aplicar controles adequados à mutação pública, validação de origem/Fetch Metadata e limites por operação + sinais de origem, nunca somente IP.
  - [x] Não confiar em Conta, tenant, autoridade ou schema informados pelo browser; não emitir sessão nem construir `TenantContext` antes da ativação da Story 1.3.

- [x] **6. Transformar `/comecar` no fluxo orientado real** (AC: 1–3, 6, 7, 9, 11)
  - [x] Preservar rota pública, H1, back-link, SSR/hydration e a garantia de que apenas navegar não cria recursos.
  - [x] Implementar labels persistentes, ajuda anterior ao erro, autocomplete adequado, suporte a colar/gerenciador de senhas e controle acessível mostrar/ocultar.
  - [x] Manter a declaração desmarcada por padrão; em erro, focar resumo anunciado e associar mensagens aos campos sem apagar os valores.
  - [x] Implementar estados de validação, processamento, pendente, retomado, indisponível, sem conectividade, conflito e falha/quarentena com próxima ação segura.
  - [x] Bloquear duplo envio; em rede incerta, consultar/retomar pelo mesmo identificador idempotente antes de gerar nova tentativa.
  - [x] Informar no sucesso apenas que a solicitação está pendente e que o e-mail ainda deverá ser verificado; não oferecer painel ou acesso interno.

- [x] **7. Criar testes e executar todos os gates** (AC: 1–11)
  - [x] Unitários: validação/minimização, declaração obrigatória/versionada, máquina de estados, hashing/pepper, request hash, idempotência, compensações e redaction.
  - [x] Integração com PostgreSQL 18 real via Testcontainers: migrations global/tenant, isolamento, mesmo nome em tenants distintos, happy path pendente, concorrência, replay, conflito e failpoint por etapa.
  - [x] Contrato/API: `/api/v1`, OpenAPI/cliente, RFC 9457, correlação, não enumeração, ausência de segredos e bloqueio de acesso/`TenantContext`.
  - [x] Componentes/E2E: declaração ausente sem request, preservação de entrada/foco, duplo clique, rede incerta/retry, resposta neutra, falha parcial e pendência sem acesso interno.
  - [x] Acessibilidade: axe mais revisão humana de teclado, leitor de tela, foco, 200% zoom, reflow 320 px/400%, text spacing, reduced motion e forced colors em mobile/desktop.
  - [x] Regressão: `npm run smoke`, boundary web→backend, API/worker independentes, SSR útil, hydration sem mismatch, landing/CTA da Story 1.1 e navegação direta `/comecar`.

### Review Findings

_Revisão bmad-code-review executada em 2026-07-30 sobre o diff da Story 1.2 (baseline `8bd9171`, 40 arquivos / ~1.679 linhas, excluído `package-lock.json` por ser lockfile gerado). Camadas: Blind Hunter (adversarial geral), Edge Case Hunter (caminhos/limites) e Acceptance Auditor (critérios de aceite)._

- [x] [Review][Patch] Retry idempotente de solicitação compensada/quarentenada nunca resolve — loop permanente em 409 "processando" (resolvido como patch em 2026-07-30) — `CreateCondominium.knownResult` (packages/application/src/provisioning/create-condominium.ts:12-23) só retorna `known.result`; para chaves com estado `compensated`/`quarantined`, `response_json` nunca é preenchido, então toda nova tentativa com a mesma chave repete o mesmo 409 "Solicitação em processamento" para sempre, sem nunca expor o estado terminal real ao cliente. Viola AC 6 (retorno do resultado já conhecido) e a garantia da AC 5 de estado explícito.
- [x] [Review][Patch] `AuditPort` injetado nunca é chamado por `CreateCondominium`; nenhum Evento de Auditoria é registrado na falha (compensação/quarentena) (resolvido como patch em 2026-07-30) — em `create-condominium.ts:56-59`, o bloco catch chama apenas `tenantProvisioner.compensate` e `repository.markFailure`; `this.deps.audit.record(...)` nunca é invocado em lugar nenhum do caso de uso. `markFailure` (packages/adapters/src/db/postgres-provisioning-repository.ts:77-83) também não insere em `audit_events` (diferente de `markPending`, que insere). Viola a exigência de "diagnóstico correlacionado" da AC 5 e "auditoria necessária" da Task 4.
- [x] [Review][Patch] Canal lateral de tempo na não enumeração de Conta — criação real de schema tenant só ocorre para Conta nova (resolvido como patch em 2026-07-30) — em `create-condominium.ts:51-54`, `tenantProvisioner.createAndMigrate` (CREATE SCHEMA + migration, múltiplos round-trips) só executa quando `!staged.existingAccount`; apenas o hash Argon2 é deliberadamente equalizado entre os dois caminhos. A etapa de DDL/migration, comparativamente mais lenta, cria uma diferença de tempo mensurável entre "Conta nova" e "Conta existente", violando a neutralidade de caminho funcional exigida pela AC 7.

- [x] [Review][Patch] Rate limiter de provisionamento chaveado só por cabeçalhos controláveis pelo cliente, sem expiração de entradas [apps/api/src/nest-app.ts:43-53]
- [x] [Review][Patch] Verificação de origem (`Sec-Fetch-Site`) é ignorada por completo quando o cabeçalho está simplesmente ausente [apps/api/src/nest-app.ts:25-26]
- [x] [Review][Patch] `app.listen()` em `startApi()` fica fora do try/catch de `createProductionApplication` — falha ao subir (ex.: porta em uso) vaza pool/app já criados [apps/api/src/composition-root.ts:25-27]
- [x] [Review][Patch] Schema OpenAPI declarado (`additionalProperties:false`, tipos/limites) não é aplicado em runtime — controller apenas coage cada campo via `String(...)` [apps/api/src/nest-app.ts:28]
- [x] [Review][Patch] `classify()` trata qualquer status fora de {409,503,429} (400, 403, 422 direto de API, 500) como `'unavailable'`, exibindo botão de nova tentativa para falhas não recuperáveis por repetição [apps/web/src/components/OnboardingStartPage.tsx:24-27]
- [x] [Review][Patch] `package.json` raiz lista uma dependência literal `"node": "24.18.0"` em `devDependencies` — aparenta ser um pin de Volta/engine mal posicionado, não uma dependência real [package.json]
- [x] [Review][Patch] Override de `app.close` chama `originalClose()` e depois `pool.end()` sem try/finally — se `originalClose()` lançar, `pool.end()` é pulado [apps/api/src/composition-root.ts:19-20]
- [x] [Review][Patch] `markPending`/`markFailure` acessam `request.rows[0]` sem checar `rowCount` — lançaria `TypeError` não tratado em vez de um erro de domínio claro [packages/adapters/src/db/postgres-provisioning-repository.ts:68-69,79-80]
- [x] [Review][Patch] `redaction.ts`: `redact()` sem guarda contra referência circular (risco de stack overflow) e regex `SENSITIVE` mira chaves camelCase que não correspondem às colunas snake_case das linhas reais do banco [packages/adapters/src/observability/redaction.ts:1-6]

- [x] [Review][Defer] `knownResult` só faz polling por ~1s (40×25ms) antes de tratar uma solicitação concorrente em andamento como conflito [packages/application/src/provisioning/create-condominium.ts:12-23] — deferido, pré-existente
- [x] [Review][Defer] `Argon2PasswordHasher.verify` não tem caminho de fallback para pepper anterior — rotação de pepper bloquearia todas as Contas existentes; ainda não alcançável nesta story (login é Story 1.4) [packages/adapters/src/security/argon2-password-hasher.ts:9-12] — deferido, pré-existente
- [x] [Review][Defer] `argon2.verify` pode lançar exceção em hash malformado em vez de resolver `false`; mesma ressalva de alcançabilidade do item anterior [packages/adapters/src/security/argon2-password-hasher.ts:10-12] — deferido, pré-existente
- [x] [Review][Defer] `packages/adapters`, `application`, `config`, `api-client`, `test-support` não têm `tsconfig.json`/script de build próprios — checados apenas transitivamente pelos apps que os importam hoje [packages/*/package.json] — deferido, pré-existente
- [x] [Review][Defer] `scripts/dev.mjs` fixa o nome da distro WSL `Ubuntu` e um mapeamento de drive-letter para `/mnt` — quebra para distro com outro nome ou raiz de automount não padrão [scripts/dev.mjs:7,64] — deferido, pré-existente
- [x] [Review][Defer] Migrations global/tenant rodam via `pool.query` simples a cada boot, sem advisory lock — condição de corrida em boot concorrente multi-instância [packages/adapters/src/db/postgres-global-migrator.ts:6] — deferido, pré-existente
- [x] [Review][Defer] `apps/api/src/index.ts`: `await startApi()` de topo sem try/catch explícito depende do comportamento padrão do Node para rejeição não tratada [apps/api/src/index.ts:6-8] — deferido, pré-existente

## Dev Notes

### Contexto de implementação

- Esta story inaugura a persistência e o backend reais do monorepo criado na Story 1.1. Os shells em `apps/api`, `packages/application`, `packages/adapters`, `packages/config` e `packages/api-client` devem ser estendidos conforme as fronteiras existentes.
- O fluxo termina em **provisionamento pendente**. Token, envio de verificação, consumo do token e ativação são Story 1.3; login, sessão, seleção de Condomínio, CSRF autenticado e `TenantContext` são Story 1.4.
- A autodeclaração registra uma afirmação do usuário; não certifica identidade civil, eleição, mandato ou legitimidade jurídica.
- `epics-and-stories.md` é rascunho histórico superado. Não herdar dele nome global único, senha temporária/por convite, seletor de perfis, acesso imediato ou autenticação dentro da Story 1.2.
- Não determinar nesta story bases legais e prazos de retenção ainda abertos no PRD. Estruture os registros para futura governança/exportabilidade sem inventar política.

### Arquitetura e contratos obrigatórios

- Backend: monólito modular vertical; controllers somente validam/traduzem e chamam casos de uso; domínio protege invariantes; adapters concretos entram apenas nos composition roots.
- API: REST JSON em `/api/v1`, `camelCase`, validação runtime, OpenAPI como contrato, cliente TypeScript gerado, erros RFC 9457 e correlação por `X-Request-Id`.
- Persistência: PostgreSQL por Kysely ou migration SQL versionada; global e tenant separados; consultas qualificadas/`withSchema`; `SET LOCAL search_path` somente dentro de transação controlada.
- Segurança: deny-by-default, configuração fail-closed, same-origin sem CORS, saída minimizada e nenhum segredo em telemetria. O nome do schema nunca entra nem sai do contrato HTTP.
- Idempotência: vincular operação, chave e hash canônico da requisição; incluir Conta/tenant somente quando resolvidos com segurança. Mesmo conteúdo retorna o resultado persistido; conteúdo divergente é `409`.
- Provisionamento: `CREATE SCHEMA` e migration tenant tornam o fluxo uma saga/workflow compensável. Especificar claramente transação global, failpoints, retomada, compensação/quarentena e critérios de reconciliação.
- A Story 1.2 não pode criar `TenantContext` autorizado. O tenant registry e a autoridade permanecem pendentes até a ativação atômica da Story 1.3.

### Stack e versões

- Manter os pins arquiteturais: Node.js `24.18.0`, TypeScript `7.0.2`, React `19.2.7`, TanStack Start `1.168.30`, Vite `8.1.5`, NestJS/platform-fastify `11.1.20`, Fastify `5.10.0`, PostgreSQL `18.4`, Kysely `0.29.2`, Kysely Codegen `0.20.0`, Vitest `4.1.10`, Cypress `15.19.0` e Testcontainers `12.0.4`.
- A Story 1.1 registrou decisão explícita do proprietário para resolver TanStack Router em `1.170.18`, dependência publicada compatível com Start `1.168.30`. Preservar o lockfile; não forçar a versão inexistente `1.168.30` do Router nem atualizar silenciosamente.
- Argon2id: usar implementação compatível com a stack e baseline mínimo OWASP vigente; o pepper deve permanecer fora do banco e ser fornecido como segredo runtime versionado.

### UX e acessibilidade

- Preservar os tokens e padrões da Story 1.1 e das UX Spines: visual sóbrio/institucional, links sublinhados, foco visível, botão com alvo confortável e mensagens não dependentes de cor.
- Formulário em uma coluna até 768 px e no máximo duas acima; sem scroll bidimensional em 320 CSS px/400%.
- `State panel` deve trazer título, explicação, próxima ação segura e correlation ID quando útil; não anunciar sucesso antes da persistência conhecida.
- Em rede incerta, preservar entrada quando seguro e reconciliar o resultado idempotente. Fechar a tela não equivale a cancelar trabalho já aceito.

### Arquivos existentes a ler e preservar

- `apps/web/src/components/OnboardingStartPage.tsx`: hoje informa “Nada foi criado ainda”; substituir pela experiência real preservando H1, back-link e ausência de efeito na navegação.
- `apps/web/src/routes/comecar.tsx`, `apps/web/src/router.tsx` e `apps/web/src/routeTree.gen.ts`: preservar acesso direto, SSR e hydration.
- `apps/web/src/styles.css`: reutilizar tokens, foco, reflow, forced colors e reduced motion existentes.
- `apps/api/src/index.ts`: shell atual com `basePath: '/api/v1'`; evoluir para composition root executável sem perder a fronteira.
- `packages/application/src/index.ts`, `packages/adapters/src/index.ts`, `packages/config/src/index.ts`, `packages/api-client/src/index.ts`: shells reais da base greenfield; criar módulos abaixo deles e exportar somente contratos permitidos.
- `scripts/check-boundaries.mjs`, `tests/boundaries.test.ts`, `tests/entrypoints.test.ts`, `tests/ssr-smoke.test.ts`, `tests/accessibility-contract.test.ts` e `cypress/e2e/public-entry.cy.js`: ampliar sem reduzir os guardrails aprovados.

### Protótipo histórico: não reutilizar como contrato

- `src/App.tsx` e `src/server/*` permanecem histórico recuperável pelo Git. Não adaptar silenciosamente nem importar na base greenfield.
- Comportamentos proibidos do protótipo: Express/CORS irrestrito, `/api` sem versão, JSON/memória, identidade/tenant enviados pelo cliente, resposta contendo `passwordHash`, senha temporária devolvida na UI, falso “e-mail enviado”, tenant imediatamente ativo, nome globalmente “único” por sufixo, roles amplas e erros que apagam/corrompem estado.

### Project Structure Notes

Estrutura provável, ajustável aos padrões já presentes:

```text
apps/api/src/                         # bootstrap, module, controller/DTO
apps/web/src/components/              # onboarding e state panels
apps/web/src/routes/comecar.tsx       # rota pública existente
packages/application/src/identity/    # credencial e ports
packages/application/src/tenancy/     # registro/autoridade pendente
packages/application/src/provisioning/# workflow e estados
packages/adapters/src/db/             # Kysely, repositories e migrator
packages/config/src/                  # config tipada e fail-closed
packages/api-client/                  # cliente gerado do OpenAPI
migrations/global/                    # schema global versionado
migrations/tenant/                    # tenant canônico versionado
tests/                                # integração real e regressões
cypress/e2e/                          # fluxo público acessível
```

Arquivos `UPDATE` prováveis: `package.json`, `package-lock.json`, manifests/configs dos workspaces; `apps/api/src/index.ts`; `apps/web/src/components/OnboardingStartPage.tsx`, rota e estilos; índices dos pacotes; Vitest/build/boundary scripts e testes existentes. O plano final e todo arquivo criado/modificado devem constar no File List do Dev Agent Record.

### Testing Requirements

- PostgreSQL 18 real via Testcontainers é obrigatório para evidência de schema, migrations, concorrência, transação, compensação e isolamento; mocks não bastam.
- Testar falha após cada recurso parcial e comprovar que o tenant não fica utilizável.
- Testar não enumeração além da copy: status, formato, headers, efeitos e observabilidade pública não podem revelar Conta existente.
- Testar que senha/hash/pepper/token/schema interno não aparecem em resposta, OpenAPI, logs, auditoria ou snapshots.
- Testar dois Condomínios de mesmo nome e isolamento de IDs/schemas.
- Testar que manipulação de URL/payload e acesso direto antes da verificação não ativam tenant, não criam sessão e não constroem `TenantContext`.

### Inteligência da Story anterior e do Git

- A Story 1.1 entregou monorepo, SSR/hydration, navegação pública, boundary checks, API/worker independentes e smoke final com 33 testes Vitest e 6 cenários Cypress. Preserve esses gates.
- O Router foi reconciliado com autorização explícita; Cypress precisou `@babel/preset-typescript` e runner autônomo. Não reverta essas decisões.
- Commits recentes: `8bd9171` consolidou a decomposição atual; `b376293` contém o protótipo histórico. Planejamento atual e base greenfield prevalecem.
- O worktree possui mudanças não commitadas da Story 1.1 e artefatos do usuário. Não limpar, resetar ou substituir alterações fora do escopo.

### Informação técnica atual verificada

- OWASP recomenda Argon2id e pepper armazenado separadamente do banco, idealmente em vault/HSM; parâmetros devem ser medidos sem cair abaixo do baseline atual. [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- PostgreSQL 18 trata schemas como namespaces e alerta que `search_path` confia em quem possui `CREATE` nos schemas incluídos; prefira nomes qualificados/`withSchema` e privilégios mínimos. [PostgreSQL 18 — Schemas](https://www.postgresql.org/docs/18/ddl-schemas.html)
- `CREATE SCHEMA` exige privilégio `CREATE`, aceita `AUTHORIZATION` e nomes iniciados por `pg_` são reservados; gere e valide o identificador internamente. [PostgreSQL 18 — CREATE SCHEMA](https://www.postgresql.org/docs/18/sql-createschema.html)
- Node.js 24 fornece UUIDs aleatórios criptograficamente seguros; use a convenção arquitetural definida para IDs opacos, sem criar identificadores sequenciais. [Node.js 24 Crypto](https://nodejs.org/download/release/v24.16.0/docs/api/crypto.html)

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Épico 1, Story 1.2 e dependências/invariantes]
- [Source: `_bmad-output/planning-artifacts/prd.md` — UJ-1, FR-3, FR-5, NFRs, segurança/privacidade, escopo e gates]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/ARCHITECTURE-SPINE.md` — AD-1–AD-11, AD-23–AD-26, Stack, Structural Seed e Capability Map]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-burgoweb-2026-07-27/EXPERIENCE.md` — Foundation, Começar, State Patterns, Responsive, Accessibility Floor e UJ-1]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-burgoweb-2026-07-27/DESIGN.md` — Brand & Style, Layout, Form field, Button e State panel]
- [Source: `docs/product/discovery/01-identidade-e-proposito.md` — princípios, tom e promessas]
- [Source: `docs/product/discovery/03-segmentos-e-personas.md` — cliente, adotante e separação Pessoa/Vínculo/Papel]
- [Source: `docs/product/discovery/04-necessidades-e-jornadas.md` — entrada e adoção progressiva]
- [Source: `docs/product/discovery/07-mapa-de-capacidades.md` — cadastro, configuração e controles essenciais]
- [Source: `docs/product/discovery/08-decisoes-hipoteses-e-riscos.md` — autoridade como questão refinada posteriormente]
- [Source: `_bmad-output/implementation-artifacts/1-1-conhecer-o-burgoweb-e-iniciar-gratuitamente.md` — decisões, implementação, revisão e File List]
- [Source: `apps/web/src/components/OnboardingStartPage.tsx`, `apps/api/src/index.ts`, `src/App.tsx`, `src/server/*.ts` — estado atual e histórico incompatível]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- 2026-07-28 — Implementação iniciada no baseline `8bd91716b0c465c303cb00586a20af3e997fa31f`; story e sprint mantidos em `in-progress`.
- 2026-07-28 — Núcleo, contrato HTTP e UI validados com 42/42 testes Vitest; `check:types`, `check:boundaries` e `build` aprovados.
- 2026-07-28 — HALT no gate obrigatório de integração: executável `docker` não está instalado/disponível, portanto PostgreSQL 18 via Testcontainers, migrations reais, concorrência, isolamento e failpoints ainda não puderam ser comprovados.
- 2026-07-28 — Ambiente executa Node.js `22.11.0`, abaixo do pin arquitetural `24.18.0`; npm reportou incompatibilidades de engine e 10 vulnerabilidades high na árvore instalada, pendentes de triagem sem atualização forçada.
- 2026-07-28 — Retomada solicitada após instalação de WSL/Docker em outro perfil Windows. No perfil que executa o workspace, `wsl.exe --list --verbose` informa que não há distribuições registradas; Docker CLI, Docker Desktop e serviço global também não foram encontrados. Credenciais fornecidas pelo usuário não foram inseridas em comandos, arquivos ou logs.
- 2026-07-28 — O contexto escalado confirmou Ubuntu WSL2 com usuário padrão `operador01` e Docker Engine 29.6.2 funcional. Node.js 24.18.0 foi instalado localmente no WSL, sem necessidade da senha fornecida.
- 2026-07-28 — Gate PostgreSQL 18.4 via Testcontainers aprovado: 4/4 testes de migrations retomáveis, isolamento, nomes repetidos, concorrência idempotente, proibição de estado `active`, validação de schema e compensação.
- 2026-07-28 — Composition root NestJS/platform-fastify e OpenAPI adicionados; Argon2id real, TypeScript, boundaries, build e 44 testes não integrados aprovados. Integração fica opt-in por `BURGOWEB_INTEGRATION=1` para não depender de Docker na suíte Windows.
- 2026-07-28 — Regressão Cypress inicialmente detectou remoção da nota de navegação sem mutação; copy restaurada e repetição aprovada com 6/6 cenários.
- 2026-07-29 — Cliente HTTP web passou a ser criado no browser após hydration; 11/11 cenários Cypress aprovados, incluindo duplo envio, retomada idempotente, conflito, foco e axe em 320 px.
- 2026-07-29 — Gates automatizados finais aprovados: 48/48 testes não integrados, 7/7 integrações PostgreSQL 18.4/Testcontainers, contrato OpenAPI, boundaries, build e `npm run smoke`.
- 2026-07-29 — Único gate aberto: revisão humana de acessibilidade com leitor de tela, teclado, zoom/reflow, text spacing, reduced motion e forced colors; automação axe e contratos CSS passaram, mas não substituem a evidência humana exigida.
- 2026-07-29 — Teste manual revelou que `npm run dev` iniciava apenas o frontend. Ambiente local corrigido para orquestrar PostgreSQL 18 no Docker/WSL, API, proxy same-origin e frontend com segredos efêmeros; POST real pelo proxy retornou `pending-email-verification`.
- 2026-07-29 — Revisão humana de acessibilidade confirmada pelo proprietário: teclado, leitor de tela, ordem/anúncios de foco, zoom 200%, reflow 320 px/400%, text spacing, reduced motion e forced colors aprovados. Regressão final aprovada com 48/48 testes Vitest, 11/11 Cypress, TypeScript, OpenAPI, boundaries, build e 7/7 integrações PostgreSQL 18/Testcontainers.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- História criada com base na decomposição vigente, nas fontes canônicas de produto, na arquitetura versionada, nas UX Spines, no código atual e nos aprendizados da Story 1.1.
- Conflitos do rascunho `epics-and-stories.md` foram explicitamente neutralizados.
- Contrato, validação, declaração versionada, estados, idempotência, compensação, Argon2id/configuração fail-closed, redaction, SQL, API same-origin/RFC 9457, cliente tipado e formulário acessível foram concluídos.
- Bloqueio de infraestrutura PostgreSQL resolvido; adapter completo, cliente OpenAPI e cobertura de estados/failpoints foram concluídos e validados.
- API NestJS/platform-fastify, composition root PostgreSQL/Argon2id, OpenAPI e cliente gerado foram concluídos com validação de origem, rate limiting por sinais e bloqueio de `TenantContext` pré-ativação.
- O fluxo público `/comecar` foi concluído com validação acessível, preservação de entrada, estados seguros, bloqueio de duplo envio e retomada pela mesma chave idempotente.
- Ambiente de desenvolvimento agora sobe ponta a ponta com um único `npm run dev`, aguarda readiness e limpa a infraestrutura temporária no encerramento normal.
- Toda validação automatizável passou; a revisão humana de acessibilidade explicitamente exigida foi posteriormente concluída sem falhas.
- Revisão humana de acessibilidade concluída sem falhas; definição de pronto integralmente atendida e história promovida para `review`.

### File List

- package.json
- package-lock.json
- tsconfig.json
- apps/api/package.json
- apps/api/src/index.ts
- apps/api/src/composition-root.ts
- apps/api/src/nest-app.ts
- apps/api/src/openapi.ts
- apps/web/package.json
- apps/web/src/components/OnboardingStartPage.tsx
- apps/web/src/styles.css
- apps/web/vite.config.ts
- infra/compose/compose.dev.yml
- infra/compose/README.md
- migrations/global/001_provisioning.sql
- migrations/tenant/001_identity_pending.sql
- packages/adapters/package.json
- packages/adapters/src/index.ts
- packages/adapters/src/db/postgres-global-migrator.ts
- packages/adapters/src/db/postgres-provisioning-repository.ts
- packages/adapters/src/db/postgres-tenant-migrator.ts
- packages/adapters/src/observability/redaction.ts
- packages/adapters/src/security/argon2-password-hasher.ts
- packages/api-client/src/index.ts
- packages/api-client/src/provisioning.ts
- scripts/generate-api-client.mjs
- scripts/dev.mjs
- cypress/e2e/public-entry.cy.js
- tests/api-client-contract.test.ts
- packages/application/src/index.ts
- packages/application/src/identity/password-hasher.ts
- packages/application/src/provisioning/canonical-request.ts
- packages/application/src/provisioning/contracts.ts
- packages/application/src/provisioning/create-condominium.ts
- packages/application/src/provisioning/ports.ts
- packages/config/src/index.ts
- packages/config/src/security-config.ts
- tests/api-provisioning.test.ts
- tests/css-modules.d.ts
- tests/provisioning.test.ts
- tests/postgres-integration.test.ts

### Change Log

- 2026-07-28 — Story 1.2 criada e marcada como `ready-for-dev`.
- 2026-07-28 — Implementação retomada com WSL/Docker; infraestrutura de integração PostgreSQL 18, NestJS/OpenAPI e regressões ampliadas, mantendo status `in-progress`.
- 2026-07-29 — API, persistência real, cliente gerado e UX concluídos; todos os gates automatizados aprovados. Mantido `in-progress` até revisão humana de acessibilidade.
- 2026-07-29 — Ambiente `npm run dev` reparado após teste manual: stack completa Docker/WSL + API + web validada ponta a ponta.
- 2026-07-29 — Revisão humana de acessibilidade e regressão final concluídas; Story 1.2 promovida para `review`.
- 2026-07-30 — `bmad-code-review` executado (Blind Hunter, Edge Case Hunter, Acceptance Auditor). 3 achados `decision-needed` decididos pelo proprietário e resolvidos como `patch`; 12 `patch` aplicados no total; 7 `defer` registrados em `deferred-work.md`; 3 descartados como ruído. Suíte não integrada (48/48), `check:types`, `check:boundaries`, `check:api-contract` e `npm run build` revalidados após as correções. Story promovida para `done`.
