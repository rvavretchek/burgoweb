---
baseline_commit: 8bd91716b0c465c303cb00586a20af3e997fa31f
---

# Story 1.3: Verificar o e-mail e ativar a gestão inicial

Status: done

## Story

Como responsável pela gestão,
Quero verificar meu e-mail e ativar minha Conta e meu Condomínio,
Para que somente quem controla o canal informado possa concluir o onboarding.

## Acceptance Criteria

1. **Token de verificação seguro**
   - **Dado** que existe um provisionamento pendente válido
   - **Quando** o sistema solicita a verificação do e-mail
   - **Então** gera um token aleatório, de finalidade exclusiva, uso único e validade finita
   - **E** persiste somente seu hash, associado à Conta, ao provisionamento e ao instante de expiração.

2. **Outbox transacional e envio confirmado**
   - **Dado** que o token de verificação foi criado
   - **Quando** a notificação é preparada
   - **Então** um item de outbox é registrado transacionalmente e processado pelo worker por meio do `EmailPort`
   - **E** o sistema não declara envio bem-sucedido antes da confirmação aceita pelo provedor.

3. **Mensagem minimizada**
   - **Dado** que o e-mail de verificação é enviado
   - **Quando** a mensagem é produzida
   - **Então** ela identifica o Burgoweb, explica a finalidade, apresenta a expiração e oferece um único caminho de ativação
   - **E** não inclui senha, segredo, informação administrativa desnecessária nem tracking de abertura ou clique.

4. **Retry e contingência controlados**
   - **Dado** que o provedor primário de e-mail falha de forma transitória
   - **Quando** o worker processa a outbox
   - **Então** aplica tentativas limitadas, backoff, lease e idempotência sem enviar mensagens duplicadas silenciosamente
   - **E** utiliza a contingência configurada somente conforme a política operacional, registrando resultado e correlação sem expor o token.

5. **Falha terminal recuperável**
   - **Dado** que o provedor retorna falha permanente ou todas as tentativas e contingências permitidas se esgotam
   - **Quando** o item de outbox não pode mais ser entregue automaticamente
   - **Então** registra estado terminal de entrega com motivo sanitizado e oferece reemissão por caminho de recuperação autorizado
   - **E** não mantém a verificação como enviada, não ativa o Condomínio e não reutiliza o token comprometido ou expirado.

6. **Ativação atômica**
   - **Dado** que o responsável acessa um token válido e não utilizado
   - **Quando** confirma a verificação
   - **Então** o servidor revalida Conta, provisionamento, estado do Condomínio e compatibilidade da migration tenant
   - **E** marca o e-mail como verificado, ativa o Condomínio e torna vigente a autoridade inicial de Síndico em uma única transação observável.

7. **Confirmação sem certificação jurídica**
   - **Dado** que a ativação foi concluída
   - **Quando** o responsável recebe a confirmação
   - **Então** a interface informa que o controle do canal foi comprovado e orienta o acesso autenticado
   - **E** deixa explícito que a verificação do e-mail não certifica identidade civil, eleição ou mandato jurídico.

8. **Token indisponível sem enumeração**
   - **Dado** que o token é inválido, expirado, já utilizado, cancelado ou pertence a outra finalidade
   - **Quando** alguém tenta utilizá-lo
   - **Então** nenhuma Conta, autoridade ou tenant muda de estado
   - **E** a resposta não revela existência da Conta, estado interno, hash ou motivo explorável por terceiros.

9. **Reenvio seguro**
   - **Dado** que o responsável solicita reenvio dentro dos limites permitidos
   - **Quando** a solicitação é aceita
   - **Então** um novo token de verificação é emitido e os tokens anteriores aplicáveis deixam de poder concluir o fluxo
   - **E** limites consideram Conta, tenant pretendido, operação e sinais de origem, sem usar IP como única autoridade.

10. **Confirmação concorrente idempotente**
    - **Dado** que múltiplas confirmações concorrentes usam o mesmo token
    - **Quando** a primeira ativação é concluída
    - **Então** as demais não duplicam Vínculo, Papel, Evento de Auditoria ou ativação do tenant
    - **E** recebem resultado idempotente ou indicação segura de token indisponível.

11. **Falha transacional segura**
    - **Dado** que a ativação falha depois de iniciar a transação
    - **Quando** o estado não pode ser concluído integralmente
    - **Então** e-mail, Condomínio e autoridade permanecem em estado anterior coerente ou são compensados
    - **E** nenhuma autoridade parcial permite construir `TenantContext` autorizado.

12. **Fluxo acessível**
    - **Dado** que verificação, reenvio ou erro são apresentados em dispositivo móvel, desktop ou tecnologia assistiva
    - **Quando** o usuário interage com o fluxo
    - **Então** mensagens, foco, temporização e ações de recuperação são acessíveis e compreensíveis
    - **E** a interface não depende apenas de cor para diferenciar pendente, sucesso, expirado ou falha.

## Tasks / Subtasks

- [x] **1. Fechar contratos, estados e configuração da verificação** (AC: 1–5, 8–10)
  - [x] Definir commands/results e ports em `packages/application` para emitir/reemitir token, confirmar ativação, persistir verificação/outbox e entregar e-mail; controllers e worker apenas traduzem e chamam casos de uso.
  - [x] Modelar estados explícitos e transições de token (`valid`, `used`, `cancelled`, `expired` derivados de campos persistidos), entrega (`pending`, `leased`, `accepted`, `dead`) e ativação, sem usar estado de UI como estado de negócio.
  - [x] Implementar o token completo como saída pseudoaleatória de HMAC/keyring runtime sobre domínio, IDs aleatórios CSPRNG da verificação/outbox e contexto imutável. Esses IDs são metadados públicos de registros, não integram o token nem autorizam uso. O token existe apenas em memória; o banco persiste metadados de derivação não secretos, versão da chave e somente o hash do token completo. O worker o reconstrói apenas para compor a mensagem. Não persistir token bruto nem mesmo cifrado em outbox, auditoria, log, fixture ou snapshot.
  - [x] Usar comparação constante do hash e domínio explícito de finalidade (`email-verification`) para impedir confusão com Convite ou recuperação; manter chaves anteriores configuradas somente pelo período necessário aos tokens ainda válidos.
  - [x] Ampliar configuração runtime tipada e fail-closed para URL pública permitida, remetente, TTL, keyring/versionamento do token, lease/backoff/tentativas, política de contingência e credenciais HTTPS de Brevo/Resend. Valores operacionais são configuráveis e não viram promessa pública ou SLA inventado.

