---
baseline_commit: 8bd91716b0c465c303cb00586a20af3e997fa31f
---

# Story 1.5: Recuperar acesso e controlar sessões

Status: done

## Story

Como Pessoa com Conta,
Quero recuperar meu acesso e controlar minhas sessões ativas,
Para que eu possa retomar o uso com segurança após perder ou suspeitar do comprometimento da credencial.

## Acceptance Criteria

1. **Solicitação neutra e não enumerável**
   - **Dado** que alguém informa um e-mail no fluxo de recuperação
   - **Quando** solicita instruções de acesso
   - **Então** o sistema apresenta a mesma resposta pública, exista ou não Conta elegível
   - **E** não revela existência, estado, Papéis, Vínculos ou Condomínios relacionados.

2. **Token de recuperação e outbox**
   - **Dado** que existe Conta elegível para recuperação
   - **Quando** a solicitação é aceita dentro dos limites de abuso
   - **Então** o sistema gera token aleatório, de finalidade exclusiva, uso único e validade finita, persistindo somente seu hash
   - **E** registra a notificação em outbox para processamento idempotente pelo worker.

3. **E-mail de recuperação minimizado**
   - **Dado** que o e-mail de recuperação é produzido
   - **Quando** a mensagem é enviada
   - **Então** explica finalidade, expiração e efeito da recuperação sem incluir senha, dados institucionais ou detalhes de segurança
   - **E** não utiliza tracking de abertura ou clique.

4. **Redefinição segura da credencial**
   - **Dado** que uma Pessoa apresenta token válido de recuperação
   - **Quando** define uma nova senha conforme a política vigente
   - **Então** a credencial é persistida com Argon2id, salt individual e pepper versionado
   - **E** o token consumido e os demais tokens de recuperação anteriores deixam de poder alterar a Conta.

5. **Nova sessão sem ampliação de autoridade**
   - **Dado** que a recuperação é concluída
   - **Quando** o novo acesso é estabelecido
   - **Então** o sistema rotaciona a sessão usada no fluxo e oferece opção explícita para encerrar todas as demais sessões da Conta
   - **E** nenhuma recuperação transfere, cria ou amplia Papel, Vínculo ou capacidade em qualquer Condomínio.

6. **Revogação de todas as demais sessões**
   - **Dado** que a Pessoa escolhe encerrar todas as demais sessões
   - **Quando** confirma a ação
   - **Então** todas as sessões anteriores alcançadas são revogadas, exceto a nova sessão quando isso for informado claramente
   - **E** qualquer reutilização dos tokens revogados é negada.

7. **Consulta e revogação individual**
   - **Dado** que a Pessoa autenticada consulta suas sessões
   - **Quando** abre o controle de sessões
   - **Então** visualiza somente metadados mínimos úteis, como criação, última atividade aproximada e estado
   - **E** pode revogar uma sessão individual sem ver token, cookie, endereço completo ou dado excessivo.

8. **Falha segura de token**
   - **Dado** que um token é inválido, expirado, utilizado, revogado ou pertence a outra finalidade
   - **Quando** alguém tenta recuperar a Conta
   - **Então** nenhuma credencial, sessão ou autoridade é alterada
   - **E** a resposta oferece caminho seguro para nova solicitação sem revelar o motivo interno explorável.

9. **Consumo concorrente de uso único**
   - **Dado** que duas tentativas concorrentes usam o mesmo token
   - **Quando** a primeira conclui a recuperação
   - **Então** somente uma nova credencial é confirmada e as demais tentativas falham de forma segura
   - **E** não ocorre restauração de sessão ou credencial anterior por condição de corrida.

10. **Proteção contra abuso multissinal**
    - **Dado** que solicitações repetidas ou automatizadas excedem os limites
    - **Quando** o sistema aplica proteção contra abuso
    - **Então** considera Conta candidata, operação e sinais de origem, sem depender apenas do IP
    - **E** mantém resposta sem enumeração, quotas, alertas e auditoria minimizada.

11. **Experiência acessível e responsiva**
    - **Dado** que recuperação, redefinição ou gestão de sessões são usadas em mobile, desktop, teclado ou tecnologia assistiva
    - **Quando** estados de processamento, sucesso, expiração, conflito ou erro são apresentados
    - **Então** foco, rótulos, instruções e confirmações cumprem WCAG 2.2 AA
    - **E** ações sensíveis exigem confirmação compreensível e não dependem apenas de cor.

## Tasks / Subtasks

