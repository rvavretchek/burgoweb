---
baseline_commit: 8bd91716b0c465c303cb00586a20af3e997fa31f
---

# Story 1.4: Entrar, sair e selecionar o Condomínio

Status: done

## Story

Como Pessoa com Conta ativa,
Quero autenticar-me, selecionar um Condomínio autorizado e encerrar minha sessão,
Para que eu possa acessar a gestão correspondente sem expor outros Condomínios ou permanecer conectado indevidamente.

## Acceptance Criteria

1. **Login válido e sessão opaca**
   - **Dado** que a Pessoa possui Conta ativa, e-mail verificado e credencial válida
   - **Quando** informa corretamente e-mail e senha
   - **Então** o servidor autentica a credencial e cria uma sessão opaca revogável
   - **E** o browser recebe somente token aleatório em cookie `__Host-`, `Secure`, `HttpOnly`, `SameSite=Lax` e `Path=/`, sem atributo `Domain`.

2. **Persistência minimizada da sessão**
   - **Dado** que uma nova sessão é criada
   - **Quando** o servidor persiste seu estado
   - **Então** armazena somente o hash do token, Conta, instantes de criação e expiração e metadados mínimos de segurança
   - **E** senha, token bruto, cookie, pepper ou segredo não aparecem em resposta, log ou Evento de Auditoria.

3. **Falha neutra e proteção contra abuso**
   - **Dado** que e-mail, senha ou estado da Conta não permitem autenticação
   - **Quando** alguém tenta entrar
   - **Então** recebe resposta genérica que não confirma existência da Conta, verificação do e-mail ou motivo interno da recusa
   - **E** limites de abuso consideram Conta candidata, operação e sinais de origem, sem depender somente do IP.

4. **Seleção isolada de Condomínio**
   - **Dado** que a Pessoa autenticada possui um ou mais Vínculos ativos
   - **Quando** acessa a seleção de Condomínio
   - **Então** visualiza somente Condomínios cobertos por seus próprios Vínculos vigentes
   - **E** a resposta não inclui schema interno, dados institucionais ou Condomínios não autorizados.

5. **Construção confiável do `TenantContext`**
   - **Dado** que a Pessoa seleciona um Condomínio permitido
   - **Quando** uma operação tenant-scoped é iniciada
   - **Então** a API resolve o identificador público no registro global, revalida Conta e Vínculo e constrói `TenantContext` confiável
   - **E** casos de uso e persistência não aceitam tenant ou schema cru informado pelo cliente como autorização.

6. **Defesa contra acesso cruzado**
   - **Dado** que a Pessoa altera URL, identificador, header ou payload para apontar a outro Condomínio
   - **Quando** não possui Vínculo ativo correspondente
   - **Então** o servidor nega a operação sem consultar nem revelar dados do tenant alvo
   - **E** a tentativa produz evidência de segurança minimizada e correlacionada conforme a política de auditoria.

7. **Revogação efetiva durante a sessão**
   - **Dado** que o Vínculo selecionado foi suspenso ou encerrado depois do login
   - **Quando** a Pessoa realiza nova operação protegida
   - **Então** a autorização é revalidada e o acesso àquele Condomínio é bloqueado imediatamente
   - **E** Vínculos válidos com outros Condomínios permanecem utilizáveis sem ampliar permissões.

8. **Dashboard vazio útil**
   - **Dado** que a Pessoa entra em um Condomínio sem dados operacionais cadastrados
   - **Quando** o dashboard autenticado é exibido
   - **Então** apresenta estado vazio útil, identidade do Condomínio selecionado e apenas próximas ações autorizadas
   - **E** não depende de Pendências, finanças ou Publicações futuras para funcionar.

9. **Proteção CSRF e de origem**
   - **Dado** que a Pessoa tenta executar uma mutação autenticada
   - **Quando** a requisição não possui proteção CSRF válida ou falha na validação de Origin, Referer ou Fetch Metadata
   - **Então** a mutação é rejeitada
   - **E** requisições GET não alteram estado de negócio e o baseline não habilita CORS; o touch técnico de `last_seen_at` é a única exceção, limitado por throttle configurável com padrão de 5 minutos.

10. **Logout real**
    - **Dado** que a Pessoa seleciona **Sair**
    - **Quando** o logout é confirmado
    - **Então** a sessão atual é revogada no servidor e o cookie é invalidado no browser
    - **E** reutilizar o token anterior não autoriza nova operação.

11. **Experiência acessível, responsiva e não enumerável**
    - **Dado** que login, seleção, dashboard ou logout são usados em dispositivo móvel, desktop, teclado ou tecnologia assistiva
    - **Quando** os estados de carregamento, vazio, erro, acesso negado ou sucesso são apresentados
    - **Então** foco, rótulos, mensagens e navegação cumprem WCAG 2.2 AA e são compreensíveis
    - **E** nenhuma mensagem revela a existência de recurso protegido ou depende somente de cor.