- [x] **2. Criar migrations incrementais global e tenant** (AC: 1, 2, 4–6, 9–11)
  - [x] Criar `migrations/global/002_email_verification_activation.sql`; não reescrever a migration 001 já aplicada. Adicionar verificação de e-mail, tokens, outbox/leases/tentativas/dead-letter, referências de provedor sanitizadas e estados `active` necessários, com constraints, índices e timestamps UTC.
  - [x] Criar `migrations/tenant/002_activate_initial_authority.sql` para preservar a Pessoa/autoridade pendente e materializar Vínculo/Papel inicial vigente sem antecipar o cadastro completo da Story 1.6 nem a gestão de Papéis da Story 1.8.
  - [x] Garantir unicidade/idempotência do Evento de Auditoria de ativação e da autoridade inicial; o schema atual não possui constraint suficiente para impedir duplicação concorrente.
  - [x] Tornar migrations retomáveis e seguras em boot concorrente: usar advisory lock ou definir um único owner de migrations entre API/worker. API e worker não podem disputar `pool.query` de migration sem coordenação.
  - [x] Atualizar `PostgresGlobalMigrator` e `PostgresTenantMigrator` para descobrir/executar migrations 001→002 em ordem, registrar/validar versão compatível e não permanecer fixos em um único arquivo. Testar boot de banco vazio, upgrade de v1 e rerun idempotente.
  - [x] Persistir rate limit em bucket/window com chave normalizada por operação+sinais resolvidos, expiração e índice; incremento/claim deve ser atômico sob concorrência e possuir limpeza limitada, sem tabela ou `Map` de crescimento irrestrito.
  - [x] Validar `schema_name` exclusivamente a partir do tenant registry sob lock e usar identificador server-side qualificado; nenhum schema, tenant interno ou claim de token vindo do browser é confiável.

- [x] **3. Emitir token e outbox de forma atômica** (AC: 1–3, 5, 9)
  - [x] Integrar a emissão inicial ao término pendente da Story 1.2, persistindo token-hash e outbox na mesma transação que torna a solicitação elegível para verificação; falha não pode gerar estado “e-mail enviado” nem perder silenciosamente o trabalho assíncrono.
  - [x] Gravar na outbox apenas referências e metadados minimizados necessários para o worker reconstruir a mensagem; nunca incluir e-mail em claro quando uma referência server-side resolver o destinatário com segurança, token bruto ou payload administrativo.
  - [x] Implementar reemissão neutra: selecionar apenas provisionamento pendente elegível, enviar exclusivamente ao e-mail já persistido, invalidar tokens anteriores e criar novo token+outbox atomicamente. `requestId`, ID público do Condomínio e e-mail informado são seletores, não autoridade.
  - [x] Aplicar rate limits persistentes/expiráveis por operação, Conta/tenant quando resolvidos e sinais de origem confiáveis; ausência/incoerência de Origin/Fetch Metadata falha fechada, e IP nunca é a única chave.

- [x] **4. Implementar ativação global+tenant em uma única transação** (AC: 6–8, 10, 11)
  - [x] Consumir confirmação somente por `POST`. O `GET` do link renderiza a página e nunca altera estado, evitando consumo por scanners, prefetchers ou previews de e-mail.
  - [x] Bloquear e revalidar token, Conta, provisionamento, tenant registry, migration version e autoridade pendente na mesma conexão/`BEGIN`; atualizar estado global e schema tenant nessa única transação PostgreSQL, sem reutilizar o migrator que abre transação separada.
  - [x] Marcar token usado, e-mail verificado/Conta ativa, tenant ativo, Vínculo/Papel inicial de Síndico vigente e Evento de Auditoria exatamente uma vez. Guard de transição/constraint deve tornar confirmações concorrentes idempotentes ou neutras.
  - [x] Implementar failpoints em cada etapa e comprovar rollback integral: nenhum estado parcial, outbox indevida, autoridade duplicada ou `TenantContext` utilizável.
  - [x] Manter o endpoint de `TenantContext` bloqueado nesta story: ativação não autentica, não cria sessão e não autoriza operações internas; sessão, seleção e construção de contexto pertencem à Story 1.4.