- [x] **1. Fechar contratos, política e configuração da recuperação** (AC: 1–5, 8–10)
  - [x] Criar commands/results/ports em `packages/application/src/identity` para solicitar e concluir recuperação, distinguindo resultado interno de resposta pública neutra; controllers/adapters apenas traduzem e chamam casos de uso.
  - [x] Definir token de recuperação integralmente aleatório por CSPRNG, com finalidade própria, entropia suficiente, TTL configurável e hash/HMAC server-side versionado; token bruto existe apenas no link entregue e nunca vira token de sessão.
  - [x] Estender configuração tipada e fail-closed com keyring/segredo, TTL e limites de abuso específicos de recuperação, impondo limites seguros para Node/PostgreSQL. Não reutilizar chave/domínio criptográfico de sessão, verificação ou convite.
  - [x] Preservar a política de senha e `PasswordHasher` Argon2id da 1.4, inclusive salt individual, pepper versionado, tratamento neutro de hash malformado e atualização concorrente segura.
  - [x] Fixar neutralidade para Conta ausente, inativa, inelegível ou limitada: mesmo status, corpo, headers e caminho funcional público, com custo aproximado sem promessa de igualdade temporal absoluta.

- [x] **2. Persistir tokens e estender outbox por migrations incrementais** (AC: 2–4, 8, 9)
  - [x] Criar migration global `004_*` aditiva; nunca reescrever migrations 001–003. Modelar recovery token hash-only com Conta, finalidade, criação, expiração, consumo/revogação e key version; adicionar constraints/índices para uso único, limpeza e concorrência.
  - [x] Reutilizar a outbox PostgreSQL, lease, retry/backoff, dead-letter e idempotência da 1.3; acrescentar novo tipo de mensagem/handler, sem Redis, BullMQ ou fila paralela.
  - [x] Garantir transação atômica para criação do token e enfileiramento da notificação; retry do worker não pode duplicar a entrega/efeito. Não cancelar tokens anteriores na solicitação sem requisito: o AC exige invalidá-los quando uma recuperação é concluída.
  - [x] Testar banco vazio, upgrade 003→004, rerun idempotente e boot/processamento concorrentes em PostgreSQL 18.

- [x] **3. Implementar solicitação, notificação e proteção contra enumeração** (AC: 1–3, 10)
  - [x] Normalizar o seletor de e-mail como no login e derivar seletor pessoal por HMAC; aplicar buckets independentes por operação+candidato e operação+origem confiável usando o rate limiter existente, nunca um bucket combinado ou somente IP.
  - [x] Executar caminho público uniforme mesmo sem Conta elegível; não personalizar resposta por Conta, Papel, Vínculo, Condomínio, limite interno ou entrega do provedor.
  - [x] Produzir e-mail em linguagem simples com finalidade, expiração, efeito e link de uso único; não incluir senha, dados do Condomínio, estado interno, detalhes de segurança ou promessa de entrega.
  - [x] Usar `EmailPort` e provider já abstraído; manter tracking de abertura/clique desligado e impedir token/e-mail em logs, auditoria, métricas, erro do provider ou telemetria.
  - [x] Auditar solicitação aceita/negada/limitada e processamento de outbox de forma minimizada e correlacionada, separando auditoria de logs técnicos.

- [x] **4. Consumir token e estabelecer nova sessão atomicamente** (AC: 4, 5, 8, 9)
  - [x] Em uma transação com lock/guard condicional, validar finalidade, hash, estado e expiração; somente um consumidor pode trocar a credencial e marcar o token usado.
  - [x] Persistir a nova senha e invalidar todos os recovery tokens anteriores da Conta na mesma transação; falha/conflito não pode produzir update parcial nem restaurar credencial ou sessão anterior.
  - [x] Cumprir o AC canônico estabelecendo uma nova sessão opaca da 1.4 após a redefinição: gerar novo token de sessão e CSRF, persistir apenas hashes e emitir cookie somente depois do commit. Nunca converter/reutilizar recovery token como sessão nem manter identificador preexistente (session fixation).
  - [x] Disponibilizar escolha explícita para preservar a nova sessão e encerrar todas as demais. Não alterar Conta, tenant, Pessoa, Vínculo, Papel, capacidade ou `TenantContext` como efeito da recuperação.
  - [x] Responder token inválido/expirado/usado/revogado/finalidade incorreta de forma não explorável, sem alterar estado e com caminho para nova solicitação.
  - [x] Gravar troca de credencial, consumo/invalidação dos tokens, criação/rotação da sessão e Eventos de Auditoria relacionados atomicamente quando compartilharem a transição.