## Tasks / Subtasks

- [x] **1. Fechar contratos, estados e configuração de autenticação** (AC: 1–3, 7, 9, 10)
  - [x] Definir commands/results e ports em `packages/application` para autenticar, criar/resolver/revogar sessão e representar falhas públicas neutras; controllers e adapters apenas traduzem e chamam casos de uso.
  - [x] Definir sessão com expiração absoluta e por inatividade configuráveis, `createdAt`, `lastSeenAt`, `absoluteExpiresAt`, `revokedAt/reason` e metadados mínimos. A validade efetiva é `min(absoluteExpiresAt, lastSeenAt + idleTTL)`; touch é limitado por intervalo configurável com padrão de 300 segundos, condicional ao estado vigente e nunca ressuscita sessão expirada/revogada. Não implementar listagem ou revogação em massa, que pertencem à Story 1.5.
  - [x] Gerar token de sessão integralmente aleatório com CSPRNG e pelo menos 128 bits de entropia; persistir somente hash/HMAC server-side com unicidade e comparação segura. Token bruto existe apenas na resposta `Set-Cookie`.
  - [x] Ampliar configuração runtime tipada e fail-closed para TTLs, segredo/keyring da sessão, política CSRF, limites de login, dummy hash e rotação de pepper; impor limites de sanidade e nunca fornecer fallback inseguro em produção.
  - [x] Evoluir `PasswordHasher.verify` para resultado estruturado `{ valid, needsRehash }`; aceitar peppers ainda vigentes por versão e converter pepper desconhecido/hash malformado em falha neutra, nunca em `500` ou canal de enumeração. Após login válido com pepper anterior, rehash e update condicional não podem falhar o login nem sobrescrever credencial mais nova.
  - [x] Equalizar status, corpo, headers, caminho observável e custo aproximado para Conta ausente, inativa, não verificada, senha incorreta, pepper indisponível e hash inválido; usar dummy hash configurado sem transformar timing em promessa absoluta.

- [x] **2. Criar migrations incrementais e projeção confiável de autoridade** (AC: 2, 4–7, 10)
  - [x] Criar migration global `003_*` para sessões hash-only, constraints/índices de unicidade, expiração, revogação e limpeza limitada; não reescrever migrations 001/002 já aplicadas.
  - [x] Criar projeção global explícita com IDs opacos e constraints ligando, no mínimo, `account_id`, `tenant_id`, `person_id`, `authority/membership_id`, estado e vigência. O servidor precisa enumerar tenants autorizados nessa projeção antes de acessar schemas tenant.
  - [x] Se a modelagem exigir estado tenant adicional, criar migration tenant `003_*` incremental com vigência e constraints. Não antecipar o cadastro completo da Story 1.6 nem a gestão de Papéis/capacidades da Story 1.8.
  - [x] Retropreencher a projeção no upgrade 002→003 a partir dos IDs correlacionados gerados no seed da 1.2/1.3, nunca por nome, posição ou heurística. Atualizar a ativação para selecionar a autoridade pelo ID correlacionado, não todas as autoridades pendentes do schema; impor unicidade/integridade e preservar autoria/histórico.
  - [x] Preservar migrations ordenadas, retomáveis e protegidas pelo advisory lock/owner existente; testar banco vazio, upgrade 002→003, rerun idempotente e boot concorrente.

- [x] **3. Implementar login, sessão e logout no domínio de aplicação** (AC: 1–3, 7, 10)
  - [x] Normalizar o seletor de e-mail sem vazar o valor e reutilizar `PasswordHasher`; carregar Conta/credencial com projeção mínima e verificar estado ativo + e-mail verificado antes de emitir sessão.
  - [x] Persistir a sessão e emitir o cookie somente após sucesso; impedir fixation/reuso de identificador preexistente e não armazenar sessão/token em `localStorage` ou `sessionStorage`.
  - [x] Estender/corrigir `PostgresRateLimiter`: aplicar simultaneamente buckets independentes por `operação + candidato normalizado` e `operação + origem confiável`, sem concatenar sinais mutáveis em um único bucket. Derivar seletores pessoais por HMAC com chave runtime própria/versionada; hash simples, IP ou headers controláveis nunca são autoridade única. Conta inexistente segue o mesmo contrato neutro.
  - [x] Revogar a sessão atual server-side antes de invalidar o cookie. Logout repetido deve ser seguro e neutro; replay do token revogado deve falhar.
  - [x] Revalidar Conta/sessão em toda requisição protegida; touch concorrente usa guard de estado e não vence logout/expiração. Expiração ou revogação remove o contexto autenticado e retorna recuperação neutra.
  - [x] Auditar de modo minimizado login aceito/negado/limitado, sessão criada/revogada/expirada, logout e acesso tenant negado. Permitir apenas tipo, resultado, instante, `requestId` e seletores HMAC necessários; proibir e-mail, senha, token, cookie, hash e motivo enumerável. Criação/revogação e evento correspondente são atômicos.