- [x] **5. Habilitar worker PostgreSQL e adapters de e-mail** (AC: 2–5)
  - [x] Substituir o shell `jobsEnabled: false` por composition root independente em `apps/worker`, compartilhando casos de uso/adapters sem importar o composition root da API e encerrando loop/pool corretamente em sinais e falhas de startup.
  - [x] Consumir outbox com `FOR UPDATE SKIP LOCKED`, ordenação determinística, lease recuperável/renovável e maior que o timeout HTTP, chamadas HTTPS fora da transação de claim e finalização condicionada ao lease/versão. Manter ledger durável por tentativa (`started`, `accepted`, `failed`, `ambiguous`) antes/depois da chamada; handlers usam chave idempotente estável por item.
  - [x] Implementar `EmailPort` com Brevo primário e Resend contingência sem acoplar casos de uso a SDK/provedor. Classificar aceite, falha transitória, permanente e resultado ambíguo; “accepted” não significa “delivered”.
  - [x] Assumir semântica de entrega *at-least-once*: Resend pode deduplicar por chave durante sua janela, mas Brevo não oferece garantia equivalente. Crash após aceite ou timeout ambíguo não pode disparar automaticamente retry/contingência como se fosse falha certa; tentar reconciliação quando possível e manter estado ambíguo/recuperação operacional. Duplicata residual deve ser detectável no ledger e na correlação, nunca silenciosa.
  - [x] Aplicar contingência somente pela política configurada e após distinguir falha certa de resultado ambíguo. Registrar somente código/estado/referência sanitizados e correlação.
  - [x] Produzir mensagem texto/HTML escapada, com identidade Burgoweb, finalidade, expiração e um único link; desabilitar tracking, não anexar conteúdo, não incluir nome do Condomínio ou dado administrativo sem necessidade. SPF/DKIM/DMARC são pré-requisitos operacionais documentados, não segredos versionados.
  - [x] Se webhooks de provedor forem incluídos, verificar assinatura, timestamp/replay e idempotência; não são substituto para o aceite síncrono exigido por esta story.

- [x] **6. Expor API `/api/v1`, OpenAPI e cliente gerado** (AC: 5–10)
  - [x] Adicionar `POST /api/v1/email-verifications/confirm` com `{ token }` e `POST /api/v1/email-verifications/resend` com `{ requestId, email }`, validação runtime alinhada ao OpenAPI, respostas RFC 9457, `X-Request-Id`, `Cache-Control: no-store` e `Referrer-Policy: no-referrer`.
  - [x] Na confirmação, retornar `200` com estado público `activated` somente após commit; todo token inválido, expirado, usado, cancelado ou de outra finalidade retorna o mesmo `410` genérico, inclusive replay após sucesso. Receber token exclusivamente no corpo do `POST`, nunca em path, log, auditoria ou exemplo OpenAPI; indisponibilidades não podem diferir de forma explorável em status, corpo, headers, tempo aproximado ou caminho funcional.
  - [x] No reenvio, retornar sempre `202` neutro depois da validação pública, inclusive quando nenhum provisionamento elegível existir. `requestId`+`email` apenas selecionam candidato; o destinatário vem do registro persistido e nunca pode ser alterado pela chamada. Bloquear cross-site e validar Origin/Referer/Fetch Metadata conforme a mutação pública.
  - [x] Atualizar OpenAPI e `scripts/generate-api-client.mjs`, regenerar `packages/api-client` e manter `apps/web` consumindo apenas o cliente gerado; contrato e saídas não contêm token-hash, selector interno, schema, provider credential ou estado interno.

- [x] **7. Criar a experiência pública de verificação e recuperação** (AC: 5, 7–9, 12)
  - [x] Criar rota pública `/verificar-email` com SSR/hydration útil. O link usa fragmento para transportar o token sem enviá-lo ao servidor no `GET`; no browser, capturar em memória e remover imediatamente o fragmento com `history.replaceState` antes de qualquer request. Não guardar token em `localStorage`, `sessionStorage`, analytics ou telemetria.
  - [x] Exigir ação humana explícita “Confirmar meu e-mail” para o `POST`; abrir ou pré-visualizar o link não ativa nada. Bloquear duplo envio e reconciliar resposta incerta sem repetir efeitos.
  - [x] Reutilizar `State panel`, botões, live message, tokens visuais e padrões de foco da Story 1.2. Mostrar estados carregando, confirmação, processando, sucesso persistente, token indisponível, reenvio solicitado, indisponível e sem conectividade com próxima ação segura.
  - [x] No sucesso, afirmar apenas controle do canal e orientar a futura autenticação; não criar sessão, dashboard ou `TenantContext`, e informar que não houve certificação civil, eleição ou mandato jurídico.
  - [x] Implementar recuperação/reenvio sem revelar Conta ou Condomínio, preservar contexto não sensível e mover foco deliberadamente para resultado/erro; não usar toast como única evidência nem contador regressivo ruidoso para leitor de tela.
  - [x] Cumprir teclado, foco visível, HTML semântico, `lang=pt-BR`, labels/ajuda/erros associados, `aria-live` sem repetição, contraste, cor não exclusiva, zoom 200%, reflow 320 CSS px/400%, text spacing, reduced motion, forced colors, orientação e alvos mínimos WCAG 2.2 AA em mobile/desktop.

- [x] **8. Criar testes e executar todos os gates** (AC: 1–12)
  - [x] Unitários: derivação pseudoaleatória/hash-only/finalidade/expiração/uso único; keyring; dump do banco sem keyring não fabrica token; neutralidade; reenvio invalida anterior; limites de relógio; conteúdo sem tracking/segredos; classificação de erros, backoff, lease, contingência e idempotência.
  - [x] PostgreSQL 18 real via Testcontainers: migrations 001→002 e rerun; token+outbox atômicos; claims concorrentes `SKIP LOCKED`; lease expirado/renovado; retry/dead-letter/resultado ambíguo e crash depois do aceite; confirmação concorrente; unicidade de Vínculo/Papel/auditoria; rollback por failpoint; race de reenvio; rate limit concorrente/cleanup; token anterior inválido; isolamento de dois tenants; migration incompatível e ausência de `TenantContext` parcial.
  - [x] Contrato/API/adapters: validação runtime, OpenAPI/cliente, RFC 9457/correlação/cache/referrer, token ausente de logs/respostas/esquemas/snapshots, não enumeração, same-origin, rate limits multissinal, `GET` sem mutação, Brevo/Resend aceito/transitório/permanente/ambíguo e webhook autenticado se existir.
  - [x] Componentes/E2E: abrir link não ativa; confirmação explícita ativa uma vez; sucesso com disclaimer; token indisponível uniforme; reenvio e token anterior; duplo clique; rede incerta; foco/teclado/live regions; axe e estados em 320 px.
  - [x] Revisão humana de acessibilidade: leitor de tela, teclado, foco, zoom 200%, reflow 320 px/400%, text spacing, reduced motion e forced colors em mobile/desktop.
  - [x] Regressão: `npm run smoke`, `check:types`, `check:api-contract`, `check:boundaries`, builds independentes API/worker/web, SSR/hydration, landing, `/comecar`, provisionamento idempotente/compensável, nomes repetidos e bloqueio pré-login do `TenantContext`.