- [x] **5. Listar e revogar as próprias sessões** (AC: 6, 7, 10)
  - [x] Estender `IdentityRepository` e use cases existentes; identificar sessões por `publicId` opaco distinto do token/hash e sempre restringir queries à Conta autenticada.
  - [x] Retornar somente criação, última atividade aproximada, estado e indicador confiável da sessão atual; não expor token/hash/cookie, IP/endereço completo, User-Agent bruto, schema, tenant ou fingerprint excessivo.
  - [x] Implementar revogação individual com ownership revalidado, guard de estado e resultado idempotente. Revogar a sessão atual equivale a logout real: revogar server-side, limpar cookie/contexto e encaminhar para entrada.
  - [x] Implementar “encerrar todas as demais” em uma transação, preservando explicitamente o ID interno da nova/atual sessão; sessões criadas/revogadas concorrentemente terminam no estado mais restritivo e replay sempre falha.
  - [x] Manter o touch de `last_seen_at` como única exceção técnica em GET, com throttle configurável de 300 segundos herdado da 1.4; listagem não pode ressuscitar ou tocar sessões alheias.
  - [x] Auditar revogação individual/em massa com `requestId`, ação, resultado e seletores mínimos; estado e evento correspondente devem ser atômicos.

- [x] **6. Expor API, OpenAPI e cliente gerado** (AC: 1–10)
  - [x] Adicionar contratos REST JSON sob `/api/v1`: solicitação/conclusão de recuperação públicas e listagem/revogação de sessões autenticadas. Definir DTOs, status e RFC 9457 sem incluir token em URL de API, problema, log ou `X-Request-Id`.
  - [x] Manter `Cache-Control: no-store`, CORS desabilitado, redaction e `X-Request-Id`; mutações autenticadas exigem synchronizer CSRF + Origin/Referer/Fetch Metadata como na 1.4. A conclusão pública do recovery deve validar origem/fetch metadata e o token no body, não como autorização genérica.
  - [x] Definir semântica idempotente/neutra para revogação repetida, sessão já expirada e rede incerta; declarar todas as respostas reais no OpenAPI.
  - [x] Atualizar `scripts/generate-api-client.mjs` e regenerar `packages/api-client`; nunca editar somente o artefato gerado. Requests autenticados usam `credentials: 'same-origin'` e aceitam `AbortSignal`.
  - [x] Preservar integralmente provisioning, verificação/reenvio, login, tenancy, dashboard e logout das Stories 1.1–1.4.

- [x] **7. Construir recuperação e controle de sessões acessíveis** (AC: 1, 3, 5–8, 11)
  - [x] Criar rotas/componentes em `apps/web` para solicitar/redefinir acesso e para “Conta e sessões”; não usar o protótipo legado `src/**`. Atualizar `routeTree.gen.ts` somente pelo gerador TanStack.
  - [x] Reutilizar shell, tokens visuais, `StatePanel`, error summary, foco, labels/ajuda, `aria-describedby`, `aria-busy`, live message e mostrar/ocultar senha existentes. Permitir colagem e gerenciador de senhas, com confirmação da nova senha conforme política.
  - [x] Manter solicitação pública neutra e resultado persistente. Token inválido/expirado/usado apresenta o mesmo caminho seguro para nova solicitação; token e e-mail não permanecem em title, history, query, breadcrumb, cache ou live region.
  - [x] Na área autenticada, manter Condomínio ativo visível sem apresentar gestão da Conta global como autoridade tenant. Diferenciar claramente sessão atual e demais sessões, inclusive escopo/efeito de “encerrar todas as demais”.
  - [x] Confirmar revogações sensíveis nomeando objeto, efeito e reversibilidade; Enter em campo não confirma implicitamente. Não anunciar sucesso antes da confirmação server-side; falha mantém diálogo aberto e foca o resumo.
  - [x] Tratar loading, vazio útil, processamento, sucesso, expiração, conflito concorrente, indisponibilidade, offline, duplo envio/rede incerta e sessão revogada. Revogação/expiração da atual remove imediatamente conteúdo autenticado, cache, rota e title antes do redirecionamento neutro.
  - [x] Garantir reflow a 320 CSS px/400%, zoom 200%, teclado completo, foco visível/restaurado, um H1, title coerente, landmarks, skip link, reduced-motion, forced-colors, contraste e alvos WCAG 2.2 AA.