- [x] **4. Resolver seleção e `TenantContext` deny-by-default** (AC: 4–8)
  - [x] Listar somente `publicId` opaco, nome de exibição estritamente necessário e dados mínimos de Vínculos vigentes da própria Conta; não expor schema, IDs internos, Papéis de terceiros ou contagens inferíveis.
  - [x] Resolver em duas etapas: (1) registro global revalida Conta, sessão, tenant ativo e Vínculo vigente sem consultar schema não autorizado; (2) já com schema confiável, carregar Papel/capacidades vigentes. Construir `TenantContext` imutável com identidades de Conta/Pessoa/Vínculo, schema server-side, versão de migration e contexto de autorização versionado.
  - [x] Fazer casos de uso tenant-scoped e repositories aceitarem `TenantContext`, nunca `tenantId`, schema, header ou payload cru como autoridade. Cada ação/recurso exige capacidade efetiva; mutação privilegiada revalida Vínculo, capacidade e versão dentro da transação. Não usar `search_path` compartilhado nem deixar estado tenant vazar pelo pool.
  - [x] Negar adulteração antes de abrir query no schema alvo. Produzir Evento de Auditoria minimizado com `requestId`, ação e resultado; não registrar identificador sensível desnecessário nem existência do alvo.
  - [x] Revalidar o Vínculo em cada operação protegida para bloquear suspensão/encerramento imediato sem invalidar acesso legítimo a outros tenants.
  - [x] Entregar dashboard mínimo/estado vazio a partir de autorização real, sem criar ou consultar Pendências, finanças, Publicações ou outros módulos futuros.

- [x] **5. Aplicar CSRF e contratos HTTP seguros** (AC: 1, 3–7, 9, 10)
  - [x] Fixar contratos REST JSON: `POST /api/v1/auth/sessions` recebe `{ email, password }`, retorna `201` com `{ csrfToken }` e cria cookie `__Host-burgoweb-session`; `GET /api/v1/auth/session` retorna estado autenticado mínimo ou `401`; `DELETE /api/v1/auth/session` retorna `204`; `GET /api/v1/tenants` retorna apenas DTOs `{ publicId, displayName }`; `GET /api/v1/tenants/{publicId}/dashboard` retorna contexto/estado vazio autorizado. Falhas usam RFC 9457 e `X-Request-Id`; login inválido sempre usa o mesmo `401` público e rate limit usa `429` neutro.
  - [x] Usar synchronizer token CSRF aleatório ligado à sessão e persistido somente como hash. Entregá-lo no body do login e exigir header `X-CSRF-Token` em `DELETE /auth/session` e toda mutação autenticada; rotacioná-lo com a sessão/elevação de autoridade. Não usar cookie CSRF nem expor o token em URL, log ou auditoria.
  - [x] Aplicar política explícita de `Origin`, fallback de `Referer` quando cabível e Fetch Metadata; ausência/incoerência deve falhar fechada conforme o tipo de request. `SameSite=Lax` é defesa complementar, não substitui CSRF.
  - [x] Criar `__Host-burgoweb-session` sem `Domain`, com `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/` e `Max-Age` limitado ao TTL absoluto. A remoção usa o mesmo nome/escopo e `Max-Age=0`/`Expires` passado. Logout exige sessão quando disponível + CSRF/origem, mas permanece idempotente e sempre limpa o cookie mesmo se a sessão estiver ausente, expirada ou revogada.
  - [x] Manter CORS desabilitado e garantir que GET/HEAD não mudem estado. Preservar `Cache-Control: no-store`, referrer policy, redaction de cookie/auth/senha/token/CSRF e correlação existentes. Seleção é o `publicId` opaco na rota; nenhum “tenant selecionado” server-side ou no browser concede autoridade.
  - [x] Gerar o cliente em `packages/api-client` por `scripts/generate-api-client.mjs`; não editar o artefato gerado manualmente. Todos os requests autenticados usam `credentials: 'same-origin'`.
  - [x] Preservar integralmente provisioning, verificação/reenvio e o contrato público das Stories 1.1–1.3; substituir o placeholder 403 de `TenantContext` somente pela autorização real desta story.