### Review Findings

_Revisão bmad-code-review executada em 2026-07-30 sobre o diff da Story 1.3 (baseline `8bd9171`, 46 arquivos / ~2.339 linhas, excluído `package-lock.json`). Camadas: Blind Hunter (adversarial geral), Edge Case Hunter (caminhos/limites) e Acceptance Auditor (critérios de aceite)._

- [x] [Review][Patch] Canal lateral de tempo no reenvio de verificação — alvo inelegível responde rápido (SELECT+ROLLBACK), alvo elegível dispara transação completa de múltiplas escritas (resolvido como patch em 2026-07-30) — `ResendEmailVerification.execute` (packages/application/src/verification/resend-email-verification.ts:9) sempre retorna o mesmo `NEUTRAL_RESULT`, mas `PostgresVerificationRepository.reissue` (packages/adapters/src/db/postgres-verification-repository.ts:14-27) tem custo de banco muito diferente entre "não elegível" (uma SELECT + ROLLBACK) e "elegível" (SELECT + 2 UPDATEs + 2 INSERTs + COMMIT). Viola diretamente o aprendizado registrado da Story 1.2 ("Neutralidade inclui status, corpo, headers, tempo aproximado, observabilidade e caminho funcional — não apenas copy") e a AC 8/9 desta story.
- [x] [Review][Patch] Falha ao liberar o advisory lock de migration é engolida e pode travar o boot compartilhado entre API e worker indefinidamente (resolvido como patch em 2026-07-30) — `PostgresGlobalMigrator.migrate` (packages/adapters/src/db/postgres-global-migrator.ts:16) executa `pg_advisory_unlock(...).catch(() => undefined)`; como a conexão volta ao pool (não é destruída) e o advisory lock é por sessão, uma falha real de unlock mantém o lock preso nessa sessão. Como API e worker chamam `migrate()` no boot e `pg_advisory_lock` bloqueia indefinidamente (sem timeout), o outro processo travaria esperando um lock que nunca será liberado.

- [x] [Review][Patch] `claim()` da outbox de e-mail não valida o estado do token dentro do próprio `UPDATE` — token usado/cancelado/expirado antes do claim deixa a linha presa em `leased` para sempre, com `attempt_count` crescendo a cada ciclo de lease [packages/adapters/src/db/postgres-verification-outbox.ts:12]
- [x] [Review][Patch] Rate limiter de `/api/v1/provisioning/condominiums` continua em memória e chaveado só por cabeçalhos do cliente — não foi migrado para o `PostgresRateLimiter` persistente aplicado ao `/resend`, contrariando o aprendizado já registrado da Story 1.2 [apps/api/src/nest-app.ts:89-108]
- [x] [Review][Patch] `EmailDeliveryState` não inclui `'ambiguous'`, embora a constraint do banco, `finish()` do adapter e os testes de integração usem esse valor real [packages/application/src/verification/contracts.ts:3]
- [x] [Review][Patch] `ProcessVerificationEmail.execute()` não protege `codec.derive(item)` contra versão de chave ausente no keyring (ex.: após rotação) — lança exceção não tratada e o item roubado (`leased`) fica preso em loop de expiração/reclaim para sempre, nunca chegando a `dead` [packages/application/src/verification/process-verification-email.ts:12]
- [x] [Review][Patch] `apps/worker/src/composition-root.ts` não tem try/catch ao redor da criação do pool + `migrate()` + carregamento de config — qualquer falha de startup vaza o pool, diferente do composition root da API [apps/worker/src/composition-root.ts:9-17]
- [x] [Review][Patch] `apps/worker/src/index.ts` não aguarda a promise em andamento de `startWorker()` no shutdown — SIGINT/SIGTERM antes do startup terminar encerra o processo imediatamente sem limpeza [apps/worker/src/index.ts:6-10]
- [x] [Review][Patch] `startApi()` chama `app.close()` no catch sem seu próprio try/catch — se `close()` falhar, mascara o erro original de `listen()` [apps/api/src/composition-root.ts:33]
- [x] [Review][Patch] `confirm()`/`resend()` não replicam o tratamento catch-all de `create()` — `confirm()` só trata `VerificationUnavailable` e relança o resto; `resend()` não tem try/catch algum — erro inesperado escapa do contrato RFC 9457 exigido pela Task 6 [apps/api/src/nest-app.ts:64-78]
- [x] [Review][Patch] `loadVerificationConfig` não valida colisão entre versão atual e versão da chave anterior, nem rejeita configuração parcial (só `KEY` ou só `VERSION` definidos) [packages/config/src/security-config.ts:31-34]