- [x] **8. Automatizar segurança, concorrência, regressão e acessibilidade** (AC: 1–11)
  - [x] Unitários: finalidade/TTL/hash-only, política de senha, token inválido/expirado/usado/revogado, neutralidade, rate-limit multissinal, consumo concorrente, rotação/fixation e revogação idempotente/concorrente.
  - [x] API/contrato: DTO/status/path, resposta uniforme, cookie/CSRF/origin/fetch metadata/no-store/CORS, RFC 9457, redaction, ownership e ausência de segredos/metadados excessivos/OpenAPI.
  - [x] PostgreSQL 18: migration 004, outbox/worker idempotentes, somente um vencedor no mesmo token, atomicidade de credencial+tokens+sessão+auditoria, revogação individual/em massa e replay negado.
  - [x] Web/Cypress: solicitação neutra; token válido/inválido/usado/expirado; nova senha e sessão; escolha de encerrar demais; listagem e revogação individual/atual; abas/rede concorrentes; cleanup de cache/title/contexto; mobile e desktop.
  - [x] Validar acessibilidade com axe, teclado, foco, zoom/reflow, forced-colors/reduced-motion e inspeção assistiva; não marcar cenário concluído sem evidência executada.
  - [x] Executar `npm test`, `npm run check:types`, `npm run check:boundaries`, `npm run check:api-contract`, `npm run build`, integração PostgreSQL 18 em contêiner, Cypress e regressão completa das Stories 1.1–1.4.

### Review Findings

- [x] [Review][Patch] Validar recovery contra `config.recovery.baseUrl`, não contra a origem de verificação [apps/api/src/composition-root.ts:23]
- [x] [Review][Patch] Injetar limites configurados e consumir buckets candidato/origem independentemente [apps/api/src/nest-app.ts:51]
- [x] [Review][Patch] Normalizar o e-mail antes de derivar o bucket candidato [apps/api/src/nest-app.ts:51]
- [x] [Review][Patch] Limitar confirmações antes do Argon2 para impedir DoS com tokens inválidos [packages/application/src/identity/recovery.ts:39]
- [x] [Review][Patch] Auditar solicitações ausentes e limitadas sem quebrar neutralidade [packages/adapters/src/db/postgres-recovery-repository.ts:8]
- [x] [Review][Patch] Aproximar o custo observável dos caminhos elegível e ausente [packages/adapters/src/db/postgres-recovery-repository.ts:8]
- [x] [Review][Patch] Persistir o destinatário imutável da solicitação em vez de reler o e-mail atual da Conta [packages/adapters/src/db/postgres-recovery-outbox.ts:5]
- [x] [Review][Patch] Evitar starvation do recovery quando a fila de verificação permanece ocupada [apps/worker/src/composition-root.ts:26]
- [x] [Review][Patch] Tratar rejeição/perda de lease e exigir ownership ao finalizar a entrega [packages/application/src/identity/recovery.ts:55]
- [x] [Review][Patch] Auditar claim, retry, ambiguidade e dead-letter da outbox de recovery [packages/adapters/src/db/postgres-recovery-outbox.ts:5]
- [x] [Review][Patch] Verificar `rowCount` ao trocar a credencial antes de consumir token/criar sessão [packages/adapters/src/db/postgres-recovery-repository.ts:9]
- [x] [Review][Patch] Revalidar elegibilidade da Conta ao consumir o token [packages/adapters/src/db/postgres-recovery-repository.ts:9]
- [x] [Review][Patch] Cancelar somente tokens anteriores ao token consumido [packages/adapters/src/db/postgres-recovery-repository.ts:9]
- [x] [Review][Patch] Serializar “encerrar todas as demais” contra criação concorrente de sessões [packages/adapters/src/db/postgres-recovery-repository.ts:12]
- [x] [Review][Patch] Não responder/auditar sucesso quando o guard da sessão atual falhar [packages/adapters/src/db/postgres-recovery-repository.ts:12]
- [x] [Review][Patch] Validar `publicId` antes de consultar a coluna UUID [apps/api/src/nest-app.ts:60]
- [x] [Review][Patch] Limitar/paginar sessões históricas retornadas à interface [packages/adapters/src/db/postgres-recovery-repository.ts:10]
- [x] [Review][Patch] Declarar no OpenAPI todas as respostas realmente emitidas [apps/api/src/openapi.ts:5]
- [x] [Review][Patch] Renovar CSRF e repetir de forma segura após 403 entre abas [apps/web/src/components/AccountSessionsPage.tsx:3]
- [x] [Review][Patch] Manter confirmação acessível aberta em falha e focar o resumo de erro [apps/web/src/components/AccountSessionsPage.tsx:3]
- [x] [Review][Patch] Renderizar orientação útil quando a lista de sessões estiver vazia [apps/web/src/components/AccountSessionsPage.tsx:3]
- [x] [Review][Defer] Desempatar retenção de tokens CSRF criados no mesmo timestamp [packages/adapters/src/db/postgres-identity-repository.ts:24] — deferred, pre-existing