- [x] **6. Construir login, seletor, troca atômica e dashboard vazio** (AC: 1, 3–5, 7, 8, 10, 11)
  - [x] Criar rotas/componentes de login, seleção e dashboard no workspace `apps/web`; não desenvolver no protótipo legado `src/**`. Atualizar `routeTree.gen.ts` somente pelo gerador TanStack.
  - [x] Reutilizar shell, tokens visuais, `StatePanel`, error summary, foco, labels/ajuda, `aria-describedby`, `aria-busy`, live message e padrão mostrar/ocultar senha já entregues. Permitir colar e usar gerenciador de senhas.
  - [x] Mostrar permanentemente o Condomínio ativo em toda tela autenticada; shell e próximas ações derivam de capacidades autorizadas, não de Papel nominal ou estado do browser.
  - [x] Na troca de Condomínio, cancelar/ignorar respostas e polling anteriores, invalidar cache/preview, limpar filtros/seleções/rascunhos não portáveis, fechar overlays e substituir/revalidar rota atomicamente. URL, query, title, breadcrumb e live regions não retêm dados do tenant anterior.
  - [x] Após troca/revogação, remover conteúdo e metadados sensíveis imediatamente, mover foco ao H1 neutro e anunciar a mudança uma única vez. O browser pode guardar preferência de seleção, nunca autoridade.
  - [x] Tratar carregando, vazio útil, validação, credencial neutra, acesso negado/revogado, indisponibilidade, offline, sessão expirada, sucesso e duplo envio. Toast é complementar; entrada do formulário é preservada quando seguro.
  - [x] Disponibilizar logout por teclado e toque, confirmar o resultado persistente e retornar à entrada sem deixar cache/título/conteúdo autenticado visível.

- [x] **7. Automatizar segurança, isolamento, regressão e acessibilidade** (AC: 1–11)
  - [x] Testes unitários: estados de Conta, senha correta/incorreta, dummy hash, hash malformado, pepper atual/anterior/desconhecido e rehash concorrente; fronteiras de relógio, TTL absoluto/ocioso, touch versus logout, revogação e `TenantContext` imutável/deny-by-default.
  - [x] Testes API/contrato: paths/DTOs/status fixados, atributos exatos de criação/remoção do `Set-Cookie`, ausência de segredo em body/log/auditoria/OpenAPI, neutralidade, buckets de rate limit, matriz CSRF/Origin/Referer/Fetch Metadata, CORS ausente, GET sem mutação, logout idempotente e replay negado.
  - [x] Testes PostgreSQL 18 real via Testcontainers: migration/upgrade 002→003 com dados e múltiplas autoridades existentes; correlação sem associação cruzada; concorrência login/logout, expiração, auditoria atômica/minimizada, Conta com 1/N tenants, mesmo nome em tenants distintos, suspensão de Vínculo ou capacidade após login e adulteração cross-tenant comprovando que o schema alvo não foi consultado.
  - [x] Testar rate limit com rotação de IP mantendo bucket do candidato, várias Contas na mesma origem, concorrência, TTL/limpeza e ausência de e-mail no banco/log; testar capacidade ausente, suspensa e alterada concorrentemente por ação/recurso.
  - [x] Testes web/Cypress: login → seleção → dashboard vazio → troca → logout, sessão expirada, requisição atrasada do tenant anterior, limpeza de cache/route/title e estados de rede/erro.
  - [x] Estender gates existentes de SSR/hydration, axe e teclado. Validar manualmente leitor de tela, Tab/Shift+Tab/Enter/Esc, foco restaurado, zoom 200%, reflow 320 CSS px/400%, text spacing, portrait/landscape, teclado virtual, forced-colors e reduced-motion.
  - [x] Executar `npm test`, `npm run check:types`, `npm run check:boundaries`, `npm run check:api-contract`, `npm run build`, integração PostgreSQL, Cypress e regressão integral das Stories 1.1–1.3 antes de marcar para review.

### Review Findings

- [x] [Review][Patch] Documentar touch de sessão em GET como exceção técnica e aplicar throttle configurável de 5 minutos [packages/config/src/security-config.ts:75] — decisão do proprietário: atualizar `last_seen_at` somente quando o último touch tiver ocorrido há mais de 300 segundos, mantendo o intervalo menor que o TTL ocioso.
- [x] [Review][Patch] Remover o endpoint legado não documentado `GET /api/v1/tenants/:id/context` [apps/api/src/nest-app.ts:44] — decisão do proprietário: manter somente `/api/v1/tenants/{publicId}/dashboard` como contrato canônico.
- [x] [Review][Patch] Rate limit de login cria bucket global por Origin e permite DoS entre Contas [apps/api/src/nest-app.ts:54]
- [x] [Review][Patch] Logout visual confirma sucesso mesmo quando a revogação falha e não há recuperação de CSRF entre abas [apps/web/src/components/AuthenticatedPages.tsx:9]
- [x] [Review][Patch] Resolução do TenantContext não revalida Conta, Vínculo e versões atomicamente [packages/adapters/src/db/postgres-identity-repository.ts:18]
- [x] [Review][Patch] Adulteração para tenant sem Vínculo não gera auditoria correlacionada [packages/adapters/src/db/postgres-identity-repository.ts:18]
- [x] [Review][Patch] Pepper desconhecido e hash malformado falham cedo e quebram neutralidade temporal aproximada [packages/adapters/src/security/argon2-password-hasher.ts:10]
- [x] [Review][Patch] Auditoria omite login aceito/limitado e expiração de sessão [packages/adapters/src/db/postgres-identity-repository.ts:12]
- [x] [Review][Patch] Logout resolve e toca a sessão antes de validar o CSRF atomicamente [packages/application/src/identity/session.ts:44]
- [x] [Review][Patch] Resposta cross-origin de logout limpa cookie antes de rejeitar a origem [apps/api/src/nest-app.ts:60]
- [x] [Review][Patch] Projeção permite múltiplos Vínculos ativos por Conta/tenant e duplica a seleção [migrations/global/003_sessions_memberships.sql:27]
- [x] [Review][Patch] Configuração aceita TTLs enormes fora dos limites seguros de Date/PostgreSQL [packages/config/src/security-config.ts:73]
- [x] [Review][Patch] Troca de Condomínio pode renderizar dados/título anteriores e não passa AbortSignal ao fetch [apps/web/src/components/AuthenticatedPages.tsx:11]
- [x] [Review][Patch] Sessão expirada é tratada como acesso tenant negado e não limpa o contexto autenticado [apps/web/src/components/AuthenticatedPages.tsx:10]
- [x] [Review][Patch] TenantContext permanece mutável e ignora divergência entre authorization_version global e tenant [packages/application/src/tenancy/tenancy.ts:2]
- [x] [Review][Patch] OpenAPI omite respostas RFC 9457 efetivamente produzidas por sessão, logout e tenancy [apps/api/src/openapi.ts:6]
- [x] [Review][Patch] Testes não comprovam diversos cenários de segurança e UX marcados como concluídos na Task 7 [tests/authentication.test.ts:17]