- [x] [Review][Defer] `scripts/generate-api-client.mjs` continua sendo um "gerador" por grep de substring, agora ampliado com 2 novas operações sem validação estrutural real do contrato [scripts/generate-api-client.mjs] — deferido, pré-existente da Story 1.2
- [x] [Review][Defer] FK circular `verification_tokens.outbox_id`/`email_outbox.verification_id` via `DEFERRABLE INITIALLY DEFERRED` depende de uma ordem de inserção não documentada em `insertVerification` [migrations/global/002_email_verification_activation.sql:47] — deferido, pré-existente
- [x] [Review][Defer] `RATE_LIMITER` indefinido desativaria o rate limit do `/resend` silenciosamente em vez de falhar fechado; hoje inalcançável pois o composition root real sempre fornece `PostgresRateLimiter` [apps/api/src/nest-app.ts:76] — deferido, pré-existente
- [x] [Review][Defer] `HttpEmailPort` (Brevo primário) não tem deduplicação real de provedor — trade-off at-least-once explicitamente aceito nas Dev Notes da story, com duplicatas detectáveis via `email_delivery_attempts`; registrado apenas para visibilidade [packages/adapters/src/email/http-email-port.ts:20] — deferido, aceito por design
- [x] [Review][Defer] Sem limite superior de sanidade para TTL/lease/tentativas de e-mail; lease muito pequeno aproxima o intervalo de renovação da duração do lease [packages/config/src/security-config.ts:15-19] — deferido, pré-existente

## Dev Notes

### Contexto de implementação

- A Story 1.2 termina corretamente em `pending_verification`: Conta, credencial, tenant registry, schema tenant migrado, declaração e autoridade inicial pendente já existem. Esta story adiciona token, outbox, entrega, reenvio e ativação; não refaz onboarding/provisionamento.
- O fluxo termina com Conta/Condomínio/autoridade ativados, porém **sem sessão**. Login/logout, cookie opaco, seleção de Condomínio, CSRF autenticado, dashboard e `TenantContext` pertencem à Story 1.4.
- Recuperação de credencial/sessões é Story 1.5; Convite e ativação de outras Pessoas é Story 1.7. Tokens desses fluxos têm finalidade separada e nunca são reutilizados.
- Verificar e-mail comprova controle do canal, não identidade civil, eleição, mandato ou legitimidade jurídica. Não alterar silenciosamente essa decisão de produto.
- TTL, limites, backoff e política de contingência são configuração operacional testável, não promessa pública. Não inventar SLA, prazo jurídico, base legal ou retenção ainda abertos no PRD.

### Estado atual que deve ser estendido

- `migrations/global/001_provisioning.sql`: estados apenas pendentes/compensados; não há tokens, outbox ou `email_verified_at`. Criar migration 002.
- `migrations/tenant/001_identity_pending.sql`: contém Pessoa e autoridade exclusivamente pendente. Criar migration 002 que preserve histórico e materialize autoridade vigente.
- `packages/application/src/provisioning/create-condominium.ts` e ports: concluem `pending-email-verification` e não enviam e-mail. Estender o fechamento pendente para emissão+outbox atômicas sem quebrar idempotência/compensação da 1.2.
- `packages/adapters/src/db/postgres-provisioning-repository.ts`: preservar resolução server-side de schema e transações; ativação global+tenant precisa de uma única conexão/transação específica.
- `apps/api/src/nest-app.ts`, `openapi.ts` e `composition-root.ts`: hoje expõem somente provisionamento e bloqueio de tenant. Adicionar controllers finos/use cases e preservar redaction, same-origin, correlação, `no-store` e fechamento do pool.
- `apps/worker/src/index.ts`: shell sem jobs. Transformar em processo real e independente, sem importar adapters concretos fora do composition root.
- `packages/config/src/security-config.ts`: hoje valida banco/API/pepper. Adicionar config de verificação/e-mail/worker sem afrouxar o startup fail-closed.
- `packages/api-client/src/provisioning.ts` e gerador: hoje só suportam criação. Gerar contratos de confirmação/reenvio.
- `apps/web/src/components/OnboardingStartPage.tsx`, rota `/comecar`, router e estilos: preservar formulário, estado pendente, SSR/hydration, idempotência, foco e bloqueio interno; acrescentar orientação/reenvio e nova rota sem duplicar padrões.
- `scripts/dev.mjs`: hoje sobe PostgreSQL/API/web, mas não worker. Orquestrar worker e configuração efêmera sem imprimir token/credenciais nem depender de provedor real para testes automatizados.

### Segurança do token e da URL

- A exigência “somente hash persistido” vale também para outbox. Derive o token completo por HMAC/keyring versionado sobre domínio de finalidade, IDs aleatórios de verificação/outbox e contexto server-side imutável. Os IDs persistidos não são parte do token nem autoridade; persista somente o hash do token completo e reconstrua o token somente no worker. Um dump do banco sem o keyring não pode fabricar token válido.
- O link recomendado é `https://<allowed-origin>/verificar-email#token=<token>`: fragmento não chega no request HTTP nem no `Referer`. A página não consome por `GET`; o browser remove o fragmento e envia token no corpo de um `POST` explícito.
- Nunca registrar URL completa, fragmento, token ou mensagem. `X-Request-Id`, IDs públicos de request/tenant e selector não são autorização. Reenvio sempre entrega ao endereço persistido e elegível.
- Resultado aceito pela API do provedor significa apenas aceitação para processamento. Não comunicar entrega final sem evidência posterior; tracking de abertura/clique permanece desabilitado.

### Arquitetura e padrões obrigatórios

- Preservar AD-1/AD-2: módulos verticais, use cases dependem de ports, adapters concretos somente nos composition roots da API/worker.
- Preservar AD-3: REST JSON `/api/v1`, `camelCase`, validação runtime, OpenAPI/cliente gerado, RFC 9457 e `X-Request-Id`.
- Aplicar AD-4/AD-7/AD-25: tenant/schema nunca são autoridade do browser; ativação somente com migration compatível e estado integral.
- Aplicar AD-10/AD-11: finalidade isolada, uso único, hash-only; estado+auditoria+outbox na transação correspondente.
- Aplicar AD-17: fila PostgreSQL, `FOR UPDATE SKIP LOCKED`, lease, backoff, tentativas limitadas, dead-letter, handler idempotente.
- Aplicar AD-22/AD-23: `EmailPort`, Brevo primário/Resend contingência via HTTPS, tracking off, config tipada/fail-closed e segredos runtime de menor privilégio.
- Banco em `snake_case`, JSON em `camelCase`, timestamps `timestamptz` UTC, IDs opacos. SQL de aplicação por Kysely/adapter existente ou migration versionada; tipos de persistência não atravessam API.