## Dev Notes

### Contexto e limites obrigatórios

- A Story 1.5 estende dois baselines já entregues: tokens/outbox/worker da 1.3 e autenticação/sessão/CSRF da 1.4. Reutilize os ports, adapters, migrations e testes existentes; não crie uma segunda infraestrutura de token, fila, e-mail ou sessão.
- Recuperação comprova controle do canal de e-mail verificado conforme o contrato; não comprova identidade civil, mandato ou autoridade institucional.
- A conclusão deve obedecer ao AC do produto e estabelecer uma nova sessão opaca, apesar de recomendações genéricas que preferem novo login. O recovery token permanece finalidade única e nunca é autenticação reutilizável.
- “Encerrar todas as demais” preserva somente a nova/atual sessão quando isso estiver explícito. Revogar a própria sessão atual é logout e usa o comportamento seguro da 1.4.
- Não antecipar contenção/investigação de Conta comprometida, revogação de Convites, transferência de Síndico ou recuperação administrativa das Stories 1.11 e 6.5–6.6.
- Não criar nem modificar Condomínio, Pessoa, Unidade, Vínculo, Papel ou capacidade. A recuperação nunca é elevação de privilégio.
- Apps móveis nativos ficam fora do MVP; a experiência web responsiva e acessível é obrigatória.

### Arquitetura e segurança obrigatórias

- Módulos verticais: use cases dependem de ports; adapters concretos entram apenas nos composition roots. Identity global permanece em `packages/application/src/identity`; nenhum tipo de persistência atravessa a API.
- API REST JSON `/api/v1`, `camelCase`, validação runtime, OpenAPI/cliente gerado, RFC 9457 e `X-Request-Id`; banco em `snake_case`, `timestamptz` UTC e IDs opacos.
- Tokens de recuperação, verificação, convite e sessão são criptograficamente e semanticamente distintos. Use CSPRNG e HMAC/hash versionado com comparação segura; persista somente hash e nunca segredos brutos.
- A outbox não pode persistir o recovery token bruto. Para permitir envio assíncrono, use um codec próprio que derive o token imprevisível a partir de contexto opaco/aleatório persistido e segredo runtime versionado, ou mecanismo equivalente que preserve literalmente o contrato hash-only; o worker recebe contexto/referência, não o segredo reutilizável. Não copiar a finalidade/chave do codec de verificação.
- Toda transição sensível usa guard/lock e checa `rowCount`. Consumo do token, troca da senha, invalidação dos demais recovery tokens e criação/rotação da sessão precisam de fronteira atômica; retry e corrida não podem confirmar dois resultados.
- Sessões continuam opacas e revogáveis em PostgreSQL, com cookie `__Host-burgoweb-session`, `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`, sem `Domain`; token bruto não vai para Web Storage.
- CSRF synchronizer token permanece ligado à sessão e hash-only. Mutações autenticadas exigem `X-CSRF-Token` e validação de Origin/Referer/Fetch Metadata; CORS continua desabilitado.
- Neutralidade cobre status, corpo, headers, caminho observável, rate-limit, outbox/entrega e custo aproximado. Nunca revelar elegibilidade ou motivo interno por copy, tempo, quota, log ou métrica.
- Auditoria é separada de logs técnicos, minimizada e correlacionada. Proibido registrar senha, e-mail bruto desnecessário, recovery/session/CSRF token, cookie, hash, pepper, segredo ou conteúdo de e-mail.
- Outbox permanece PostgreSQL com worker separado, lease, retries, backoff e dead-letter; handlers são idempotentes. Não adicionar Redis/BullMQ/nova fila sem decisão arquitetural.

### Estado atual e arquivos `UPDATE`