## Dev Notes

### Contexto e limites obrigatórios

- Esta é a primeira jornada autenticada utilizável. Ela estende a ativação da Story 1.3; não refaz provisioning nem verificação de e-mail.
- Recuperação de senha, consulta/revogação de todas as sessões e contenção de Conta ficam nas Stories 1.5/6.5. Convites, cadastro completo de Pessoas/Unidades/Vínculos, gestão de Papéis, delegação, Responsável Financeiro e troca de gestão ficam nas Stories 1.6–1.11.
- Selecionar entre Condomínios já autorizados não é multiconomínio profissional, painel consolidado ou permissão nova.
- E-mail verificado comprova controle do canal, não identidade civil, eleição ou mandato jurídico.
- Hipóteses de adoção, transparência e continuidade não são requisitos confirmados nem devem ampliar o escopo.

### Estado atual dos arquivos `UPDATE`

- `apps/api/src/nest-app.ts`: expõe provisioning, confirmação/reenvio e um placeholder `GET /api/v1/tenants/:id/context` sempre 403. Acrescentar auth/guard/CSRF/contexto preservando endpoints existentes, RFC 9457, `X-Request-Id`, `no-store`, referrer policy e redaction.
- `apps/api/src/composition-root.ts`: compõe pool, migrators, provisioning, verification e rate limiter. Acrescentar identity/session/tenancy mantendo startup e encerramento fail-closed sem leak de pool.
- `apps/api/src/openapi.ts`: contém três operações públicas. Estender contratos sem quebrá-las; o cliente deve continuar gerado.
- `packages/adapters/src/security/argon2-password-hasher.ts`: hoje aceita apenas o pepper atual e deixa hash malformado lançar. Corrigir como parte desta story, conforme dívida explicitamente reservada na Story 1.3.
- `packages/config/src/security-config.ts`: hoje modela pepper atual e configuração de verificação/e-mail. Ampliar sem defaults inseguros.
- `packages/adapters/src/db/postgres-global-migrator.ts`: já descobre migrations em ordem sob advisory lock. Preservar e adicionar migration incremental.
- `packages/adapters/src/db/postgres-provisioning-repository.ts` e `postgres-verification-repository.ts`: ativam Conta, tenant e autoridade inicial. Evitar edição se a nova projeção puder ser construída incrementalmente; nunca quebrar idempotência/rollback da 1.3.
- `packages/adapters/src/observability/redaction.ts`: já cobre estruturas circulares e nomes camel/snake. Preservar e cobrir novos campos de sessão/CSRF.
- `packages/api-client/src/provisioning.ts` é gerado por `scripts/generate-api-client.mjs`; modificar o gerador, não o resultado isoladamente.
- `apps/web/src/routes/__root.tsx`, `router.tsx` e `styles.css`: já oferecem skip link, loading/error seguro, tokens e foco. Estender os padrões; preservar SSR/hydration e o proxy same-origin.
- `OnboardingStartPage.tsx` e `EmailVerificationPage.tsx`: reutilizar seus padrões de formulário, error summary, foco e live messages; após ativação, oferecer caminho claro para entrar sem transformar a confirmação em sessão.

### Arquivos e abordagens a não reutilizar