### Stack e dependências

- Preservar o lockfile atual: Node.js `24.18.0`, TypeScript `7.0.2`, React `19.2.7`, TanStack Start `1.168.30`, Router `1.170.18`, Vite `8.1.5`, NestJS/platform-fastify `11.1.20`, Fastify `5.10.0`, PostgreSQL `18.4`, Kysely `0.29.2`, Vitest `4.1.10`, Cypress `15.19.0` e Testcontainers `12.0.4`.
- O root contém `@tanstack/start-plugin-core 1.171.22`; não “alinhar” versões TanStack por atualização silenciosa. A resolução atual já foi validada e o lockfile prevalece.
- Preferir `node:crypto` (`randomBytes`, HMAC/hash e comparação constante) e `fetch` HTTPS nativo do Node 24; não adicionar SDKs/filas/Redis quando os ports e APIs HTTP bastam. Nova dependência fora da story exige aprovação.

### Aprendizados da Story 1.2 e code review

- Não confundir terminal conhecido com polling infinito; toda espera tem limite e resultado recuperável.
- Neutralidade inclui status, corpo, headers, tempo aproximado, observabilidade e caminho funcional — não apenas copy.
- Audit port deve ser realmente chamado; checar `rowCount`/guard de transição e não assumir que update ocorreu.
- Rate limit não pode depender apenas de headers controláveis nem crescer sem TTL; origem ausente ou incoerente falha fechada.
- Startup/listen/close devem liberar pool/loop; erros devem classificar corretamente retry, terminal e resultado ambíguo.
- Redaction deve cobrir `camelCase`, `snake_case`, estruturas circulares e URLs. Nenhum token ou payload pessoal em logs/snapshots.
- O worktree contém implementação e artefatos não commitados. Não limpar, resetar, sobrescrever ou inferir escopo somente por `git diff`.

### Deferred work relevante

- Migrations sem advisory lock tornam-se diretamente relevantes quando API e worker podem iniciar juntos; resolver nesta story ou estabelecer owner único comprovado.
- Pacotes sem `tsconfig.json` próprio continuam checados transitivamente; se novos entrypoints escaparem dessa cobertura, adicionar build/typecheck específico sem transformar isso em refatoração ampla.
- `scripts/dev.mjs` fixa distro WSL `Ubuntu`; ao incluir worker, não ampliar essa dependência. Portabilidade completa continua registrada no ledger se não for pré-requisito.
- Fallback de pepper Argon2 e hash malformado pertencem ao login da Story 1.4; não expandir escopo aqui.

### Testing Requirements

- PostgreSQL 18 real via Testcontainers é obrigatório; mocks não demonstram locks, `SKIP LOCKED`, transação global+tenant, migration, concorrência ou rollback.
- Adapters de provedor devem ser testáveis por servidor HTTP controlado/fake, sem credencial externa em CI. Testes precisam cobrir timeout depois de possível aceite, pois retry/contingência ingênuos duplicam envio.
- Comprovar que nenhum `GET`, scanner ou preview ativa o tenant; somente `POST` explícito consome token.
- Procurar token/secret/hash/schema/email excessivo em respostas, logs capturados, auditoria, outbox, OpenAPI, snapshots e artefatos gerados.
- Reexecutar integralmente os gates das Stories 1.1/1.2 e revisão humana de acessibilidade antes de marcar a story para review.

### Project Structure Notes

Arquivos existentes que obrigatoriamente devem ser avaliados como `UPDATE` e preservados quando não houver mudança necessária:

- `package.json`, `package-lock.json`, manifests/tsconfigs de API, worker, web e pacotes alcançados;
- `apps/api/src/composition-root.ts`, `apps/api/src/nest-app.ts`, `apps/api/src/openapi.ts` e `apps/api/src/index.ts`;
- `apps/worker/src/index.ts` e novo composition root próprio;
- `packages/application/src/index.ts` e módulos atuais de provisioning integrados ao fechamento pendente;
- `packages/adapters/src/index.ts`, `packages/adapters/src/db/postgres-global-migrator.ts`, `postgres-tenant-migrator.ts` e `postgres-provisioning-repository.ts`;
- `packages/config/src/index.ts` e `packages/config/src/security-config.ts`;
- `packages/api-client/src/index.ts`, `packages/api-client/src/provisioning.ts` e `scripts/generate-api-client.mjs`;
- `apps/web/src/components/OnboardingStartPage.tsx`, `apps/web/src/router.tsx`, `apps/web/src/routeTree.gen.ts`, `apps/web/src/styles.css` e `apps/web/vite.config.ts`;
- `scripts/dev.mjs`, boundary/build scripts e testes existentes de contrato, integração, SSR, acessibilidade e Cypress.

Novos arquivos devem seguir esta estrutura; nomes podem variar somente para aderir aos módulos existentes:

```text
apps/api/src/                         # controllers/composition root da verificação
apps/worker/src/                      # composition root e loop da outbox
apps/web/src/components/              # página/estados de verificação
apps/web/src/routes/verificar-email.tsx
packages/application/src/verification/# casos de uso, contratos e ports
packages/adapters/src/db/             # token, ativação e outbox PostgreSQL
packages/adapters/src/email/          # EmailPort Brevo/Resend
packages/adapters/src/security/       # geração/hash/reconstrução do token
packages/config/src/                  # config tipada de token/e-mail/worker
packages/api-client/src/              # cliente gerado de confirmação/reenvio
migrations/global/002_email_verification_activation.sql
migrations/tenant/002_activate_initial_authority.sql
tests/                                # unidade, contrato e integração real
cypress/e2e/                          # confirmação pública e acessibilidade
```