- `packages/application/src/identity/session.ts`: contém login, resolução/touch, refresh de CSRF e logout; ampliar a mesma abstração para ownership/listagem/revogação sem duplicar regras de validade.
- `packages/application/src/identity/password-hasher.ts` e `packages/adapters/src/security/argon2-password-hasher.ts`: já implementam verificação estruturada, peppers vigentes e falha neutra. Reutilizar para a nova credencial.
- `packages/adapters/src/security/hmac-session-token.ts` e `hmac-verification-token.ts`: copiar o padrão de adapter/contrato com domínio criptográfico próprio; não reutilizar a chave ou classe como se as finalidades fossem equivalentes.
- `packages/adapters/src/db/postgres-identity-repository.ts`: estender transações e queries de identity; manter sessão/Conta globais e ownership deny-by-default.
- `packages/adapters/src/db/postgres-rate-limiter.ts`: reutilizar buckets independentes e seletores HMAC corrigidos no review da 1.4.
- `packages/adapters/src/db/postgres-verification-repository.ts`, outbox/worker e `EmailPort`: reutilizar padrões de token, invalidação, lease e entrega da 1.3 sem acoplar finalidades.
- `packages/config/src/security-config.ts`: ampliar keyrings/TTL/rate limit fail-closed e preservar bounds seguros.
- `migrations/global/003_sessions_memberships.sql`: baseline imutável; criar `004_*` aditiva.
- `apps/api/src/nest-app.ts`, `composition-root.ts`, `openapi.ts`: acrescentar endpoints/guards/composição preservando RFC 9457, no-store, redaction, shutdown e contratos existentes.
- `scripts/generate-api-client.mjs` gera `packages/api-client/src/provisioning.ts`; editar o gerador e regenerar, nunca alterar apenas a saída.
- `apps/web/src/components/AuthenticatedPages.tsx`, rotas autenticadas, `__root.tsx`, `router.tsx` e `styles.css`: estender shell e session boundary preservando SSR/hydration, proxy same-origin, AbortSignal e limpeza de contexto.
- Testes atuais relevantes: `tests/authentication.test.ts`, `tests/api-authentication.test.ts`, `tests/postgres-integration.test.ts`, testes de migrations/contrato/SSR/a11y e `cypress/e2e/authenticated-entry.cy.js`.

### Arquivos e abordagens a não reutilizar

- `src/**` é protótipo legado em memória/arquivo; não é contrato nem alvo.
- Não adicionar JWT, Redis, SDK de autenticação, CORS, CAPTCHA cognitivo, security questions ou fingerprinting invasivo.
- Não usar token na URL da API, query, fragment, log ou auditoria. O link de e-mail pode carregar o segredo até a página, que deve removê-lo da URL/history imediatamente e enviá-lo somente no body protegido da conclusão.
- Não expor IP completo, User-Agent bruto, localização exata, hash ou identificador interno na lista de sessões.
- Não alterar silenciosamente versões/lockfile nem introduzir dependência para recurso coberto por `node:crypto` e adapters atuais.

### UX e acessibilidade

- “Recuperar acesso” fica em **Acesso sem sessão**; “Conta e sessões” fica em **Configurações**. Sessão/Conta são globais e não devem ser confundidas com gestão institucional por capacidade.
- Linguagem simples, direta e institucional; label persistente, ajuda antes do erro, entrada segura preservada, error summary focado e sucesso persistente. Toast é apenas complementar.
- Confirmação de revogação nomeia objeto, efeito, escopo e reversibilidade; a sessão atual e a exceção “manter esta sessão” precisam estar inequívocas.
- Loading mantém geometria/foco; offline/rede incerta nunca confirma mutação; negação/revogação remove dados sensíveis antes de comunicar e anuncia uma vez.
- Preservar um H1, title coerente, landmarks, skip link, `aria-current`, teclado completo, foco visível/restaurado, contraste, target size, reduced-motion e forced-colors.

### Previous Story Intelligence

- A 1.4 reservou explicitamente recuperação, listagem e revogação ampla para esta story; estenda sua sessão opaca em vez de reimplementar login/logout.
- O review da 1.4 corrigiu: CSRF recuperável entre abas, logout atômico e origin-safe, rate-limit candidato/origem independente, auditoria de auth, neutralidade Argon2, concorrência de touch, TTL bounds, ownership/versão de `TenantContext`, respostas RFC 9457 e estados UX de expiração/troca. Não regredir nenhum desses pontos.
- `GET /api/v1/auth/session` pode rotacionar CSRF e tocar `last_seen_at` somente após 300 segundos por decisão explícita do proprietário; outros GETs não alteram estado de negócio.
- Sessão expirada é estado de autenticação, não acesso tenant negado. Limpe cookie/contexto/cache/title e ofereça entrada/recuperação neutra.
- O worktree contém a implementação não commitada das Stories 1.1–1.4; Git não representa sozinho o baseline. Preserve alterações do usuário e use código/File Lists atuais.

### Stack e versões