- `src/server/auth.ts`, `src/server/storage.ts` e demais `src/**` são protótipo legado em memória/arquivo, com autorização por `condominiumId` vindo do fluxo e papéis agregados. Não são contrato nem alvo desta implementação.
- Não autorizar por “usuário logado”, Papel nominal, tenant selecionado no browser, `pending_authorities`, header, URL, payload, schema ou `search_path`.
- Não adicionar JWT, Redis, SDK de autenticação, CORS ou nova fila. A arquitetura exige sessão opaca revogável em PostgreSQL e os ports/adapters existentes são suficientes; nova dependência requer decisão explícita.
- Não criar dashboard fictício com módulos futuros e não alterar silenciosamente versões do lockfile.

### Arquitetura e padrões obrigatórios

- Módulos verticais: use cases dependem de ports; adapters concretos entram somente nos composition roots. Identity fica em `application/identity`; tenancy em `application/tenancy`.
- API REST JSON `/api/v1`, `camelCase`, validação runtime, OpenAPI/cliente gerado, RFC 9457 e `X-Request-Id`; banco em `snake_case`, `timestamptz` UTC e IDs opacos.
- Schemas: global para Conta, credencial, sessão, registry e projeção de autorização; schema por Condomínio para dados tenant. Resolver schema exclusivamente server-side e nunca deixar tipo de persistência atravessar a API.
- Autorização granular, transacional, revogável, deny-by-default e revalidada por operação. Estado + auditoria relacionado deve ser atômico quando a transição exigir.
- Queries de aplicação devem seguir AD-6/Kysely e os adapters existentes. O SQL `pg` direto legado não autoriza ampliar a divergência indiscriminadamente.
- Toda tela autenticada mostra o Condomínio ativo; trocar o contexto é operação atômica de segurança, não simples alteração visual.

### UX e acessibilidade

- Tom direto, institucional e sóbrio; sem gradientes, gamificação ou linguagem técnica desnecessária. Labels persistentes; placeholder não substitui label; links sublinhados; ícones sempre acompanhados de texto.
- Um H1 por rota, título de página coerente, landmarks, skip link e `aria-current`. Teclado completo, foco visível, `Esc`/restauração de foco e mensagens `aria-live` sem repetição.
- Contraste mínimo 4,5:1 para texto e 3:1 para texto grande, componentes e foco. Alvos mínimos 24×24 CSS px; ações principais/mobile preferencialmente 44×44.
- Conteúdo não depende só de cor, posição ou ícone. Respeitar reduced-motion e forced-colors; manter geometria estável durante loading.
- Uma negação/revogação remove dados sensíveis de tela, cache, rota, title, breadcrumb e live region antes de comunicar o estado neutro.

### Stack e versões

- Preservar o lockfile atual: Node.js `24.18.0`, TypeScript `7.0.2`, React `19.2.7`, Vite `8.1.5`, TanStack Start `1.168.30`, Router `1.170.18`, NestJS/platform-fastify `11.1.20`, Fastify `5.10.0`, Argon2 `0.44.0`, PostgreSQL `18.4`, Kysely `0.29.2`, `pg` `8.16.3`, Vitest `4.1.10`, Cypress `15.19.0` e Testcontainers `12.0.4`.
- O root contém `@tanstack/start-plugin-core 1.171.22`; não “alinhar” versões TanStack por atualização silenciosa. O lockfile/código prevalece sobre versão divergente na spine.
- Preferir `node:crypto` para CSPRNG/HMAC/hash/comparação constante. Não introduzir dependência para capacidade já coberta pela plataforma.

### Project Structure Notes

Arquivos existentes que devem ser avaliados como `UPDATE` e preservados quando não houver mudança necessária:

- `package.json`, `package-lock.json`, manifests e tsconfigs alcançados;
- `apps/api/src/composition-root.ts`, `nest-app.ts`, `openapi.ts`, `index.ts`;
- `packages/application/src/index.ts`, `identity/password-hasher.ts`;
- `packages/adapters/src/index.ts`, `security/argon2-password-hasher.ts`, `observability/redaction.ts`, migrators e repositories PostgreSQL existentes;
- `packages/config/src/index.ts`, `security-config.ts`;
- `packages/api-client/src/index.ts`, `provisioning.ts`, `scripts/generate-api-client.mjs`;
- `apps/web/src/routes/__root.tsx`, `router.tsx`, `routeTree.gen.ts`, `styles.css`, `vite.config.ts`, `OnboardingStartPage.tsx` e `EmailVerificationPage.tsx`;
- testes de contrato, integração, SSR, acessibilidade e Cypress existentes.

Estrutura provável para arquivos `NEW` — nomes podem variar para aderir aos módulos existentes:

```text
packages/application/src/identity/       # autenticação, sessão, logout, contratos e ports
packages/application/src/tenancy/        # listagem autorizada e TenantContext
packages/adapters/src/db/                 # repositories de identity/session/tenancy
packages/config/src/                      # sessão, CSRF, rate limit e keyrings
apps/web/src/components/                  # Login, TenantSelection, EmptyDashboard, session boundary
apps/web/src/routes/entrar.tsx
apps/web/src/routes/condominios.tsx
apps/web/src/routes/condominios.$publicId.tsx
migrations/global/003_*_sessions_memberships.sql
migrations/tenant/003_*_active_membership.sql  # somente se necessário
tests/                                    # unidade, API, contrato e PostgreSQL real
cypress/e2e/                              # login, troca tenant, dashboard e logout
```

### Previous Story Intelligence

- Story 1.3 termina com Conta, Condomínio e autoridade inicial ativos, mas deliberadamente sem sessão e sem `TenantContext`; esta story deve desbloquear o placeholder, não duplicar a ativação.
- O fallback de pepper Argon2 e o tratamento de hash malformado foram adiados especificamente para o login da Story 1.4.
- Neutralidade abrange status, corpo, headers, tempo aproximado, observabilidade e caminho funcional — não apenas copy.
- Rate limit deve ser persistente, expirável e multissinal; origem ausente/incoerente falha fechada. Redaction cobre camel/snake, ciclos e URLs.
- Checar `rowCount`/guards em transições; migrations e processos concorrentes precisam de coordenação. Startup/listen/close devem liberar pool e loops.
- A revisão da 1.3 corrigiu `PostgresRateLimiter`, timeout/unlock do advisory lock, shutdown do worker e canais laterais de reenvio; não regredir.
- Antes da revisão, a 1.3 aprovou 67/67 testes não integrados, 9/9 PostgreSQL e 13/13 Cypress. Após patches de SQL, a integração real não foi rerodada por limitação WSL/Docker; reexecutá-la nesta story.

### Git Intelligence Summary

- O último commit (`8bd9171`) contém a decomposição final de épicos; o commit anterior relevante (`b376293`) é o protótipo inicial legado.
- A implementação das Stories 1.1–1.3 está no worktree não commitado. `git diff` contra HEAD não representa o baseline de produto; usar código atual, File Lists e completion notes.
- O worktree contém alterações do usuário. Não limpar, resetar, sobrescrever ou inferir escopo apenas pelo histórico Git.

### Latest Technical Information