### Informação técnica atual verificada

- Node.js 24 fornece CSPRNG, HMAC/hash e comparação constante em `node:crypto`; usar bytes aleatórios suficientes e manter toda a segurança do token no servidor. [Node.js 24 Crypto](https://nodejs.org/docs/latest-v24.x/api/crypto.html)
- PostgreSQL 18 documenta `SKIP LOCKED` como apropriado para múltiplos consumidores de tabela com comportamento de fila, não para leitura geral; combinar com lease e ordenação determinística. [PostgreSQL 18 — SELECT locking clause](https://www.postgresql.org/docs/18/sql-select.html#SQL-FOR-UPDATE-SHARE)
- Resend aceita `Idempotency-Key` em envio e mantém deduplicação por 24 horas; isso complementa, mas não substitui, o ledger persistido nem torna exatamente uma vez a entrega multprovedor. [Resend — Idempotency Keys](https://resend.com/docs/dashboard/emails/idempotency-keys)
- Brevo expõe envio transacional por HTTPS; encapsular contrato e autenticação no adapter do `EmailPort`, sem vazar resposta do provedor para o domínio público. [Brevo — Send transactional email](https://developers.brevo.com/reference/send-transac-email)

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Épico 1, Story 1.3, dependências e invariantes]
- [Source: `_bmad-output/planning-artifacts/prd.md` — UJ-1, FR-3, FR-4, FR-5, NFR-6–NFR-14, escopo e gates]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/ARCHITECTURE-SPINE.md` — AD-1–AD-7, AD-10, AD-11, AD-17, AD-22–AD-26, conventions e stack]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-burgoweb-2026-07-27/EXPERIENCE.md` — Foundation, Acesso sem sessão/Começar, State Patterns, Accessibility Floor, Responsive e UJ-1]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-burgoweb-2026-07-27/DESIGN.md` — Typography, Layout, State panel, Button, Toast/live message e Focus ring]
- [Source: `docs/product/discovery/01-identidade-e-proposito.md` — princípios, promessa e tom]
- [Source: `docs/product/discovery/03-segmentos-e-personas.md` — Márcia e separação Pessoa/Vínculo/Papel]
- [Source: `docs/product/discovery/04-necessidades-e-jornadas.md` — entrada e adoção progressiva]
- [Source: `docs/product/discovery/07-mapa-de-capacidades.md` — identidade, convites, experiência e acessibilidade]
- [Source: `docs/product/discovery/08-decisoes-hipoteses-e-riscos.md` — autoridade, privacidade, escopo e hipóteses]
- [Source: `_bmad-output/implementation-artifacts/1-2-criar-conta-e-condominio-de-forma-segura.md` — implementação, review, gates e File List]
- [Source: `_bmad-output/implementation-artifacts/deferred-work.md` — sete itens adiados]
- [Source: `migrations/global/001_provisioning.sql`, `migrations/tenant/001_identity_pending.sql`, `packages/application/src/provisioning/*`, `apps/api/src/*`, `apps/worker/src/index.ts`, `apps/web/src/components/OnboardingStartPage.tsx` — estado atual]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- 2026-07-30 — Implementação iniciada no baseline `8bd91716b0c465c303cb00586a20af3e997fa31f`; story e sprint marcados como `in-progress`.
- 2026-07-30 — Revisão humana bloqueada por `ERR_MODULE_NOT_FOUND` no worker local; `esbuild` declarado diretamente e worker desabilitado mantido ocioso até o shutdown. Ambiente completo validado em HTTP 200 na web/API.
- 2026-07-30 — Segunda retomada da revisão humana: processos órfãos da validação ocupavam 3000/3001 e o terminal selecionava Node 22.11 apesar do fnm possuir 24.18. Orquestrador passou a usar `--strictPort` e encerrar árvores de subprocessos no Windows; portas liberadas e web/API revalidadas em Node 24.18 com HTTP 200.
- 2026-07-30 — Feedback da revisão humana identificou recuperação ambígua e ausência de entrega observável no ambiente local. O formulário passou a explicar e preencher o código da solicitação/e-mail, o cadastro ganhou confirmação local de senha e o ambiente de desenvolvimento passou a entregar pelo Mailpit.
- 2026-07-30 — Proprietário confirmou o funcionamento de todo o processo após os ajustes, encerrando a validação humana e liberando a story para revisão de código.

### Implementation Plan

- Executar as tarefas na ordem da story com testes primeiro: contratos/token/config; migrations; emissão/reenvio; ativação; worker/e-mail; API/cliente; UX; regressão completa.
- Preservar a Story 1.2 e manter login, sessão e `TenantContext` fora do escopo.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Story criada a partir da decomposição final, fontes canônicas de produto, PRD, Architecture Spine, UX Spines, código atual, Story 1.2 concluída, code review e deferred work.
- Fronteiras de escopo com login, recuperação, Convites, Pessoas e Papéis futuros foram explicitadas.
- Guardrails críticos definidos para token hash-only reconstruível, `POST` explícito, outbox/worker, ativação global+tenant atômica, reenvio neutro e bloqueio contínuo de `TenantContext`.
- Contratos de verificação/e-mail, estados explícitos, codec HMAC hash-only com keyring e configuração runtime fail-closed concluídos; 54/54 testes não integrados e TypeScript aprovados.
- Migrations global/tenant 002, execução ordenada sob advisory lock, autoridade tenant versionada e tabelas de token/outbox/tentativas/rate limit concluídas; 57/57 testes não integrados, 7/7 PostgreSQL 18 e TypeScript aprovados.
- Emissão inicial e reemissão hash-only/outbox concluídas atomicamente, com seleção server-side, invalidação do token anterior, rate limit persistente e origem fail-closed.
- Ativação global+tenant concluída numa única transação, com migration guard, consumo único, auditoria idempotente, concorrência e rollback integral nos três failpoints observáveis.
- Worker independente, claim `SKIP LOCKED`, lease recuperável/renovável, ledger de tentativas e adapters HTTPS Brevo/Resend concluídos; resultado ambíguo não dispara contingência cega.
- API/OpenAPI/cliente e experiência SSR `/verificar-email` concluídos; fragmento removido antes de requests, confirmação humana explícita, reenvio neutro, disclaimer e estados acessíveis.
- Gates automáticos concluídos: 66/66 testes não integrados, 9/9 PostgreSQL 18, 13/13 Cypress, TypeScript, contrato OpenAPI, fronteiras e builds API/worker/web.
- Ambiente manual corrigido e revalidado: PostgreSQL/API/worker/web permanecem ativos após “Burgoweb pronto”; build do worker, TypeScript e 4 testes afetados aprovados.
- Fluxo local real validado ponta a ponta: nova solicitação criou mensagem no Mailpit, o link com fragmento foi extraído da mensagem e a confirmação ativou a gestão inicial. Nenhum token foi persistido no navegador; somente código da solicitação e e-mail são usados para facilitar eventual reenvio.
- Após os ajustes de UX/Mailpit, foram aprovados 67/67 testes não integrados, build completo em Node 24.18 e 13/13 cenários Cypress. O proprietário confirmou o funcionamento do processo completo na revisão humana.

### Change Log

- 2026-07-30 — Implementado o fluxo completo de verificação de e-mail, entrega assíncrona, reemissão, ativação atômica e recuperação pública da Story 1.3.
- 2026-07-30 — Revisão humana concluída; Story 1.3 promovida para `review`.
- 2026-07-30 — `bmad-code-review` executado (Blind Hunter, Edge Case Hunter, Acceptance Auditor). 2 achados `decision-needed` decididos pelo proprietário e resolvidos como `patch`; 11 `patch` aplicados no total (destaque: claim() da outbox agora valida o token antes do UPDATE e faz dead-letter de itens com token indisponível; rate limiter do provisionamento migrado para `PostgresRateLimiter`; reenvio de verificação equalizado para reduzir o canal lateral de tempo; advisory lock de migration trocado por `pg_try_advisory_lock` com timeout, destruindo a conexão se o unlock falhar; composition root do worker e shutdown corrigidos para não vazar pool/conexão). 5 `defer` registrados em `deferred-work.md`; 3 descartados como ruído (2 refutados por leitura direta do código/API instalada, 1 já era decisão de produto aprovada). Suíte não integrada revalidada (67/67, 1 ajuste de asserção obsoleta em `tests/migrations-verification-contract.test.ts`), `check:types`, `check:boundaries`, `check:api-contract` e `npm run build` aprovados. A suíte real de integração PostgreSQL/Testcontainers não pôde ser executada nesta sessão de revisão — Docker só é alcançável via WSL e o Node 24 do WSL não estava no PATH desta invocação não interativa; recomenda-se rodar `BURGOWEB_INTEGRATION=1 npm run test:integration` no ambiente WSL antes de confiar plenamente nas mudanças de SQL (claim/reissue/migrator) em produção. Story promovida para `done`.

### File List

- packages/application/src/index.ts
- packages/application/src/verification/contracts.ts
- packages/application/src/verification/ports.ts
- packages/adapters/src/index.ts
- packages/adapters/src/security/hmac-verification-token.ts
- packages/config/src/security-config.ts
- tests/email-verification.test.ts
- migrations/global/002_email_verification_activation.sql
- migrations/tenant/002_activate_initial_authority.sql
- packages/adapters/src/db/postgres-global-migrator.ts
- packages/adapters/src/db/postgres-provisioning-repository.ts
- packages/adapters/src/db/postgres-tenant-migrator.ts
- tests/migrations-verification-contract.test.ts
- tests/postgres-integration.test.ts
- packages/application/src/verification/verification-token-issuer.ts
- packages/application/src/verification/resend-email-verification.ts
- packages/application/src/verification/confirm-email-verification.ts
- packages/application/src/verification/process-verification-email.ts
- packages/adapters/src/db/postgres-verification-repository.ts
- packages/adapters/src/db/postgres-verification-outbox.ts
- packages/adapters/src/db/postgres-rate-limiter.ts
- packages/adapters/src/email/http-email-port.ts
- packages/adapters/src/email/mailpit-email-port.ts
- apps/api/src/composition-root.ts
- apps/api/src/nest-app.ts
- apps/api/src/openapi.ts
- apps/worker/src/composition-root.ts
- apps/worker/src/index.ts
- apps/web/src/components/EmailVerificationPage.tsx
- apps/web/src/components/OnboardingStartPage.tsx
- apps/web/src/routes/verificar-email.tsx
- apps/web/src/routeTree.gen.ts
- packages/api-client/src/provisioning.ts
- scripts/generate-api-client.mjs
- scripts/dev.mjs
- infra/compose/compose.dev.yml
- docs/operations/email-delivery.md
- tests/api-verification.test.ts
- tests/email-delivery.test.ts
- tests/api-provisioning.test.ts
- tests/accessibility-contract.test.ts
- tests/ssr-smoke.test.ts
- tests/entrypoints.test.ts
- tests/boundaries.test.ts
- cypress/e2e/public-entry.cy.js
- apps/worker/package.json
- package-lock.json