- Ambiente-alvo confirmado pelo proprietário: Node.js 24 no WSL e PostgreSQL 18 em contêiner.
- Preservar o lockfile atual: Node `24.18.0`, TypeScript `7.0.2`, React `19.2.x`, NestJS/platform-fastify `11.1.20`, Fastify `5.10.0`, Argon2 `0.44.0`, Kysely `0.29.2`, `pg` `8.16.3`, Vitest `4.1.10`, Cypress `15.19.0` e Testcontainers `12.0.4`.
- O lockfile/código prevalece sobre versões divergentes em artefatos históricos; não alinhar dependências TanStack silenciosamente.

### Project Structure Notes

Estrutura provável para arquivos `NEW`; nomes podem variar para aderir aos módulos existentes:

```text
packages/application/src/identity/recovery.ts
packages/adapters/src/security/hmac-recovery-token.ts
packages/adapters/src/db/postgres-recovery-repository.ts  # ou extensão coesa do identity repository
migrations/global/004_recovery_tokens_sessions.sql
apps/web/src/components/AccessRecoveryPages.tsx
apps/web/src/routes/recuperar-acesso.tsx
apps/web/src/routes/redefinir-acesso.tsx
apps/web/src/routes/conta.sessoes.tsx
tests/access-recovery.test.ts
tests/api-access-recovery.test.ts
cypress/e2e/access-recovery-sessions.cy.js
```

Preservar índices de barrel existentes e limites entre workspaces. Se a implementação coesa couber em arquivos atuais, não criar abstração/repository duplicado apenas para corresponder aos nomes sugeridos.

### Latest Technical Information