- Sessões customizadas devem usar identificadores CSPRNG imprevisíveis com pelo menos 128 bits, significado apenas server-side, TLS integral, cookie `Secure`/`HttpOnly`/`SameSite`, expiração e revogação; não guardar token de autenticação em Web Storage. [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- O prefixo `__Host-` exige `Secure`, ausência de `Domain` e `Path=/`; `SameSite=Lax` restringe envio cross-site, mas continua sendo defesa parcial. [MDN — Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)
- Tokens CSRF devem ser gerados server-side e explicitamente ligados à sessão; sinais de origem e Fetch Metadata compõem defesa em profundidade. [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- Fastify 5 lista plugins oficiais de cookie e CSRF, mas a história não autoriza dependência automaticamente: primeiro avaliar compatibilidade e se os adapters/recursos atuais bastam. [Fastify 5 Ecosystem](https://fastify.dev/docs/v5.0.x/Guides/Ecosystem/)

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Épico 1, Story 1.4 e rastreabilidade]
- [Source: `_bmad-output/planning-artifacts/prd.md` — FR-4, FR-5, NFR-1, NFR-6–NFR-12]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/ARCHITECTURE-SPINE.md` — AD-3–AD-5, AD-8–AD-10, AD-14, AD-23, AD-24, AD-26, módulos e stack]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-burgoweb-2026-07-27/EXPERIENCE.md` — Foundation, IA, Tenant Switch, State Patterns, Authentication, Accessibility e UJ-1]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-burgoweb-2026-07-27/DESIGN.md` — cores, tipografia, layout, componentes e Do’s]
- [Source: `docs/product/discovery/01-identidade-e-proposito.md` — princípios, tom e privacidade]
- [Source: `docs/product/discovery/03-segmentos-e-personas.md` — distinção Pessoa/Conta/Vínculo/Papel]
- [Source: `docs/product/discovery/04-necessidades-e-jornadas.md` — entrada progressiva e controle de acesso]
- [Source: `docs/product/discovery/06-escopo-e-modelo-de-negocio.md` — núcleo gratuito e limites]
- [Source: `docs/product/discovery/07-mapa-de-capacidades.md` — Pessoas, Vínculos, governança e acessibilidade]
- [Source: `docs/product/discovery/08-decisoes-hipoteses-e-riscos.md` — decisões, hipóteses e risco de privacidade]
- [Source: `_bmad-output/implementation-artifacts/1-3-verificar-o-e-mail-e-ativar-a-gestao-inicial.md` — aprendizados, code review, deferred work e File List]
- [Source: `_bmad-output/implementation-artifacts/deferred-work.md` — pepper anterior, hash malformado e cliente gerado]
- [Source: código atual em `apps/`, `packages/`, `migrations/`, `tests/` e `cypress/` — estado dos arquivos UPDATE]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- 2026-07-30 — Implementação iniciada no baseline preservado `8bd91716b0c465c303cb00586a20af3e997fa31f`; story e sprint marcados como `in-progress`.
- 2026-07-30 — Ciclos red-green executados para autenticação/sessão, migrations 003, tenancy deny-by-default, API e web. Suíte direcionada: 24/24; suíte completa não integrada: 79/79, com 9 integrações ignoradas; build, contrato e fronteiras aprovados.
- 2026-07-30 — Ambiente confirmado: WSL com Node 24.18.1 e Docker 29.6.2. Integração real PostgreSQL 18 aprovada em 9/9 cenários após corrigir concorrência do rate limit e idempotência da migration tenant.
- 2026-07-30 — Regressão final aprovada: 80/80 testes não integrados, 15/15 Cypress, build, TypeScript, contrato OpenAPI/cliente gerado e fronteiras arquiteturais com Node 24.
- 2026-07-31 — Code review adversarial em três camadas concluído; 2 decisões resolvidas pelo proprietário e 16 patches aplicados. Regressão final: 91/91 testes não integrados, 9/9 PostgreSQL 18, 18/18 Cypress, build, tipos, contrato e fronteiras aprovados.

### Implementation Plan

- Implementar por camadas test-first: contratos/configuração; migrations/projeção; repositories/use cases; API/cliente; UX; integração real e regressão.
- Plano concluído; story pronta para code review adversarial.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- História criada a partir da decomposição final, fontes canônicas de discovery, PRD, Architecture Spine, UX Spines, código atual, Stories 1.1–1.3 concluídas, Git e deferred work.
- Fronteiras com recuperação/controle amplo de sessões, cadastro de Vínculos, Papéis, delegação, financeiro e demais módulos futuros foram explicitadas.
- Guardrails definidos para sessão opaca hash-only, rotação de pepper, neutralidade, CSRF, projeção Conta→Vínculo, `TenantContext` server-side, revogação imediata e troca atômica de tenant.
- Arquivos UPDATE foram lidos e seu estado/preservações documentados; o protótipo legado `src/**` foi excluído como fonte de implementação.
- Entregues login neutro, sessão opaca revogável, logout CSRF/origin-protected, projeção de Vínculos e `TenantContext` deny-by-default com revalidação por operação.
- Entregues seletor isolado, dashboard vazio, troca segura de Condomínio e UX responsiva/acessível; corrigidas corridas de hidratação, roteamento aninhado e foco pós-render.
- Validado no ambiente-alvo informado: Node 24 no WSL/Windows e PostgreSQL 18 em contêiner.
- Code review corrigiu DoS entre Contas no rate limit, neutralidade Argon2, auditoria de autenticação, logout/CSRF entre abas, atomicidade/versionamento do `TenantContext`, throttle de touch em 5 minutos, contrato OpenAPI e estados UX de expiração/troca.

### File List

- packages/application/src/identity/password-hasher.ts
- packages/application/src/identity/session.ts
- packages/application/src/tenancy/tenancy.ts
- packages/application/src/index.ts
- packages/adapters/src/security/argon2-password-hasher.ts
- packages/adapters/src/security/hmac-session-token.ts
- packages/adapters/src/db/postgres-identity-repository.ts
- packages/adapters/src/db/postgres-rate-limiter.ts
- packages/adapters/src/db/postgres-provisioning-repository.ts
- packages/adapters/src/db/postgres-verification-repository.ts
- packages/adapters/src/db/postgres-tenant-migrator.ts
- packages/adapters/src/index.ts
- packages/config/src/security-config.ts
- migrations/global/003_sessions_memberships.sql
- migrations/tenant/002_activate_initial_authority.sql
- migrations/tenant/003_authorization_context.sql
- apps/api/src/nest-app.ts
- apps/api/src/composition-root.ts
- apps/api/src/openapi.ts
- packages/api-client/src/provisioning.ts
- scripts/generate-api-client.mjs
- apps/web/src/components/AuthenticatedPages.tsx
- apps/web/src/routes/entrar.tsx
- apps/web/src/routes/condominios.tsx
- apps/web/src/routes/condominios.index.tsx
- apps/web/src/routes/condominios.$publicId.tsx
- apps/web/src/routeTree.gen.ts
- apps/web/src/styles.css
- tests/authentication.test.ts
- tests/tenancy.test.ts
- tests/api-authentication.test.ts
- tests/migrations-verification-contract.test.ts
- tests/provisioning.test.ts
- tests/postgres-integration.test.ts
- cypress/e2e/authenticated-entry.cy.js

### Change Log

- 2026-07-30 — Implementada a Story 1.4 de ponta a ponta e movida para `review`; gates unitários, integração PostgreSQL 18, build e E2E aprovados.
- 2026-07-31 — Code review concluído; todos os 16 patches foram aplicados, validados e a story foi movida para `done`.