- OWASP recomenda resposta e tempo aproximadamente consistentes para Conta existente/inexistente, canal lateral, token CSPRNG longo, armazenamento seguro, finalidade única, expiração e uso único; nenhuma alteração deve ocorrer antes de token válido. Também recomenda oferecer ou aplicar invalidação das sessões existentes. [OWASP Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
- OWASP recomenda que sessão customizada tenha identificador imprevisível com pelo menos 128 bits, estado server-side, expiração server-side e capacidade de consultar/revogar sessões simultâneas. [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- A recomendação OWASP de exigir login normal após redefinição é genérica; o AC mais específico e aprovado desta história exige novo acesso/sessão rotacionada. Compense com finalidade estrita, transação atômica, prevenção de fixation, cookie/CSRF da 1.4 e opção clara de revogar as demais.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Épico 1, Stories 1.3–1.5 e rastreabilidade]
- [Source: `_bmad-output/planning-artifacts/prd.md` — FR-4, FR-5, FR-33, FR-45 e NFR-6–NFR-14]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/ARCHITECTURE-SPINE.md` — AD-9–AD-11, AD-17, AD-22, AD-23 e AD-25]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-burgoweb-2026-07-27/EXPERIENCE.md` — IA, Authentication, State Patterns, Authorization/Privacy e Accessibility]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-burgoweb-2026-07-27/DESIGN.md` — formulário, componentes, responsividade e tokens visuais]
- [Source: `docs/product/discovery/01-identidade-e-proposito.md` — privacidade, acesso mínimo, simplicidade e tom]
- [Source: `docs/product/discovery/03-segmentos-e-personas.md` — distinção Pessoa/Conta/Vínculo/Papel]
- [Source: `docs/product/discovery/04-necessidades-e-jornadas.md` — acesso e continuidade]
- [Source: `docs/product/discovery/07-mapa-de-capacidades.md` — identidade, governança, auditoria e acessibilidade]
- [Source: `docs/product/discovery/08-decisoes-hipoteses-e-riscos.md` — DEC-007, DEC-008 e RSK-003]
- [Source: `_bmad-output/implementation-artifacts/1-4-entrar-sair-e-selecionar-o-condominio.md` — Dev Notes, review patches, Completion Notes e File List]
- [Source: código atual em `apps/`, `packages/`, `migrations/`, `tests/` e `cypress/` — estado real dos arquivos UPDATE]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- 2026-07-31 — Story iniciada no baseline preservado `8bd91716b0c465c303cb00586a20af3e997fa31f`; sprint e story movidos para `in-progress`.
- 2026-07-31 — Ciclos red-green concluídos para contratos/use cases de recovery e gestão de sessões, migration 004, repository PostgreSQL, API/OpenAPI/cliente, worker/outbox e UI responsiva.
- 2026-07-31 — Gates aprovados: 100/100 testes não integrados (10 PostgreSQL ignorados), TypeScript, contrato OpenAPI/cliente, fronteiras, build e 20/20 Cypress.
- 2026-07-31 — O primeiro gate PostgreSQL 18 revelou dois defeitos reais: constraint nomeada incompatível e criação de sessão sem o novo `public_id`; ambos foram corrigidos e a base foi recriada para validação limpa.
- 2026-07-31 — Gate PostgreSQL 18 aprovado: 10/10 testes de integração em contêiner; regressão final aprovada com 100/100 testes não integrados, 20/20 Cypress, TypeScript, contrato OpenAPI/cliente, fronteiras e build.
- 2026-07-31 — Ambiente-alvo confirmado com Node `v24.18.1` no WSL; `npm run check:types` aprovado. Contêineres e rede temporários de PostgreSQL/Mailpit foram removidos após os testes.
- 2026-07-31 — Code review adversarial em três camadas produziu 21 patches, todos aplicados; 1 débito preexistente de desempate CSRF foi registrado em `deferred-work.md`.
- 2026-07-31 — Regressão pós-review aprovada no Node 24/WSL: 104/104 testes não PostgreSQL, TypeScript, fronteiras, contrato e build; PostgreSQL 18 10/10 em base limpa; Cypress 20/20. Timeouts de teste foram calibrados para o filesystem montado do WSL.

### Implementation Plan

- Implementação test-first por camadas: contratos/configuração; migration/repositories; API/cliente; worker/e-mail; UX; testes e regressão.
- Plano concluído; implementação e regressão validadas no ambiente-alvo e no PostgreSQL 18 real.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- História preparada com os 11 critérios canônicos, dependências das Stories 1.3/1.4, guardrails de segurança/UX, estado do código e pesquisa técnica atual.
- Fronteiras com transferência de autoridade e contenção de incidente foram explicitadas; Story pronta para implementação.
- Implementados recovery token com domínio/keyring próprios e persistência hash-only, outbox/worker idempotentes, redefinição atômica de credencial e nova sessão opaca.
- Implementadas listagem minimizada e revogação individual/das demais sessões com ownership da Conta, CSRF/origem e auditoria transacional.
- Implementados endpoints, OpenAPI/cliente gerado, configuração fail-closed, rotas acessíveis de recuperação e controle de sessões e cobertura unitária/API/Cypress.
- Implementação pronta para review: todos os critérios e subtarefas foram concluídos, incluindo integração PostgreSQL 18, regressão das Stories 1.1–1.4 e validação no Node 24/WSL.
- Review concluído: origem e quotas de recovery, anti-DoS, neutralidade/auditoria, destinatário imutável, fairness/lease da outbox, atomicidade/concorrência, OpenAPI, CSRF entre abas e UX acessível foram corrigidos e validados.

### File List

- packages/application/src/identity/recovery.ts
- packages/application/src/identity/session.ts
- packages/application/src/index.ts
- packages/adapters/src/security/hmac-recovery-token.ts
- packages/adapters/src/db/postgres-recovery-repository.ts
- packages/adapters/src/db/postgres-recovery-outbox.ts
- packages/adapters/src/db/postgres-identity-repository.ts
- packages/adapters/src/index.ts
- packages/config/src/security-config.ts
- migrations/global/004_password_recovery_sessions.sql
- apps/api/src/composition-root.ts
- apps/api/src/nest-app.ts
- apps/api/src/openapi.ts
- apps/worker/src/composition-root.ts
- scripts/generate-api-client.mjs
- scripts/dev.mjs
- packages/api-client/src/provisioning.ts
- apps/web/src/components/AccessRecoveryPages.tsx
- apps/web/src/components/AccountSessionsPage.tsx
- apps/web/src/routes/recuperar-acesso.tsx
- apps/web/src/routes/redefinir-acesso.tsx
- apps/web/src/routes/conta-sessoes.tsx
- apps/web/src/routeTree.gen.ts
- apps/web/src/styles.css
- tests/access-recovery.test.ts
- tests/api-access-recovery.test.ts
- tests/authentication.test.ts
- tests/api-authentication.test.ts
- tests/provisioning.test.ts
- tests/postgres-integration.test.ts
- tests/ssr-smoke.test.ts
- cypress/e2e/access-recovery-sessions.cy.js
- vitest.config.ts

### Change Log

- 2026-07-31 — Story criada e marcada como `ready-for-dev`.
- 2026-07-31 — Implementação funcional concluída e validada nos gates locais; story mantida `in-progress` aguardando o gate obrigatório PostgreSQL 18 em contêiner.
- 2026-07-31 — Defeitos encontrados pela integração PostgreSQL 18 corrigidos; todos os gates finais aprovados e story promovida para `review`.
- 2026-07-31 — 21 findings do code review corrigidos e revalidados; story e sprint promovidos para `done`.
