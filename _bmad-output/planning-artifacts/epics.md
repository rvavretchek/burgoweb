---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/addendum.md
  - _bmad-output/planning-artifacts/ux.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/implementation-readiness-report-2026-07-21.md
  - _bmad-output/planning-artifacts/review-rubric.md
  - _bmad-output/planning-artifacts/review-adversarial-product.md
  - _bmad-output/planning-artifacts/review-privacy-security.md
  - _bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/reviews/review-stack.md
  - _bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/reviews/review-security-tenancy.md
  - _bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/reviews/review-rubric-walker.md
  - _bmad-output/planning-artifacts/BURGOWEB_COBRANÇA.md
  - _bmad-output/planning-artifacts/solicitacao-parecer-cobranca-e-vinculos.md
---

# burgoweb - Decomposição de Épicos

## Visão geral

Este documento contém a decomposição completa de épicos e histórias do Burgoweb, derivada do PRD e addendum finais, do contrato de UX disponível, da arquitetura final e dos relatórios dos gates. O relatório de prontidão de 2026-07-21 é usado somente como evidência histórica dos problemas que a nova decomposição não pode repetir.

## Inventário de requisitos

### Requisitos funcionais

FR-1: O visitante pode compreender a proposta gratuita, o público atendido e o compromisso de organização e transparência antes de criar uma Conta.

FR-2: O visitante pode selecionar **Utilize gratuitamente** para iniciar a criação da Conta e do Condomínio.

FR-3: O responsável pode criar sua Conta e um Condomínio em um único fluxo orientado, com autoridade inicial autodeclarada, registrada e limitada ao Condomínio criado.

FR-4: A Pessoa pode autenticar-se, encerrar sua sessão e recuperar acesso à Conta pelo controle do e-mail verificado, com invalidação dos tokens e sessões alcançados.

FR-5: Uma Conta acessa somente Condomínios e dados cobertos por Vínculos ativos e Papéis autorizados, com verificação no servidor e preservação da autoria histórica após suspensão ou encerramento.

FR-6: O Síndico ou Auxiliar Administrativo autorizado pode cadastrar Pessoas, e-mails e Vínculos com Unidades, mantendo Pessoa, Conta e Vínculo como registros distintos e temporalmente auditáveis.

FR-7: O Síndico ou Auxiliar com capacidade delegada pode enviar, reenviar, acompanhar, cancelar e expirar Convites; o destinatário pode ativar ou associar sua Conta sem duplicidade indevida de identidade.

FR-8: O Síndico pode gerir Papéis subordinados e capacidades explícitas; Auxiliar autorizado pode aplicar suspensão urgente reversível, mas não elevar poderes, revogar o Síndico nem confirmar revogação administrativa permanente.

FR-9: O Condomínio pode trocar Síndico ou Auxiliares sem perder dados, histórico ou acesso institucional, distinguindo transferência cooperativa, recuperação operacional e transferência contestada.

FR-10: O Síndico ou Auxiliar autorizado pode criar, corrigir e classificar Lançamentos de receita e despesa, com estados, realização parcial, cancelamento justificado, idempotência e atomicidade.

FR-11: O Síndico ou Auxiliar autorizado pode registrar serviços e parcelamentos, preservando valor total, fornecedor, parcelas, vencimentos, pagamentos, saldo e apresentação publicada sem Dados Pessoais desnecessários.

FR-12: Papéis autorizados podem consultar caixa e previsões por Conta Financeira, separando valores realizados e previstos e preservando equação de saldo, moeda e fuso do Condomínio.

FR-13: O Síndico ou Auxiliar autorizado pode conduzir períodos pelos estados Aberto, Conferido, Fechado e Publicado, com snapshot auditável, reabertura justificada e versões preservadas.

FR-14: Anexos associados a Lançamentos são privados por padrão e somente podem ser compartilhados após ação explícita, pré-visualização de audiência e confirmação por Pessoa com capacidade de publicação.

FR-15: O Condomínio pode operar internamente antes de cadastrar Moradores; após o primeiro Vínculo de Morador, a transparência coletiva não pode ser desativada unilateralmente, admitindo apenas suspensão de Publicação específica.

FR-16: O Morador pode consultar informações financeiras publicadas e dados individuais das Unidades pelas quais seja Responsável Financeiro, sem acesso a dados administrativos, rascunhos ou dados de outra Unidade.

FR-17: Informações trabalhistas são exibidas a Moradores e Conselheiros somente de forma agregada, com reagrupamento ou supressão conforme a política aprovada de risco de reidentificação.

FR-18: Relatórios gerais, telas de Conselheiro e materiais de assembleia apresentam inadimplência somente de forma agregada e reconciliável com os saldos detalhados autorizados.

FR-19: Somente Síndico, Auxiliar especificamente autorizado e Responsável Financeiro da própria Unidade podem consultar inadimplência detalhada, dentro de seus limites explícitos.

FR-20: O Conselheiro pode consultar caixa, fluxo, receitas, despesas e previsões, mas não cadastros, inadimplência individual, dados trabalhistas individuais nem originais de Anexos.

FR-21: O Síndico ou Auxiliar com capacidade específica pode gerir o ciclo de Pendências internas, com estados, responsáveis, prazos, justificativas, histórico e visibilidade restrita; comunicação a Moradores exige Publicação separada.

FR-22: O sistema preserva histórico compreensível de mudanças relevantes, com autor, instante, natureza e filtros autorizados, sem reescrita silenciosa.

FR-23: Comentários, Decisões Operacionais e Eventos de Auditoria permanecem semanticamente distintos, com permissões próprias e moderação auditável.

FR-24: Papel explicitamente autorizado pode gerar Exportação Institucional completa, documentada e utilizável por terceiro, preservando escopo institucional e excluindo credenciais e segredos.

FR-25: O Síndico ou Auxiliar autorizado pode gerar Exportação Financeira por escopo selecionado e registrar aceitação, rejeição e substituição informadas pelo operador externo, sem integração contábil automática.

FR-26: Exportações possuem snapshot coerente, manifesto, formato aberto, integridade verificável, autenticação recente, download temporário auditado, tratamento de falhas e ciclo de vida controlado.

FR-27: Comunicados, Fechamentos, prestações e demais snapshots publicados possuem versões imutáveis, estados explícitos e histórico acessível conforme Papel e retenção.

FR-28: Síndico, Auxiliar autorizado ou operador do Burgoweb diante de incidente técnico pode suspender uma Publicação específica, preservando conteúdo restrito, motivo, autoria, histórico e demais Publicações seguras.

FR-29: Cada Condomínio possui SLA finito para tratar suspensão, inicialmente 72 horas e configurável somente pelo Síndico para casos futuros, sem republicação automática e com vencimento, notificações e prorrogações auditáveis.

FR-30: A Pessoa pode iniciar e acompanhar solicitação sobre seus Dados Pessoais, com autenticação, encaminhamento, estados, decisão e resposta justificada, condicionados ao gate jurídico.

FR-31: O Síndico pode designar Contatos de Continuidade para alertas e apoio operacional sem conceder Papel administrativo ou acesso adicional; designação, aceitação e remoção são notificadas e auditadas.

FR-32: Uma Pessoa pode registrar transferência contestada e evidências sem receber acesso; qualquer execução depende de procedimento reconhecido e registro completo, sem certificação jurídica pelo Burgoweb.

FR-33: O Burgoweb pode conter uma Conta administrativa comprometida, revogar sessões e Convites e sinalizar ações recentes sem transferir automaticamente autoridade.

FR-34: Síndico ou Auxiliar com capacidade delegada pode publicar conteúdo institucional após pré-visualizar versão, audiência, campos e Anexos e confirmar explicitamente; Morador e Conselheiro não publicam no MVP.

FR-35: O Anexo original privado e a versão compartilhável são objetos distintos, imutáveis e autorizados independentemente, com audiência explícita e trilha preservada.

FR-36: Correção de conteúdo publicado cria nova versão e notifica a audiência quando altera valor, período, audiência ou Anexo, preservando classificação, responsável e histórico.

FR-37: Cada Condomínio possui Cota de Armazenamento configurável, com consumo, alertas e bloqueio apenas de novos uploads; remoção é explícita, respeita retenção e preserva trilha e integridade histórica.

FR-38: O Síndico ou Auxiliar autorizado pode criar, ativar e encerrar Contas Financeiras, mantendo Movimentos, decomposição de saldos e ausência de alegação de conciliação bancária.

FR-39: O Síndico ou Auxiliar autorizado pode criar Obrigações por Unidade individualmente ou em lote, com pré-visualização, prevenção de duplicidade, saldo, inadimplência, correção e cancelamento auditáveis.

FR-40: O sistema apresenta previsões financeiras separadas do caixa realizado, com período, premissas e atualização sem reescrever snapshots fechados.

FR-41: O Síndico pode delegar capacidades granulares a Auxiliares; toda ausência é negada no servidor e toda concessão ou retirada possui vigência e auditoria, sem autodelegação ou delegação entre Auxiliares.

FR-42: Síndico ou Auxiliar com capacidade específica de gerir Responsáveis Financeiros pode atribuir ou remover essa responsabilidade por relação Pessoa–Unidade, sem elevar Papel global e com notificação e auditoria.

FR-43: Pessoa com acesso ao objeto pode comentar sem alterar estado ou decisão; edição cria versão, moderação preserva original restrito e Anexos herdam visibilidade privada.

FR-44: Síndico ou Auxiliar com capacidade específica pode confirmar Decisão Operacional explícita, imutável e substituível por nova decisão, sem convertê-la em ata ou Publicação automática.

FR-45: O sistema gera Eventos de Auditoria minimizados e imutáveis para operações relevantes, sem credenciais ou conteúdo excessivo e com consulta e exportação limitadas por capacidade e retenção.

### Requisitos não funcionais

NFR-1: O produto deve coletar e expor apenas dados necessários à finalidade de cada fluxo.

NFR-2: Conteúdo coletivo deve ocultar, agregar ou reagrupar Dados Pessoais conforme critérios aprovados de risco de reidentificação.

NFR-3: Toda operação de tratamento relevante deve possuir finalidade, acesso, retenção e base legal documentáveis antes do lançamento público.

NFR-4: Solicitações de titulares devem possuir canal, autenticação, encaminhamento, estado, resposta justificada e trilha de auditoria.

NFR-5: A política de retenção deve abranger os dados efetivamente mantidos; exportação externa não encerra o tratamento das cópias remanescentes.

NFR-6: Toda operação protegida deve verificar autorização no servidor considerando Conta, Condomínio, Vínculo e Papel/capacidade.

NFR-7: Identificadores previsíveis ou requisições manipuladas nunca podem permitir acesso cruzado entre Condomínios.

NFR-8: Credenciais, sessões, segredos e dados armazenados ou transmitidos devem atender ao baseline de segurança da arquitetura para sua classe de risco.

NFR-9: Eventos relevantes devem ser auditáveis sem registrar segredos ou dados excessivos.

NFR-10: Antes do lançamento, deve existir procedimento verificável de detecção, contenção, preservação de evidências, avaliação, correção, restauração, comunicação e revisão de incidentes.

NFR-10A: O procedimento deve cobrir, no mínimo, comprometimento de Conta, abuso de Convite/recuperação, sessão não revogada, acesso cross-tenant, publicação/exportação indevida, exposição de banco/backup, segredo vazado, alteração não autorizada e perda de dados.

NFR-11: Fluxos críticos devem funcionar por teclado, com foco visível, rótulos compreensíveis, contraste adequado e mensagens independentes de cor.

NFR-12: Landing page, onboarding, autenticação, convite, registro financeiro, publicação e consulta devem funcionar nas telas móveis e desktop suportadas.

NFR-13: A linguagem financeira e administrativa deve ser compreensível para usuários sem formação técnica ou contábil.

NFR-14: Gravações não podem produzir duplicidade silenciosa diante de repetição, falha de rede ou reenvio.

NFR-15: O sistema deve possuir backup e restauração testados, com objetivos de recuperação definidos antes do lançamento.

NFR-16: Metas quantitativas de disponibilidade, latência, capacidade e recuperação dependem de medição e validação no gate de lançamento.

NFR-17: O MVP deve ser operável por uma pessoa com disponibilidade parcial, sem NOC, plantão ou equipe dedicada.

NFR-18: A arquitetura deve minimizar tarefas recorrentes e fornecer diagnóstico e verificações proporcionais ao risco.

NFR-19: Limitações de disponibilidade, suporte, manutenção, recuperação e capacidade devem ser documentadas e comunicadas realisticamente.

NFR-20: Nenhuma meta operacional pode ser apresentada como compromisso público sem evidência de sustentabilidade.

### Requisitos adicionais

- A implementação é greenfield no repositório existente; o protótipo e `data/storage.json` não definem contratos, migração ou compatibilidade e só podem ser removidos após snapshot Git revisável e nova base com build e testes fundamentais.
- O primeiro incremento técnico deve criar o monorepo com `apps/web`, `apps/api`, `apps/worker`, pacotes internos, migrations e infraestrutura, preservando fronteiras de imports e composition roots (AD-1, AD-2 e Structural Seed).
- A stack de bootstrap deve usar as versões fixadas na arquitetura e produzir lockfile funcional; TanStack Start/Router permanece condicionado a smoke tests de build, SSR, hydration, navegação e Cypress.
- A API pública deve ser REST JSON em `/api/v1`, com validação runtime, OpenAPI validado no CI, cliente TypeScript gerado, RFC 9457, evolução aditiva e nova versão para breaking changes (AD-3).
- Toda operação tenant-scoped deve usar `TenantContext` confiável resolvido no servidor; IDs ou schemas recebidos do cliente não constituem autorização (AD-4).
- PostgreSQL deve usar schema global para Conta/sessão/tokens/registro de tenants e um schema por Condomínio para dados institucionais; consultas e jobs devem impedir vazamento por `search_path` ou pool (AD-5).
- Kysely é o único acesso ao banco da aplicação; migrations SQL versionadas são permitidas e tipos gerados não atravessam a API (AD-6).
- Migrations globais e tenant devem ser separadas, versionadas, retomáveis, aplicadas em lotes e compatíveis com expand/contract; tenant só é ativado após migration compatível (AD-7).
- Autorização deve ser granular, transacional, revogável e deny-by-default; gerir Responsáveis Financeiros é capacidade distinta de gerir Vínculos e notifica a Pessoa afetada (AD-8 e gates PS-01/PS-02).
- Sessões devem usar token opaco aleatório em cookie `__Host-`, persistir apenas hash, possuir rotação, revogação, TTL, proteção CSRF, Origin/Referer/Fetch Metadata, rate limits e respostas sem enumeração (AD-9).
- Senhas devem usar Argon2id com salt individual e pepper versionado no OCI Vault; Convite, verificação e recuperação usam tokens distintos, de uso único, expirados e persistidos somente como hash (AD-10).
- Cada mutação deve ser transacional e observável, com auditoria/outbox quando exigido, controle otimista de versão, resposta 409 a conflito e idempotência vinculada a tenant, Conta, operação e payload (AD-11).
- Publicações devem usar snapshots imutáveis; correções geram nova versão, suspensões não alteram conteúdo/hash nem republicam automaticamente e expurgo permitido mantém tombstone, hash e razão (AD-12 e gate de ciclo de vida de Anexos).
- Uploads devem usar storage privado, chave opaca, URL curta, quarentena fail-closed, verificação de tamanho/hash/tipo, allowlist e scanner/sanitizador; originais e compartilháveis são objetos separados e imutáveis (AD-13).
- A política de auditoria deve enumerar leituras sensíveis — inadimplência detalhada, original de Anexo, conteúdo moderado, solicitação LGPD, exportação/download e mudanças de segurança/capacidade — sem copiar conteúdo sensível (AD-14 e PS-03/PS-04).
- Eventos de Auditoria são append-only para a aplicação, inseridos por port/role restrito; correções são compensatórias e consultas usam projeção minimizada e capacidade própria (AD-15).
- Dinheiro usa `numeric(19,2)`, biblioteca decimal e string decimal no JSON; instantes usam UTC, datas civis usam `date`, Condomínio usa timezone IANA e IDs públicos são opacos (AD-16).
- O processamento assíncrono inicial usa outbox PostgreSQL e worker separado com lease, tentativas, backoff, dead-letter e handlers idempotentes; Redis/BullMQ não integra o baseline (AD-17).
- Exportação usa ZIP64 versionado com manifesto, JSON canônico UTF-8, CSV, binários autorizados e SHA-256; geração e entrega revalidam autorização e o artefato privado expira (AD-18).
- Backup deve combinar recuperação física/PITR e dumps lógicos por schema, criptografia, integridade, retenção e credenciais separadas; restore integral, seletivo e reprovisionamento devem ser exercitados em destino novo (AD-19).
- O baseline OCI é single-node ARM64 e não HA, com Load Balancer público, reverse proxy privado e Docker Compose para web, API, worker e PostgreSQL; nenhuma documentação pode alegar alta disponibilidade (AD-20).
- Salt governa a OCI por canal privado e menor privilégio; Alloy exporta métricas minimizadas; Prometheus/Grafana rodam na GCP; auditoria fica separada de logs técnicos (AD-21).
- Object storage, backup storage e e-mail devem ficar atrás de ports; Brevo é primário, Resend é contingência, SPF/DKIM/DMARC são obrigatórios e tracking de abertura/clique fica desabilitado (AD-22).
- Configuração deve ser tipada e fail-closed; segredos entram somente em runtime e limites de abuso usam Conta, tenant, operação e sinais de origem — nunca somente IP (AD-23 e gate de segurança).
- O gate de release deve usar PostgreSQL real via Testcontainers, Vitest e Cypress e cobrir contratos, fronteiras, isolamento, revogação concorrente, autenticação, idempotência, outbox, migrations, storage hostil, acessibilidade, benchmark, soak e restore (AD-24).
- Provisionamento deve ser compensável e só ativar o tenant após schema migrado; recuperação/contenção nunca transfere autoridade e suspensão, disputa, LGPD, SLA e cotas usam máquinas de estado com owner e auditoria (AD-25).
- WCAG 2.2 AA é baseline de entrega; testes automatizados complementam, mas não substituem, revisão humana de teclado, foco, contraste, semântica e linguagem em mobile/desktop (AD-26).
- Antes do provisionamento, Salt, Grafana e Alloy devem ser fixados por patch/digest; o mesmo inventário deve ser usado no soak test (gate de stack M2).
- O procedimento excepcional de transferência e a máquina de estados/prazos finais de direitos de titulares ficam bloqueados até o gate jurídico; histórias dependentes devem explicitar essa condição, sem presumir decisão jurídica.
- Antes do lançamento devem existir evidências para os gates jurídico/LGPD, segurança, privacidade, portabilidade, qualidade/capacidade, resposta a incidentes e operação; esses gates não bloqueiam a decomposição ou a implementação segura dos demais incrementos.
- O parecer jurídico consolidado sobre LGPD, cobrança, saída de ocupante, responsabilidade e retenção foi solicitado e está pendente; histórias dependentes devem permanecer marcadas pelo gate e não podem inventar responsáveis, bases legais, prazos ou critérios de corresponsabilidade.
- Como baseline conservador provisório, a saída encerra o Vínculo ativo de Morador mesmo com pendência, preserva o histórico Pessoa–Unidade e a Obrigação por competência, não transfere dívida ao novo ocupante e não mantém acesso amplo; eventual relação ou acesso pós-saída é separado, mínimo, auditado e condicionado ao parecer.
- Cada história deve rastrear FRs/NFRs aplicáveis e incluir cenários positivos, validação, autorização, isolamento, falha e auditoria, evitando épico técnico tardio de “qualidade”.

### Requisitos de UX Design

UX-DR1: A experiência deve comunicar confiança, simplicidade, clareza, transparência e controle, usando linguagem direta e compreensível para uso ocasional e baixa familiaridade tecnológica.

UX-DR2: A navegação deve priorizar os principais trabalhos do dia a dia e manter uma arquitetura de informação clara entre visão geral, finanças/prestação, Pendências, Publicações/comunicação, histórico e configurações autorizadas.

UX-DR3: O dashboard deve apresentar somente resumos e ações disponíveis conforme Papel/capacidade, com estado vazio útil antes de existirem dados e sem depender de funcionalidades futuras para ser utilizável.

UX-DR4: Criar Pendência deve ser um fluxo curto com título, descrição, responsável e demais campos permitidos, mas salvar nunca pode publicar a Pendência a Moradores; comunicação exige Publicação separada.

UX-DR5: A tela de Pendência deve apresentar estado, responsável, prazo, atraso, histórico, comentários, transições válidas e motivos obrigatórios, ocultando ações não autorizadas e negando-as também no servidor.

UX-DR6: Histórico deve permitir filtros por objeto, período, autor e natureza conforme Papel, distinguindo visualmente Comentário, Decisão Operacional, mudança de estado, Versão Publicada e Evento de Auditoria.

UX-DR7: Onboarding deve cobrir landing page, CTA, criação conjunta de Conta/Condomínio, autodeclaração de autoridade, verificação de e-mail, progresso, falha compensada e retomada segura.

UX-DR8: Autenticação e acesso devem cobrir login, logout, recuperação, sessões, Convites e estados de token inválido, expirado, usado ou cancelado, sem enumeração de Contas.

UX-DR9: Gestão de Pessoas, Unidades, Vínculos, Papéis, capacidades e Responsáveis Financeiros deve tornar vigência e alcance compreensíveis, exigir confirmação para ações sensíveis e notificar Pessoas afetadas.

UX-DR10: Visões financeiras devem separar claramente realizado, previsto, saldo, obrigações, inadimplência e Fechamento, usar linguagem não contábil e adaptar campos e detalhamento ao Papel e à Unidade autorizada.

UX-DR11: Publicação deve oferecer pré-visualização fiel por audiência/Papel, campos e Anexos, alertar possível Dado Pessoal e exigir confirmação explícita; rascunho, publicado, substituído e suspenso devem ser inequivocamente distintos.

UX-DR12: Anexos devem exibir privacidade por padrão, estado de upload/quarentena/erro, diferença entre original e compartilhável, audiência, revisão de Dados Pessoais, consumo de Cota e bloqueio restrito a novos uploads.

UX-DR13: Suspensão deve retirar o conteúdo indevido sem apagar a existência da Publicação, mostrar categoria pública, prazo e vencimento sem reproduzir dados sensíveis e nunca sugerir republicação automática.

UX-DR14: Exportação deve permitir selecionar e revisar escopo, acompanhar processamento, apresentar falha parcial/total sem falso sucesso, disponibilizar download temporário e permitir verificar manifesto, contagens e integridade.

UX-DR15: Solicitações de Dados Pessoais e transferências contestadas devem expor estados, responsáveis, evidências e limites de acesso sem prometer resultado jurídico ainda não aprovado.

UX-DR16: Todos os fluxos devem especificar estados vazio, carregando, sucesso, validação, conflito, indisponibilidade, permissão negada e recuperação, com mensagens acionáveis que não revelem dados ou existência de recursos protegidos.

UX-DR17: A interface deve ser responsiva nos viewports móveis e desktop suportados e cumprir WCAG 2.2 AA, incluindo HTML semântico, teclado, ordem e restauração de foco, rótulos, contraste, leitores de tela e mensagens independentes de cor.

UX-DR18: Componentes reutilizáveis devem padronizar, no mínimo, navegação, formulários e validação, confirmação de ação sensível, status/badge, mensagem/alerta, estado vazio, carregamento, erro, foco, tabelas/listas responsivas, histórico/timeline, preview de audiência e upload/quarentena.

UX-DR19: A experiência deve preservar a distinção entre conteúdo interno e publicado e entre ações humanas e evidência automática; nenhuma ação implícita pode promover Pendência, Comentário ou Decisão a Publicação.

UX-DR20: Critérios de usabilidade devem ser verificáveis nos fluxos críticos, incluindo conclusão sem suporte, compreensão de estado/alcance e localização da informação, complementados por revisão humana de acessibilidade.

UX-DR21: A interface deve representar separadamente natureza do conteúdo, audiência efetiva e estado editorial. “Público” significa visível à audiência coletiva autorizada do Condomínio, nunca necessariamente público na internet.

UX-DR22: Conteúdo coletivo obrigatório não pode excluir silenciosamente Morador ativo; conteúdo privado obrigatório não pode receber audiência coletiva; Comunicado geral deve alcançar toda a audiência geral definida; Comunicado de cobrança deve ficar restrito aos Responsáveis Financeiros vigentes das Unidades abrangidas.

UX-DR23: Encerrar Vínculo deve retirar acesso de Morador a conteúdo posterior sem apagar histórico; eventual experiência pós-saída deve ser separada, limitada às próprias cobranças e documentos, sem revelar dados coletivos ou do novo ocupante e condicionada ao parecer jurídico consolidado.

### Mapa de cobertura de FRs

FR-1: Épico 1 — compreender a proposta pública.
FR-2: Épico 1 — iniciar pelo CTA gratuito.
FR-3: Épico 1 — criar Conta e Condomínio conjuntamente.
FR-4: Épico 1 — autenticar, encerrar sessão e recuperar acesso.
FR-5: Épico 1 — isolar acesso por Condomínio, Vínculo e Papel.
FR-6: Épico 1 — cadastrar Pessoas, Unidades e Vínculos.
FR-7: Épico 1 — gerir Convites e ativação de Contas.
FR-8: Épico 1 — gerir temporalmente Papéis e capacidades.
FR-9: Épico 1 — realizar troca cooperativa de gestão.
FR-10: Épico 2 — gerir Lançamentos financeiros.
FR-11: Épico 2 — registrar serviços e parcelamentos.
FR-12: Épico 2 — consultar caixa e previsões.
FR-13: Épico 2 — conferir e fechar períodos.
FR-14: Épico 3 — manter Anexos privados por padrão.
FR-15: Épico 4 — ativar e preservar transparência coletiva.
FR-16: Épico 4 — oferecer visão financeira ao Morador.
FR-17: Épico 4 — proteger informações trabalhistas.
FR-18: Épico 4 — apresentar inadimplência agregada.
FR-19: Épico 4 — restringir inadimplência detalhada.
FR-20: Épico 4 — oferecer visão fiscal ao Conselheiro.
FR-21: Épico 5 — gerir o ciclo de Pendências.
FR-22: Épico 5 — preservar histórico compreensível.
FR-23: Épico 5 — separar Comentários, Decisões e Auditoria.
FR-24: Épico 7 — gerar Exportação Institucional autorizada.
FR-25: Épico 7 — gerar e substituir Exportação Financeira.
FR-26: Épico 7 — proteger e verificar Exportações.
FR-27: Épico 4 — versionar conteúdo publicado.
FR-28: Épico 4 — suspender Publicação específica.
FR-29: Épico 4 — tratar suspensão dentro de SLA auditável.
FR-30: Épico 6 — atender solicitações sobre Dados Pessoais.
FR-31: Épico 6 — designar Contatos de Continuidade.
FR-32: Épico 6 — registrar e tratar transferência contestada.
FR-33: Épico 6 — conter Conta administrativa comprometida.
FR-34: Épico 4 — conferir audiência e autorizar Publicação.
FR-35: Épico 4 — separar original privado e versão compartilhável vinculada à audiência e à Versão Publicada.
FR-36: Épico 4 — corrigir e comunicar nova versão publicada.
FR-37: Épico 3 — controlar Cota de Armazenamento de Anexos.
FR-38: Épico 2 — gerir Contas Financeiras.
FR-39: Épico 2 — gerir Obrigações por Unidade.
FR-40: Épico 2 — apresentar previsões financeiras.
FR-41: Épico 1 — delegar capacidades granulares a Auxiliares.
FR-42: Épico 1 — atribuir Responsável Financeiro por Pessoa–Unidade.
FR-43: Épico 5 — manter Comentários versionados.
FR-44: Épico 5 — confirmar Decisões Operacionais.
FR-45: Épico 5 — produzir e consultar Eventos de Auditoria.

## Lista de épicos

### Épico 1: Começar a gestão e formar uma equipe autorizada

O responsável cria e acessa o Condomínio, convida Pessoas e administra Vínculos, Papéis, capacidades e Responsáveis Financeiros. Auxiliares recebem responsabilidades delimitadas e Pessoas afetadas são notificadas.

**FRs cobertos:** FR-1–FR-9, FR-41, FR-42.

### Épico 2: Organização e controle financeiro

A gestão mantém Contas Financeiras, Lançamentos, serviços, parcelamentos, Obrigações, Movimentos, previsões e Fechamentos íntegros e compreensíveis.

**FRs cobertos:** FR-10–FR-13, FR-38–FR-40.

### Épico 3: Guardar documentos com privacidade e controle de espaço

A gestão armazena originais e derivados ainda privados, controla quarentena e Cota e preserva integridade histórica sem conceder audiência ou publicar implicitamente.

**FRs cobertos:** FR-14, FR-37.

### Épico 4: Prestar contas e fiscalizar com transparência segura

Moradores compreendem prestações e sua situação autorizada; Conselheiros fiscalizam sem acessar dados individuais indevidos; a gestão cria versões efetivamente compartilháveis, define audiências e publica, corrige ou suspende conteúdo sem apagar o histórico.

**FRs cobertos:** FR-15–FR-20, FR-27–FR-29, FR-34–FR-36.

### Épico 5: Coordenar o trabalho e preservar decisões confiáveis

A gestão acompanha Pendências, responsabilidades, Comentários e Decisões Operacionais; usuários autorizados consultam histórico e auditoria sem confundir conteúdo interno, publicação e evidência automática.

**FRs cobertos:** FR-21–FR-23, FR-43–FR-45.

### Épico 6: Proteger dados e preservar a autoridade em situações excepcionais

Pessoas acompanham solicitações sobre seus dados; o Condomínio enfrenta comprometimento, indisponibilidade ou disputa sem exposição indevida ou transferência automática de autoridade. Execuções dependentes de parecer permanecem bloqueadas pelos gates aplicáveis.

**FRs cobertos:** FR-30–FR-33.

### Épico 7: Garantir portabilidade e continuidade institucional

Pessoas autorizadas geram Exportações Institucionais e Financeiras completas, íntegras, protegidas, verificáveis e utilizáveis por terceiros.

**FRs cobertos:** FR-24–FR-26.

### Dependências e invariantes de decomposição

- O Épico 1 habilita os demais; os Épicos 2 e 3 habilitam a prestação completa do Épico 4; o Épico 7 sucede os demais para exportar o conjunto institucional completo.
- Auditoria é produzida desde o primeiro evento relevante, embora sua experiência integrada tenha cobertura primária no Épico 5.
- Privacidade e segurança são aplicadas desde o primeiro dado; o Épico 6 entrega os fluxos humanos e excepcionais completos.
- Projeções exportáveis versionadas são construídas com cada domínio; o Épico 7 compõe e valida o pacote ponta a ponta.
- Bootstrap greenfield é incremental e ligado ao primeiro fluxo demonstrável, sem épico técnico separado.
- Requisitos UX reconciliados neste documento prevalecem sobre fluxos obsoletos de `ux.md`, conforme a precedência documental do projeto.
- Natureza do conteúdo, audiência efetiva e estado editorial são dimensões separadas; não existe um booleano genérico de público/privado capaz de substituir essas regras.
- “Público” significa coletivo dentro da audiência autorizada do Condomínio, não exposição irrestrita na internet.
- Publicação coletiva obrigatória alcança todos os Moradores ativos sem exclusão individual silenciosa; conteúdo privado obrigatório nunca recebe audiência coletiva.
- Comunicado geral é necessariamente coletivo para a audiência geral definida; Comunicado privado usa audiência restrita autorizada; Comunicado de cobrança alcança somente Responsáveis Financeiros vigentes das Unidades abrangidas.
- Criar derivado saneado no Épico 3 não concede acesso, cria URL pública, vincula audiência ou publica. A versão compartilhável de FR-35 somente existe no Épico 4, associada explicitamente à audiência e à Versão Publicada.
- Nenhuma história depende de história futura, satisfaz autorização somente na interface, aceita fluxo sensível apenas pelo happy path ou converte requisito deferido em decisão silenciosa.
- Cada história deve ser uma fatia vertical demonstrável, possuir rastreabilidade e cenários negativos específicos e caber no contexto de execução de um agente.
- Nenhum épico termina sem resultado demonstrável ao stakeholder principal.
- O gate de prontidão deve ser repetido antes de liberar a implementação orientada pelo backlog.

## Épico 1: Começar a gestão e formar uma equipe autorizada

O responsável cria e acessa o Condomínio, convida Pessoas e administra Vínculos, Papéis, capacidades e Responsáveis Financeiros. Auxiliares recebem responsabilidades delimitadas e Pessoas afetadas são notificadas.

### Story 1.1: Conhecer o Burgoweb e iniciar gratuitamente

Como visitante,
Quero compreender a proposta do Burgoweb e iniciar gratuitamente,
Para que eu possa decidir com segurança se desejo criar minha Conta e meu Condomínio.

**Critérios de Aceitação:**

**Dado** que uma Pessoa acessa o endereço público sem autenticação
**Quando** a landing page é carregada
**Então** ela apresenta, em linguagem simples, que o Burgoweb é gratuito e destinado à organização e transparência de condomínios
**E** não promete contabilidade, cobrança bancária, certificação jurídica ou funcionalidades fora do MVP.

**Dado** que o visitante está na landing page
**Quando** identifica a ação principal
**Então** encontra o CTA **Utilize gratuitamente** com nome e finalidade compreensíveis
**E** sua ativação inicia a primeira etapa do onboarding sem exigir contato comercial.

**Dado** que o visitante ativa o CTA
**Quando** a navegação é concluída
**Então** o sistema apresenta o início do fluxo de criação de Conta e Condomínio
**E** nenhuma Conta, autoridade ou entidade institucional é criada apenas pela navegação.

**Dado** que a landing page é acessada em viewport móvel ou desktop suportado
**Quando** o visitante navega por teclado ou tecnologia assistiva
**Então** conteúdo, navegação e CTA usam HTML semântico, ordem lógica, foco visível, rótulos compreensíveis e contraste conforme WCAG 2.2 AA
**E** nenhuma informação ou ação depende exclusivamente de cor, posição ou interação por ponteiro.

**Dado** que recursos essenciais estão carregando ou falham
**Quando** o estado é apresentado
**Então** a interface distingue carregamento, indisponibilidade e recuperação com mensagem acionável
**E** não exibe stack trace, segredo, configuração interna ou falso estado de sucesso.

**Dado** o desenvolvimento greenfield dentro do repositório existente
**Quando** esta história é implementada
**Então** existe um monorepo executável com as fronteiras iniciais de `apps/web`, `apps/api`, `apps/worker` e pacotes compartilhados previstos pela arquitetura
**E** `apps/web` não importa código interno, tipos de persistência ou classes de domínio do backend.

**Dado** a stack fixada pela arquitetura
**Quando** dependências e scripts fundamentais são instalados
**Então** as versões resolvidas ficam registradas no lockfile e o projeto executa build e testes fundamentais de forma reproduzível
**E** o smoke test cobre build, renderização, hydration e navegação pública com o par TanStack Start/Router efetivamente resolvido.

**Dado** que o protótipo histórico permanece no repositório
**Quando** a nova base greenfield é introduzida
**Então** nenhuma rota, persistência JSON ou comportamento anterior é tratado automaticamente como contrato compatível
**E** qualquer reutilização ou substituição fica explícita, sem remover o histórico ou os artefatos BMAD.

Rastreabilidade: FR-1, FR-2, UX-DR1, UX-DR7, UX-DR16, UX-DR17, AD-1, AD-2, AD-24 e AD-26.

### Story 1.2: Criar Conta e Condomínio de forma segura

Como responsável pela gestão,
Quero criar minha Conta e meu Condomínio em um único fluxo orientado,
Para que eu possa estabelecer a base institucional sem depender de atendimento comercial.

**Critérios de Aceitação:**

**Dado** que o visitante iniciou o onboarding
**Quando** informa os dados mínimos válidos da Pessoa, da Conta e do Condomínio, define sua credencial e aceita a declaração de autoridade inicial
**Então** o sistema registra uma solicitação de provisionamento em estado pendente
**E** apresenta claramente que o controle do e-mail ainda deverá ser verificado antes da ativação.

**Dado** que a declaração de autoridade inicial é apresentada
**Quando** o responsável confirma sua autodeclaração
**Então** o sistema registra o texto e a versão da declaração, a Pessoa declarante, a Conta, o Condomínio pretendido e o instante
**E** informa que o Burgoweb não certifica identidade civil, mandato, eleição ou legitimidade jurídica do Síndico.

**Dado** que o visitante não confirmou a declaração obrigatória
**Quando** tenta concluir a criação
**Então** o provisionamento não é iniciado
**E** a interface informa, de maneira acessível, o que falta sem marcar automaticamente a declaração.

**Dado** que os dados de criação são aceitos
**Quando** o workflow de provisionamento é executado
**Então** Conta, registro do Condomínio, schema tenant, versão de migration e autoridade inicial pendente são criados de forma coordenada e rastreável
**E** o Condomínio somente pode avançar para ativação quando seu schema estiver na versão compatível com a aplicação.

**Dado** que ocorre falha depois da criação parcial de recursos
**Quando** o workflow não consegue concluir o provisionamento
**Então** recursos incompletos são compensados ou colocados em quarentena com estado explícito e diagnóstico correlacionado
**E** nenhum Condomínio utilizável permanece sem responsável inicial ou schema compatível.

**Dado** que a mesma solicitação é reenviada por repetição, falha de rede ou duplo acionamento
**Quando** possui a mesma chave idempotente e o mesmo conteúdo
**Então** o sistema retorna o resultado já conhecido sem duplicar Conta, Condomínio, schema, declaração ou autoridade
**E** reutilizar a chave com conteúdo diferente é rejeitado como conflito.

**Dado** que o e-mail informado já está associado a uma Conta
**Quando** uma criação não autenticada é solicitada
**Então** a resposta pública não confirma nem nega a existência da Conta
**E** orienta de forma segura os caminhos de autenticação, recuperação ou associação após comprovação do canal.

**Dado** que outro Condomínio possui o mesmo nome de exibição
**Quando** a nova solicitação é válida
**Então** o nome não é tratado como identificador global nem como prova de identidade institucional
**E** o sistema utiliza identificador público opaco e tenant interno independente.

**Dado** que uma senha é definida durante o fluxo
**Quando** a credencial é persistida
**Então** ela utiliza Argon2id com salt individual e pepper versionado fornecido em runtime
**E** senha, hash, pepper, token ou segredo nunca aparecem em resposta, log, Evento de Auditoria ou artefato versionado.

**Dado** que o provisionamento ainda aguarda verificação do e-mail
**Quando** alguém tenta acessar funcionalidade interna ou construir contexto do tenant
**Então** o acesso é negado no servidor
**E** nenhuma manipulação de URL, identificador ou payload ativa o Condomínio ou concede autoridade.

**Dado** que o fluxo apresenta validação, processamento, falha ou estado pendente
**Quando** é utilizado em viewport móvel, desktop, teclado ou tecnologia assistiva
**Então** o estado atual, os próximos passos e as ações de recuperação são compreensíveis e preservam foco
**E** as mensagens não revelam dados de outras Contas ou Condomínios.

Rastreabilidade: FR-3, FR-5, NFR-1, NFR-6–NFR-9, NFR-11, NFR-12, NFR-14, UX-DR7, UX-DR16, UX-DR17, AD-4, AD-5, AD-7, AD-10, AD-11, AD-23 e AD-25.

### Story 1.3: Verificar o e-mail e ativar a gestão inicial

Como responsável pela gestão,
Quero verificar meu e-mail e ativar minha Conta e meu Condomínio,
Para que somente quem controla o canal informado possa concluir o onboarding.

**Critérios de Aceitação:**

**Dado** que existe um provisionamento pendente válido
**Quando** o sistema solicita a verificação do e-mail
**Então** gera um token aleatório, de finalidade exclusiva, uso único e validade finita
**E** persiste somente seu hash, associado à Conta, ao provisionamento e ao instante de expiração.

**Dado** que o token de verificação foi criado
**Quando** a notificação é preparada
**Então** um item de outbox é registrado transacionalmente e processado pelo worker por meio do `EmailPort`
**E** o sistema não declara envio bem-sucedido antes da confirmação aceita pelo provedor.

**Dado** que o e-mail de verificação é enviado
**Quando** a mensagem é produzida
**Então** ela identifica o Burgoweb, explica a finalidade, apresenta a expiração e oferece um único caminho de ativação
**E** não inclui senha, segredo, informação administrativa desnecessária nem tracking de abertura ou clique.

**Dado** que o provedor primário de e-mail falha de forma transitória
**Quando** o worker processa a outbox
**Então** aplica tentativas limitadas, backoff, lease e idempotência sem enviar mensagens duplicadas silenciosamente
**E** utiliza a contingência configurada somente conforme a política operacional, registrando resultado e correlação sem expor o token.

**Dado** que o responsável acessa um token válido e não utilizado
**Quando** confirma a verificação
**Então** o servidor revalida Conta, provisionamento, estado do Condomínio e compatibilidade da migration tenant
**E** marca o e-mail como verificado, ativa o Condomínio e torna vigente a autoridade inicial de Síndico em uma única transação observável.

**Dado** que a ativação foi concluída
**Quando** o responsável recebe a confirmação
**Então** a interface informa que o controle do canal foi comprovado e orienta o acesso autenticado
**E** deixa explícito que a verificação do e-mail não certifica identidade civil, eleição ou mandato jurídico.

**Dado** que o token é inválido, expirado, já utilizado, cancelado ou pertence a outra finalidade
**Quando** alguém tenta utilizá-lo
**Então** nenhuma Conta, autoridade ou tenant muda de estado
**E** a resposta não revela existência da Conta, estado interno, hash ou motivo explorável por terceiros.

**Dado** que o responsável solicita reenvio dentro dos limites permitidos
**Quando** a solicitação é aceita
**Então** um novo token de verificação é emitido e os tokens anteriores aplicáveis deixam de poder concluir o fluxo
**E** limites consideram Conta, tenant pretendido, operação e sinais de origem, sem usar IP como única autoridade.

**Dado** que múltiplas confirmações concorrentes usam o mesmo token
**Quando** a primeira ativação é concluída
**Então** as demais não duplicam Vínculo, Papel, Evento de Auditoria ou ativação do tenant
**E** recebem resultado idempotente ou indicação segura de token indisponível.

**Dado** que a ativação falha depois de iniciar a transação
**Quando** o estado não pode ser concluído integralmente
**Então** e-mail, Condomínio e autoridade permanecem em estado anterior coerente ou são compensados
**E** nenhuma autoridade parcial permite construir `TenantContext` autorizado.

**Dado** que verificação, reenvio ou erro são apresentados em dispositivo móvel, desktop ou tecnologia assistiva
**Quando** o usuário interage com o fluxo
**Então** mensagens, foco, temporização e ações de recuperação são acessíveis e compreensíveis
**E** a interface não depende apenas de cor para diferenciar pendente, sucesso, expirado ou falha.

Rastreabilidade: FR-3, FR-4, FR-5, NFR-6–NFR-10A, NFR-11, NFR-12, NFR-14, UX-DR7, UX-DR8, UX-DR16, UX-DR17, AD-4, AD-7, AD-10, AD-11, AD-17, AD-22, AD-23 e AD-25.

### Story 1.4: Entrar, sair e selecionar o Condomínio

Como Pessoa com Conta ativa,
Quero autenticar-me, selecionar um Condomínio autorizado e encerrar minha sessão,
Para que eu possa acessar a gestão correspondente sem expor outros Condomínios ou permanecer conectado indevidamente.

**Critérios de Aceitação:**

**Dado** que a Pessoa possui Conta ativa, e-mail verificado e credencial válida
**Quando** informa corretamente e-mail e senha
**Então** o servidor autentica a credencial e cria uma sessão opaca revogável
**E** o browser recebe somente token aleatório em cookie `__Host-`, `Secure`, `HttpOnly`, `SameSite=Lax` e `Path=/`.

**Dado** que uma nova sessão é criada
**Quando** o servidor persiste seu estado
**Então** armazena somente o hash do token, Conta, instantes de criação e expiração e metadados mínimos de segurança
**E** senha, token bruto, cookie, pepper ou segredo não aparecem em resposta, log ou Evento de Auditoria.

**Dado** que e-mail, senha ou estado da Conta não permitem autenticação
**Quando** alguém tenta entrar
**Então** recebe resposta genérica que não confirma existência da Conta, verificação do e-mail ou motivo interno da recusa
**E** limites de abuso consideram Conta candidata, operação e sinais de origem, sem depender somente do IP.

**Dado** que a Pessoa autenticada possui um ou mais Vínculos ativos
**Quando** acessa a seleção de Condomínio
**Então** visualiza somente Condomínios cobertos por seus próprios Vínculos vigentes
**E** a resposta não inclui schema interno, dados institucionais ou Condomínios não autorizados.

**Dado** que a Pessoa seleciona um Condomínio permitido
**Quando** uma operação tenant-scoped é iniciada
**Então** a API resolve o identificador público no registro global, revalida Conta e Vínculo e constrói `TenantContext` confiável
**E** casos de uso e persistência não aceitam tenant ou schema cru informado pelo cliente como autorização.

**Dado** que a Pessoa altera URL, identificador, header ou payload para apontar a outro Condomínio
**Quando** não possui Vínculo ativo correspondente
**Então** o servidor nega a operação sem consultar nem revelar dados do tenant alvo
**E** a tentativa produz evidência de segurança minimizada e correlacionada conforme a política de auditoria.

**Dado** que o Vínculo selecionado foi suspenso ou encerrado depois do login
**Quando** a Pessoa realiza nova operação protegida
**Então** a autorização é revalidada e o acesso àquele Condomínio é bloqueado imediatamente
**E** Vínculos válidos com outros Condomínios permanecem utilizáveis sem ampliar permissões.

**Dado** que a Pessoa entra em um Condomínio sem dados operacionais cadastrados
**Quando** o dashboard autenticado é exibido
**Então** apresenta estado vazio útil, identidade do Condomínio selecionado e apenas próximas ações autorizadas
**E** não depende de Pendências, finanças ou Publicações futuras para funcionar.

**Dado** que a Pessoa tenta executar uma mutação autenticada
**Quando** a requisição não possui proteção CSRF válida ou falha na validação de Origin, Referer ou Fetch Metadata
**Então** a mutação é rejeitada
**E** requisições GET não alteram estado e o baseline não habilita CORS.

**Dado** que a Pessoa seleciona **Sair**
**Quando** o logout é confirmado
**Então** a sessão atual é revogada no servidor e o cookie é invalidado no browser
**E** reutilizar o token anterior não autoriza nova operação.

**Dado** que login, seleção, dashboard ou logout são usados em dispositivo móvel, desktop, teclado ou tecnologia assistiva
**Quando** os estados de carregamento, vazio, erro, acesso negado ou sucesso são apresentados
**Então** foco, rótulos, mensagens e navegação cumprem WCAG 2.2 AA e são compreensíveis
**E** nenhuma mensagem revela a existência de recurso protegido ou depende somente de cor.

Rastreabilidade: FR-4, FR-5, NFR-1, NFR-6–NFR-12, UX-DR3, UX-DR8, UX-DR16–UX-DR18, AD-3–AD-5, AD-8, AD-9, AD-14, AD-23, AD-24 e AD-26.

### Story 1.5: Recuperar acesso e controlar sessões

Como Pessoa com Conta,
Quero recuperar meu acesso e controlar minhas sessões ativas,
Para que eu possa retomar o uso com segurança após perder ou suspeitar do comprometimento da credencial.

**Critérios de Aceitação:**

**Dado** que alguém informa um e-mail no fluxo de recuperação
**Quando** solicita instruções de acesso
**Então** o sistema apresenta a mesma resposta pública, exista ou não Conta elegível
**E** não revela existência, estado, Papéis, Vínculos ou Condomínios relacionados.

**Dado** que existe Conta elegível para recuperação
**Quando** a solicitação é aceita dentro dos limites de abuso
**Então** o sistema gera token aleatório, de finalidade exclusiva, uso único e validade finita, persistindo somente seu hash
**E** registra a notificação em outbox para processamento idempotente pelo worker.

**Dado** que o e-mail de recuperação é produzido
**Quando** a mensagem é enviada
**Então** explica finalidade, expiração e efeito da recuperação sem incluir senha, dados institucionais ou detalhes de segurança
**E** não utiliza tracking de abertura ou clique.

**Dado** que uma Pessoa apresenta token válido de recuperação
**Quando** define uma nova senha conforme a política vigente
**Então** a credencial é persistida com Argon2id, salt individual e pepper versionado
**E** o token consumido e os demais tokens de recuperação anteriores deixam de poder alterar a Conta.

**Dado** que a recuperação é concluída
**Quando** o novo acesso é estabelecido
**Então** o sistema rotaciona a sessão usada no fluxo e oferece opção explícita para encerrar todas as demais sessões da Conta
**E** nenhuma recuperação transfere, cria ou amplia Papel, Vínculo ou capacidade em qualquer Condomínio.

**Dado** que a Pessoa escolhe encerrar todas as demais sessões
**Quando** confirma a ação
**Então** todas as sessões anteriores alcançadas são revogadas, exceto a nova sessão quando isso for informado claramente
**E** qualquer reutilização dos tokens revogados é negada.

**Dado** que a Pessoa autenticada consulta suas sessões
**Quando** abre o controle de sessões
**Então** visualiza somente metadados mínimos úteis, como criação, última atividade aproximada e estado
**E** pode revogar uma sessão individual sem ver token, cookie, endereço completo ou dado excessivo.

**Dado** que um token é inválido, expirado, utilizado, revogado ou pertence a outra finalidade
**Quando** alguém tenta recuperar a Conta
**Então** nenhuma credencial, sessão ou autoridade é alterada
**E** a resposta oferece caminho seguro para nova solicitação sem revelar o motivo interno explorável.

**Dado** que duas tentativas concorrentes usam o mesmo token
**Quando** a primeira conclui a recuperação
**Então** somente uma nova credencial é confirmada e as demais tentativas falham de forma segura
**E** não ocorre restauração de sessão ou credencial anterior por condição de corrida.

**Dado** que solicitações repetidas ou automatizadas excedem os limites
**Quando** o sistema aplica proteção contra abuso
**Então** considera Conta candidata, operação e sinais de origem, sem depender apenas do IP
**E** mantém resposta sem enumeração, quotas, alertas e auditoria minimizada.

**Dado** que recuperação, redefinição ou gestão de sessões são usadas em mobile, desktop, teclado ou tecnologia assistiva
**Quando** estados de processamento, sucesso, expiração, conflito ou erro são apresentados
**Então** foco, rótulos, instruções e confirmações cumprem WCAG 2.2 AA
**E** ações sensíveis exigem confirmação compreensível e não dependem apenas de cor.

Rastreabilidade: FR-4, FR-5, FR-33 parcialmente quanto à revogação, NFR-6–NFR-10A, NFR-11, NFR-12, NFR-14, UX-DR8, UX-DR16–UX-DR18, AD-9, AD-10, AD-11, AD-17, AD-22, AD-23 e AD-25.

### Story 1.6: Cadastrar Pessoas, Unidades e Vínculos temporais

Como Síndico ou Pessoa com capacidade específica,
Quero cadastrar Pessoas, Unidades e seus Vínculos temporais,
Para que o Condomínio represente corretamente quem se relaciona com cada Unidade sem confundir identidade, credencial e autorização.

**Critérios de Aceitação:**

**Dado** que o ator possui capacidade vigente para gerir Pessoas, Unidades e Vínculos
**Quando** cadastra uma Pessoa com os dados mínimos necessários
**Então** o sistema cria um registro institucional distinto de Conta e credencial
**E** não cria acesso, senha, sessão, Papel ou Convite automaticamente.

**Dado** que o ator cadastra uma Unidade
**Quando** informa sua identificação dentro do Condomínio
**Então** o sistema cria a Unidade somente no tenant autorizado, com identificador público opaco
**E** impede duplicidade da identificação institucional dentro do mesmo Condomínio sem exigir unicidade global.

**Dado** que uma Pessoa se relaciona com uma Unidade
**Quando** o ator cria um Vínculo
**Então** registra Pessoa, Unidade, natureza declarada da relação, início, estado e demais dados mínimos permitidos
**E** não converte a natureza declarada em prova de propriedade, posse, responsabilidade jurídica ou obrigação financeira.

**Dado** que uma Pessoa possui relações válidas com múltiplas Unidades
**Quando** novos Vínculos são cadastrados
**Então** o sistema preserva cada relação e período separadamente
**E** não duplica silenciosamente a identidade institucional da Pessoa.

**Dado** que uma Pessoa já existe no mesmo Condomínio com e-mail ou dados coincidentes
**Quando** o ator tenta criar outro registro
**Então** o sistema sinaliza possível duplicidade e oferece associação ao registro autorizado existente
**E** não expõe Pessoas de outro Condomínio nem realiza fusão automática.

**Dado** que a mesma Pessoa possui uma Conta existente
**Quando** é cadastrada ou associada institucionalmente
**Então** Pessoa e Conta permanecem registros distintos ligados somente pelo fluxo autorizado aplicável
**E** a associação não concede Papel, Vínculo ativo ou acesso sem Convite e autorização correspondentes.

**Dado** que o ator altera dados ou período de um Vínculo
**Quando** confirma a mudança
**Então** o servidor revalida capacidade, tenant, vigência e versão dentro da transação
**E** preserva autor, instante, valores anteriores, motivo quando exigido e projeção exportável versionada.

**Dado** que uma Pessoa deixa de se relacionar ativamente com a Unidade
**Quando** o Vínculo é encerrado com data efetiva
**Então** novos acessos baseados nesse Vínculo são bloqueados e sessões alcançadas deixam de autorizar aquele Condomínio
**E** Pessoa, períodos anteriores, autoria e registros institucionais não são apagados.

**Dado** que o Vínculo encerrado possui possível pendência financeira
**Quando** a saída é registrada antes do parecer jurídico consolidado
**Então** o Vínculo de Morador ainda é encerrado e a pendência não é transferida ao novo ocupante
**E** o sistema não cria automaticamente corresponsabilidade, acesso pós-saída ou decisão jurídica definitiva.

**Dado** que dois atores alteram simultaneamente a mesma Pessoa, Unidade ou Vínculo
**Quando** a versão persistida já mudou
**Então** a segunda gravação recebe conflito `409` sem sobrescrever silenciosamente a primeira
**E** a interface apresenta os dados atuais e orienta revisão antes de nova tentativa.

**Dado** que o ator tenta usar identificador, URL ou payload de outro Condomínio
**Quando** cria, consulta, altera ou encerra um registro
**Então** o servidor nega a operação antes de acessar o tenant alvo
**E** não revela existência, dados pessoais ou estrutura interna do outro Condomínio.

**Dado** que formulários, listas ou histórico são utilizados em mobile, desktop, teclado ou tecnologia assistiva
**Quando** estados vazio, carregando, validação, conflito, erro ou sucesso são apresentados
**Então** rótulos, foco, mensagens e ações cumprem WCAG 2.2 AA
**E** a linguagem diferencia claramente Pessoa, Conta, Unidade, Vínculo e Papel.

Rastreabilidade: FR-5, FR-6, FR-22 parcialmente, NFR-1, NFR-6–NFR-9, NFR-11–NFR-14, UX-DR9, UX-DR16–UX-DR18, UX-DR23, AD-4–AD-8, AD-11, AD-14–AD-16, AD-23–AD-26 e gate jurídico consolidado pendente.

### Story 1.7: Convidar Pessoas e ativar Contas

Como Síndico ou Auxiliar com capacidade delegada,
Quero enviar e acompanhar Convites para Pessoas cadastradas,
Para que elas possam associar ou criar sua Conta e acessar somente o Papel autorizado.

**Critérios de Aceitação:**

**Dado** que o ator possui capacidade vigente para gerir Convites
**Quando** seleciona uma Pessoa, e-mail, Condomínio, Vínculo e Papel predefinido permitido
**Então** o sistema apresenta uma prévia do destinatário, alcance, Papel e validade antes da confirmação
**E** não permite convidar diretamente um novo Síndico nem incluir capacidades não autorizadas.

**Dado** que o ator confirma um Convite válido
**Quando** o servidor revalida tenant, Vínculo, capacidade e versão dos registros
**Então** cria um Convite com destinatário, Condomínio, Papel, validade e estado explícitos
**E** gera token aleatório de finalidade exclusiva, uso único e persistido somente como hash.

**Dado** que o Convite é criado
**Quando** a notificação é preparada
**Então** o estado e o item de outbox são persistidos na mesma transação
**E** o worker envia a mensagem por `EmailPort` sem senha temporária, token em log ou falsa confirmação de envio.

**Dado** que a Pessoa ainda não possui Conta
**Quando** acessa um Convite válido pelo e-mail destinatário
**Então** pode definir sua credencial, comprovar controle do canal e associar a nova Conta à Pessoa institucional existente
**E** o fluxo não cria uma segunda Pessoa nem concede acesso antes da conclusão transacional.

**Dado** que a Pessoa já possui Conta associável ao mesmo e-mail verificado
**Quando** autentica-se e aceita o Convite válido
**Então** o sistema associa a Conta existente à Pessoa e ativa o Papel e Vínculo previstos
**E** não cria identidade, credencial ou Conta duplicada.

**Dado** que uma Conta autenticada não controla o e-mail destinatário ou pertence a outra Pessoa incompatível
**Quando** tenta aceitar o Convite
**Então** o sistema bloqueia a associação automática e apresenta caminho seguro de correção
**E** não revela dados institucionais além do mínimo necessário para resolver o convite.

**Dado** que o Convite foi utilizado, cancelado, expirado ou substituído por reenvio
**Quando** alguém tenta reutilizar seu token
**Então** nenhum Papel, Vínculo ou acesso é criado ou reativado
**E** a resposta informa indisponibilidade sem revelar hash, estado interno excessivo ou dados do Condomínio.

**Dado** que o ator solicita reenvio de Convite pendente
**Quando** a solicitação respeita os limites de abuso
**Então** um novo token e nova entrega são registrados e os tokens anteriores aplicáveis deixam de ser aceitos
**E** o histórico preserva tentativas, resultados e correlação sem armazenar o token bruto.

**Dado** que o e-mail destinatário precisa ser alterado
**Quando** o ator confirma a correção
**Então** o Convite anterior é cancelado e um novo Convite é criado para o novo endereço
**E** nenhum token anterior pode ativar a associação corrigida.

**Dado** que o ator consulta os Convites do Condomínio
**Quando** abre a lista ou os detalhes
**Então** visualiza destinatário permitido, Papel, validade, estado, entrega e ações disponíveis conforme capacidade
**E** pode enviar, reenviar, cancelar e acompanhar sem acessar Convites de outro tenant.

**Dado** que a capacidade do emissor ou o Vínculo/Papel pretendido foi revogado depois da emissão
**Quando** o Convite é aceito
**Então** o servidor revalida todas as autorizações dentro da transação e nega a ativação incompatível
**E** não confia apenas na autorização existente no instante da criação.

**Dado** que duas aceitações concorrentes usam o mesmo Convite
**Quando** a primeira conclusão é persistida
**Então** somente uma associação e atribuição de Papel são criadas
**E** as demais tentativas recebem resultado idempotente ou indisponibilidade segura.

**Dado** que Convites são enviados, consultados ou aceitos em mobile, desktop, teclado ou tecnologia assistiva
**Quando** estados pendente, enviado, falha, expirado, cancelado ou aceito são apresentados
**Então** foco, rótulos, validade, mensagens e ações cumprem WCAG 2.2 AA
**E** nenhum estado depende somente de cor.

Rastreabilidade: FR-5, FR-7, FR-8 parcialmente, NFR-1, NFR-6–NFR-12, NFR-14, UX-DR8, UX-DR9, UX-DR16–UX-DR18, AD-4, AD-8–AD-11, AD-14, AD-17, AD-22–AD-26.

### Story 1.8: Conceder, suspender e revogar Papéis

Como Síndico,
Quero administrar a vigência dos Papéis subordinados,
Para que cada Pessoa mantenha somente a autoridade institucional necessária ao período correto.

**Critérios de Aceitação:**

**Dado** que o Síndico possui autoridade vigente no Condomínio
**Quando** concede um Papel predefinido subordinado a uma Pessoa com Vínculo compatível
**Então** registra Papel, início, término opcional, estado, concedente e alcance no tenant autorizado
**E** a atribuição não cria capacidades além das previstas para aquele Papel e das delegações explícitas aplicáveis.

**Dado** que uma concessão de Papel está sendo preparada
**Quando** o Síndico revisa a ação
**Então** a interface apresenta Pessoa, Vínculo, Papel, vigência e efeitos de acesso antes da confirmação
**E** distingue Papel institucional, capacidade delegada, Responsável Financeiro e Contato de Continuidade.

**Dado** que a vigência futura de um Papel é configurada
**Quando** o instante inicial ainda não chegou
**Então** o Papel permanece programado e não autoriza operações
**E** sua ativação temporal ocorre de forma idempotente, auditável e baseada no fuso configurado do Condomínio.

**Dado** que a vigência de um Papel termina
**Quando** o prazo final é alcançado
**Então** novas autorizações baseadas nesse Papel são negadas e as sessões alcançadas deixam de autorizar aquele Condomínio
**E** a atribuição, autoria e ações históricas permanecem preservadas.

**Dado** que existe risco urgente associado a um Papel subordinado
**Quando** o Síndico ou Auxiliar com capacidade específica aplica suspensão urgente
**Então** o servidor revalida capacidade e estado dentro da transação, exige motivo e registra autor e instante
**E** bloqueia imediatamente novos acessos e revoga as sessões alcançadas naquele tenant.

**Dado** que um Auxiliar tenta suspender o próprio Papel, revogar permanentemente outro Papel ou afetar o Síndico
**Quando** envia a solicitação
**Então** o servidor nega a operação conforme as regras de autoridade
**E** não permite contornar a proibição por rota, payload, acumulação de Papéis ou chamada concorrente.

**Dado** que um Papel subordinado está suspenso
**Quando** o Síndico decide restaurá-lo
**Então** a restauração exige confirmação explícita e preserva período, motivo, autor e histórico da suspensão
**E** não restaura sessões revogadas; a Pessoa deve autenticar-se novamente quando aplicável.

**Dado** que o Síndico confirma a revogação permanente de Papel subordinado
**Quando** informa o motivo e conclui a ação
**Então** o Papel deixa de autorizar imediatamente e as sessões alcançadas são revogadas
**E** Pessoa, Vínculo, autoria histórica e registros produzidos não são apagados.

**Dado** que o próprio Auxiliar está sujeito a revogação permanente
**Quando** tenta confirmar, cancelar ou ampliar a operação sobre si
**Então** o servidor nega a ação
**E** somente o Síndico vigente pode confirmar a revogação administrativa permanente.

**Dado** que uma Pessoa acumula Papéis ou Vínculos válidos
**Quando** solicita uma operação protegida
**Então** o servidor calcula apenas a união dos acessos explicitamente autorizados dentro de cada Condomínio e Unidade
**E** nenhum Papel suspenso, expirado ou revogado contribui para a autorização.

**Dado** que dois atores alteram simultaneamente o mesmo Papel
**Quando** a versão persistida já foi modificada
**Então** a segunda operação recebe conflito `409` e não sobrescreve a decisão anterior
**E** a interface apresenta o estado atual para nova revisão.

**Dado** que concessão, suspensão, restauração, expiração ou revogação é concluída
**Quando** a transação é persistida
**Então** estado, Evento de Auditoria, projeção exportável e notificação à Pessoa afetada são registrados de forma coerente
**E** a notificação não expõe capacidades, dados pessoais ou motivos restritos além do necessário.

**Dado** que a gestão de Papéis é utilizada em mobile, desktop, teclado ou tecnologia assistiva
**Quando** estados e confirmações são apresentados
**Então** vigência, alcance, risco e resultado são compreensíveis, com foco preservado e WCAG 2.2 AA
**E** estado ativo, programado, suspenso, expirado ou revogado não depende apenas de cor.

Rastreabilidade: FR-5, FR-8, FR-22 parcialmente, FR-41 parcialmente, NFR-1, NFR-6–NFR-9, NFR-11, NFR-12, NFR-14, UX-DR9, UX-DR16–UX-DR18, AD-4, AD-8, AD-9, AD-11, AD-14–AD-17, AD-23–AD-26.

### Story 1.9: Delegar capacidades ao Auxiliar Administrativo

Como Síndico,
Quero delegar capacidades granulares a Auxiliares Administrativos,
Para que eles executem responsabilidades específicas sem receber autoridade ampla ou poder de autoelevação.

**Critérios de Aceitação:**

**Dado** que o Condomínio possui Auxiliar Administrativo com Papel e Vínculo vigentes
**Quando** o Síndico abre a gestão de capacidades
**Então** visualiza um catálogo predefinido agrupado por domínio e ação
**E** cada capacidade descreve claramente o que permite e o que permanece negado.

**Dado** o catálogo de capacidades do MVP
**Quando** é consultado pela interface ou pelo servidor
**Então** distingue ações sobre Pessoas, Unidades, Vínculos, Convites, suspensão urgente, finanças, Fechamentos, Publicações, Anexos, Pendências, Exportações, solicitações de titulares e tratamento de suspensões
**E** rótulos de domínio não são interpretados como acesso irrestrito a todas as ações daquele domínio.

**Dado** que determinada funcionalidade ainda não foi entregue ou habilitada
**Quando** sua capacidade existe no catálogo planejado
**Então** ela não concede rota, tela, dado ou efeito inexistente
**E** a interface não apresenta falsa disponibilidade da funcionalidade.

**Dado** que o Síndico seleciona uma ou mais capacidades delegáveis
**Quando** revisa a concessão
**Então** a interface apresenta Auxiliar, ações, recursos, alcance, início, término opcional e riscos relevantes
**E** exige confirmação explícita antes de persistir a delegação.

**Dado** que a concessão é confirmada
**Quando** o servidor revalida Síndico, Auxiliar, tenant, Papéis, vigência e versões dentro da transação
**Então** registra cada capacidade individualmente com concedente, início, término, estado e alcance
**E** cria Evento de Auditoria, projeção exportável e notificação minimizada ao Auxiliar afetado.

**Dado** que uma capacidade está ausente, expirada, suspensa, revogada ou desconhecida
**Quando** o Auxiliar tenta executar a ação correspondente por interface, API, job ou arquivo
**Então** o servidor nega por padrão
**E** conhecer a rota, manipular payload ou acumular Papéis não amplia a autorização.

**Dado** que um Auxiliar tenta conceder, retirar ou ampliar capacidade própria ou de outro Auxiliar
**Quando** envia a solicitação por qualquer fronteira
**Então** o servidor nega a operação
**E** registra evidência de segurança minimizada sem alterar delegações.

**Dado** que o Síndico tenta delegar poder não delegável
**Quando** seleciona transferência do Síndico, revogação administrativa permanente, designação de Contato de Continuidade ou alteração da política de delegação
**Então** o servidor rejeita a concessão
**E** a interface identifica essas ações como exclusivas do Síndico no MVP.

**Dado** que o Síndico retira ou encerra uma capacidade
**Quando** confirma a ação
**Então** novas operações correspondentes são negadas imediatamente e trabalhos assíncronos revalidam a autorização antes de executar ou entregar resultado
**E** autoria e operações históricas permanecem preservadas.

**Dado** que uma operação privilegiada começou antes da retirada da capacidade
**Quando** tenta persistir ou concluir depois da revogação
**Então** o servidor revalida a capacidade dentro da transação ou antes da entrega e interrompe o efeito não mais autorizado
**E** não depende apenas da autorização verificada no início da navegação.

**Dado** que dois atores alteram simultaneamente as capacidades do mesmo Auxiliar
**Quando** a versão persistida já mudou
**Então** a segunda operação recebe conflito `409` sem sobrescrever a primeira
**E** a interface apresenta o conjunto atual para nova revisão.

**Dado** que o Síndico ou Auxiliar consulta suas autorizações
**Quando** abre a visão de capacidades
**Então** visualiza apenas capacidades pertinentes ao Condomínio selecionado, com alcance, vigência e estado compreensíveis
**E** não acessa delegações de outro tenant nem detalhes pessoais desnecessários.

**Dado** que a gestão de capacidades é utilizada em mobile, desktop, teclado ou tecnologia assistiva
**Quando** catálogo, riscos, confirmação ou resultado são apresentados
**Então** agrupamento, foco, rótulos, estados e mensagens cumprem WCAG 2.2 AA
**E** concessão, ausência, expiração ou revogação não dependem apenas de cor.

Rastreabilidade: FR-5, FR-8, FR-41, NFR-1, NFR-6–NFR-9, NFR-11, NFR-12, NFR-14, UX-DR9, UX-DR16–UX-DR18, AD-4, AD-8, AD-9, AD-11, AD-14, AD-15, AD-17, AD-23–AD-26.

### Story 1.10: Atribuir Responsáveis Financeiros por Unidade

Como Síndico ou Auxiliar com capacidade específica,
Quero atribuir Responsáveis Financeiros às Unidades,
Para que as Pessoas corretas possam acompanhar obrigações privadas sem receber autoridade global no Condomínio.

**Critérios de Aceitação:**

**Dado** que o ator possui a capacidade específica de gerir Responsáveis Financeiros
**Quando** seleciona uma Pessoa e uma Unidade com Vínculo compatível
**Então** o sistema apresenta a atribuição, seu alcance, início, término opcional e efeitos de acesso antes da confirmação
**E** diferencia essa atribuição de Papel global e da capacidade genérica de gerir Vínculos.

**Dado** que o ator possui apenas capacidade para gerir Pessoas, Unidades ou Vínculos
**Quando** tenta atribuir ou remover Responsável Financeiro sem a capacidade específica
**Então** o servidor nega a operação
**E** nenhuma combinação de rota, payload ou Papel subordinado amplia essa autoridade.

**Dado** que uma atribuição válida é confirmada
**Quando** o servidor revalida tenant, ator, Pessoa, Unidade, Vínculo, capacidade e versões
**Então** registra a relação Pessoa–Unidade com vigência e estado explícitos
**E** não eleva o Papel da Pessoa nem concede acesso a outras Unidades.

**Dado** que uma Pessoa é Responsável Financeiro por múltiplas Unidades
**Quando** consulta seu alcance autorizado
**Então** visualiza cada atribuição separadamente com Unidade, vigência e estado
**E** uma atribuição não implica acesso às demais Unidades do Condomínio.

**Dado** que uma Unidade possui múltiplos Responsáveis Financeiros vigentes
**Quando** o sistema resolve sua audiência privada
**Então** inclui somente as Pessoas com atribuições ativas e Vínculos válidos para aquela Unidade
**E** não transforma a pluralidade de destinatários em audiência coletiva do Condomínio.

**Dado** que uma Pessoa possui apenas Papel Morador sem atribuição financeira
**Quando** tenta consultar obrigação individual de uma Unidade
**Então** o servidor nega o acesso
**E** ser Morador, proprietário declarado, ocupante ou destinatário anterior não cria automaticamente responsabilidade financeira no sistema.

**Dado** que o produto ainda não entregou as telas de Obrigações Financeiras
**Quando** a atribuição é criada
**Então** ela permanece válida como autorização explícita para capacidades futuras correspondentes
**E** não apresenta dados, rotas ou funcionalidades financeiras inexistentes como disponíveis.

**Dado** que a atribuição é concedida ou removida
**Quando** a transação é concluída
**Então** a Pessoa afetada recebe notificação com Condomínio, Unidade, natureza da alteração, vigência e canal de contestação
**E** a notificação não presume consentimento, responsabilidade jurídica ou base legal ainda pendente de parecer.

**Dado** que uma atribuição é removida ou expira
**Quando** a Pessoa tenta novo acesso baseado nela
**Então** o servidor nega imediatamente a consulta ou entrega futura de dados financeiros daquela Unidade
**E** preserva histórico da atribuição, autoria e leituras sensíveis auditáveis aplicáveis.

**Dado** que o Vínculo relacionado é encerrado
**Quando** o encerramento entra em vigor
**Então** a atribuição financeira ativa deixa de autorizar novos acessos
**E** eventual relação de cobrança pós-saída não é criada automaticamente e permanece condicionada ao parecer jurídico consolidado.

**Dado** que um novo ocupante ou Responsável Financeiro é cadastrado para a Unidade
**Quando** sua atribuição começa
**Então** ele não herda dívida, comunicação privada nem dados pessoais do ocupante anterior por causa da nova relação
**E** qualquer acesso histórico futuro deverá obedecer à política jurídica e de retenção aprovada.

**Dado** que uma leitura de inadimplência detalhada for implementada e autorizada por esta atribuição
**Quando** ocorrer
**Então** deve gerar Evento de Auditoria minimizado com ator, Unidade, finalidade, resultado e correlação
**E** o evento não copia valores, documentos ou conteúdo pessoal desnecessário.

**Dado** que dois atores alteram simultaneamente a mesma atribuição
**Quando** a versão persistida já mudou
**Então** a segunda operação recebe conflito `409` sem sobrescrever a primeira
**E** a interface apresenta o estado atual para nova revisão.

**Dado** que a gestão de Responsáveis Financeiros é utilizada em mobile, desktop, teclado ou tecnologia assistiva
**Quando** alcance, vigência, confirmação, notificação ou erro são apresentados
**Então** foco, rótulos, linguagem e estados cumprem WCAG 2.2 AA
**E** a interface deixa claro que a atribuição é restrita à Unidade e não depende apenas de cor.

Rastreabilidade: FR-5, FR-19 parcialmente, FR-41, FR-42, NFR-1–NFR-9, NFR-11, NFR-12, NFR-14, UX-DR9, UX-DR16–UX-DR18, UX-DR22, UX-DR23, AD-4, AD-8, AD-11, AD-14–AD-16, AD-23–AD-26 e gate jurídico consolidado pendente.

### Story 1.11: Transferir cooperativamente a gestão

Como Síndico atual,
Quero transferir cooperativamente a gestão para um sucessor,
Para que o Condomínio preserve sua continuidade institucional sem perder dados, histórico ou controle de autoridade.

**Critérios de Aceitação:**

**Dado** que o Síndico atual possui autoridade vigente
**Quando** inicia uma transferência cooperativa
**Então** seleciona uma Pessoa com Conta ativa, e-mail verificado e Vínculo compatível como sucessora
**E** nenhuma transferência é iniciada por Auxiliar, recuperação de Conta ou simples maioria de usuários cadastrados.

**Dado** que o sucessor ainda não possui Vínculo compatível
**Quando** o Síndico tenta iniciar a transferência
**Então** o sistema impede a conclusão e orienta a regularização autorizada do Vínculo
**E** não cria automaticamente Papel, posse, mandato ou legitimidade jurídica.

**Dado** que a transferência válida está sendo preparada
**Quando** o Síndico revisa a operação
**Então** a interface apresenta antecessor, sucessor, poderes transferidos, momento proposto e opções permitidas para o Papel anterior
**E** informa que o Burgoweb registra a cooperação declarada sem certificar eleição, ata ou mandato.

**Dado** que o Síndico confirma o início
**Quando** o servidor revalida tenant, autoridade, Vínculos e versões
**Então** cria processo de transferência cooperativa em estado pendente, com validade e snapshot dos poderes propostos
**E** ainda não altera o Síndico vigente nem concede acesso adicional ao sucessor.

**Dado** que o processo está pendente
**Quando** a notificação é enviada ao sucessor
**Então** utiliza canal verificado, token de finalidade exclusiva, uso único e validade finita
**E** a mensagem não expõe dados institucionais ou poderes além do necessário para revisar a proposta.

**Dado** que o sucessor acessa uma proposta válida
**Quando** autentica-se recentemente e revisa a transferência
**Então** visualiza o Condomínio, a autoridade a receber, os efeitos e o destino proposto do Papel anterior
**E** pode aceitar ou rejeitar explicitamente sem que silêncio ou simples abertura da mensagem produzam efeito.

**Dado** que o sucessor aceita a transferência válida
**Quando** o servidor conclui a operação
**Então** revalida autoridade atual, sucessor, Vínculos, token, vigência e versões dentro da mesma transação
**E** encerra a autoridade anterior e ativa o novo Síndico sem intervalo utilizável sem Síndico nem coexistência silenciosa de dois Síndicos.

**Dado** que o Papel anterior deve assumir estado permitido após a transferência
**Quando** a conclusão é persistida
**Então** o sistema aplica exatamente o destino previamente apresentado e aceito, como Papel subordinado compatível ou encerramento
**E** não preserva capacidades exclusivas do Síndico nem cria delegação implícita.

**Dado** que a transferência altera privilégios das Contas envolvidas
**Quando** é concluída
**Então** sessões alcançadas são revogadas ou rotacionadas e toda nova operação revalida os Papéis atuais
**E** tokens ou sessões anteriores não mantêm poderes incompatíveis com o novo estado.

**Dado** que a proposta expira, é rejeitada ou cancelada pelo Síndico vigente
**Quando** alguém tenta utilizá-la
**Então** nenhuma autoridade é transferida e o token fica indisponível
**E** o histórico preserva estado, autor, instante e resultado sem expor evidências excessivas.

**Dado** que duas propostas ou aceitações concorrentes tentam transferir a mesma gestão
**Quando** a primeira conclusão altera a versão da autoridade
**Então** as demais recebem conflito ou indisponibilidade segura
**E** nunca resultam em múltiplos Síndicos vigentes, perda de autoridade ou sobrescrita silenciosa.

**Dado** que a transferência é concluída
**Quando** a transação é confirmada
**Então** antecessor, sucessor, poderes, destino do Papel anterior, instante, Eventos de Auditoria, notificações e projeção exportável são registrados de forma coerente
**E** Pessoas, Unidades, Vínculos, finanças, Publicações, Anexos e histórico institucional permanecem no mesmo Condomínio.

**Dado** que alguém tenta usar a recuperação de Conta para assumir o Papel de Síndico
**Quando** comprova apenas controle do e-mail ou redefine credencial
**Então** o sistema recupera somente a Conta correspondente
**E** não inicia nem conclui transferência de autoridade.

**Dado** que existe contestação sobre a autoridade atual
**Quando** não há cooperação válida do Síndico vigente
**Então** esta história não executa transferência e encaminha o caso ao fluxo contestado condicionado ao gate jurídico
**E** o requerente não recebe acesso automático a dados ou poderes.

**Dado** que a transferência é utilizada em mobile, desktop, teclado ou tecnologia assistiva
**Quando** proposta, poderes, confirmação, rejeição, conflito ou conclusão são apresentados
**Então** foco, linguagem, riscos e efeitos cumprem WCAG 2.2 AA
**E** nenhuma decisão depende apenas de cor ou ação implícita.

Rastreabilidade: FR-4, FR-5, FR-8, FR-9, FR-22 parcialmente, NFR-1, NFR-6–NFR-10A, NFR-11, NFR-12, NFR-14, UX-DR9, UX-DR15–UX-DR18, AD-4, AD-8–AD-11, AD-14, AD-15, AD-17, AD-23–AD-26 e gate jurídico aplicável à transferência contestada.

## Épico 2: Organização e controle financeiro

A gestão mantém Contas Financeiras, Lançamentos, serviços, parcelamentos, Obrigações, Movimentos, previsões e Fechamentos íntegros e compreensíveis.

### Story 2.1: Configurar e administrar Contas Financeiras

Como Síndico ou Auxiliar com capacidade financeira,
Quero criar, consultar e encerrar Contas Financeiras,
Para que o caixa do Condomínio seja organizado por origem sem alegar conciliação bancária inexistente.

**Critérios de Aceitação:**

**Dado** que o Condomínio ainda não possui configuração financeira
**Quando** a primeira Conta Financeira é preparada
**Então** o sistema utiliza real brasileiro como moeda inicial e o timezone IANA configurado para o Condomínio
**E** apresenta moeda, data de referência e efeitos do saldo inicial antes da confirmação.

**Dado** que o ator possui capacidade vigente para gerir Contas Financeiras
**Quando** informa nome, tipo, saldo inicial e data de referência válidos
**Então** o sistema cria uma Conta Financeira ativa somente no tenant autorizado
**E** registra valores monetários em `numeric(19,2)` e os expõe como string decimal no contrato JSON.

**Dado** que o saldo inicial possui centavos, valor zero ou valor negativo permitido pela natureza da Conta
**Quando** a Conta é criada
**Então** o valor é preservado exatamente com duas casas decimais, sem conversão por ponto flutuante
**E** a interface apresenta claramente o significado do sinal e da data de referência.

**Dado** que nome ou tipo estão ausentes ou o valor monetário é inválido
**Quando** o ator tenta criar a Conta Financeira
**Então** a operação é rejeitada sem persistência parcial
**E** a interface identifica cada campo inválido com mensagem acessível e acionável.

**Dado** que a mesma solicitação é repetida por duplo acionamento, reenvio ou falha de rede
**Quando** utiliza a mesma chave idempotente e o mesmo conteúdo
**Então** o sistema retorna a Conta Financeira já criada sem duplicar saldo inicial ou Evento de Auditoria
**E** reutilizar a chave com conteúdo diferente é rejeitado como conflito.

**Dado** que o ator consulta as Contas Financeiras
**Quando** abre a lista ou os detalhes
**Então** visualiza nome, tipo, estado, saldo inicial, data de referência e saldo derivado disponível até o momento
**E** qualquer total consolidado permanece decomponível por Conta Financeira.

**Dado** que não existem Movimentos posteriores
**Quando** o saldo derivado é apresentado
**Então** corresponde exatamente ao saldo inicial da Conta
**E** o produto não afirma que esse valor foi conciliado ou confirmado por instituição financeira.

**Dado** que o ator encerra uma Conta Financeira ativa
**Quando** confirma a ação com data e motivo
**Então** a Conta passa ao estado encerrado e deixa de aceitar novos Lançamentos ou Movimentos
**E** saldo, registros anteriores, autoria e histórico permanecem consultáveis conforme autorização.

**Dado** que uma Conta Financeira encerrada possui saldo diferente de zero
**Quando** o encerramento é solicitado
**Então** a interface alerta o ator e exige confirmação explícita sem alterar ou zerar o saldo
**E** o sistema preserva o valor histórico e não cria Movimento compensatório automaticamente.

**Dado** que o ator tenta excluir uma Conta Financeira ou reativá-la por manipulação de rota
**Quando** a operação não faz parte do contrato autorizado
**Então** o servidor nega a solicitação
**E** nenhuma Conta, Lançamento, Movimento ou histórico relacionado é apagado.

**Dado** que dois atores alteram simultaneamente a mesma Conta Financeira
**Quando** a versão persistida já mudou
**Então** a segunda operação recebe conflito `409` e não sobrescreve a primeira
**E** a interface apresenta o estado atual para revisão.

**Dado** que o ator usa identificador de Conta Financeira pertencente a outro Condomínio
**Quando** tenta consultar, alterar ou encerrar a Conta
**Então** o servidor nega antes de acessar o tenant alvo
**E** não revela existência, nome, tipo ou saldo da Conta protegida.

**Dado** que criação ou encerramento é concluído
**Quando** a transação é persistida
**Então** Conta Financeira, Evento de Auditoria e projeção exportável são registrados de forma coerente
**E** o evento contém apenas ator, ação, Condomínio, objeto, instante, resultado, motivo e correlação necessários.

**Dado** que a gestão de Contas Financeiras é utilizada em mobile, desktop, teclado ou tecnologia assistiva
**Quando** lista, formulário, confirmação, alerta, conflito ou estado vazio são apresentados
**Então** foco, rótulos, valores, datas e estados cumprem WCAG 2.2 AA
**E** ativo ou encerrado não depende apenas de cor.

Rastreabilidade: FR-12 parcialmente, FR-38, NFR-1, NFR-6–NFR-9, NFR-11–NFR-14, UX-DR10, UX-DR16–UX-DR18, AD-4–AD-8, AD-11, AD-14–AD-16, AD-23–AD-26.

### Story 2.2: Registrar e corrigir Lançamentos financeiros

Como Síndico ou Auxiliar com capacidade financeira,  
Quero registrar e corrigir receitas e despesas previstas,  
Para que os compromissos financeiros do Condomínio sejam controlados com contexto, histórico e valores confiáveis.

**Critérios de Aceitação:**

**Dado** que o ator possui capacidade vigente para gerir Lançamentos  
**Quando** informa tipo, descrição, categoria, competência, vencimento, valor esperado e Conta Financeira ativa  
**Então** o sistema cria o Lançamento somente no Condomínio autorizado  
**E** permite informar contraparte e observação apenas quando necessárias.

**Dado** que um Lançamento é criado  
**Quando** sua data de vencimento ainda não chegou  
**Então** ele pode assumir o estado `Previsto` ou `Em aberto`, conforme a classificação informada  
**E** a interface diferencia claramente previsão, vencimento e realização financeira.

**Dado** que um Lançamento permanece com saldo esperado e seu vencimento já passou no timezone do Condomínio  
**Quando** seu estado é consultado  
**Então** ele é apresentado como `Vencido`  
**E** essa classificação não cria Movimento, multa, juros ou cobrança automaticamente.

**Dado** que não existem Movimentos vinculados ao Lançamento  
**Quando** alguém tenta marcá-lo manualmente como `Parcial`, `Pago` ou `Recebido`  
**Então** o servidor rejeita a alteração  
**E** informa que estados de realização dependem de Movimentos financeiros efetivamente registrados.

**Dado** que o tipo selecionado é receita ou despesa  
**Quando** o valor esperado é informado  
**Então** ele deve ser maior que zero e ter no máximo duas casas decimais  
**E** sua natureza é determinada pelo tipo, sem exigir valor negativo para despesas.

**Dado** que o Lançamento contém valor monetário válido  
**Quando** ele é persistido ou retornado pela API  
**Então** o valor é armazenado em `numeric(19,2)`  
**E** é representado no contrato JSON como string decimal, sem conversão por ponto flutuante.

**Dado** que tipo, descrição, categoria, competência, vencimento, valor esperado ou Conta Financeira são inválidos  
**Quando** o ator tenta criar o Lançamento  
**Então** a operação é rejeitada sem persistência parcial  
**E** cada problema é apresentado junto ao campo correspondente com orientação acessível.

**Dado** que a Conta Financeira está encerrada ou pertence a outro Condomínio  
**Quando** alguém tenta vinculá-la a um novo Lançamento  
**Então** o servidor nega a operação  
**E** não revela dados protegidos nem permite contornar a validação pela manipulação da requisição.

**Dado** que um anexo comprobatório ainda não existe ou o recurso de anexação está indisponível  
**Quando** o Lançamento é criado ou corrigido  
**Então** a operação financeira pode ser concluída normalmente  
**E** o sistema não inventa documento, evidência ou comprovação inexistente.

**Dado** que contraparte ou observação são informadas  
**Quando** o Lançamento é persistido e exibido  
**Então** somente dados adequados e necessários à finalidade financeira são aceitos  
**E** esses campos permanecem restritos às capacidades autorizadas, sem publicação coletiva automática.

**Dado** que o período financeiro correspondente ainda está aberto  
**Quando** um ator autorizado corrige dados do Lançamento  
**Então** o sistema exige o motivo da correção e preserva os valores anteriores no histórico  
**E** a alteração não reescreve nem elimina Eventos de Auditoria existentes.

**Dado** que o período correspondente está fechado  
**Quando** alguém tenta corrigir diretamente o Lançamento  
**Então** o servidor rejeita a alteração  
**E** orienta o uso do processo autorizado de reabertura ou ajuste, sem modificar silenciosamente o Fechamento.

**Dado** que um Lançamento não deve mais produzir efeitos futuros  
**Quando** o ator solicita seu cancelamento e informa o motivo  
**Então** o Lançamento passa ao estado `Cancelado` sem ser excluído  
**E** permanece consultável com autoria, instante, motivo e histórico.

**Dado** que a mesma criação é reenviada por duplo acionamento ou falha de rede  
**Quando** utiliza a mesma chave idempotente e o mesmo conteúdo  
**Então** o sistema retorna o Lançamento anteriormente criado sem duplicá-lo  
**E** a reutilização da chave com conteúdo diferente resulta em conflito.

**Dado** que dois atores corrigem ou cancelam simultaneamente o mesmo Lançamento  
**Quando** a versão persistida já foi alterada  
**Então** a segunda operação recebe conflito `409` sem sobrescrever a primeira  
**E** a interface apresenta o estado atual para revisão.

**Dado** que criação, correção ou cancelamento é concluído  
**Quando** a transação é confirmada  
**Então** Lançamento, histórico, Evento de Auditoria e projeção exportável são persistidos de forma coerente  
**E** falha em qualquer parte impede a confirmação parcial da operação.

**Dado** que os Lançamentos são consultados em mobile, desktop, teclado ou tecnologia assistiva  
**Quando** lista, formulário, estado vazio, validação, conflito ou indisponibilidade são apresentados  
**Então** foco, rótulos, valores, datas e estados cumprem WCAG 2.2 AA  
**E** receita, despesa, previsão, vencimento e cancelamento não são diferenciados apenas por cor.

Rastreabilidade: FR-10, FR-12 parcialmente, FR-14 parcialmente, FR-38, FR-40 parcialmente, NFR-1, NFR-6–NFR-9, NFR-11–NFR-14, UX-DR10, UX-DR16–UX-DR18, AD-4–AD-8, AD-11, AD-14–AD-16 e AD-23–AD-26.

### Story 2.3: Registrar Movimentos e realizações parciais

Como Síndico ou Auxiliar com capacidade financeira,  
Quero registrar entradas e saídas efetivamente realizadas, inclusive parciais,  
Para que os saldos e estados financeiros reflitam os fatos registrados sem confundir previsão com caixa realizado.

**Critérios de Aceitação:**

**Dado** que o ator possui capacidade vigente para registrar Movimentos  
**Quando** informa Conta Financeira ativa, natureza de entrada ou saída, valor, data de realização e descrição  
**Então** o sistema registra o Movimento somente no Condomínio autorizado  
**E** permite vinculá-lo a um Lançamento compatível do mesmo Condomínio.

**Dado** que um Movimento é vinculado a um Lançamento  
**Quando** sua natureza é validada  
**Então** uma entrada somente pode realizar um Lançamento de receita e uma saída somente pode realizar um Lançamento de despesa  
**E** incompatibilidades são rejeitadas sem alteração de saldo ou estado.

**Dado** que o valor acumulado dos Movimentos válidos é menor que o valor esperado do Lançamento  
**Quando** um novo Movimento é confirmado  
**Então** o Lançamento passa ao estado `Parcial`  
**E** a interface apresenta separadamente valor esperado, valor realizado e saldo restante.

**Dado** que o valor acumulado dos Movimentos válidos alcança exatamente o valor esperado  
**Quando** o Movimento é confirmado  
**Então** o Lançamento de despesa passa ao estado `Pago` ou o de receita passa ao estado `Recebido`  
**E** o estado é derivado dos Movimentos, sem marcação manual independente.

**Dado** que o novo Movimento faria o total realizado superar o valor esperado  
**Quando** o ator revisa a operação  
**Então** a interface apresenta explicitamente o valor excedente e exige confirmação com justificativa  
**E** o sistema não altera automaticamente o valor esperado nem cria outro Lançamento.

**Dado** que um Movimento não está vinculado a Lançamento  
**Quando** é registrado diretamente em uma Conta Financeira ativa  
**Então** ele afeta o caixa realizado dessa Conta  
**E** permanece identificado como Movimento avulso, sem gerar previsão ou Lançamento retroativo automaticamente.

**Dado** que valor, natureza, data, descrição ou Conta Financeira são inválidos  
**Quando** o ator tenta registrar o Movimento  
**Então** a operação é rejeitada sem alteração parcial de saldo  
**E** a interface apresenta mensagens acessíveis e específicas para os campos inválidos.

**Dado** que o Movimento contém valor monetário válido  
**Quando** é persistido ou retornado pela API  
**Então** o valor é armazenado em `numeric(19,2)` e representado no JSON como string decimal  
**E** cálculos de total e saldo não utilizam ponto flutuante.

**Dado** que a data de realização é informada  
**Quando** o Movimento é registrado  
**Então** o sistema a interpreta segundo o timezone IANA do Condomínio e preserva o instante técnico em UTC quando aplicável  
**E** competência, vencimento e realização continuam sendo conceitos distintos.

**Dado** que a Conta Financeira está encerrada ou pertence a outro Condomínio  
**Quando** alguém tenta registrar nela um Movimento  
**Então** o servidor nega a operação antes de modificar qualquer saldo  
**E** não revela nome, saldo, histórico ou existência do objeto protegido.

**Dado** que o Lançamento está cancelado ou pertence a um período fechado  
**Quando** alguém tenta registrar um novo Movimento vinculado  
**Então** o servidor rejeita a operação  
**E** orienta o fluxo autorizado de correção ou reabertura sem alterar o histórico fechado.

**Dado** que o mesmo registro é reenviado por duplo acionamento, timeout ou falha de rede  
**Quando** utiliza a mesma chave idempotente e o mesmo conteúdo  
**Então** o sistema retorna o Movimento já registrado sem duplicar o efeito no saldo  
**E** a reutilização da chave com conteúdo diferente é rejeitada como conflito.

**Dado** que um Movimento confirmado contém erro  
**Quando** um ator autorizado solicita sua correção  
**Então** o registro original não é editado nem excluído  
**E** o sistema exige motivo e cria estorno rastreável, permitindo depois registrar o Movimento correto.

**Dado** que um estorno é confirmado  
**Quando** os saldos são recalculados  
**Então** o efeito financeiro do Movimento original é neutralizado exatamente uma vez  
**E** o estado e o saldo restante do Lançamento vinculado são novamente derivados dos Movimentos válidos.

**Dado** que um estorno faria o Lançamento retornar de `Pago` ou `Recebido` para `Parcial`, `Em aberto` ou `Vencido`  
**Quando** a operação é revisada  
**Então** a interface apresenta antecipadamente o novo estado e o saldo restante  
**E** o resultado considera a data atual no timezone do Condomínio.

**Dado** que dois atores registram Movimentos simultaneamente para o mesmo Lançamento ou Conta Financeira  
**Quando** a versão utilizada já não corresponde ao estado persistido  
**Então** uma operação recebe conflito `409` para revisão  
**E** nenhum saldo, total realizado ou estado é sobrescrito silenciosamente.

**Dado** que um Movimento ou estorno é confirmado  
**Quando** a transação é persistida  
**Então** Movimento, saldos derivados, estado do Lançamento, Evento de Auditoria e projeção exportável são atualizados atomicamente  
**E** falha em qualquer parte impede que o caixa seja alterado parcialmente.

**Dado** que saldos e Movimentos são apresentados  
**Quando** o usuário consulta uma Conta Financeira ou um Lançamento  
**Então** a interface distingue valor esperado, realizado, estornado e restante  
**E** não afirma que os valores foram conciliados ou confirmados por instituição financeira.

**Dado** que a funcionalidade é utilizada em mobile, desktop, teclado ou tecnologia assistiva  
**Quando** formulário, revisão, excesso, estorno, conflito ou resultado são apresentados  
**Então** foco, rótulos, valores, datas e estados cumprem WCAG 2.2 AA  
**E** entradas, saídas, realizações e estornos não dependem apenas de cor.

Rastreabilidade: FR-10, FR-12 parcialmente, FR-38, FR-40 parcialmente, NFR-1, NFR-6–NFR-9, NFR-11–NFR-14, UX-DR10, UX-DR16–UX-DR18, AD-4–AD-8, AD-11, AD-14–AD-16 e AD-23–AD-26.

### Story 2.4: Acompanhar serviços e parcelamentos

Como Síndico ou Auxiliar com capacidade financeira,  
Quero registrar serviços contratados e seus parcelamentos,  
Para que o Condomínio acompanhe valor total, vencimentos, pagamentos e saldo sem perder a relação com o compromisso original.

**Critérios de Aceitação:**

**Dado** que o ator possui capacidade vigente para gerir serviços e parcelamentos  
**Quando** informa descrição do serviço, fornecedor, valor total, data de contratação e condições de pagamento  
**Então** o sistema registra o serviço somente no Condomínio autorizado  
**E** apresenta separadamente os dados do compromisso, das parcelas e dos pagamentos realizados.

**Dado** que o serviço será pago em uma única vez  
**Quando** o ator confirma seu registro  
**Então** o sistema cria um Lançamento de despesa associado ao serviço com valor e vencimento informados  
**E** mantém o valor total do serviço rastreável ao Lançamento gerado.

**Dado** que o serviço será parcelado  
**Quando** o ator informa quantidade, valores e vencimentos  
**Então** o sistema apresenta uma pré-visualização de todas as parcelas antes da confirmação  
**E** exige que a soma delas corresponda exatamente ao valor total contratado.

**Dado** que as parcelas têm valores diferentes  
**Quando** a soma permanece igual ao valor total  
**Então** o parcelamento pode ser confirmado  
**E** cada parcela gera um Lançamento próprio, numerado e vinculado ao mesmo serviço.

**Dado** que a divisão uniforme produz diferença de centavos  
**Quando** as parcelas são calculadas automaticamente  
**Então** o sistema distribui a diferença de maneira explícita e determinística  
**E** a soma final permanece exatamente igual ao valor total.

**Dado** que quantidade, valor total, valores das parcelas ou vencimentos são inválidos  
**Quando** o ator tenta confirmar o parcelamento  
**Então** a operação é rejeitada sem criar serviço ou Lançamentos parciais  
**E** a interface indica quais dados precisam ser corrigidos.

**Dado** que já existe serviço equivalente ou parcelamento com a mesma referência operacional  
**Quando** o ator tenta registrá-lo novamente  
**Então** o sistema alerta sobre a possível duplicidade e apresenta o registro existente  
**E** exige confirmação justificada quando a duplicidade representar compromissos realmente distintos.

**Dado** que o serviço ou suas parcelas contêm valores monetários  
**Quando** são persistidos ou retornados pela API  
**Então** os valores utilizam `numeric(19,2)` e strings decimais no JSON  
**E** total contratado, total previsto, total realizado e saldo são calculados sem ponto flutuante.

**Dado** que Movimentos são vinculados aos Lançamentos das parcelas  
**Quando** o serviço é consultado  
**Então** o sistema apresenta cada parcela como em aberto, parcial, paga ou vencida conforme seus Movimentos e datas  
**E** calcula total realizado e saldo restante a partir dos registros válidos.

**Dado** que uma parcela recebe pagamento parcial  
**Quando** o respectivo Movimento é confirmado  
**Então** somente essa parcela passa ao estado `Parcial`  
**E** o saldo do serviço reflete o valor ainda não realizado de todas as parcelas.

**Dado** que um pagamento excede o valor de uma parcela após confirmação justificada  
**Quando** o serviço é consultado  
**Então** o excedente permanece associado à parcela que recebeu o Movimento  
**E** não é redistribuído silenciosamente para outras parcelas nem altera o valor contratado.

**Dado** que o período financeiro permanece aberto e nenhuma parcela afetada possui realização  
**Quando** o ator corrige fornecedor, descrição, valor ou cronograma  
**Então** o sistema exige motivo, apresenta a nova composição e preserva a versão anterior  
**E** atualiza serviço e Lançamentos relacionados atomicamente após confirmação.

**Dado** que a correção afetaria parcela com Movimento ou período fechado  
**Quando** o ator tenta alterar valor ou vencimento diretamente  
**Então** o servidor rejeita a alteração destrutiva  
**E** orienta estorno, ajuste ou reabertura conforme o estado dos registros envolvidos.

**Dado** que um serviço é cancelado antes de qualquer realização  
**Quando** o ator informa o motivo e confirma  
**Então** o serviço e seus Lançamentos ainda abertos são cancelados atomicamente  
**E** nenhum registro é excluído ou transformado em pagamento.

**Dado** que o serviço possui realização parcial ou total  
**Quando** seu cancelamento é solicitado  
**Então** o sistema impede o cancelamento simples  
**E** apresenta os Movimentos existentes e orienta o tratamento por estorno ou ajuste auditável.

**Dado** que informações do fornecedor são registradas  
**Quando** o serviço é exibido internamente ou preparado para uso posterior em prestação de contas  
**Então** o sistema preserva apenas dados adequados à finalidade administrativa e financeira  
**E** não torna Dados Pessoais, contatos, documentos ou dados bancários automaticamente compartilháveis.

**Dado** que ainda não existe Anexo comprobatório  
**Quando** o serviço ou parcelamento é registrado  
**Então** a operação pode ser concluída normalmente  
**E** o sistema não declara que contrato, nota fiscal ou comprovante foi apresentado.

**Dado** que a mesma confirmação é reenviada com a mesma chave idempotente  
**Quando** ocorre duplo acionamento ou falha de rede  
**Então** o sistema retorna o serviço e as parcelas já criados sem duplicá-los  
**E** a mesma chave com conteúdo diferente é rejeitada como conflito.

**Dado** que dois atores alteram simultaneamente o mesmo serviço ou parcelamento  
**Quando** a versão persistida já mudou  
**Então** a segunda operação recebe conflito `409`  
**E** nenhum valor, vencimento ou Lançamento é sobrescrito silenciosamente.

**Dado** que criação, correção ou cancelamento é confirmado  
**Quando** a transação é persistida  
**Então** serviço, parcelas, Lançamentos, histórico, Eventos de Auditoria e projeção exportável permanecem coerentes  
**E** uma falha impede a gravação parcial da composição financeira.

**Dado** que a funcionalidade é utilizada em mobile, desktop, teclado ou tecnologia assistiva  
**Quando** formulário, pré-visualização, cronograma, alertas ou estados são apresentados  
**Então** foco, rótulos, valores e datas cumprem WCAG 2.2 AA  
**E** o estado das parcelas não depende apenas de cor.

Rastreabilidade: FR-10 parcialmente, FR-11, FR-12 parcialmente, FR-14 parcialmente, FR-40 parcialmente, NFR-1, NFR-6–NFR-9, NFR-11–NFR-14, UX-DR10, UX-DR16–UX-DR18, AD-4–AD-8, AD-11, AD-14–AD-16 e AD-23–AD-26.

### Story 2.5: Gerar Obrigações por Unidade

Como Síndico ou Auxiliar com capacidade financeira,  
Quero criar Obrigações individualmente ou em lote para as Unidades,  
Para que valores devidos sejam controlados com segurança, privacidade e histórico, sem atribuir dívidas à Pessoa errada.

**Critérios de Aceitação:**

**Dado** que o ator possui capacidade vigente para gerir Obrigações  
**Quando** informa Unidade, descrição, competência, vencimento, valor e natureza da obrigação  
**Então** o sistema cria a Obrigação somente no Condomínio autorizado  
**E** preserva separadamente Unidade, Vínculos temporais e Responsáveis Financeiros alcançados.

**Dado** que a mesma obrigação se aplica a várias Unidades  
**Quando** o ator seleciona as Unidades e define valores iguais ou individualizados  
**Então** o sistema apresenta uma pré-visualização completa antes da confirmação  
**E** mostra quantidade, Unidades alcançadas, valor de cada Obrigação e total do lote.

**Dado** que alguma Unidade está inativa, é inválida ou pertence a outro Condomínio  
**Quando** o lote é validado  
**Então** o sistema identifica a ocorrência sem revelar dados de outro tenant  
**E** impede a confirmação até que o escopo seja corrigido.

**Dado** que já existe Obrigação ativa com a mesma Unidade, natureza, competência e referência operacional  
**Quando** uma criação individual ou em lote é preparada  
**Então** o sistema sinaliza a possível duplicidade na pré-visualização  
**E** não cria nova Obrigação sem confirmação justificada de que se trata de débito distinto.

**Dado** que um lote contém uma ou mais duplicidades não justificadas  
**Quando** o ator tenta confirmá-lo  
**Então** nenhuma Obrigação do lote é criada  
**E** a interface permite revisar ou retirar os itens conflitantes antes de uma nova confirmação.

**Dado** que a criação individual ou em lote é confirmada  
**Quando** todas as validações são satisfeitas  
**Então** cada Obrigação recebe identificador próprio e vínculo imutável com sua Unidade  
**E** a operação não eleva Papel, não cria Vínculo de ocupação e não define propriedade jurídica.

**Dado** que uma Obrigação é criada  
**Quando** existem Responsáveis Financeiros vigentes para a Unidade  
**Então** o sistema registra quais relações Pessoa–Unidade estavam alcançadas naquele momento  
**E** não converte esse snapshot operacional em conclusão jurídica definitiva sobre responsabilidade pela dívida.

**Dado** que a Unidade não possui Responsável Financeiro vigente  
**Quando** a Obrigação é criada  
**Então** ela permanece válida e associada à Unidade  
**E** o sistema alerta a gestão sobre a ausência sem atribuí-la automaticamente a qualquer Pessoa.

**Dado** que uma Pessoa inicia posteriormente novo Vínculo com a Unidade  
**Quando** consulta sua situação financeira  
**Então** o sistema não lhe transfere automaticamente Obrigações anteriores ao início de seu Vínculo  
**E** qualquer acesso excepcional depende de regra expressa, finalidade válida e do gate jurídico consolidado.

**Dado** que um Morador ou Responsável Financeiro encerra seu Vínculo  
**Quando** ainda existem Obrigações pendentes relacionadas ao período anterior  
**Então** o Vínculo de acesso ao Condomínio encerra-se conforme sua vigência  
**E** a Obrigação, a Unidade, os snapshots históricos e a trilha permanecem preservados sem manter acesso ordinário da Pessoa.

**Dado** que ainda está pendente o parecer jurídico consolidado  
**Quando** o sistema precisa determinar cobrança posterior à saída, responsabilidade definitiva ou retenção de acesso excepcional  
**Então** não presume que o ex-inquilino, o proprietário ou o Condomínio deva executar uma conduta jurídica específica  
**E** mantém o caso sinalizado para aplicação da futura decisão formal sem transferir o débito ao novo ocupante.

**Dado** que o vencimento passa e a Obrigação mantém saldo pendente  
**Quando** seu estado é consultado no timezone do Condomínio  
**Então** ela é apresentada como inadimplente  
**E** o sistema não aplica automaticamente multa, juros, correção monetária ou medida de cobrança não configurada e juridicamente validada.

**Dado** que um pagamento é registrado para uma Obrigação  
**Quando** o Movimento de entrada é confirmado  
**Então** o valor realizado reduz seu saldo e atualiza o estado para parcial ou quitada  
**E** o sistema preserva separadamente valor original, total realizado, estornos e saldo.

**Dado** que um pagamento excede o saldo da Obrigação  
**Quando** o ator revisa o Movimento  
**Então** o sistema apresenta claramente o excedente e exige confirmação justificada  
**E** não o redistribui para outras Obrigações ou Unidades de forma automática.

**Dado** que a Obrigação ainda não possui Movimento e pertence a período aberto  
**Quando** o ator corrige valor, competência, vencimento ou descrição  
**Então** o sistema exige motivo e apresenta os efeitos antes da confirmação  
**E** preserva a versão anterior e os snapshots de destinatários no histórico.

**Dado** que a correção alcançaria Obrigação com Movimento ou período fechado  
**Quando** o ator tenta alterar diretamente seu valor ou referência  
**Então** o servidor rejeita a alteração destrutiva  
**E** orienta o tratamento por estorno, ajuste ou reabertura autorizada.

**Dado** que uma Obrigação sem realização foi criada indevidamente  
**Quando** o ator informa o motivo e confirma o cancelamento  
**Então** ela passa ao estado `Cancelada` sem ser excluída  
**E** deixa de compor o saldo pendente, preservando autoria, versão e histórico.

**Dado** que a Obrigação possui realização parcial ou total  
**Quando** seu cancelamento simples é solicitado  
**Então** o sistema impede a operação  
**E** apresenta os Movimentos existentes e orienta o fluxo auditável de estorno ou ajuste.

**Dado** que uma Obrigação contém dados financeiros de uma Unidade ou Pessoa  
**Quando** é consultada ou futuramente utilizada em comunicação  
**Então** seu conteúdo permanece privado por definição  
**E** nenhuma lista de inadimplência, valor individual ou comunicação de cobrança se torna coletiva ou publicável automaticamente.

**Dado** que a mesma confirmação individual ou em lote é reenviada com a mesma chave idempotente  
**Quando** ocorre duplo acionamento, timeout ou falha de rede  
**Então** o sistema retorna as Obrigações já criadas sem duplicá-las  
**E** reutilizar a chave com conteúdo diferente resulta em conflito.

**Dado** que dois atores alteram simultaneamente a mesma Obrigação  
**Quando** a versão persistida já mudou  
**Então** a segunda operação recebe conflito `409`  
**E** saldo, destinatários históricos e estado não são sobrescritos silenciosamente.

**Dado** que criação, correção ou cancelamento é confirmado  
**Quando** a transação é persistida  
**Então** Obrigações, saldos, snapshots, Eventos de Auditoria e projeção exportável permanecem coerentes  
**E** qualquer falha impede a gravação parcial do lote ou de seus efeitos.

**Dado** que a funcionalidade é utilizada em mobile, desktop, teclado ou tecnologia assistiva  
**Quando** seleção de Unidades, pré-visualização, duplicidade, inadimplência ou conflito são apresentados  
**Então** foco, rótulos, valores, datas e estados cumprem WCAG 2.2 AA  
**E** informações privadas não são expostas em notificações, títulos de página ou mensagens de erro desnecessárias.

Rastreabilidade: FR-5 parcialmente, FR-10 parcialmente, FR-12 parcialmente, FR-19 parcialmente, FR-39, FR-40 parcialmente, FR-42 parcialmente, NFR-1–NFR-9, NFR-11–NFR-14, UX-DR9, UX-DR10, UX-DR16–UX-DR18, UX-DR22, UX-DR23, AD-4–AD-8, AD-11, AD-14–AD-17, AD-23–AD-26 e gate jurídico consolidado pendente.

### Story 2.6: Consultar caixa e saldos realizados

Como Síndico ou Auxiliar com capacidade financeira,  
Quero consultar o caixa realizado por Conta Financeira e período,  
Para que eu compreenda a origem dos saldos sem misturar previsões com valores efetivamente registrados.

**Critérios de Aceitação:**

**Dado** que o ator possui capacidade vigente para consultar informações financeiras  
**Quando** acessa a visão de caixa  
**Então** o sistema apresenta as Contas Financeiras do Condomínio autorizado  
**E** não consulta nem revela dados pertencentes a outro tenant.

**Dado** que o ator seleciona uma Conta Financeira e um período  
**Quando** a consulta é concluída  
**Então** o sistema apresenta saldo de abertura, entradas realizadas, saídas realizadas e saldo final  
**E** informa claramente as datas inicial e final e o timezone IANA utilizados.

**Dado** que o saldo de uma Conta Financeira é calculado  
**Quando** os Movimentos válidos do período são consolidados  
**Então** aplica-se a equação `saldo final = saldo de abertura + entradas − saídas`  
**E** estornos neutralizam exatamente os Movimentos correspondentes sem serem somados como fatos independentes.

**Dado** que a consulta começa na data de referência da Conta  
**Quando** ainda não existem Movimentos válidos  
**Então** o saldo de abertura e o saldo final correspondem ao saldo inicial registrado  
**E** entradas e saídas são apresentadas como zero.

**Dado** que a consulta começa depois da data de referência da Conta  
**Quando** o saldo de abertura é calculado  
**Então** ele incorpora o saldo inicial e todos os Movimentos válidos anteriores ao período  
**E** permanece demonstrável por meio da decomposição cronológica.

**Dado** que o Condomínio possui mais de uma Conta Financeira  
**Quando** o ator consulta a visão consolidada  
**Então** o sistema apresenta o saldo individual de cada Conta e o total consolidado  
**E** permite decompor o total até os Movimentos que o compõem.

**Dado** que existem Contas Financeiras encerradas com histórico no período  
**Quando** a consulta é realizada  
**Então** elas permanecem disponíveis nos resultados históricos com seu estado e data de encerramento  
**E** seus valores não são omitidos do consolidado correspondente.

**Dado** que um Movimento avulso ou vinculado a Lançamento foi confirmado  
**Quando** ele pertence ao período consultado  
**Então** compõe o caixa realizado exatamente uma vez  
**E** sua existência independe do valor esperado do eventual Lançamento.

**Dado** que existem Lançamentos previstos, em aberto ou vencidos sem Movimento  
**Quando** o caixa realizado é consultado  
**Então** esses valores não alteram entradas, saídas ou saldo  
**E** a interface indica que previsões e compromissos estão disponíveis em visão separada.

**Dado** que um Lançamento foi parcialmente realizado  
**Quando** a consulta é exibida  
**Então** somente a soma dos Movimentos válidos compõe o caixa  
**E** o saldo esperado restante não é tratado como dinheiro disponível ou já gasto.

**Dado** que um Movimento foi estornado  
**Quando** a consulta inclui o Movimento original e seu estorno  
**Então** o efeito líquido correspondente é zero  
**E** ambos permanecem visíveis na decomposição, com relação, motivo e datas.

**Dado** que o filtro utiliza Conta, natureza, categoria, descrição ou intervalo de datas  
**Quando** a consulta é aplicada  
**Então** totais e lista detalhada refletem o mesmo conjunto de Movimentos  
**E** a interface apresenta os filtros ativos e oferece forma clara de removê-los.

**Dado** que nenhum Movimento corresponde aos filtros  
**Quando** a consulta termina  
**Então** a interface apresenta estado vazio explicativo, saldo aplicável e filtros utilizados  
**E** não confunde ausência de Movimento com saldo inexistente ou erro de carregamento.

**Dado** que valores monetários são calculados ou apresentados  
**Quando** a consulta é processada  
**Então** os cálculos utilizam precisão decimal compatível com `numeric(19,2)` e os contratos JSON usam strings decimais  
**E** subtotais e total consolidado fecham exatamente, sem arredondamento por ponto flutuante.

**Dado** que a consulta abrange um período aberto, conferido ou fechado  
**Quando** o resultado é exibido  
**Então** o sistema informa o estado do período e se os dados ainda podem mudar  
**E** uma consulta atual não reescreve nem substitui snapshots fechados.

**Dado** que o ator tenta acessar a consulta sem capacidade financeira vigente  
**Quando** solicita totais, detalhes ou decomposição  
**Então** o servidor nega a operação  
**E** não revela valores em contadores, mensagens, cache, logs do cliente ou respostas parciais.

**Dado** que a consulta está carregando, falha ou fica temporariamente indisponível  
**Quando** a interface apresenta seu estado  
**Então** diferencia carregamento, ausência de dados e erro recuperável  
**E** preserva os filtros e oferece nova tentativa sem exibir totais antigos como atuais.

**Dado** que a visão de caixa é utilizada em mobile, desktop, teclado ou tecnologia assistiva  
**Quando** filtros, tabelas, totais, detalhes ou estados são apresentados  
**Então** ordem de leitura, foco, rótulos e valores cumprem WCAG 2.2 AA  
**E** entradas, saídas, estornos e saldos não dependem apenas de cor ou posição visual.

Rastreabilidade: FR-10 parcialmente, FR-11 parcialmente, FR-12, FR-38, FR-40 parcialmente, NFR-1–NFR-3, NFR-6–NFR-9, NFR-11–NFR-13, UX-DR10, UX-DR16–UX-DR18, AD-4–AD-8, AD-11, AD-14–AD-16, AD-23, AD-25 e AD-26.

### Story 2.7: Consultar compromissos e previsões financeiras

Como Síndico ou Auxiliar com capacidade financeira,  
Quero consultar compromissos e projeções por período e Conta Financeira,  
Para que eu antecipe necessidades de caixa sem confundir estimativas com valores realizados.

**Critérios de Aceitação:**

**Dado** que o ator possui capacidade vigente para consultar informações financeiras  
**Quando** acessa a visão de previsões  
**Então** o sistema apresenta somente dados do Condomínio autorizado  
**E** identifica a visão como previsão, sem tratá-la como caixa realizado ou saldo bancário.

**Dado** que o ator seleciona Conta Financeira, data inicial e data final  
**Quando** a previsão é calculada  
**Então** o sistema apresenta saldo realizado de referência, entradas previstas, saídas previstas e saldo projetado  
**E** informa período, timezone IANA, instante do cálculo e premissas utilizadas.

**Dado** que o saldo projetado é calculado  
**Quando** os compromissos válidos são consolidados  
**Então** aplica-se a equação `saldo projetado = saldo realizado de referência + entradas previstas − saídas previstas`  
**E** cada total pode ser decomposto nos Lançamentos ou Obrigações que o compõem.

**Dado** que um Lançamento possui realização parcial  
**Quando** ele participa da previsão  
**Então** somente seu saldo esperado restante compõe o valor previsto  
**E** os Movimentos já confirmados permanecem exclusivamente na parcela realizada da análise.

**Dado** que um Lançamento já está integralmente pago ou recebido  
**Quando** a previsão é calculada  
**Então** ele não volta a compor entradas ou saídas previstas  
**E** seu valor realizado permanece refletido apenas no saldo de referência.

**Dado** que um Lançamento ou Obrigação está vencido e ainda possui saldo  
**Quando** o período projetado é consultado  
**Então** a interface informa separadamente os valores vencidos incluídos ou excluídos da projeção  
**E** a premissa adotada fica visível, sem afirmar que o recebimento ou pagamento ocorrerá.

**Dado** que o ator altera a premissa de inclusão de valores vencidos  
**Quando** recalcula a previsão  
**Então** o sistema apresenta o efeito da escolha sobre entradas, saídas e saldo projetado  
**E** não modifica Lançamentos, Obrigações, Movimentos ou estados financeiros.

**Dado** que serviços parcelados possuem parcelas futuras  
**Quando** seus vencimentos estão dentro do período consultado  
**Então** os saldos pendentes dessas parcelas compõem as saídas previstas  
**E** o compromisso pode ser decomposto por serviço, parcela e Lançamento.

**Dado** que Obrigações por Unidade possuem saldo e vencimento dentro do período  
**Quando** a projeção de receitas é calculada  
**Então** seus saldos pendentes podem compor as entradas previstas conforme premissa explícita  
**E** o sistema não apresenta a previsão como garantia de recebimento nem expõe devedores na visão consolidada.

**Dado** que um Lançamento está cancelado ou um Movimento foi estornado  
**Quando** a previsão é recalculada  
**Então** o compromisso cancelado deixa de compor valores previstos e o saldo realizado considera o estorno  
**E** nenhuma alteração reescreve resultados históricos já fechados.

**Dado** que o ator filtra por Conta, natureza, categoria, serviço, Unidade ou intervalo de datas  
**Quando** a consulta é aplicada  
**Então** totais e detalhes refletem o mesmo conjunto de registros  
**E** filtros que possam revelar informação privada somente estão disponíveis a capacidades autorizadas.

**Dado** que uma previsão consolidada abrange várias Contas Financeiras  
**Quando** o resultado é apresentado  
**Então** o sistema mostra a contribuição individual de cada Conta e o total projetado  
**E** não compensa silenciosamente déficits ou excedentes entre Contas.

**Dado** que o saldo projetado fica negativo em algum ponto do período  
**Quando** a evolução temporal é exibida  
**Então** o sistema destaca a data, o valor e os compromissos que produzem a insuficiência projetada  
**E** apresenta o resultado como alerta estimado, sem executar transferência, cobrança ou cancelamento automático.

**Dado** que não existem compromissos previstos para o período  
**Quando** a consulta é concluída  
**Então** a interface apresenta estado vazio e mantém visível o saldo realizado de referência  
**E** não confunde ausência de previsão com ausência de caixa ou erro de carregamento.

**Dado** que novos Lançamentos, Obrigações ou Movimentos são registrados em período aberto  
**Quando** a previsão atual é recalculada  
**Então** ela utiliza o estado vigente dos dados e informa o novo instante de cálculo  
**E** resultados anteriores não são apresentados como snapshots imutáveis, salvo quando vinculados a Fechamento.

**Dado** que a consulta alcança período fechado  
**Quando** o ator compara a previsão atual com dados históricos  
**Então** o snapshot fechado permanece preservado e claramente identificado  
**E** o recálculo atual é apresentado como uma visão distinta, sem substituir a versão fechada.

**Dado** que valores monetários são calculados ou retornados pela API  
**Quando** a previsão é processada  
**Então** utilizam precisão decimal compatível com `numeric(19,2)` e strings decimais no JSON  
**E** subtotais e totais fecham exatamente, sem ponto flutuante.

**Dado** que o ator não possui capacidade financeira vigente  
**Quando** tenta consultar totais, detalhes ou premissas  
**Então** o servidor nega o acesso  
**E** não revela valores, Unidades, categorias ou existência de compromissos em respostas parciais.

**Dado** que a consulta falha ou fica temporariamente indisponível  
**Quando** a interface apresenta o estado de erro  
**Então** preserva período, filtros e premissas para nova tentativa  
**E** não exibe previsão anterior como se estivesse atualizada.

**Dado** que a visão é utilizada em mobile, desktop, teclado ou tecnologia assistiva  
**Quando** premissas, filtros, totais, alertas ou decomposição são apresentados  
**Então** foco, ordem de leitura, rótulos e valores cumprem WCAG 2.2 AA  
**E** realizado, previsto, vencido e projetado não dependem apenas de cor ou elementos gráficos.

Rastreabilidade: FR-10 parcialmente, FR-11 parcialmente, FR-12, FR-13 parcialmente, FR-39 parcialmente, FR-40, NFR-1–NFR-3, NFR-6–NFR-9, NFR-11–NFR-13, UX-DR10, UX-DR16–UX-DR18, AD-4–AD-8, AD-11, AD-14–AD-16, AD-23, AD-25 e AD-26.

### Story 2.8: Conferir e fechar um período financeiro

Como Síndico ou Auxiliar com capacidade financeira específica,  
Quero conferir e fechar um período financeiro com snapshot preservado,  
Para que os registros daquele ciclo tenham uma versão íntegra e auditável, pronta para eventual prestação de contas.

**Critérios de Aceitação:**

**Dado** que ainda não existe período financeiro correspondente  
**Quando** um ator autorizado define datas inicial e final válidas  
**Então** o sistema cria o período no estado `Aberto` para o Condomínio autorizado  
**E** impede sobreposição incompatível com outro período da mesma finalidade.

**Dado** que o período está `Aberto`  
**Quando** o ator inicia a conferência  
**Então** o sistema apresenta Contas Financeiras, saldos de abertura, Movimentos, estornos, saldos finais, Lançamentos, serviços, Obrigações e previsões alcançados  
**E** permite decompor os totais até os registros que os originaram.

**Dado** que os saldos realizados são conferidos  
**Quando** o sistema valida cada Conta Financeira  
**Então** confirma a equação `saldo final = saldo de abertura + entradas − saídas`  
**E** qualquer divergência impede a conclusão da conferência e identifica a Conta e o conjunto afetado.

**Dado** que existem Lançamentos ou Obrigações em aberto, parciais ou vencidos  
**Quando** o período é conferido  
**Então** eles são apresentados separadamente dos valores realizados com seus respectivos saldos  
**E** sua existência não impede automaticamente a conferência, mas exige reconhecimento explícito do ator.

**Dado** que existem Movimentos sem Lançamento vinculado, pagamentos excedentes ou duplicidades justificadas  
**Quando** a conferência é preparada  
**Então** o sistema destaca cada ocorrência para revisão  
**E** exige reconhecimento explícito sem corrigi-la, redistribuí-la ou eliminá-la automaticamente.

**Dado** que existem possíveis inconsistências não reconhecidas ou erros de integridade  
**Quando** o ator tenta concluir a conferência  
**Então** a operação é bloqueada  
**E** a interface informa quais itens precisam ser corrigidos ou reconhecidos.

**Dado** que todos os bloqueios foram resolvidos e os alertas foram reconhecidos  
**Quando** o ator conclui a conferência  
**Então** o período passa de `Aberto` para `Conferido`  
**E** registra autoria, instante, versão dos dados e resultados das verificações.

**Dado** que novos registros ou correções alcançam um período `Conferido`  
**Quando** seu conteúdo financeiro é alterado antes do fechamento  
**Então** o período retorna automaticamente a `Aberto` ou invalida formalmente a conferência anterior  
**E** preserva quem conferiu, quando conferiu e qual mudança exigiu nova conferência.

**Dado** que o período está `Conferido` e o ator possui capacidade específica para fechá-lo  
**Quando** solicita o fechamento  
**Então** a interface apresenta período, Contas, totais realizados, compromissos pendentes, previsões, alertas reconhecidos e efeitos do bloqueio  
**E** exige confirmação explícita antes da mudança de estado.

**Dado** que o fechamento é confirmado  
**Quando** o servidor revalida capacidade, tenant, estado e versões  
**Então** o período passa para `Fechado` e recebe um snapshot imutável e versionado  
**E** alterações concorrentes ocorridas após a conferência impedem o fechamento.

**Dado** que o snapshot de fechamento é criado  
**Quando** a transação é persistida  
**Então** ele preserva datas, timezone, moeda, Contas, saldos, totais, decomposição, pendências, premissas de previsão, alertas e referências às versões alcançadas  
**E** permite demonstrar posteriormente quais dados produziram aquela versão.

**Dado** que valores monetários fazem parte do snapshot  
**Quando** são persistidos ou retornados pela API  
**Então** utilizam precisão compatível com `numeric(19,2)` e strings decimais no JSON  
**E** subtotais, totais e equações permanecem exatos, sem ponto flutuante.

**Dado** que o período está `Fechado`  
**Quando** alguém tenta criar, corrigir, cancelar, estornar ou vincular registros dentro de seu alcance  
**Então** o servidor rejeita a mutação direta  
**E** não altera o snapshot nem aceita contorno por manipulação de rota ou requisição.

**Dado** que um Anexo esperado não foi enviado ou está indisponível  
**Quando** o ator confere ou fecha o período  
**Então** o sistema informa a ausência sem declarar comprovação inexistente  
**E** o fechamento não é bloqueado apenas pela falta do Anexo, salvo regra formal futura explicitamente configurada.

**Dado** que o período fechado ainda não foi publicado  
**Quando** o fechamento termina  
**Então** o snapshot fica elegível para preparação de uma prestação de contas  
**E** nenhuma audiência é vinculada e nenhuma Publicação é criada automaticamente por esta história.

**Dado** que um período precisa ser corrigido após o fechamento  
**Quando** um ator com capacidade específica solicita sua reabertura  
**Então** o sistema exige motivo, apresenta os efeitos e solicita confirmação explícita  
**E** não apaga nem transforma o snapshot fechado existente.

**Dado** que a reabertura é confirmada  
**Quando** o servidor revalida autoridade, tenant, estado e versão  
**Então** cria uma nova versão operacional do período no estado `Aberto`  
**E** preserva a versão fechada anterior como histórica, com autoria, motivo e relação de sucessão.

**Dado** que a versão fechada já foi utilizada por uma Publicação  
**Quando** o período é reaberto ou corrigido  
**Então** a Publicação e o snapshot anteriormente utilizados permanecem imutáveis  
**E** qualquer prestação de contas atualizada exigirá nova versão e nova ação editorial no Épico 4.

**Dado** que alguém tenta marcar diretamente o período como `Publicado`  
**Quando** não existe ação editorial válida com audiência e versão definidas  
**Então** o servidor rejeita a transição  
**E** mantém separados o estado financeiro `Fechado` e o estado editorial da Publicação.

**Dado** que a mesma solicitação de fechamento ou reabertura é reenviada com a mesma chave idempotente  
**Quando** ocorre duplo acionamento, timeout ou falha de rede  
**Então** o sistema retorna o resultado anteriormente confirmado sem criar nova versão ou novo Evento de Auditoria  
**E** reutilizar a chave com conteúdo diferente resulta em conflito.

**Dado** que dois atores tentam fechar ou reabrir simultaneamente o mesmo período  
**Quando** a primeira operação altera sua versão  
**Então** a segunda recebe conflito `409` e não sobrescreve o novo estado  
**E** a interface apresenta a versão atual para revisão.

**Dado** que conferência, fechamento ou reabertura é concluído  
**Quando** a transação é confirmada  
**Então** período, snapshot, histórico, Eventos de Auditoria e projeção exportável são persistidos atomicamente  
**E** uma falha impede estado ou snapshot parcial.

**Dado** que o ator não possui capacidade vigente para a operação solicitada  
**Quando** tenta conferir, fechar, reabrir ou consultar detalhes protegidos  
**Então** o servidor aplica negação por padrão  
**E** não revela valores ou conteúdo financeiro em mensagens de erro, respostas parciais ou logs indevidos.

**Dado** que a funcionalidade é utilizada em mobile, desktop, teclado ou tecnologia assistiva  
**Quando** conferência, alertas, confirmação, snapshot, conflito ou reabertura são apresentados  
**Então** foco, ordem de leitura, rótulos, valores e estados cumprem WCAG 2.2 AA  
**E** `Aberto`, `Conferido` e `Fechado` não dependem apenas de cor.

Rastreabilidade: FR-10 parcialmente, FR-11 parcialmente, FR-12, FR-13, FR-14 parcialmente, FR-38–FR-40 parcialmente, NFR-1, NFR-6–NFR-9, NFR-11–NFR-14, UX-DR10, UX-DR14, UX-DR16–UX-DR18, AD-4–AD-8, AD-11, AD-14–AD-16 e AD-23–AD-26.

## Épico 3: Guardar documentos com privacidade e controle de espaço

A gestão armazena, consulta, prepara e remove Anexos financeiros com privacidade por padrão, processamento seguro, controle de Cota e integridade histórica, sem publicar ou vincular audiência neste épico.

### Story 3.1: Enviar e processar Anexos privados com segurança

Como Síndico ou Auxiliar com capacidade financeira e documental,
Quero anexar documentos a registros financeiros,
Para que o Condomínio preserve suas evidências sem expô-las antes de uma decisão explícita de compartilhamento.

**Critérios de Aceitação:**

**Dado** que o ator possui capacidade vigente sobre o objeto financeiro
**Quando** seleciona um arquivo para um Lançamento, serviço, parcela, Obrigação ou Movimento do Condomínio autorizado
**Então** o sistema apresenta nome, tamanho, tipo declarado, privacidade e consumo estimado da Cota
**E** informa inequivocamente que o Anexo será privado.

**Dado** que o ator confirma o envio
**Quando** o servidor revalida Conta, tenant, Vínculo, capacidade, objeto associado e Cota disponível
**Então** cria um identificador opaco e uma chave privada de armazenamento
**E** nunca utiliza nome original, e-mail, Unidade ou outro Dado Pessoal como chave ou URL.

**Dado** que o arquivo excede o tamanho permitido, possui tipo fora da allowlist ou conteúdo incompatível com o tipo declarado
**Quando** o upload é validado
**Então** o sistema rejeita o arquivo sem associá-lo ao objeto financeiro
**E** apresenta orientação segura sem executar ou interpretar conteúdo ativo.

**Dado** que o upload é recebido
**Quando** tamanho, hash e tipo são verificados
**Então** o arquivo permanece no estado `Em quarentena` e indisponível para consulta ou download ordinário
**E** o processamento assíncrono é solicitado por outbox na mesma operação observável.

**Dado** que o scanner ou sanitizador está indisponível, expira ou retorna resultado inconclusivo
**Quando** o processamento é executado
**Então** o Anexo permanece bloqueado em quarentena por comportamento fail-closed
**E** a interface apresenta estado recuperável sem afirmar que o arquivo é seguro.

**Dado** que o arquivo é identificado como malicioso ou proibido
**Quando** a análise termina
**Então** o Anexo passa ao estado `Rejeitado`, não pode ser aberto ou baixado e gera alerta operacional
**E** hash, motivo técnico minimizado e trilha são preservados sem copiar conteúdo malicioso para logs.

**Dado** que todas as verificações são aprovadas
**Quando** o processamento termina
**Então** o Anexo passa ao estado `Privado disponível` e permanece associado ao objeto financeiro
**E** nenhuma audiência, URL pública, Publicação ou permissão coletiva é criada.

**Dado** que dois arquivos possuem conteúdo idêntico
**Quando** são enviados ao mesmo ou a diferentes Condomínios
**Então** cada vínculo mantém autorização e metadados próprios
**E** qualquer deduplicação interna não revela existência, nome, proprietário ou conteúdo entre tenants.

**Dado** que o mesmo pedido de upload é repetido com a mesma chave idempotente e conteúdo
**Quando** ocorre duplo acionamento ou falha de rede
**Então** o sistema retorna o mesmo Anexo sem duplicar arquivo, Cota, associação ou auditoria
**E** a chave reutilizada com conteúdo diferente é rejeitada.

**Dado** que a Cota não comporta o novo arquivo
**Quando** o upload é iniciado ou finalizado
**Então** somente esse novo upload é bloqueado ou descartado de forma segura
**E** os dados estruturados e Anexos já existentes continuam disponíveis conforme autorização.

**Dado** que o upload é abandonado ou falha antes da confirmação
**Quando** a reserva expira
**Então** armazenamento temporário e reserva de Cota são liberados de modo idempotente
**E** nenhum Anexo disponível ou associação parcial permanece.

**Dado** que upload, aprovação ou rejeição é concluído
**Quando** o novo estado é persistido
**Então** metadados, referência privada, Cota, Evento de Auditoria e projeção exportável permanecem coerentes
**E** uma falha impede a confirmação parcial.

**Dado** que o fluxo é utilizado em mobile, desktop, teclado ou tecnologia assistiva
**Quando** seleção, progresso, quarentena, rejeição ou conclusão são apresentados
**Então** foco, rótulos e estados cumprem WCAG 2.2 AA
**E** segurança e privacidade não dependem apenas de cor.

Rastreabilidade: FR-14, FR-37 parcialmente, NFR-1, NFR-3, NFR-5–NFR-9, NFR-11, NFR-12, NFR-14, UX-DR12, UX-DR16–UX-DR18, AD-4–AD-8, AD-11, AD-13–AD-17, AD-22–AD-26.

### Story 3.2: Consultar e baixar originais privados

Como Síndico ou Auxiliar especificamente autorizado,
Quero consultar e baixar os Anexos originais permitidos,
Para que eu confira documentos do Condomínio sem ampliar sua audiência ou expor seu conteúdo.

**Critérios de Aceitação:**

**Dado** que o ator possui capacidade vigente sobre o objeto e acesso específico ao original
**Quando** consulta seus Anexos
**Então** visualiza nome apresentado, tipo, tamanho, estado, autoria, data e classificação privada
**E** não recebe chave interna de armazenamento ou endereço permanente do arquivo.

**Dado** que o Anexo está `Em quarentena`, `Rejeitado`, `Removido` ou indisponível
**Quando** o ator tenta abri-lo ou baixá-lo
**Então** o servidor nega a entrega
**E** apresenta o estado permitido sem revelar detalhes sensíveis da análise.

**Dado** que o Anexo está `Privado disponível`
**Quando** um ator autorizado solicita o download
**Então** o servidor revalida tenant, Vínculo, capacidade, objeto associado e estado no momento da solicitação
**E** emite acesso privado de finalidade única e curta duração.

**Dado** que o endereço temporário expira, é alterado ou usado fora de seu contexto
**Quando** alguém tenta acessar o arquivo
**Então** o armazenamento nega a entrega
**E** não converte a URL em acesso público ou renovável sem nova autorização.

**Dado** que o ator perdeu Papel, Vínculo ou capacidade após abrir a tela
**Quando** solicita novo acesso ao original
**Então** o servidor nega a operação conforme o estado atual
**E** dados previamente carregados não autorizam nova emissão de URL.

**Dado** que um Conselheiro ou Morador tenta acessar o original financeiro no MVP
**Quando** solicita metadados protegidos, pré-visualização ou download
**Então** o servidor nega por padrão
**E** não revela nome, tipo, hash, existência ou conteúdo do Anexo.

**Dado** que o arquivo pode conter conteúdo ativo
**Quando** é entregue
**Então** utiliza cabeçalhos seguros, tipo validado e disposição compatível com a política aprovada
**E** não é executado no contexto privilegiado da aplicação.

**Dado** que o download ou acesso ao original é solicitado
**Quando** a operação termina
**Então** um Evento de Auditoria minimizado registra ator, objeto, finalidade, instante e resultado
**E** não copia nome excessivo, conteúdo, URL assinada ou Dado Pessoal desnecessário para a auditoria.

**Dado** que o mesmo Anexo aparece em mais de um contexto autorizado
**Quando** seus metadados são consultados
**Então** a interface apresenta os vínculos permitidos ao ator
**E** não infere nem revela associações protegidas.

**Dado** que a entrega falha ou o storage fica indisponível
**Quando** o download é solicitado
**Então** a interface diferencia falta de autorização, expiração e indisponibilidade recuperável
**E** não apresenta falso sucesso nem mantém URL vencida como opção válida.

**Dado** que a lista ou o detalhe é utilizado com teclado, leitor de tela, mobile ou desktop
**Quando** estado, ações e histórico são apresentados
**Então** cumprem WCAG 2.2 AA
**E** original privado e indisponibilidade são comunicados por texto, não apenas por ícone ou cor.

Rastreabilidade: FR-14, FR-20 parcialmente, FR-37 parcialmente, FR-45 parcialmente, NFR-1, NFR-3, NFR-5–NFR-9, NFR-11, NFR-12, UX-DR12, UX-DR16–UX-DR18, AD-4–AD-8, AD-13–AD-16, AD-22, AD-23, AD-25 e AD-26.

### Story 3.3: Preparar um derivado saneado para revisão editorial

Como Síndico ou Auxiliar com capacidade documental,
Quero preparar um derivado saneado de um Anexo privado,
Para que uma versão sem Dados Pessoais indevidos possa ser posteriormente avaliada para publicação.

**Critérios de Aceitação:**

**Dado** que o ator possui acesso vigente ao Anexo original privado
**Quando** inicia a preparação de um derivado
**Então** a interface identifica o original, sua finalidade e os riscos de Dados Pessoais
**E** esclarece que o derivado ainda não possui audiência e não está publicado.

**Dado** que o saneamento exige intervenção humana
**Quando** o ator prepara o conteúdo fora ou dentro das ferramentas permitidas
**Então** pode enviar um novo arquivo derivado para revisão
**E** o Burgoweb não afirma que anonimização, ocultação ou conformidade jurídica foi automaticamente garantida.

**Dado** que o arquivo derivado é enviado
**Quando** passa pelas mesmas validações de tamanho, tipo, hash, allowlist e quarentena
**Então** permanece indisponível até a aprovação do scanner ou sanitizador
**E** falha ou resultado inconclusivo mantém o arquivo bloqueado.

**Dado** que o derivado é aprovado tecnicamente
**Quando** o processamento termina
**Então** ele se torna um objeto imutável distinto do original, com hash e identificador próprios
**E** preserva relação rastreável com o original sem substituir ou modificar seu binário.

**Dado** que o ator conclui a revisão humana
**Quando** declara campos revisados, finalidade e possíveis limitações
**Então** o derivado passa ao estado `Candidato revisado`
**E** a declaração registra autoria e instante sem transformar a revisão humana em certificação jurídica.

**Dado** que nova correção é necessária
**Quando** outro derivado é preparado
**Então** o sistema cria nova versão candidata e preserva as anteriores
**E** não sobrescreve hash, arquivo ou declaração já registrada.

**Dado** que existe um derivado `Candidato revisado`
**Quando** qualquer Pessoa tenta acessá-lo sem capacidade documental
**Então** o servidor nega o acesso
**E** sua condição de candidato não concede acesso coletivo ou ao Conselheiro.

**Dado** que o derivado está pronto para uso editorial posterior
**Quando** esta história é concluída
**Então** nenhuma audiência, URL pública ou Versão Publicada é vinculada
**E** somente o Épico 4 poderá incorporá-lo como versão efetivamente compartilhável após pré-visualização de audiência e confirmação de publicador autorizado.

**Dado** que o original é alterado — o que exige novo objeto — ou removido conforme política
**Quando** a relação histórica é consultada
**Então** o derivado continua apontando para a identidade e o hash do original que lhe deu origem
**E** não é silenciosamente promovido a derivado de outro arquivo.

**Dado** que o mesmo pedido é reenviado com a mesma chave idempotente
**Quando** ocorre repetição ou falha de rede
**Então** o sistema não duplica candidato, armazenamento, Cota ou auditoria
**E** conteúdo diferente com a mesma chave resulta em conflito.

**Dado** que criação, revisão ou substituição de candidato é confirmada
**Quando** a transação é persistida
**Então** original, derivado, versões, Cota, auditoria e projeção exportável permanecem coerentes
**E** nenhuma falha produz candidato parcialmente autorizado.

**Dado** que o fluxo é utilizado em mobile, desktop, teclado ou tecnologia assistiva
**Quando** original, candidato, revisão, risco ou histórico são apresentados
**Então** foco, rótulos e estados cumprem WCAG 2.2 AA
**E** a diferença entre privado, candidato e publicado não depende apenas de cor.

Rastreabilidade: FR-14, FR-35 parcialmente apenas quanto à separação física e imutabilidade, FR-37 parcialmente, NFR-1–NFR-3, NFR-5–NFR-9, NFR-11, NFR-12, NFR-14, UX-DR11, UX-DR12, UX-DR16–UX-DR21, AD-4–AD-8, AD-11–AD-17, AD-22–AD-26 e gate jurídico/LGPD consolidado pendente.

### Story 3.4: Acompanhar e controlar a Cota de Armazenamento

Como Síndico ou Auxiliar autorizado,
Quero acompanhar o consumo de armazenamento do Condomínio,
Para que eu antecipe limites sem perder acesso aos documentos e funcionalidades já existentes.

**Critérios de Aceitação:**

**Dado** que o Condomínio possui Cota configurada
**Quando** um ator autorizado consulta o armazenamento
**Então** visualiza limite, consumo confirmado, reservas temporárias, espaço disponível e percentual utilizado
**E** a interface informa o instante de atualização e quais tipos de objeto compõem o consumo.

**Dado** que o consumo alcança os limiares configurados de alerta
**Quando** a tela financeira ou documental é acessada
**Então** o sistema apresenta aviso progressivo e acionável
**E** não bloqueia prematuramente upload que ainda caiba no espaço disponível.

**Dado** que o consumo mais a reserva do novo arquivo ultrapassaria a Cota
**Quando** um upload é iniciado
**Então** a reserva é negada atomicamente
**E** uploads concorrentes não conseguem ultrapassar silenciosamente o limite.

**Dado** que a Cota foi atingida
**Quando** o usuário utiliza o Burgoweb
**Então** apenas novos uploads de binários são bloqueados
**E** consulta, download autorizado, exportação, remoção permitida e funcionalidades estruturadas continuam operacionais.

**Dado** que um arquivo é rejeitado, removido fisicamente conforme política ou um upload temporário expira
**Quando** o consumo é recalculado
**Então** somente o espaço efetivamente liberado deixa de compor a Cota
**E** tombstones, hashes e metadados históricos não são tratados como binários ainda armazenados.

**Dado** que original e derivado saneado são arquivos distintos
**Quando** o consumo é apresentado
**Então** ambos são contabilizados conforme o espaço efetivamente ocupado
**E** a interface permite decompor o consumo sem expor conteúdo ou nomes a atores não autorizados.

**Dado** que uma configuração de Cota é alterada por operação administrativa autorizada
**Quando** a mudança é confirmada
**Então** nova vigência, valor anterior, novo valor, autoria e motivo são auditados
**E** a redução abaixo do consumo atual não elimina arquivos e apenas impede novos uploads.

**Dado** que o Síndico tenta ampliar a Cota por rota não autorizada
**Quando** não existe oferta ou capacidade administrativa correspondente no MVP
**Então** o servidor nega a alteração
**E** não promete compra de espaço, armazenamento próprio ou expurgo assistido, que permanecem futuros.

**Dado** que o serviço de medição fica temporariamente indisponível
**Quando** a interface apresenta o consumo
**Então** informa indisponibilidade ou dado desatualizado com seu instante de referência
**E** o servidor mantém a decisão de upload fail-closed quando não puder reservar espaço com segurança.

**Dado** que configuração, reserva ou liberação modifica o estado da Cota
**Quando** a transação é concluída
**Então** consumo, reserva, metadados, auditoria e alertas permanecem coerentes
**E** operações repetidas não debitam nem liberam o mesmo espaço duas vezes.

**Dado** que a visão é usada em mobile, desktop, teclado ou tecnologia assistiva
**Quando** consumo, alertas, bloqueio ou decomposição são apresentados
**Então** cumprem WCAG 2.2 AA
**E** a proximidade do limite não depende apenas de barra gráfica ou cor.

Rastreabilidade: FR-37, NFR-1, NFR-5–NFR-9, NFR-11, NFR-12, NFR-14, UX-DR12, UX-DR16–UX-DR18, AD-4–AD-8, AD-11, AD-13–AD-17, AD-23–AD-26 e gate de capacidade.

### Story 3.5: Remover Anexos respeitando retenção e histórico

Como Síndico ou Auxiliar com capacidade documental específica,
Quero solicitar a remoção de um Anexo desnecessário ou indevido,
Para que o Condomínio reduza exposição e consumo sem destruir evidências que devam ser preservadas.

**Critérios de Aceitação:**

**Dado** que o ator possui capacidade vigente para remover o Anexo
**Quando** inicia a solicitação
**Então** a interface apresenta objeto associado, estado, consumo, relações históricas e consequências conhecidas
**E** exige motivo e confirmação explícita.

**Dado** que o Anexo está sujeito a retenção, preservação por incidente, disputa, obrigação legal ou vínculo histórico impeditivo
**Quando** a remoção física é solicitada
**Então** o sistema bloqueia o expurgo do binário
**E** informa o impedimento permitido sem inventar prazo ou fundamento jurídico ainda não aprovado.

**Dado** que os prazos e bases exatos de retenção ainda dependem do parecer jurídico consolidado
**Quando** não existe política aprovada aplicável ao Anexo
**Então** o sistema adota preservação conservadora do binário e permite restringir seu acesso quando cabível
**E** não presume prazo, base legal ou autorização de eliminação.

**Dado** que o Anexo está em quarentena, rejeitado ou privado e não possui impedimento de retenção
**Quando** a remoção é confirmada conforme política aprovada
**Então** seu acesso é revogado e o binário é programado para expurgo seguro
**E** o sistema não o torna temporariamente público nem o entrega ao solicitante como etapa da remoção.

**Dado** que o Anexo ou derivado está referenciado por snapshot imutável ou Publicação
**Quando** alguém solicita remoção simples
**Então** o sistema impede que a operação quebre a integridade histórica
**E** orienta o fluxo de suspensão editorial do Épico 4 quando houver risco de exposição publicada.

**Dado** que o expurgo físico é permitido e concluído
**Quando** o ciclo de remoção termina
**Então** permanece um tombstone com identificador, hash, tamanho, relação, responsável, motivo, instantes e resultado
**E** conteúdo, URL, chave de storage e Dados Pessoais desnecessários deixam de estar disponíveis.

**Dado** que o expurgo falha ou o storage fica indisponível
**Quando** o worker processa a solicitação
**Então** o Anexo permanece inacessível aos usuários e a remoção assume estado de falha recuperável
**E** novas tentativas são idempotentes, com backoff e dead-letter observável.

**Dado** que o binário é efetivamente eliminado
**Quando** a Cota é atualizada
**Então** seu espaço é liberado exatamente uma vez
**E** metadados e tombstone necessários à integridade não são confundidos com conteúdo ainda armazenado.

**Dado** que o mesmo pedido de remoção é reenviado
**Quando** utiliza a mesma chave idempotente e conteúdo
**Então** retorna o estado corrente da mesma solicitação
**E** não duplica expurgo, liberação de Cota ou Evento de Auditoria.

**Dado** que dois atores removem, consultam ou preparam derivado concorrentemente
**Quando** uma operação já alterou a versão ou o estado do Anexo
**Então** a operação incompatível recebe conflito `409` ou indisponibilidade segura
**E** nenhuma ação restaura acesso ou cria derivado a partir de binário removido.

**Dado** que restrição, bloqueio, expurgo ou falha é persistido
**Quando** a transação e o processamento terminam
**Então** estado, tombstone, Cota, Eventos de Auditoria e projeção exportável permanecem coerentes
**E** a auditoria não contém o arquivo nem conteúdo sensível excessivo.

**Dado** que o fluxo é usado em mobile, desktop, teclado ou tecnologia assistiva
**Quando** retenção, impedimento, confirmação, processamento ou falha são apresentados
**Então** foco, linguagem e estados cumprem WCAG 2.2 AA
**E** remoção lógica, expurgo físico e preservação histórica são distinguíveis sem depender apenas de cor.

Rastreabilidade: FR-14 parcialmente, FR-35 parcialmente quanto à integridade dos objetos, FR-37, FR-45 parcialmente, NFR-1, NFR-3, NFR-5–NFR-9, NFR-11, NFR-12, NFR-14, UX-DR12, UX-DR16–UX-DR18, AD-4–AD-8, AD-11–AD-17, AD-23–AD-26 e gates jurídico, de retenção e de ciclo de vida de Anexos.

## Épico 4: Prestar contas e fiscalizar com transparência segura

Moradores compreendem informações coletivas e sua situação financeira autorizada; Conselheiros fiscalizam sem acessar dados individuais indevidos; a gestão publica, corrige ou suspende versões imutáveis com audiência explícita.

### Story 4.1: Ativar a transparência coletiva do Condomínio

Como Síndico,
Quero que a transparência coletiva seja ativada quando houver Moradores,
Para que o Condomínio possa trabalhar internamente no início sem permitir que a prestação de contas seja posteriormente desativada de forma unilateral.

**Critérios de Aceitação:**

**Dado** que o Condomínio ainda não possui Vínculo de Morador ativo
**Quando** a gestão utiliza os módulos internos
**Então** pode registrar finanças, Anexos e rascunhos sem audiência coletiva
**E** a ausência de Moradores não transforma conteúdo interno em Publicação.

**Dado** que o primeiro Vínculo de Morador é ativado
**Quando** a transação é confirmada
**Então** a transparência coletiva do Condomínio passa ao estado `Ativa`
**E** a mudança é registrada com autoria, instante e Vínculo que satisfez a condição.

**Dado** que a transparência coletiva está ativa
**Quando** o último Morador encerra seu Vínculo
**Então** o estado institucional não retorna automaticamente a desativado
**E** Publicações e histórico permanecem preservados conforme retenção e autorização.

**Dado** que o Síndico ou Auxiliar tenta desativar globalmente a transparência após sua ativação
**Quando** solicita a operação pela interface ou API
**Então** o servidor nega a alteração
**E** orienta que somente Publicações específicas podem ser suspensas com motivo.

**Dado** que uma audiência coletiva de Moradores é utilizada
**Quando** sua composição é resolvida
**Então** inclui todos os Vínculos de Morador ativos alcançados pela regra
**E** não permite exclusão individual silenciosa.

**Dado** que uma nova Pessoa se torna Morador ativo
**Quando** consulta o histórico coletivo permitido
**Então** recebe acesso às Publicações coletivas vigentes conforme Papel, período e retenção
**E** não recebe rascunhos, conteúdo suspenso ou dados privados anteriores de outra Pessoa.

**Dado** que um Morador encerra o Vínculo
**Quando** tenta acessar conteúdo coletivo posterior ao encerramento
**Então** o servidor nega o acesso
**E** o histórico institucional preserva que a Pessoa integrou audiências anteriores sem manter acesso ordinário.

**Dado** que a interface utiliza a palavra “público”
**Quando** apresenta natureza, audiência ou estado editorial
**Então** esclarece que o conteúdo é coletivo dentro do Condomínio autorizado
**E** não sugere exposição irrestrita na internet.

**Dado** que natureza do conteúdo, audiência e estado editorial são persistidos
**Quando** o sistema cria ou consulta uma regra de transparência
**Então** essas dimensões permanecem separadas
**E** nenhum booleano genérico substitui as regras de autorização.

**Dado** que dois eventos concorrentes ativam a transparência
**Quando** o primeiro altera o estado
**Então** o segundo não duplica ativação ou auditoria
**E** o estado final permanece `Ativa`.

**Dado** que a ativação é concluída
**Quando** a transação é persistida
**Então** Vínculo, estado institucional, Evento de Auditoria e projeção exportável permanecem coerentes
**E** falha em qualquer parte impede uma ativação parcial.

**Dado** que o estado é consultado em mobile, desktop, teclado ou tecnologia assistiva
**Quando** ativação, alcance ou restrição são apresentados
**Então** cumprem WCAG 2.2 AA
**E** o estado coletivo não depende apenas de cor.

Rastreabilidade: FR-15, FR-22 parcialmente, NFR-1, NFR-6–NFR-9, NFR-11, NFR-12, UX-DR1–UX-DR3, UX-DR16–UX-DR18, UX-DR21–UX-DR23, AD-4–AD-8, AD-11, AD-14–AD-16, AD-23–AD-26.

### Story 4.2: Preparar e classificar conteúdo para Publicação

Como Síndico ou Auxiliar com capacidade editorial,
Quero preparar conteúdo institucional com natureza e audiência compatíveis,
Para que comunicados e prestações de contas não sejam enviados ao público errado.

**Critérios de Aceitação:**

**Dado** que o ator possui capacidade editorial vigente
**Quando** cria um rascunho
**Então** informa título, natureza, finalidade, período aplicável e fonte dos dados
**E** o rascunho permanece interno, sem audiência efetiva ou notificação.

**Dado** que a natureza escolhida é `Comunicado geral`
**Quando** a audiência é definida
**Então** o sistema exige a audiência coletiva geral do Condomínio
**E** não permite excluir silenciosamente um Morador ativo.

**Dado** que a natureza escolhida é `Comunicado de cobrança`
**Quando** as Unidades abrangidas são selecionadas
**Então** a audiência fica restrita aos Responsáveis Financeiros vigentes dessas Unidades
**E** Moradores sem essa responsabilidade, Conselheiros e audiência coletiva não podem ser incluídos.

**Dado** que a natureza escolhida é `Comunicado privado`
**Quando** a audiência é configurada
**Então** somente relações e Pessoas explicitamente permitidas pela finalidade podem ser selecionadas
**E** o sistema não converte o comunicado em geral por conveniência operacional.

**Dado** que a natureza é prestação de contas coletiva
**Quando** o rascunho utiliza um Fechamento financeiro
**Então** referencia exatamente um snapshot `Fechado`, imutável e versionado
**E** não utiliza dados recalculados ou período ainda aberto como se fossem fechamento aprovado.

**Dado** que o conteúdo inclui inadimplência coletiva
**Quando** o rascunho é montado
**Então** apresenta somente valores agregados e reconciliáveis
**E** não inclui nome, Unidade, contato ou outro identificador individual.

**Dado** que o conteúdo inclui informações trabalhistas
**Quando** é destinado a Moradores ou Conselheiros
**Então** aplica agregação, reagrupamento ou supressão conforme política aprovada
**E** bloqueia campos com risco de reidentificação não resolvido.

**Dado** que a política de risco de reidentificação ou a base jurídica aplicável ainda não foi aprovada
**Quando** o conteúdo depende dessa definição
**Então** o sistema impede sua preparação como publicável
**E** não inventa limiar, base legal ou garantia de anonimização.

**Dado** que o ator seleciona campos financeiros
**Quando** o rascunho é preparado
**Então** a interface distingue realizado, previsto, saldo, Obrigações, inadimplência e Fechamento
**E** utiliza linguagem compreensível para usuários sem formação contábil.

**Dado** que um derivado saneado do Épico 3 é escolhido
**Quando** é incorporado ao rascunho
**Então** o sistema referencia exatamente o candidato imutável selecionado
**E** o Anexo original privado permanece separado e não é incluído implicitamente.

**Dado** que um Anexo original privado é selecionado diretamente para audiência coletiva
**Quando** o ator tenta concluir o rascunho
**Então** o sistema bloqueia a operação
**E** exige um derivado saneado tecnicamente disponível e humanamente revisado.

**Dado** que uma Pendência, Comentário ou Decisão Operacional é usado como fonte
**Quando** o rascunho é salvo
**Então** apenas o conteúdo explicitamente copiado e revisado integra o rascunho
**E** o objeto interno não muda de estado nem se torna publicado.

**Dado** que um rascunho é corrigido antes da publicação
**Quando** o ator salva a alteração
**Então** uma nova versão interna é preservada com autoria e instante
**E** nenhuma audiência é notificada.

**Dado** que dois atores alteram o mesmo rascunho simultaneamente
**Quando** a versão persistida já mudou
**Então** a segunda gravação recebe conflito `409`
**E** o conteúdo mais recente é apresentado para nova revisão.

**Dado** que criação ou alteração é concluída
**Quando** a transação é persistida
**Então** rascunho, fontes, classificação, versões, auditoria e projeção exportável permanecem coerentes
**E** nenhuma operação parcial produz conteúdo publicável.

**Dado** que o fluxo é utilizado em mobile, desktop, teclado ou tecnologia assistiva
**Quando** natureza, audiência pretendida, campos, fontes e alertas são apresentados
**Então** cumprem WCAG 2.2 AA
**E** coletivo, privado e cobrança não dependem apenas de cor.

Rastreabilidade: FR-13 parcialmente, FR-17, FR-18, FR-27 parcialmente, FR-34 parcialmente, FR-35 parcialmente, NFR-1–NFR-3, NFR-6–NFR-9, NFR-11–NFR-14, UX-DR1, UX-DR2, UX-DR10–UX-DR12, UX-DR16–UX-DR22, AD-4–AD-8, AD-11–AD-16, AD-23–AD-26 e gate jurídico/LGPD consolidado pendente.

### Story 4.3: Pré-visualizar e publicar uma versão imutável

Como Síndico ou Auxiliar com capacidade delegada de publicação,
Quero revisar exatamente o que cada audiência verá e confirmar a Publicação,
Para que somente a versão, os campos e os Anexos autorizados sejam compartilhados.

**Critérios de Aceitação:**

**Dado** que o rascunho possui classificação válida
**Quando** um publicador autorizado abre a pré-visualização
**Então** visualiza versão, natureza, audiência efetiva, campos, período, valores e Anexos
**E** a pré-visualização reproduz fielmente o conteúdo que cada Papel ou relação verá.

**Dado** que a audiência é baseada em Papel ou relação
**Quando** a pré-visualização é gerada
**Então** apresenta a regra de audiência e a composição resolvida naquele instante
**E** permite identificar inclusões indevidas sem expor dados além da capacidade do publicador.

**Dado** que a audiência coletiva obrigatória omite Morador ativo
**Quando** a pré-visualização é validada
**Então** o sistema bloqueia a publicação
**E** informa que a audiência coletiva não admite exclusão individual silenciosa.

**Dado** que conteúdo privado obrigatório inclui audiência coletiva ou Pessoa incompatível
**Quando** o sistema valida a Publicação
**Então** bloqueia a confirmação
**E** identifica a incompatibilidade entre natureza e audiência.

**Dado** que um Comunicado de cobrança inclui Pessoa que não é Responsável Financeiro vigente de Unidade abrangida
**Quando** a audiência é revalidada
**Então** a publicação é impedida
**E** nenhuma informação de cobrança é enviada ou exibida ao destinatário indevido.

**Dado** que a pré-visualização contém possível Dado Pessoal, risco de reidentificação ou campo não aprovado
**Quando** o publicador revisa o conteúdo
**Então** recebe alerta específico e deve remover ou justificar conforme política aprovada
**E** alertas bloqueantes não podem ser ignorados por simples confirmação.

**Dado** que um derivado candidato é incluído
**Quando** a publicação é confirmada
**Então** o sistema cria uma versão compartilhável imutável, autorizada independentemente do original
**E** vincula essa versão exclusivamente à audiência e à Versão Publicada confirmadas.

**Dado** que existe apenas o Anexo original privado
**Quando** a publicação é confirmada
**Então** o original não é compartilhado nem recebe nova permissão
**E** a ausência de derivado não impede publicar os fatos econômicos sem Anexo.

**Dado** que o ator é Morador, Conselheiro ou Auxiliar sem capacidade de publicação
**Quando** tenta confirmar pela interface ou API
**Então** o servidor nega por padrão
**E** não cria versão, audiência, notificação ou URL de acesso.

**Dado** que o publicador confirma explicitamente a pré-visualização válida
**Quando** o servidor revalida capacidade, tenant, fontes, versão, audiência, campos e Anexos
**Então** cria uma Versão Publicada imutável no estado `Publicado`
**E** o rascunho, fontes e originais permanecem objetos distintos.

**Dado** que uma fonte ou audiência mudou depois da pré-visualização
**Quando** a confirmação utiliza versão desatualizada
**Então** recebe conflito `409` e a publicação não ocorre
**E** uma nova pré-visualização é exigida.

**Dado** que a mesma confirmação é reenviada com a mesma chave idempotente
**Quando** ocorre duplo acionamento ou falha de rede
**Então** o sistema retorna a mesma Versão Publicada
**E** não duplica versão, audiência, Anexo compartilhável, notificação ou auditoria.

**Dado** que a Publicação é coletiva
**Quando** novos Moradores ativos consultam o histórico permitido
**Então** a regra coletiva autoriza acesso conforme Papel e retenção
**E** a lista de destinatários resolvida na publicação permanece preservada para auditoria de notificações.

**Dado** que a publicação é concluída
**Quando** a transação é confirmada
**Então** versão, snapshot, audiência, Anexos compartilháveis, auditoria, outbox e projeção exportável permanecem coerentes
**E** falha em qualquer parte impede publicação parcial.

**Dado** que notificações são processadas
**Quando** um destinatário recebe a mensagem
**Então** o conteúdo enviado é minimizado e conduz à versão autenticada
**E** não expõe valores privados, inadimplência ou URL permanente no canal externo.

**Dado** que o fluxo é utilizado em mobile, desktop, teclado ou tecnologia assistiva
**Quando** pré-visualização, alerta, confirmação, conflito ou sucesso são apresentados
**Então** cumprem WCAG 2.2 AA
**E** audiência, versão e estado editorial não dependem apenas de cor.

Rastreabilidade: FR-27, FR-34, FR-35, NFR-1–NFR-3, NFR-6–NFR-9, NFR-11, NFR-12, NFR-14, UX-DR1, UX-DR11, UX-DR12, UX-DR16–UX-DR22, AD-4–AD-8, AD-11–AD-17, AD-22–AD-26.

### Story 4.4: Consultar a transparência financeira como Morador

Como Morador ativo,
Quero consultar prestações de contas e informações coletivas publicadas,
Para que eu compreenda a situação do Condomínio sem acessar dados privados de outras Pessoas ou Unidades.

**Critérios de Aceitação:**

**Dado** que a Pessoa possui Vínculo de Morador ativo
**Quando** acessa a área de transparência
**Então** visualiza as Publicações coletivas vigentes autorizadas
**E** não visualiza rascunhos, versões substituídas restritas ou conteúdo suspenso.

**Dado** que uma prestação de contas publicada é aberta
**Quando** os dados financeiros são apresentados
**Então** distingue saldo, receitas e despesas realizadas, previsões, período e estado do Fechamento
**E** utiliza linguagem compreensível e permite decomposição apenas até o nível coletivo autorizado.

**Dado** que a prestação contém inadimplência
**Quando** o Morador consulta os valores
**Então** visualiza somente total e indicadores agregados aprovados
**E** não recebe nome, Unidade, documento, contato ou valor individual de terceiros.

**Dado** que os totais agregados de inadimplência são apresentados
**Quando** a gestão ou auditor autorizado verifica sua origem
**Então** permanecem reconciliáveis com os saldos detalhados protegidos
**E** o Morador não obtém acesso aos registros individuais usados na reconciliação.

**Dado** que a prestação contém gastos trabalhistas
**Quando** é exibida ao Morador
**Então** mostra somente categorias agregadas aprovadas
**E** suprime ou reagrupa valores que possam permitir reidentificação.

**Dado** que uma Publicação possui versão compartilhável de Anexo
**Quando** o Morador solicita acesso
**Então** o servidor revalida Vínculo, audiência, versão e estado da Publicação
**E** entrega somente o derivado autorizado por URL privada e temporária.

**Dado** que existe Anexo original privado sem versão compartilhável
**Quando** o Morador consulta a Publicação
**Então** o original não aparece como acessível
**E** a ausência do documento não invalida os fatos econômicos publicados.

**Dado** que uma versão foi substituída
**Quando** o Morador consulta o histórico permitido
**Então** identifica versão vigente, data da correção e existência da anterior
**E** o conteúdo anterior somente é exibido se Papel e retenção permitirem.

**Dado** que uma Publicação está suspensa
**Quando** aparece no histórico
**Então** a interface mostra apenas categoria, estado, data e informação pública segura sobre tratamento
**E** não reproduz o conteúdo potencialmente indevido.

**Dado** que o Vínculo do Morador foi encerrado
**Quando** tenta acessar conteúdo posterior ao encerramento
**Então** o servidor nega o acesso
**E** não revela conteúdo coletivo, dados do novo ocupante ou existência de publicação protegida.

**Dado** que nenhum conteúdo coletivo foi publicado
**Quando** o Morador acessa a área
**Então** visualiza estado vazio explicativo
**E** não recebe dados internos como substituto improvisado.

**Dado** que a consulta falha ou fica indisponível
**Quando** a interface apresenta o estado
**Então** diferencia ausência de conteúdo, falta de autorização e falha recuperável
**E** não mantém valores antigos como se fossem atuais.

**Dado** que a área é usada em mobile, desktop, teclado ou tecnologia assistiva
**Quando** lista, valores, histórico e Anexos são apresentados
**Então** cumprem WCAG 2.2 AA
**E** receitas, despesas, previsto, realizado e suspensão não dependem apenas de cor.

Rastreabilidade: FR-15–FR-18, FR-27 parcialmente, FR-35 parcialmente, NFR-1–NFR-3, NFR-6–NFR-9, NFR-11–NFR-13, UX-DR1–UX-DR3, UX-DR10–UX-DR13, UX-DR16–UX-DR23, AD-4–AD-8, AD-12–AD-16, AD-22, AD-23, AD-25 e AD-26.

### Story 4.5: Consultar a situação privada da própria Unidade

Como Responsável Financeiro,
Quero consultar Obrigações e comunicações privadas das Unidades sob minha responsabilidade,
Para que eu acompanhe minha situação sem acessar dados de outra Unidade.

**Critérios de Aceitação:**

**Dado** que a Pessoa é Responsável Financeiro vigente de uma Unidade
**Quando** acessa sua área financeira privada
**Então** visualiza Obrigações, valores, vencimentos, realizações, estornos e saldo dessa Unidade
**E** não recebe dados de Unidades sem relação vigente autorizada.

**Dado** que a Pessoa responde por mais de uma Unidade
**Quando** consulta a situação financeira
**Então** pode selecionar cada Unidade e visualizar seus totais separadamente
**E** o consolidado pessoal permanece decomponível por Unidade.

**Dado** que a Obrigação está em aberto, parcial, quitada, vencida ou cancelada
**Quando** é apresentada
**Então** mostra valor original, total realizado, saldo, datas e estado em linguagem clara
**E** não cria juros, multa ou responsabilidade jurídica por inferência da interface.

**Dado** que existe Comunicado de cobrança publicado para a Unidade
**Quando** a audiência é revalidada
**Então** somente Responsáveis Financeiros vigentes das Unidades abrangidas podem acessá-lo
**E** o conteúdo não aparece na transparência coletiva ou na visão do Conselheiro.

**Dado** que outro Morador da mesma Unidade não é Responsável Financeiro
**Quando** tenta acessar inadimplência detalhada ou cobrança
**Então** o servidor nega o acesso
**E** não revela valor, vencimento, estado ou existência da comunicação privada.

**Dado** que a Pessoa tenta alterar o identificador da Unidade na rota ou requisição
**Quando** solicita dados financeiros
**Então** o servidor revalida a relação Pessoa–Unidade
**E** nega sem revelar dados ou existência da Unidade protegida.

**Dado** que um pagamento ou estorno é registrado
**Quando** a situação é consultada novamente
**Então** os valores refletem os Movimentos válidos
**E** a visualização não afirma conciliação bancária ou quitação documental inexistente.

**Dado** que o Vínculo ou a responsabilidade financeira é encerrado
**Quando** a Pessoa solicita acesso ordinário posteriormente
**Então** o acesso vigente é retirado
**E** o histórico financeiro, a Obrigação e os snapshots anteriores permanecem preservados.

**Dado** que existe dívida pendente após a saída
**Quando** se avalia eventual acesso pós-saída ou continuidade de cobrança
**Então** o sistema não mantém acesso coletivo ou amplo automaticamente
**E** qualquer experiência separada e mínima permanece condicionada ao parecer jurídico consolidado.

**Dado** que uma nova Pessoa assume Vínculo com a Unidade
**Quando** consulta sua área financeira
**Então** Obrigações anteriores não lhe são automaticamente atribuídas
**E** ela não recebe comunicações ou documentos privados do ocupante anterior.

**Dado** que a consulta de inadimplência detalhada é realizada
**Quando** o servidor entrega o resultado
**Então** registra leitura sensível em Evento de Auditoria minimizado
**E** não copia o conteúdo financeiro detalhado para logs técnicos.

**Dado** que nenhum dado privado está disponível
**Quando** a Pessoa acessa a área
**Então** a interface apresenta estado vazio sem sugerir dívida ou quitação inexistente
**E** não oferece dados coletivos ou de terceiros como substituição.

**Dado** que a área é usada em mobile, desktop, teclado ou tecnologia assistiva
**Quando** Unidades, valores, cobranças e estados são apresentados
**Então** cumprem WCAG 2.2 AA
**E** privacidade, vencimento e pagamento não dependem apenas de cor.

Rastreabilidade: FR-16, FR-18, FR-19, FR-27 parcialmente, FR-35 parcialmente, FR-39 parcialmente, FR-42 parcialmente, NFR-1–NFR-9, NFR-11–NFR-13, UX-DR1–UX-DR3, UX-DR9, UX-DR10, UX-DR16–UX-DR18, UX-DR22, UX-DR23, AD-4–AD-8, AD-12–AD-16, AD-23–AD-26 e gate jurídico consolidado pendente.

### Story 4.6: Fiscalizar as finanças como Conselheiro

Como Conselheiro,
Quero consultar caixa, fluxo, receitas, despesas e previsões autorizadas,
Para que eu fiscalize a gestão sem acessar cadastros ou informações individuais indevidas.

**Critérios de Aceitação:**

**Dado** que a Pessoa possui Papel de Conselheiro vigente
**Quando** acessa a visão de fiscalização
**Então** visualiza caixa, Movimentos financeiros permitidos, receitas, despesas, previsões e Fechamentos
**E** não recebe ações de criação, correção, cancelamento, fechamento ou publicação.

**Dado** que os valores são apresentados
**Quando** o Conselheiro navega do total ao detalhe
**Então** a decomposição termina no nível financeiro permitido
**E** não revela cadastro de Pessoa, Responsável Financeiro, inadimplência individual ou relação privada.

**Dado** que existe inadimplência
**Quando** a visão de fiscalização é calculada
**Então** apresenta somente valores agregados e reconciliáveis
**E** não permite filtrar ou inferir por nome, Unidade, contato ou pequeno agrupamento proibido.

**Dado** que os dados incluem despesas trabalhistas
**Quando** são exibidos
**Então** utilizam categorias agregadas, supressão ou reagrupamento conforme política aprovada
**E** não apresentam remuneração, evento ou documento individual.

**Dado** que o agrupamento ainda permitiria reidentificação
**Quando** a política de risco é aplicada
**Então** o sistema amplia o agrupamento ou suprime o detalhe
**E** não entrega o dado apenas porque o Conselheiro possui função fiscalizadora.

**Dado** que um registro financeiro possui Anexo original privado
**Quando** o Conselheiro consulta o detalhe permitido
**Então** o original, seus metadados protegidos e sua URL não são disponibilizados
**E** somente versão compartilhável vinculada a Publicação autorizada pode ser acessada.

**Dado** que existem previsões e valores realizados
**Quando** a visão é apresentada
**Então** eles permanecem separados com período, premissas e instante de cálculo
**E** previsão não é apresentada como saldo confirmado.

**Dado** que existe snapshot fechado
**Quando** o Conselheiro consulta o período
**Então** consegue identificar a versão fechada e compará-la com visões atuais permitidas
**E** a consulta não reescreve o snapshot.

**Dado** que o Papel de Conselheiro foi encerrado
**Quando** a Pessoa tenta consultar nova informação
**Então** o servidor nega conforme o estado vigente
**E** cache ou rota anteriormente aberta não mantém acesso.

**Dado** que o Conselheiro manipula filtros ou identificadores
**Quando** tenta alcançar dados individuais
**Então** o servidor aplica autorização e agregação antes de consultar ou retornar os dados
**E** respostas não revelam a existência do objeto protegido.

**Dado** que a consulta de fiscalização é realizada
**Quando** dados sensíveis agregados ou snapshots são entregues
**Então** a operação relevante é auditada de forma minimizada
**E** logs técnicos não copiam relatórios ou conteúdo financeiro excessivo.

**Dado** que a visão é utilizada em mobile, desktop, teclado ou tecnologia assistiva
**Quando** totais, filtros, decomposição e restrições são apresentados
**Então** cumprem WCAG 2.2 AA
**E** realizado, previsto, agregado e indisponível não dependem apenas de cor.

Rastreabilidade: FR-17, FR-18, FR-20, FR-27 parcialmente, NFR-1–NFR-3, NFR-6–NFR-9, NFR-11–NFR-13, UX-DR1–UX-DR3, UX-DR10–UX-DR12, UX-DR16–UX-DR21, AD-4–AD-8, AD-12–AD-16, AD-23–AD-26 e gate jurídico/LGPD aplicável ao risco de reidentificação.

### Story 4.7: Corrigir e substituir conteúdo publicado

Como Síndico ou Auxiliar com capacidade de publicação,
Quero corrigir uma Publicação criando nova versão,
Para que informações atualizadas sejam disponibilizadas sem apagar o que foi anteriormente comunicado.

**Critérios de Aceitação:**

**Dado** que existe Versão Publicada vigente
**Quando** um publicador autorizado inicia uma correção
**Então** o sistema cria novo rascunho baseado na versão selecionada
**E** a versão publicada permanece imutável durante a preparação.

**Dado** que o ator altera conteúdo, valor, período, audiência, classificação ou Anexo
**Quando** revisa a correção
**Então** a interface apresenta comparação entre versão vigente e proposta
**E** destaca campos incluídos, retirados ou modificados.

**Dado** que a nova versão altera a audiência
**Quando** a pré-visualização é gerada
**Então** apresenta Pessoas ou regras incluídas e excluídas
**E** revalida compatibilidade entre natureza e audiência.

**Dado** que uma correção de Comunicado geral tenta excluir Morador ativo
**Quando** a nova audiência é validada
**Então** o sistema bloqueia a publicação
**E** mantém a regra coletiva obrigatória.

**Dado** que uma correção de cobrança tenta incluir audiência coletiva ou Responsável Financeiro incompatível
**Quando** é validada
**Então** o servidor rejeita a alteração
**E** nenhum destinatário indevido recebe acesso ou notificação.

**Dado** que um Anexo é alterado
**Quando** a nova versão é preparada
**Então** referencia uma versão compartilhável imutável específica
**E** não altera nem reaproveita silenciosamente a autorização do Anexo anterior.

**Dado** que o publicador confirma a nova pré-visualização válida
**Quando** o servidor revalida estado, fontes, audiência, campos e Anexos
**Então** cria nova Versão Publicada e marca a anterior como `Substituída`
**E** preserva cadeia de versões, responsável, motivo e instantes.

**Dado** que a correção altera valor, período, audiência ou Anexo
**Quando** a nova versão é publicada
**Então** a audiência afetada recebe notificação material
**E** a mensagem identifica que houve correção sem expor conteúdo privado no canal externo.

**Dado** que a alteração é apenas textual e não material
**Quando** a publicação é confirmada
**Então** o sistema registra a nova versão e o motivo
**E** aplica a política de notificação explicitamente apresentada ao publicador.

**Dado** que um destinatário consulta a versão substituída
**Quando** seu Papel e retenção permitem acesso histórico
**Então** visualiza que ela não é a versão vigente e qual versão a substituiu
**E** não confunde conteúdo histórico com informação atual.

**Dado** que a correção reduz a audiência
**Quando** a nova versão entra em vigor
**Então** Pessoas removidas deixam de acessar a versão nova
**E** o acesso à versão anterior segue sua autorização histórica e eventual suspensão, sem ampliar direitos.

**Dado** que fonte ou audiência muda depois da pré-visualização
**Quando** o ator confirma versão desatualizada
**Então** recebe conflito `409`
**E** nenhuma nova versão ou notificação é criada.

**Dado** que a mesma confirmação é repetida com a mesma chave idempotente
**Quando** ocorre falha de rede
**Então** retorna a mesma nova Versão Publicada
**E** não duplica substituição, notificação, Anexo ou auditoria.

**Dado** que a correção é concluída
**Quando** a transação é persistida
**Então** versões, estados, audiências, Anexos, auditoria, outbox e projeção exportável permanecem coerentes
**E** uma falha impede substituição parcial.

**Dado** que o fluxo é utilizado em mobile, desktop, teclado ou tecnologia assistiva
**Quando** comparação, materialidade, audiência, confirmação ou histórico são apresentados
**Então** cumprem WCAG 2.2 AA
**E** vigente, substituída e modificada não dependem apenas de cor.

Rastreabilidade: FR-22 parcialmente, FR-27, FR-34–FR-36, NFR-1–NFR-3, NFR-6–NFR-9, NFR-11, NFR-12, NFR-14, UX-DR1, UX-DR6, UX-DR11–UX-DR13, UX-DR16–UX-DR22, AD-4–AD-8, AD-11–AD-17, AD-22–AD-26.

### Story 4.8: Suspender Publicação e tratar o SLA

Como Síndico, Auxiliar autorizado ou operador do Burgoweb diante de incidente técnico,
Quero suspender uma Publicação específica e acompanhar seu tratamento,
Para que conteúdo potencialmente indevido seja retirado rapidamente sem apagar o histórico ou afetar Publicações seguras.

**Critérios de Aceitação:**

**Dado** que uma Publicação específica apresenta possível exposição indevida
**Quando** um ator autorizado inicia a suspensão
**Então** a interface apresenta versão, audiência, alcance e consequências
**E** exige categoria do incidente, motivo e confirmação explícita.

**Dado** que um operador do Burgoweb atua por incidente técnico
**Quando** suspende a Publicação
**Então** pode retirar somente a versão afetada do acesso
**E** não recebe por isso Papel de Síndico, acesso irrestrito ao Condomínio ou autoridade editorial para corrigir conteúdo.

**Dado** que a suspensão é confirmada
**Quando** o servidor revalida ator, tenant, Publicação, versão e estado
**Então** a Publicação passa ao estado `Suspensa` imediatamente
**E** conteúdo e Anexos deixam de ser entregues à audiência.

**Dado** que uma Publicação é suspensa
**Quando** aparece para sua audiência anterior
**Então** a interface mostra apenas categoria pública segura, estado, prazo e vencimento
**E** não reproduz conteúdo, motivo sensível ou Dado Pessoal potencialmente indevido.

**Dado** que outras Publicações do Condomínio não estão envolvidas
**Quando** uma versão específica é suspensa
**Então** permanecem disponíveis conforme suas próprias autorizações
**E** não ocorre desativação global da transparência coletiva.

**Dado** que a suspensão é criada sem configuração específica anterior
**Quando** o prazo é calculado
**Então** utiliza SLA inicial de 72 horas
**E** registra timezone, instante inicial e vencimento exato.

**Dado** que o Síndico altera a configuração do SLA
**Quando** confirma novo prazo permitido
**Então** a mudança vale apenas para suspensões futuras
**E** valor anterior, novo valor, vigência, motivo e autoria são auditados.

**Dado** que uma suspensão está em tratamento
**Quando** responsável, estado ou justificativa muda
**Então** o histórico preserva cada transição
**E** a audiência recebe apenas notificações seguras previstas pela política.

**Dado** que o vencimento se aproxima ou é ultrapassado
**Quando** o worker processa os marcos do SLA
**Então** responsáveis e canais operacionais recebem alertas idempotentes
**E** a Publicação não é republicada automaticamente.

**Dado** que é necessária prorrogação
**Quando** um ator autorizado informa novo prazo e justificativa
**Então** a extensão é registrada com autoria, instante, prazo anterior e novo vencimento
**E** não apaga nem reinicia silenciosamente o SLA original.

**Dado** que a correção exige nova versão
**Quando** o conteúdo seguro é preparado
**Então** segue novamente pré-visualização de audiência e confirmação editorial
**E** somente a nova Versão Publicada pode substituir a suspensa.

**Dado** que se conclui que a mesma versão pode voltar a ser disponibilizada
**Quando** um publicador autorizado decide restaurá-la
**Então** a restauração exige revisão e confirmação explícita com motivo
**E** nunca decorre apenas do término do SLA ou da resolução automática do incidente.

**Dado** que a versão permanece imprópria
**Quando** o tratamento é encerrado sem republicação
**Então** permanece suspensa no histórico conforme retenção
**E** conteúdo e Anexos continuam restritos.

**Dado** que duas suspensões ou resoluções concorrentes são solicitadas
**Quando** a versão já mudou de estado
**Então** a operação incompatível recebe conflito `409`
**E** nenhum conteúdo é restaurado ou substituído silenciosamente.

**Dado** que a mesma suspensão é reenviada com a mesma chave idempotente
**Quando** ocorre repetição ou falha de rede
**Então** retorna o mesmo caso e vencimento
**E** não duplica estado, alerta, notificação ou auditoria.

**Dado** que suspensão, prorrogação ou resolução é concluída
**Quando** a transação é persistida
**Então** Publicação, caso, SLA, histórico, auditoria, outbox e projeção exportável permanecem coerentes
**E** falha em qualquer parte mantém o estado mais restritivo.

**Dado** que o fluxo é utilizado em mobile, desktop, teclado ou tecnologia assistiva
**Quando** suspensão, prazo, vencimento, prorrogação ou resolução são apresentados
**Então** cumprem WCAG 2.2 AA
**E** urgência, atraso e estado não dependem apenas de cor.

Rastreabilidade: FR-15 parcialmente, FR-22 parcialmente, FR-27–FR-29, FR-33 parcialmente quanto ao operador técnico, FR-34–FR-36 parcialmente, NFR-1–NFR-3, NFR-6–NFR-10A, NFR-11, NFR-12, NFR-14, UX-DR1, UX-DR6, UX-DR11–UX-DR13, UX-DR16–UX-DR22, AD-4–AD-8, AD-11–AD-17, AD-22–AD-26 e gates de incidente, privacidade e ciclo de vida de Publicações.

## Épico 5: Coordenar o trabalho e preservar decisões confiáveis

A gestão acompanha Pendências, responsáveis, prazos, Comentários e Decisões Operacionais, preservando histórico compreensível e auditoria minimizada sem confundir colaboração, decisão, publicação e evidência técnica.

### Story 5.1: Criar e consultar Pendências internas

Como Síndico ou Auxiliar com capacidade específica,
Quero registrar Pendências e atribuir responsáveis,
Para que o trabalho do Condomínio seja organizado sem transformar tarefas internas em comunicação pública.

**Critérios de Aceitação:**

**Dado** que o ator possui capacidade vigente para criar Pendências
**Quando** informa título, descrição, responsável, prioridade e prazo permitido
**Então** o sistema cria a Pendência no Condomínio autorizado e no estado `Aberta`
**E** mantém sua visibilidade interna por padrão.

**Dado** que o responsável selecionado possui Conta e Vínculo compatíveis
**Quando** a Pendência é confirmada
**Então** a atribuição fica vinculada à Pessoa e à vigência correspondente
**E** não concede Papel, capacidade ou acesso adicional além do necessário ao objeto.

**Dado** que o responsável pertence a outro Condomínio, está inativo ou não possui acesso compatível
**Quando** o ator tenta confirmar
**Então** a operação é rejeitada
**E** o servidor não revela dados do tenant protegido.

**Dado** que título, descrição ou campos obrigatórios são inválidos
**Quando** o ator salva o formulário
**Então** nenhuma Pendência parcial é criada
**E** a interface identifica os campos com mensagens acessíveis e acionáveis.

**Dado** que a Pendência possui prazo
**Quando** é apresentada
**Então** o sistema mostra data, timezone do Condomínio e situação temporal
**E** diferencia prazo futuro, vencimento próximo e atraso sem depender apenas de cor.

**Dado** que uma Pendência é salva
**Quando** existem Moradores ou transparência coletiva ativa
**Então** ela continua interna e restrita
**E** nenhuma Publicação, audiência ou notificação coletiva é criada.

**Dado** que a gestão precisa comunicar o assunto a Moradores
**Quando** utiliza a Pendência como fonte
**Então** deve iniciar um rascunho editorial separado no Épico 4
**E** a Pendência não muda de estado nem se torna pública implicitamente.

**Dado** que um Anexo é incluído em contexto de Pendência
**Quando** o upload é processado
**Então** herda visibilidade privada e controles de quarentena e Cota
**E** não se torna derivado compartilhável ou Anexo publicado.

**Dado** que o ator consulta as Pendências
**Quando** aplica filtros por estado, responsável, prazo, prioridade ou texto
**Então** recebe somente objetos permitidos por sua capacidade
**E** totais e lista refletem os mesmos filtros.

**Dado** que não existem Pendências ou nenhuma corresponde aos filtros
**Quando** a consulta termina
**Então** a interface apresenta estado vazio explicativo
**E** não confunde ausência de trabalho com erro ou falta de autorização.

**Dado** que a mesma criação é reenviada com a mesma chave idempotente
**Quando** ocorre duplo acionamento ou falha de rede
**Então** o sistema retorna a Pendência já criada
**E** não duplica atribuição, notificação ou auditoria.

**Dado** que a criação é concluída
**Quando** a transação é persistida
**Então** Pendência, atribuição, histórico, Evento de Auditoria, outbox e projeção exportável permanecem coerentes
**E** falha em qualquer parte impede gravação parcial.

**Dado** que o fluxo é utilizado em mobile, desktop, teclado ou tecnologia assistiva
**Quando** formulário, filtros, prazo, responsável ou estado são apresentados
**Então** cumprem WCAG 2.2 AA
**E** ações indisponíveis são ocultadas na interface e negadas no servidor.

Rastreabilidade: FR-21, FR-22 parcialmente, FR-23 parcialmente, FR-43 parcialmente quanto aos Anexos privados, NFR-1, NFR-6–NFR-9, NFR-11, NFR-12, NFR-14, UX-DR1–UX-DR6, UX-DR16–UX-DR20, AD-4–AD-8, AD-11, AD-13–AD-17, AD-23–AD-26.

### Story 5.2: Conduzir o ciclo de vida das Pendências

Como Síndico, Auxiliar autorizado ou responsável pela Pendência,
Quero atualizar estado, responsável e prazo dentro dos limites permitidos,
Para que o trabalho reflita seu andamento com justificativas e histórico confiáveis.

**Critérios de Aceitação:**

**Dado** que uma Pendência está `Aberta`
**Quando** um ator autorizado inicia o trabalho
**Então** ela pode passar para `Em andamento`
**E** registra autor, instante e eventual observação sem criar Decisão Operacional.

**Dado** que uma Pendência depende de impedimento conhecido
**Quando** é movida para `Bloqueada`
**Então** o sistema exige motivo e, quando conhecido, responsável pelo desbloqueio
**E** preserva o prazo original e apresenta eventual impacto.

**Dado** que o impedimento é removido
**Quando** o trabalho é retomado
**Então** a Pendência volta para `Em andamento`
**E** o histórico mantém bloqueio, duração, motivo e autor da retomada.

**Dado** que o trabalho foi concluído
**Quando** um ator com capacidade de resolução confirma a transição
**Então** a Pendência passa para `Resolvida` com resumo obrigatório do resultado
**E** a resolução não cria ata, Publicação ou Decisão Operacional automaticamente.

**Dado** que a Pendência não deve mais ser executada
**Quando** um ator autorizado solicita cancelamento
**Então** o sistema exige motivo e muda o estado para `Cancelada`
**E** não exclui conteúdo, Comentários ou histórico.

**Dado** que uma Pendência resolvida ou cancelada precisa ser retomada
**Quando** um ator autorizado solicita reabertura
**Então** o sistema exige justificativa e cria nova transição para `Aberta`
**E** não apaga a resolução ou o cancelamento anterior.

**Dado** que o responsável é alterado
**Quando** a nova atribuição é confirmada
**Então** o sistema registra responsável anterior, novo responsável, autoria, instante e motivo quando exigido
**E** não transfere Papel, autoridade administrativa ou responsabilidade jurídica.

**Dado** que o prazo é prorrogado ou antecipado
**Quando** a alteração é confirmada
**Então** o sistema preserva prazo anterior, novo prazo, autoria e justificativa
**E** recalcula atraso segundo o timezone do Condomínio.

**Dado** que o prazo expirou sem resolução
**Quando** a Pendência é consultada ou o worker processa o vencimento
**Então** ela permanece em seu estado funcional e recebe indicador `Atrasada`
**E** não é resolvida, cancelada ou publicada automaticamente.

**Dado** que uma transição não é permitida para o estado atual ou para a capacidade do ator
**Quando** é solicitada pela interface ou API
**Então** o servidor rejeita a operação
**E** apresenta somente as transições atualmente válidas.

**Dado** que o responsável perdeu Vínculo ou acesso compatível
**Quando** a Pendência permanece ativa
**Então** o sistema sinaliza ausência de responsável válido à gestão
**E** não conserva acesso pela atribuição histórica.

**Dado** que duas transições concorrentes são solicitadas
**Quando** a primeira altera a versão da Pendência
**Então** a segunda recebe conflito `409`
**E** não sobrescreve estado, responsável ou prazo.

**Dado** que a mesma transição é repetida com a mesma chave idempotente
**Quando** ocorre falha de rede
**Então** o sistema retorna o resultado já confirmado
**E** não duplica mudança, notificação ou auditoria.

**Dado** que uma transição é concluída
**Quando** a transação é persistida
**Então** estado, atribuição, prazos, histórico, auditoria, outbox e projeção exportável permanecem coerentes
**E** falha em qualquer parte impede uma mudança parcial.

**Dado** que o fluxo é utilizado em mobile, desktop, teclado ou tecnologia assistiva
**Quando** estado, atraso, transições, justificativas ou conflito são apresentados
**Então** cumprem WCAG 2.2 AA
**E** o estado não depende apenas de cor ou posição no quadro.

Rastreabilidade: FR-21, FR-22, FR-23 parcialmente, NFR-1, NFR-6–NFR-9, NFR-11, NFR-12, NFR-14, UX-DR1–UX-DR6, UX-DR16–UX-DR20, AD-4–AD-8, AD-11, AD-14–AD-17, AD-23–AD-26.

### Story 5.3: Comentar e moderar a colaboração

Como Pessoa com acesso a um objeto,
Quero registrar Comentários e acompanhar suas versões,
Para que eu colabore sem alterar estados, decisões ou conteúdo publicado.

**Critérios de Aceitação:**

**Dado** que a Pessoa possui acesso vigente ao objeto
**Quando** publica um Comentário válido
**Então** o Comentário é associado ao objeto e identificado como manifestação colaborativa
**E** não altera estado, responsável, prazo, Decisão ou Publicação.

**Dado** que a Pessoa não possui acesso ao objeto
**Quando** tenta comentar pela interface ou API
**Então** o servidor nega a operação
**E** não revela título, existência, participantes ou conteúdo do objeto.

**Dado** que um Comentário é criado
**Quando** sua visibilidade é determinada
**Então** herda o contexto privado do objeto
**E** não pode receber audiência coletiva ou pública independentemente.

**Dado** que um Comentário contém Anexo
**Quando** o arquivo é enviado
**Então** o Anexo herda visibilidade privada, quarentena e autorização do objeto
**E** não é convertido em versão compartilhável ou publicado automaticamente.

**Dado** que o autor corrige seu Comentário
**Quando** salva a edição dentro das permissões vigentes
**Então** o sistema cria nova versão e mantém a anterior preservada
**E** apresenta que o Comentário foi editado, com autoria e instante.

**Dado** que o autor perdeu acesso ao objeto
**Quando** tenta editar Comentário anterior
**Então** o servidor nega a alteração
**E** o histórico anterior permanece preservado.

**Dado** que um Comentário viola regra de uso ou contém exposição indevida
**Quando** um moderador autorizado atua
**Então** exige categoria, motivo e confirmação antes de restringir sua exibição
**E** o original permanece acessível apenas à capacidade de moderação e retenção aplicável.

**Dado** que um Comentário é moderado
**Quando** usuários ordinários consultam a conversa
**Então** visualizam marcador de conteúdo moderado e motivo público seguro quando permitido
**E** não recebem o texto original ou Anexos restritos.

**Dado** que um moderador tenta reescrever o Comentário de outra Pessoa
**Quando** solicita alteração direta
**Então** o servidor rejeita a operação
**E** permite apenas moderação auditável ou novo Comentário separado.

**Dado** que alguém tenta promover um Comentário a Decisão ou Publicação
**Quando** executa ação implícita ou manipula a requisição
**Então** o sistema rejeita a conversão sem fluxo explícito correspondente
**E** preserva a natureza de Comentário.

**Dado** que dois atores editam ou moderam concorrentemente o mesmo Comentário
**Quando** sua versão já mudou
**Então** a operação incompatível recebe conflito `409`
**E** nenhuma versão ou moderação é perdida silenciosamente.

**Dado** que criação, edição ou moderação é concluída
**Quando** a transação é persistida
**Então** Comentário, versões, moderação, histórico, auditoria e projeção exportável permanecem coerentes
**E** a auditoria não copia conteúdo excessivo.

**Dado** que a conversa é utilizada em mobile, desktop, teclado ou tecnologia assistiva
**Quando** autoria, edição, moderação e Anexos são apresentados
**Então** cumprem WCAG 2.2 AA
**E** Comentário, Decisão e mudança de estado são semanticamente distinguíveis.

Rastreabilidade: FR-22, FR-23, FR-43, FR-45 parcialmente, NFR-1, NFR-3, NFR-5–NFR-9, NFR-11, NFR-12, NFR-14, UX-DR1, UX-DR5, UX-DR6, UX-DR16–UX-DR20, AD-4–AD-8, AD-11, AD-13–AD-17, AD-23–AD-26 e gate de retenção aplicável.

### Story 5.4: Confirmar e substituir Decisões Operacionais

Como Síndico ou Auxiliar com capacidade específica,
Quero confirmar Decisões Operacionais explícitas,
Para que orientações administrativas fiquem claras e imutáveis sem serem confundidas com atas ou Publicações.

**Critérios de Aceitação:**

**Dado** que o ator possui capacidade vigente para confirmar Decisões Operacionais
**Quando** inicia uma decisão a partir de uma Pendência ou outro objeto permitido
**Então** informa enunciado, contexto, alcance, vigência e fundamento operacional
**E** a origem permanece referenciada sem mudar de natureza.

**Dado** que o ator revisa a decisão proposta
**Quando** abre a confirmação
**Então** visualiza texto integral, objetos afetados, efeitos operacionais e limites
**E** recebe aviso de que a decisão não constitui ata, deliberação assemblear ou certificação jurídica.

**Dado** que a decisão produziria ação não autorizada ao ator
**Quando** o servidor valida seu alcance
**Então** bloqueia a confirmação
**E** não usa a Decisão como mecanismo de elevação de privilégios.

**Dado** que a decisão é confirmada
**Quando** o servidor revalida capacidade, tenant, objetos e versões
**Então** cria uma Decisão Operacional imutável com autoria e instante
**E** nenhuma edição direta posterior é permitida.

**Dado** que uma decisão precisa ser corrigida ou atualizada
**Quando** um ator autorizado prepara a mudança
**Então** cria nova Decisão Operacional que substitui explicitamente a anterior
**E** preserva cadeia, motivo, vigência e relação de substituição.

**Dado** que uma nova decisão substitui a anterior
**Quando** o histórico é consultado
**Então** identifica claramente qual está vigente e quais foram substituídas
**E** não reescreve o conteúdo original.

**Dado** que a decisão possui prazo ou condição de vigência
**Quando** a condição termina
**Então** a interface apresenta a decisão como expirada ou encerrada
**E** não a apaga nem cria decisão sucessora automaticamente.

**Dado** que uma Decisão se refere a uma Pendência
**Quando** é confirmada
**Então** não resolve, cancela ou reatribui a Pendência automaticamente
**E** eventual mudança no ciclo da Pendência exige transição autorizada separada.

**Dado** que uma Decisão precisa ser comunicada a Moradores
**Quando** a gestão inicia essa comunicação
**Então** utiliza rascunho e Publicação separados no Épico 4
**E** a Decisão interna não recebe audiência coletiva automaticamente.

**Dado** que um Morador, Conselheiro ou Auxiliar sem capacidade tenta confirmar uma Decisão
**Quando** envia a solicitação
**Então** o servidor nega por padrão
**E** não cria objeto, efeito, notificação ou auditoria de sucesso.

**Dado** que duas confirmações concorrentes usam a mesma proposta
**Quando** a primeira altera sua versão
**Então** a segunda recebe conflito `409`
**E** não cria decisões vigentes incompatíveis silenciosamente.

**Dado** que a mesma confirmação é reenviada com a mesma chave idempotente
**Quando** ocorre falha de rede
**Então** retorna a mesma Decisão
**E** não duplica efeitos, histórico ou auditoria.

**Dado** que confirmação, substituição ou encerramento é concluído
**Quando** a transação é persistida
**Então** Decisão, cadeia, vigência, histórico, auditoria e projeção exportável permanecem coerentes
**E** nenhuma falha produz decisão parcial.

**Dado** que o fluxo é utilizado em mobile, desktop, teclado ou tecnologia assistiva
**Quando** proposta, confirmação, vigência, substituição ou limites são apresentados
**Então** cumprem WCAG 2.2 AA
**E** Decisão, Comentário, Pendência e Publicação não dependem apenas de cor para serem distinguidos.

Rastreabilidade: FR-22, FR-23, FR-44, FR-45 parcialmente, NFR-1, NFR-6–NFR-9, NFR-11, NFR-12, NFR-14, UX-DR1, UX-DR5, UX-DR6, UX-DR16–UX-DR20, AD-4–AD-8, AD-11, AD-14–AD-16, AD-23–AD-26.

### Story 5.5: Consultar o histórico compreensível do Condomínio

Como Pessoa autorizada,
Quero consultar um histórico compreensível das mudanças relevantes,
Para que eu entenda o que aconteceu sem confundir colaboração, decisão, publicação e auditoria técnica.

**Critérios de Aceitação:**

**Dado** que o ator possui acesso a um objeto
**Quando** abre seu histórico
**Então** visualiza eventos funcionais permitidos em ordem cronológica
**E** cada item apresenta natureza, autor permitido, instante e resumo adequado.

**Dado** que o histórico contém Comentário
**Quando** é apresentado
**Então** utiliza identificação semântica de `Comentário` e mostra versões ou moderação autorizadas
**E** não o apresenta como decisão ou mudança de estado.

**Dado** que o histórico contém Decisão Operacional
**Quando** é apresentado
**Então** identifica vigência, substituições e responsável pela confirmação
**E** não o apresenta como ata ou Publicação.

**Dado** que o histórico contém mudança de estado ou atribuição
**Quando** é apresentado
**Então** mostra valor anterior, novo valor, motivo permitido e autoria
**E** não mistura a transição com Comentários próximos.

**Dado** que o histórico contém Versão Publicada
**Quando** é apresentado
**Então** identifica estado editorial, audiência permitida e relação entre versões
**E** não expõe conteúdo suspenso ou audiência privada ao ator sem autorização.

**Dado** que o histórico referencia Evento de Auditoria
**Quando** o ator não possui capacidade própria de auditoria
**Então** apresenta apenas o fato funcional permitido ou omite o evento técnico
**E** não revela correlação, sinal de segurança ou leitura sensível.

**Dado** que o ator aplica filtros por objeto, período, autor ou natureza
**Quando** a consulta é executada
**Então** a lista e as contagens utilizam o mesmo escopo autorizado
**E** filtros não podem ser usados para inferir objetos protegidos.

**Dado** que o histórico contém versões antigas ou conteúdo moderado
**Quando** o ator não possui acesso ao conteúdo original
**Então** visualiza apenas marcador e metadados permitidos
**E** o servidor não retorna o conteúdo oculto no payload.

**Dado** que o ator perdeu Papel, Vínculo ou capacidade
**Quando** atualiza a consulta
**Então** o resultado é recalculado conforme o estado vigente
**E** acesso anterior não mantém visibilidade futura.

**Dado** que não existem eventos permitidos
**Quando** o histórico é aberto
**Então** a interface apresenta estado vazio explicativo
**E** não diferencia entre inexistência e proteção de forma que revele dados.

**Dado** que a consulta falha ou fica temporariamente indisponível
**Quando** a interface apresenta o erro
**Então** preserva filtros e oferece nova tentativa
**E** não mostra histórico antigo como se fosse atual.

**Dado** que eventos simultâneos possuem instantes equivalentes
**Quando** são ordenados
**Então** o sistema aplica ordenação estável e preserva correlação autorizada
**E** não inventa causalidade entre eventos independentes.

**Dado** que a linha do tempo é usada em mobile, desktop, teclado ou tecnologia assistiva
**Quando** filtros, eventos, versões e estados são apresentados
**Então** cumprem WCAG 2.2 AA
**E** as diferentes naturezas possuem texto e semântica além de ícones ou cores.

Rastreabilidade: FR-21 parcialmente, FR-22, FR-23, FR-27 parcialmente, FR-43–FR-45 parcialmente, NFR-1, NFR-3, NFR-5–NFR-9, NFR-11, NFR-12, UX-DR1, UX-DR2, UX-DR5, UX-DR6, UX-DR16–UX-DR20, AD-4–AD-8, AD-12, AD-14–AD-16, AD-23–AD-26.

### Story 5.6: Consultar e exportar Eventos de Auditoria autorizados

Como Síndico ou Auxiliar com capacidade específica de auditoria,
Quero consultar Eventos de Auditoria minimizados,
Para que operações relevantes possam ser verificadas sem transformar logs em cópias de dados sensíveis.

**Critérios de Aceitação:**

**Dado** que uma operação definida pela política de auditoria é executada
**Quando** sua transação é confirmada
**Então** o sistema registra Evento append-only com ator, ação, tenant, objeto, instante, resultado, motivo e correlação necessários
**E** não registra senha, token, cookie, segredo, URL assinada ou conteúdo excessivo.

**Dado** que ocorre leitura sensível de inadimplência, original de Anexo, conteúdo moderado, solicitação LGPD, exportação ou mudança de segurança
**Quando** a operação termina
**Então** gera Evento conforme política enumerada
**E** o Evento identifica a categoria sem copiar o dado sensível consultado.

**Dado** que uma operação auditável falha antes de produzir efeito
**Quando** a política exige registrar a tentativa
**Então** o resultado de falha é preservado com informação minimizada
**E** não cria falso Evento de sucesso.

**Dado** que o ator possui capacidade vigente de consulta de auditoria
**Quando** abre a visão
**Então** recebe Eventos apenas do Condomínio e escopo autorizados
**E** a consulta utiliza projeção minimizada separada da escrita append-only.

**Dado** que o ator filtra por período, ator, ação, objeto, resultado ou correlação
**Quando** a busca é executada
**Então** resultados e contagens respeitam o mesmo escopo
**E** o filtro não permite enumeração cross-tenant.

**Dado** que o ator não possui capacidade de auditoria
**Quando** tenta acessar a consulta ou exportação
**Então** o servidor nega por padrão
**E** não revela existência, volume ou categorias de Eventos.

**Dado** que alguém tenta editar ou excluir um Evento pela aplicação
**Quando** solicita a mutação
**Então** o servidor rejeita a operação
**E** qualquer correção de interpretação ocorre por evento compensatório ou anotação autorizada separada.

**Dado** que a aplicação ou worker tenta inserir Evento fora do port e role restritos
**Quando** a operação chega à persistência
**Então** o banco nega a escrita
**E** a falha é observável sem registrar o conteúdo protegido.

**Dado** que o ator solicita exportação filtrada de auditoria
**Quando** revisa o escopo e autentica-se recentemente
**Então** o sistema apresenta período, filtros, contagens estimadas e campos incluídos
**E** exige confirmação explícita antes do processamento.

**Dado** que a exportação é gerada
**Quando** o worker conclui o processamento
**Então** produz artefato privado, temporário, íntegro e limitado à projeção autorizada
**E** não inclui credenciais, segredos, conteúdo de Anexos ou dados sensíveis não necessários.

**Dado** que a autorização é retirada durante a geração ou antes do download
**Quando** o usuário solicita o artefato
**Então** o servidor revalida capacidade e nega a entrega
**E** não considera a autorização inicial suficiente.

**Dado** que o artefato expira
**Quando** alguém tenta baixá-lo
**Então** o acesso é negado e seu ciclo de vida segue a política aplicável
**E** uma nova geração exige autenticação e confirmação próprias.

**Dado** que prazos exatos de retenção ainda aguardam definição jurídica
**Quando** a política não possui valor aprovado
**Então** o sistema não inventa expurgo ou conservação definitiva
**E** mantém a decisão condicionada ao gate jurídico e operacional.

**Dado** que consulta, geração ou download é executado
**Quando** a operação termina
**Então** ela própria gera auditoria minimizada sem recursão ilimitada
**E** falhas parciais não são apresentadas como exportação bem-sucedida.

**Dado** que a visão é usada em mobile, desktop, teclado ou tecnologia assistiva
**Quando** filtros, tabela, detalhes, exportação ou falha são apresentados
**Então** cumprem WCAG 2.2 AA
**E** sucesso, falha e restrição não dependem apenas de cor.

Rastreabilidade: FR-22, FR-23, FR-26 parcialmente quanto ao artefato auditável, FR-43 parcialmente, FR-44 parcialmente, FR-45, NFR-1, NFR-3, NFR-5–NFR-10A, NFR-11, NFR-12, NFR-14, UX-DR1, UX-DR6, UX-DR14, UX-DR16–UX-DR20, AD-4–AD-8, AD-11, AD-14–AD-19, AD-23–AD-26 e gates jurídico, de retenção, segurança e portabilidade.

## Épico 6: Proteger dados e preservar a autoridade em situações excepcionais

Pessoas exercem solicitações sobre seus dados e o Condomínio trata continuidade, disputas e incidentes sem exposição indevida, promessa jurídica prematura ou transferência automática de autoridade.

### Story 6.1: Registrar e acompanhar solicitação sobre Dados Pessoais

Como Pessoa,
Quero registrar e acompanhar uma solicitação relacionada aos meus Dados Pessoais,
Para que meu pedido seja autenticado, encaminhado e tratado com transparência.

**Critérios de Aceitação:**

**Dado** que uma Pessoa autenticada acessa o canal de solicitações
**Quando** inicia um pedido
**Então** o sistema apresenta categorias declarativas permitidas, canal, finalidade e limites atuais
**E** não promete acesso, correção, eliminação, portabilidade ou outro resultado jurídico automático.

**Dado** que a Pessoa seleciona uma categoria e descreve sua solicitação
**Quando** confirma o envio
**Então** o sistema cria uma solicitação no estado `Recebida` com protocolo opaco
**E** associa o pedido à Conta e à identidade declarada sem exigir exposição excessiva.

**Dado** que a solicitação exige verificação adicional de identidade
**Quando** o risco ou a natureza do pedido assim determina
**Então** o estado passa para `Autenticação pendente`
**E** o acesso à Conta, isoladamente, não substitui a verificação proporcional aprovada.

**Dado** que a Pessoa não possui Conta ativa ou não consegue autenticar-se pelo fluxo ordinário
**Quando** utiliza o canal alternativo autorizado
**Então** pode registrar pedido mínimo em estado de verificação
**E** não recebe confirmação sobre existência de cadastro ou Dados Pessoais antes da autenticação adequada.

**Dado** que o pedido contém Anexo ou evidência
**Quando** o arquivo é enviado
**Então** utiliza armazenamento privado, quarentena, Cota e autorização específica
**E** não se torna acessível a usuários administrativos sem participação autorizada no caso.

**Dado** que a Pessoa tenta solicitar dados de terceiro
**Quando** o escopo declarado não corresponde à identidade autenticada
**Então** o sistema bloqueia o avanço ordinário
**E** orienta a comprovação de representação sem revelar dados do terceiro.

**Dado** que uma solicitação equivalente já está aberta
**Quando** a Pessoa prepara novo pedido
**Então** o sistema apresenta o protocolo existente quando autorizado
**E** permite complementar o caso sem duplicá-lo silenciosamente.

**Dado** que a mesma confirmação é reenviada com a mesma chave idempotente
**Quando** ocorre duplo acionamento ou falha de rede
**Então** o sistema retorna o mesmo protocolo
**E** não duplica caso, Anexo, notificação ou auditoria.

**Dado** que a solicitação é encaminhada
**Quando** existe responsável operacional configurado
**Então** o sistema registra responsável, estado e instante
**E** a atribuição não concede acesso a dados fora do escopo do caso.

**Dado** que ainda não existe responsável válido
**Quando** a solicitação é criada
**Então** ela permanece registrada e sinalizada para triagem
**E** não é encerrada ou considerada atendida automaticamente.

**Dado** que a Pessoa acompanha o protocolo
**Quando** consulta o caso autenticado
**Então** visualiza estado, marcos, pedidos de informação e respostas permitidas
**E** não recebe notas internas, dados de terceiros ou evidências restritas.

**Dado** que prazos jurídicos finais ainda aguardam parecer consolidado
**Quando** o sistema apresenta expectativa de tratamento
**Então** utiliza apenas prazo operacional provisório explicitamente identificado, se aprovado
**E** não o descreve como prazo legal definitivo.

**Dado** que o registro é concluído
**Quando** a transação é persistida
**Então** solicitação, identidade, evidências, encaminhamento, auditoria, outbox e projeção exportável permanecem coerentes
**E** falha em qualquer parte impede protocolo parcial.

**Dado** que o fluxo é usado em mobile, desktop, teclado ou tecnologia assistiva
**Quando** formulário, autenticação, protocolo, estados ou limites são apresentados
**Então** cumprem WCAG 2.2 AA
**E** a Pessoa consegue compreender alcance e próximo passo sem suporte especializado.

Rastreabilidade: FR-30, NFR-1, NFR-3–NFR-9, NFR-11, NFR-12, NFR-14, UX-DR1, UX-DR3, UX-DR15–UX-DR18, AD-4–AD-11, AD-13–AD-17, AD-22–AD-26 e gate jurídico/LGPD consolidado pendente.

### Story 6.2: Analisar e responder solicitação sobre Dados Pessoais

Como responsável autorizado pelo tratamento de solicitações,
Quero analisar o pedido e registrar uma resposta justificada,
Para que a Pessoa receba uma decisão rastreável dentro das políticas juridicamente aprovadas.

**Critérios de Aceitação:**

**Dado** que a solicitação foi autenticada adequadamente
**Quando** um responsável autorizado inicia a análise
**Então** o estado passa para `Em análise`
**E** o acesso do responsável fica limitado ao caso e às fontes necessárias.

**Dado** que a identidade ainda não foi validada
**Quando** alguém tenta consultar ou entregar dados pessoais
**Então** o servidor bloqueia a operação
**E** não utiliza urgência operacional para contornar a autenticação.

**Dado** que são necessárias informações adicionais
**Quando** o responsável registra a necessidade
**Então** a solicitação passa para `Aguardando informações` com pedido minimizado e justificativa
**E** a Pessoa é notificada sem exposição do conteúdo sensível no canal externo.

**Dado** que fontes de mais de um domínio são necessárias
**Quando** o escopo é levantado
**Então** o sistema registra quais categorias e sistemas foram consultados
**E** não amplia o pedido para dados não relacionados à solicitação.

**Dado** que a solicitação envolve acesso, correção, eliminação, oposição ou portabilidade individual
**Quando** o responsável prepara a decisão
**Então** somente políticas e bases aprovadas podem determinar o resultado
**E** a ausência de definição jurídica mantém a decisão bloqueada ou encaminhada para revisão competente.

**Dado** que dados de terceiros aparecem no material de resposta
**Quando** o conteúdo é preparado
**Então** o sistema exige ocultação, segregação ou justificativa conforme política aprovada
**E** impede a entrega de material não revisado.

**Dado** que a resposta é total, parcial, negada ou considerada inaplicável
**Quando** o responsável registra a decisão
**Então** seleciona estado, fundamento aprovado, escopo atendido e justificativa compreensível
**E** o Burgoweb não transforma decisão operacional em parecer jurídico próprio.

**Dado** que a resposta inclui arquivo
**Quando** o material é gerado
**Então** permanece privado, íntegro, temporário e acessível apenas após autenticação recente
**E** não utiliza link público ou permanente.

**Dado** que a autorização da Pessoa ou do responsável muda antes da entrega
**Quando** o download ou envio é solicitado
**Então** o servidor revalida identidade, capacidade, estado e escopo
**E** a autorização inicial não garante entrega posterior.

**Dado** que uma correção ou eliminação foi juridicamente autorizada
**Quando** sua execução é confirmada
**Então** o sistema registra objetos alcançados, exceções, resultado e evidências minimizadas
**E** preserva tombstones, auditoria e retenções obrigatórias sem afirmar eliminação de cópias que continuem existentes.

**Dado** que uma exportação externa foi entregue
**Quando** o caso é encerrado
**Então** o sistema não considera encerrado o tratamento das cópias remanescentes no Burgoweb
**E** a resposta informa o escopo efetivamente atendido.

**Dado** que a Pessoa consulta a resposta
**Quando** o caso está `Respondido`
**Então** visualiza decisão, justificativa, alcance, limitações e canal de continuidade permitido
**E** não recebe notas internas ou informações de terceiros.

**Dado** que a resposta precisa ser corrigida
**Quando** um responsável autorizado prepara nova manifestação
**Então** cria nova versão da resposta e preserva a anterior
**E** a Pessoa é notificada quando a alteração for material.

**Dado** que duas decisões concorrentes são confirmadas
**Quando** a primeira altera a versão do caso
**Então** a segunda recebe conflito `409`
**E** nenhuma resposta é sobrescrita silenciosamente.

**Dado** que análise, decisão ou entrega é concluída
**Quando** a transação é persistida
**Então** caso, estados, fontes, resposta, auditoria, outbox e projeção exportável permanecem coerentes
**E** falha parcial nunca é apresentada como atendimento completo.

**Dado** que o fluxo é usado em mobile, desktop, teclado ou tecnologia assistiva
**Quando** escopo, evidências, decisão, limitações ou resposta são apresentados
**Então** cumprem WCAG 2.2 AA
**E** estados e resultados são compreensíveis sem depender apenas de cor ou linguagem jurídica.

Rastreabilidade: FR-30, FR-45 parcialmente, NFR-1–NFR-9, NFR-11, NFR-12, NFR-14, UX-DR1, UX-DR14–UX-DR18, UX-DR20, AD-4–AD-8, AD-11, AD-13–AD-19, AD-22–AD-26 e gate jurídico/LGPD consolidado pendente.

### Story 6.3: Designar e gerir Contatos de Continuidade

Como Síndico,
Quero designar Contatos de Continuidade,
Para que Pessoas confiáveis recebam alertas e apoiem a recuperação operacional sem ganhar autoridade administrativa.

**Critérios de Aceitação:**

**Dado** que o Síndico possui autoridade vigente
**Quando** inicia uma designação
**Então** seleciona uma Pessoa com Conta e canal verificado e informa finalidade e vigência
**E** a interface esclarece que o Contato não recebe Papel administrativo.

**Dado** que a Pessoa pertence a outro Condomínio ou não satisfaz os requisitos mínimos
**Quando** a designação é preparada
**Então** o servidor rejeita a operação
**E** não revela dados protegidos do outro tenant.

**Dado** que a designação é confirmada
**Quando** o servidor revalida autoridade e versão
**Então** cria convite de continuidade pendente com token de uso único e validade finita
**E** ainda não ativa o Contato nem concede acesso a dados do Condomínio.

**Dado** que a Pessoa abre convite válido
**Quando** autentica-se e revisa finalidade e limites
**Então** pode aceitar ou rejeitar explicitamente
**E** silêncio, abertura da mensagem ou controle do e-mail não produzem aceitação.

**Dado** que a Pessoa aceita
**Quando** o servidor valida token, Conta e vigência
**Então** a relação passa ao estado `Ativa`
**E** permite somente receber alertas e executar ações de apoio explicitamente definidas.

**Dado** que o Contato tenta acessar finanças, cadastros, Anexos, auditoria ou configurações
**Quando** solicita a operação
**Então** o servidor nega por padrão
**E** a condição de Contato não é tratada como Papel, Vínculo ou capacidade administrativa.

**Dado** que ocorre alerta de continuidade
**Quando** o Contato é notificado
**Então** a mensagem contém apenas informação operacional mínima e canal seguro de resposta
**E** não expõe Dados Pessoais, finanças, credenciais ou evidências sensíveis.

**Dado** que o Síndico remove ou substitui um Contato
**Quando** confirma a ação
**Então** a relação anterior é encerrada com autoria, instante e motivo permitido
**E** sessões, links ou tokens associados deixam de produzir efeitos.

**Dado** que o Contato solicita sua própria saída
**Quando** confirma a operação
**Então** a relação é encerrada
**E** o Síndico é notificado sem impedir a retirada.

**Dado** que a autoridade do Síndico é transferida cooperativamente
**Quando** o novo Síndico assume
**Então** os Contatos permanecem visíveis para revisão conforme política aprovada
**E** não se tornam automaticamente representantes do novo Síndico.

**Dado** que alguém tenta usar a relação de continuidade para transferir o Papel de Síndico
**Quando** solicita recuperação ou mudança de autoridade
**Então** o sistema rejeita a operação
**E** encaminha para o fluxo cooperativo ou contestado aplicável.

**Dado** que duas alterações concorrentes afetam o mesmo Contato
**Quando** a primeira modifica a versão
**Então** a segunda recebe conflito `409`
**E** não restaura ou duplica a relação.

**Dado** que designação, aceitação ou remoção é concluída
**Quando** a transação é persistida
**Então** relação, vigência, notificações, auditoria e projeção exportável permanecem coerentes
**E** falha em qualquer parte impede ativação parcial.

**Dado** que o fluxo é utilizado em mobile, desktop, teclado ou tecnologia assistiva
**Quando** finalidade, limites, convite, aceitação ou remoção são apresentados
**Então** cumprem WCAG 2.2 AA
**E** Contato de Continuidade e Papel administrativo são claramente distintos.

Rastreabilidade: FR-4 parcialmente, FR-8 parcialmente, FR-9 parcialmente, FR-31, NFR-1, NFR-6–NFR-10A, NFR-11, NFR-12, NFR-14, UX-DR1, UX-DR8, UX-DR9, UX-DR15–UX-DR18, AD-4–AD-11, AD-14–AD-17, AD-22–AD-26.

### Story 6.4: Registrar e acompanhar transferência contestada

Como Pessoa que declara possuir autoridade sobre o Condomínio,
Quero registrar uma contestação e apresentar evidências,
Para que a disputa seja documentada e encaminhada sem me conceder acesso antecipado.

**Critérios de Aceitação:**

**Dado** que uma Pessoa autenticada declara autoridade incompatível com a gestão vigente
**Quando** inicia uma transferência contestada
**Então** o sistema apresenta finalidade, limites e ausência de transferência automática
**E** não confirma eleição, propriedade, mandato ou legitimidade jurídica.

**Dado** que a Pessoa informa Condomínio, fundamento declarado, contato e contexto mínimo
**Quando** confirma o registro
**Então** o sistema cria caso com protocolo opaco no estado `Registrado`
**E** não revela dados internos além do necessário para identificar o encaminhamento.

**Dado** que a Pessoa apresenta evidências
**Quando** os arquivos são enviados
**Então** permanecem privados, em quarentena e acessíveis somente a participantes autorizados
**E** o conteúdo não é publicado ou compartilhado com usuários ordinários.

**Dado** que a identidade exige verificação adicional
**Quando** o caso é triado
**Então** passa para `Autenticação pendente`
**E** nenhuma evidência é tratada como suficiente apenas porque foi enviada.

**Dado** que o caso é encaminhado à gestão vigente
**Quando** a notificação é emitida
**Então** utiliza mensagem minimizada e canal autenticado
**E** não entrega automaticamente ao requerente cadastros, documentos ou dados financeiros.

**Dado** que a gestão vigente concorda cooperativamente com a transferência
**Quando** a concordância válida é registrada
**Então** o caso pode ser encaminhado ao fluxo cooperativo do Épico 1
**E** a contestação não executa uma segunda transferência independente.

**Dado** que não existe concordância da gestão vigente
**Quando** o caso permanece em disputa
**Então** pode assumir estado `Aguardando resolução externa` ou equivalente aprovado
**E** o requerente continua sem Papel ou acesso ao Condomínio.

**Dado** que o procedimento jurídico e operacional de execução ainda não foi aprovado
**Quando** qualquer ator tenta transferir autoridade pelo caso
**Então** o servidor bloqueia a execução
**E** informa que o registro da contestação não produz mudança de gestão.

**Dado** que futuramente exista procedimento reconhecido, versionado e habilitado
**Quando** uma execução for solicitada
**Então** deverá validar identidade, evidências exigidas, decisão externa, responsáveis, autenticação recente e dupla confirmação previstas
**E** não poderá utilizar configuração informal ou intervenção direta no banco.

**Dado** que evidência adicional é solicitada
**Quando** o responsável registra o pedido
**Então** o caso preserva escopo, autoria e prazo operacional permitido
**E** a mensagem não antecipa resultado jurídico.

**Dado** que uma evidência é substituída
**Quando** novo arquivo é enviado
**Então** a versão anterior permanece preservada conforme retenção e acesso restrito
**E** nenhuma evidência é editada ou apagada silenciosamente.

**Dado** que um caso é encerrado sem transferência
**Quando** a conclusão é registrada
**Então** preserva estado, responsável, fundamento permitido e resposta justificada
**E** não certifica que uma das partes possui razão jurídica além da decisão externa registrada.

**Dado** que duas alterações concorrentes afetam o caso
**Quando** a primeira altera sua versão
**Então** a segunda recebe conflito `409`
**E** estado, evidências ou responsável não são sobrescritos.

**Dado** que registro, encaminhamento ou encerramento é concluído
**Quando** a transação é persistida
**Então** caso, evidências, estados, notificações, auditoria e projeção exportável permanecem coerentes
**E** nenhuma falha concede acesso ou autoridade parcial.

**Dado** que o fluxo é utilizado em mobile, desktop, teclado ou tecnologia assistiva
**Quando** estado, responsável, evidências, limites ou decisão são apresentados
**Então** cumprem WCAG 2.2 AA
**E** o sistema não promete resultado jurídico ainda não aprovado.

Rastreabilidade: FR-4 parcialmente, FR-9, FR-22 parcialmente, FR-32, NFR-1, NFR-3, NFR-5–NFR-10A, NFR-11, NFR-12, NFR-14, UX-DR1, UX-DR8, UX-DR15–UX-DR18, UX-DR20, AD-4–AD-11, AD-13–AD-17, AD-22–AD-26 e gate jurídico consolidado bloqueante.

### Story 6.5: Conter Conta administrativa comprometida

Como operador de segurança autorizado do Burgoweb,
Quero conter uma Conta administrativa potencialmente comprometida,
Para que acessos e tokens sejam revogados rapidamente sem transferir autoridade ou destruir evidências.

**Critérios de Aceitação:**

**Dado** que existe sinal confiável de comprometimento de uma Conta administrativa
**Quando** o operador autorizado inicia a contenção
**Então** seleciona Conta, Condomínio, categoria, evidências mínimas e alcance
**E** a interface apresenta efeitos antes da confirmação.

**Dado** que a contenção urgente é confirmada
**Quando** o servidor revalida a autoridade operacional e o estado atual
**Então** a Conta passa para estado restritivo de segurança
**E** todas as sessões alcançadas são revogadas ou rotacionadas.

**Dado** que a Conta possui Convites, tokens de recuperação ou verificações pendentes
**Quando** a contenção é aplicada
**Então** esses artefatos são revogados conforme o alcance seguro
**E** não podem ser reutilizados após a contenção.

**Dado** que a Conta comprometida possui Papel de Síndico
**Quando** é contida
**Então** o Papel institucional e seu histórico permanecem preservados, mas indisponíveis para novas ações pela Conta
**E** nenhuma outra Pessoa recebe automaticamente autoridade de Síndico.

**Dado** que a Conta comprometida é a única Conta capaz de exercer a gestão
**Quando** a contenção termina
**Então** o Condomínio pode permanecer temporariamente sem operação administrativa disponível
**E** a recuperação deve seguir fluxo de Conta, transferência cooperativa ou procedimento contestado reconhecido.

**Dado** que ações recentes da Conta precisam ser investigadas
**Quando** o caso é aberto
**Então** o sistema sinaliza Eventos e objetos correlacionados dentro do período definido
**E** não desfaz automaticamente operações financeiras, Publicações ou decisões.

**Dado** que existe Publicação, exportação ou alteração potencialmente indevida
**Quando** a triagem identifica o objeto
**Então** encaminha para suspensão, revogação ou correção específica aplicável
**E** preserva os demais objetos seguros.

**Dado** que a própria Conta comprometida tenta retirar a contenção
**Quando** envia a solicitação
**Então** o servidor nega
**E** autenticação por credencial possivelmente comprometida não é suficiente para restauração.

**Dado** que a recuperação da Conta é autorizada após investigação
**Quando** o responsável confirma as verificações exigidas
**Então** novas credenciais e sessões são emitidas com rotação dos artefatos aplicáveis
**E** sessões, tokens e Convites anteriores continuam revogados.

**Dado** que a Conta recuperada volta a operar
**Quando** executa nova ação
**Então** o servidor revalida Papéis e capacidades vigentes
**E** a recuperação não restaura delegações já revogadas por decisão administrativa legítima.

**Dado** que o operador tenta acessar conteúdo do Condomínio além do necessário à contenção
**Quando** solicita a operação
**Então** o servidor nega por menor privilégio
**E** a capacidade operacional não se converte em acesso administrativo amplo.

**Dado** que duas contenções ou restaurações concorrentes são solicitadas
**Quando** a primeira altera o estado de segurança
**Então** a operação incompatível recebe conflito `409`
**E** o estado mais restritivo é preservado diante de falha.

**Dado** que contenção, revogação ou restauração é concluída
**Quando** a transação é persistida
**Então** Conta, sessões, tokens, Convites, caso, auditoria, alertas e projeção exportável permanecem coerentes
**E** falha em qualquer parte não deixa sessão conhecida ativa silenciosamente.

**Dado** que o fluxo é utilizado em mobile, desktop, teclado ou tecnologia assistiva
**Quando** risco, alcance, confirmação, investigação ou restauração são apresentados
**Então** cumprem WCAG 2.2 AA
**E** estado de segurança e autoridade institucional permanecem claramente distintos.

Rastreabilidade: FR-4 parcialmente, FR-8 parcialmente, FR-9 parcialmente, FR-22 parcialmente, FR-33, FR-45 parcialmente, NFR-1, NFR-6–NFR-10A, NFR-11, NFR-12, NFR-14, UX-DR1, UX-DR8, UX-DR15–UX-DR18, AD-4–AD-11, AD-14–AD-17, AD-22–AD-26 e gate de resposta a incidentes.

### Story 6.6: Coordenar o ciclo de resposta a incidentes

Como responsável autorizado por segurança e privacidade,
Quero conduzir incidentes por um ciclo verificável,
Para que detecção, contenção, correção e recuperação sejam coordenadas sem perda de evidências ou comunicação indevida.

**Critérios de Aceitação:**

**Dado** que um evento suspeito é detectado manual ou automaticamente
**Quando** satisfaz critério operacional de incidente
**Então** o sistema cria caso com categoria, severidade inicial, fonte, responsável e instante
**E** não copia segredo ou conteúdo sensível desnecessário para o caso.

**Dado** que o incidente é registrado
**Quando** o responsável inicia o tratamento
**Então** o ciclo oferece estados explícitos para detecção, contenção, avaliação, correção, restauração, comunicação e revisão
**E** cada transição exige capacidade e informações mínimas próprias.

**Dado** que o incidente envolve Conta comprometida, abuso de Convite ou recuperação, ou sessão não revogada
**Quando** a contenção é definida
**Então** o sistema permite vincular revogações e bloqueios específicos
**E** não transfere autoridade automaticamente.

**Dado** que o incidente envolve acesso cross-tenant
**Quando** é classificado
**Então** recebe prioridade crítica e preservação de correlação técnica
**E** qualquer acesso adicional para investigação continua sujeito a isolamento e menor privilégio.

**Dado** que o incidente envolve Publicação ou exportação indevida
**Quando** é contido
**Então** permite vincular suspensão, expiração ou revogação específica
**E** não desativa indiscriminadamente conteúdo seguro.

**Dado** que o incidente envolve banco, backup, segredo vazado, alteração não autorizada ou perda de dados
**Quando** a resposta é planejada
**Então** registra ativos, alcance, credenciais a rotacionar e procedimentos de restauração aplicáveis
**E** não declara recuperação antes de verificação objetiva.

**Dado** que evidências são preservadas
**Quando** são adicionadas ao caso
**Então** recebem armazenamento privado, hash, cadeia de custódia operacional e acesso restrito
**E** o Burgoweb não certifica cadeia de custódia jurídica além dos registros técnicos produzidos.

**Dado** que uma ação de contenção possui risco de indisponibilidade ou perda
**Quando** é preparada
**Então** a interface apresenta alcance, alternativas, reversibilidade e efeitos conhecidos
**E** exige confirmação proporcional à severidade.

**Dado** que restauração é executada
**Quando** o serviço ou dado retorna
**Então** testes de integridade, autorização e funcionamento precisam ser registrados
**E** retorno técnico isolado não encerra automaticamente o incidente.

**Dado** que comunicação a Pessoas, Condomínios, autoridades ou fornecedores pode ser necessária
**Quando** o responsável prepara a mensagem
**Então** utiliza modelo, audiência e aprovação compatíveis com política juridicamente validada
**E** a ausência dessa política bloqueia comunicação externa definitiva, sem impedir contenção técnica.

**Dado** que o incidente está pronto para encerramento
**Quando** o responsável solicita conclusão
**Então** exige resumo, impacto conhecido, ações executadas, pendências, evidências de restauração e revisão
**E** preserva limitações e incertezas sem declarar ausência de impacto não comprovada.

**Dado** que a revisão identifica ação corretiva futura
**Quando** o caso é encerrado
**Então** pode criar Pendência interna separada com responsável e prazo
**E** o incidente não é mantido artificialmente aberto apenas para representar trabalho posterior.

**Dado** que prazos legais, critérios de notificação ou retenção ainda dependem de parecer
**Quando** o caso alcança essas decisões
**Então** o sistema sinaliza o gate e impede conclusão jurídica automática
**E** não inventa prazo, destinatário ou fundamento.

**Dado** que duas transições concorrentes afetam o caso
**Quando** a primeira altera sua versão
**Então** a segunda recebe conflito `409`
**E** o estado mais restritivo e as evidências permanecem preservados.

**Dado** que transição, evidência ou ação é persistida
**Quando** a operação termina
**Então** caso, histórico, evidências, tarefas, auditoria, outbox e projeção exportável permanecem coerentes
**E** a falha de um efeito crítico impede falso avanço do estado.

**Dado** que o fluxo é utilizado em mobile, desktop, teclado ou tecnologia assistiva
**Quando** severidade, estados, ações, evidências ou gates são apresentados
**Então** cumprem WCAG 2.2 AA
**E** criticidade e andamento não dependem apenas de cor.

Rastreabilidade: FR-21 parcialmente quanto às ações corretivas, FR-22, FR-23 parcialmente, FR-28 parcialmente, FR-30–FR-33 parcialmente, FR-45 parcialmente, NFR-1, NFR-3–NFR-12, NFR-14, NFR-15, UX-DR1, UX-DR5, UX-DR6, UX-DR13–UX-DR20, AD-4–AD-11, AD-13–AD-26 e gates jurídico, LGPD, segurança, backup/restauração e resposta a incidentes.

## Épico 7: Garantir portabilidade e continuidade institucional

Pessoas autorizadas produzem Exportações Financeiras e Institucionais completas, protegidas, verificáveis e utilizáveis por terceiros, sem confundi-las com integração contábil, backup ou solicitação individual.

### Story 7.1: Gerar Exportação Financeira por escopo

Como Síndico ou Auxiliar com capacidade financeira de exportação,
Quero selecionar e exportar os dados financeiros necessários,
Para que eu possa entregá-los a um operador externo em formato aberto e verificável.

**Critérios de Aceitação:**

**Dado** que o ator possui capacidade vigente para gerar Exportação Financeira
**Quando** inicia uma solicitação
**Então** pode selecionar período, Contas Financeiras, categorias, Lançamentos, Movimentos, serviços, Obrigações, Fechamentos e demais componentes permitidos
**E** o escopo fica limitado ao Condomínio autorizado.

**Dado** que o ator seleciona um período aberto, conferido ou fechado
**Quando** revisa o escopo
**Então** a interface identifica o estado e informa se os dados ainda podem mudar
**E** não apresenta período aberto como snapshot fechado.

**Dado** que o escopo inclui dados previstos e realizados
**Quando** a pré-visualização é apresentada
**Então** valores realizados, previstos, vencidos, estornados e saldos permanecem separados
**E** a exportação não afirma conciliação bancária ou validação contábil inexistente.

**Dado** que o escopo pode incluir dados individuais ou Anexos privados
**Quando** o ator os seleciona
**Então** o servidor exige capacidade específica e apresenta alerta de privacidade
**E** nenhum dado protegido é incluído apenas porque pertence ao período financeiro.

**Dado** que um Anexo é incluído
**Quando** o escopo é validado
**Então** somente binário disponível, autorizado e explicitamente selecionado pode integrar o pacote
**E** quarentena, rejeição, remoção ou falta de autorização são registradas como exclusão.

**Dado** que o ator conclui a seleção
**Quando** abre a revisão final
**Então** visualiza escopo, filtros, período, estado dos dados, categorias incluídas, exclusões e contagens estimadas
**E** precisa autenticar-se recentemente e confirmar explicitamente.

**Dado** que a autenticação recente não está presente ou expirou
**Quando** o ator tenta confirmar
**Então** o sistema exige nova autenticação
**E** preserva o escopo sem iniciar a geração.

**Dado** que a geração é confirmada
**Quando** o servidor revalida capacidade, tenant, escopo e versões
**Então** cria solicitação assíncrona no estado `Na fila`
**E** registra a referência coerente dos dados que formarão o snapshot.

**Dado** que os dados mudam após a confirmação
**Quando** o worker gera o pacote
**Então** utiliza o snapshot definido para a solicitação
**E** não mistura versões anteriores e posteriores silenciosamente.

**Dado** que o pacote é produzido
**Quando** a geração termina
**Então** utiliza ZIP64 versionado com manifesto, JSON canônico UTF-8, CSV e binários autorizados
**E** valores monetários são strings decimais exatas e datas informam timezone e formato.

**Dado** que o manifesto é criado
**Quando** os arquivos são consolidados
**Então** contém versão do formato, escopo, filtros, período, estado, arquivos, contagens, exclusões, tamanhos e hashes SHA-256
**E** permite verificar integridade e correspondência entre os componentes.

**Dado** que uma parte não pode ser gerada
**Quando** os demais componentes permanecem válidos
**Então** a solicitação passa para `Concluída com ressalvas` e o manifesto identifica falhas e ausências
**E** a interface não apresenta sucesso completo.

**Dado** que uma falha compromete coerência, manifesto ou integridade
**Quando** a geração termina
**Então** a solicitação passa para `Falhou` sem disponibilizar pacote enganoso
**E** mantém diagnóstico operacional minimizado e opção segura de nova tentativa.

**Dado** que o pacote está pronto
**Quando** o ator solicita download
**Então** o servidor revalida autenticação recente, Papel, capacidade, tenant, estado e validade
**E** emite acesso privado, temporário e auditado.

**Dado** que a autorização é retirada durante a geração ou antes do download
**Quando** o artefato é solicitado
**Então** a entrega é negada
**E** a autorização inicial não permanece suficiente.

**Dado** que o pacote expira
**Quando** alguém tenta baixá-lo
**Então** o servidor nega o acesso e apresenta o estado `Expirado`
**E** uma nova geração exige nova confirmação e produz novo snapshot.

**Dado** que a mesma confirmação é reenviada com a mesma chave idempotente
**Quando** ocorre duplo acionamento ou falha de rede
**Então** o sistema retorna a mesma solicitação
**E** não duplica geração, pacote ou auditoria.

**Dado** que a Exportação é entregue ao operador externo
**Quando** o usuário conclui o download
**Então** o Burgoweb registra a entrega sem afirmar importação ou aceitação pelo destinatário
**E** nenhuma integração contábil automática é executada.

**Dado** que geração, conclusão, falha, download ou expiração ocorre
**Quando** o estado é persistido
**Então** solicitação, snapshot, manifesto, artefato, auditoria e ciclo de vida permanecem coerentes
**E** os dados exportados não são copiados para logs técnicos.

**Dado** que o fluxo é utilizado em mobile, desktop, teclado ou tecnologia assistiva
**Quando** seleção, revisão, progresso, ressalvas, falha ou download são apresentados
**Então** cumprem WCAG 2.2 AA
**E** sucesso total, sucesso com ressalvas e falha não dependem apenas de cor.

Rastreabilidade: FR-12 parcialmente, FR-13 parcialmente, FR-22 parcialmente, FR-25, FR-26, FR-38–FR-40 parcialmente, FR-45 parcialmente, NFR-1, NFR-3, NFR-5–NFR-9, NFR-11–NFR-14, UX-DR1, UX-DR10, UX-DR14, UX-DR16–UX-DR18, UX-DR20, AD-4–AD-8, AD-11, AD-14–AD-18, AD-22–AD-26 e gates de privacidade, segurança e portabilidade.

### Story 7.2: Registrar validação e substituição da Exportação Financeira

Como Síndico ou Auxiliar autorizado,
Quero registrar a aceitação ou rejeição informada pelo operador externo e gerar substituições quando necessário,
Para que o histórico de entregas financeiras permaneça rastreável sem simular integração contábil.

**Critérios de Aceitação:**

**Dado** que uma Exportação Financeira foi concluída e entregue
**Quando** o ator autorizado registra retorno do operador externo
**Então** seleciona `Aceita`, `Rejeitada` ou `Aceita com ressalvas`
**E** informa operador declarado, instante informado, observação e referência externa quando existente.

**Dado** que o retorno foi comunicado fora do Burgoweb
**Quando** é registrado pela gestão
**Então** a interface identifica que se trata de declaração informada pelo usuário
**E** o sistema não afirma ter autenticado o operador externo ou validado tecnicamente seu sistema.

**Dado** que a Exportação é marcada como aceita
**Quando** o registro é confirmado
**Então** preserva o pacote, snapshot, manifesto e versão entregues
**E** não altera dados financeiros do Burgoweb.

**Dado** que a Exportação é rejeitada
**Quando** o ator registra o retorno
**Então** o sistema exige motivo, categoria e campos ou componentes afetados quando conhecidos
**E** não corrige automaticamente Lançamentos, Movimentos ou Fechamentos.

**Dado** que o operador informa ressalvas
**Quando** o retorno é confirmado
**Então** elas permanecem associadas à Exportação específica
**E** não são convertidas em erro contábil ou obrigação de correção sem análise da gestão.

**Dado** que existe documento ou mensagem comprobatória do retorno
**Quando** é anexado
**Então** permanece privado, em quarentena e autorizado conforme o caso
**E** não se torna Publicação ou Anexo financeiro coletivo.

**Dado** que uma rejeição exige correção dos dados de origem
**Quando** a gestão decide agir
**Então** utiliza os fluxos auditáveis dos domínios correspondentes
**E** a Exportação rejeitada permanece imutável.

**Dado** que uma nova Exportação deve substituir a anterior
**Quando** o ator inicia a substituição
**Então** pode reutilizar o escopo anterior como proposta e revisar todas as seleções
**E** deve autenticar-se recentemente e confirmar nova geração.

**Dado** que a substituição é gerada
**Quando** o novo pacote fica disponível
**Então** recebe identificador, snapshot, manifesto e hashes próprios
**E** mantém relação explícita com a Exportação substituída e o motivo da substituição.

**Dado** que uma Exportação é substituída
**Quando** o histórico é consultado
**Então** identifica a versão mais recente e toda a cadeia anterior
**E** nenhuma versão anterior é sobrescrita ou apresentada como a nova.

**Dado** que o pacote anterior já expirou ou foi eliminado conforme seu ciclo de vida
**Quando** a cadeia é consultada
**Então** metadados, manifesto permitido, hash, retorno e relação de substituição permanecem preservados
**E** o sistema não afirma que o binário continua disponível.

**Dado** que dois atores registram retornos incompatíveis simultaneamente
**Quando** a primeira operação altera a versão
**Então** a segunda recebe conflito `409`
**E** não sobrescreve a manifestação já registrada.

**Dado** que o mesmo retorno é reenviado com a mesma chave idempotente
**Quando** ocorre falha de rede
**Então** o sistema retorna o registro existente
**E** não duplica manifestação, Anexo, notificação ou auditoria.

**Dado** que aceitação, rejeição, ressalva ou substituição é concluída
**Quando** a transação é persistida
**Então** Exportação, retorno, cadeia, Anexos, histórico, auditoria e projeção exportável permanecem coerentes
**E** nenhum estado parcial sugere validação externa inexistente.

**Dado** que o fluxo é utilizado em mobile, desktop, teclado ou tecnologia assistiva
**Quando** retorno, ressalvas, rejeição, comparação ou cadeia são apresentados
**Então** cumprem WCAG 2.2 AA
**E** aceitação, rejeição e substituição não dependem apenas de cor.

Rastreabilidade: FR-22, FR-23 parcialmente, FR-25, FR-26 parcialmente, FR-43 parcialmente, FR-45 parcialmente, NFR-1, NFR-3, NFR-5–NFR-9, NFR-11, NFR-12, NFR-14, UX-DR1, UX-DR6, UX-DR14, UX-DR16–UX-DR20, AD-4–AD-8, AD-11, AD-13–AD-18, AD-23–AD-26.

### Story 7.3: Gerar Exportação Institucional para continuidade

Como Pessoa com capacidade explícita de exportação institucional,
Quero gerar um pacote completo e documentado do Condomínio,
Para que um terceiro possa reconstruir seu acervo e preservar a continuidade institucional fora do Burgoweb.

**Critérios de Aceitação:**

**Dado** que o ator possui capacidade específica de Exportação Institucional
**Quando** inicia a solicitação
**Então** a interface explica alcance, riscos, exclusões obrigatórias, tamanho estimado e diferença para Exportação Financeira, solicitação individual e backup
**E** exige autenticação recente.

**Dado** que o ator não possui capacidade específica ou perdeu autoridade
**Quando** tenta revisar, gerar ou baixar o pacote
**Então** o servidor nega por padrão
**E** não revela contagens, categorias ou existência de dados protegidos.

**Dado** que o escopo institucional é preparado
**Quando** as projeções dos domínios são consolidadas
**Então** inclui dados, relacionamentos, identificadores, histórico e versões necessários à reconstrução por terceiro
**E** documenta cada domínio incluído e sua versão de esquema.

**Dado** que Pessoas, Unidades, Vínculos, Papéis e capacidades integram o pacote
**Quando** são exportados
**Então** preservam relações e vigências necessárias à continuidade
**E** excluem senhas, hashes de senha, tokens, sessões, cookies, peppers, segredos e credenciais.

**Dado** que os domínios financeiros são incluídos
**Quando** o snapshot é formado
**Então** preserva Contas, Lançamentos, Movimentos, serviços, Obrigações, Fechamentos, previsões e relações necessárias
**E** utiliza strings decimais exatas, datas documentadas e timezone do Condomínio.

**Dado** que Publicações e Anexos integram o escopo
**Quando** o pacote é gerado
**Então** inclui versões, audiências, estados, relações, hashes e binários autorizados disponíveis
**E** diferencia originais privados, derivados candidatos, versões compartilháveis, suspensões, tombstones e arquivos ausentes.

**Dado** que Pendências, Comentários, Decisões e histórico são incluídos
**Quando** as projeções são consolidadas
**Então** preservam natureza semântica, versões, estados e relações
**E** não transformam Evento de Auditoria em Comentário ou histórico funcional.

**Dado** que Eventos de Auditoria integram o escopo autorizado
**Quando** são exportados
**Então** utiliza a projeção minimizada permitida e documenta limitações
**E** não inclui logs técnicos, segredos ou conteúdo sensível excessivo.

**Dado** que solicitações LGPD, disputas, incidentes ou evidências possuem restrição jurídica ou operacional
**Quando** o escopo institucional é revisado
**Então** o sistema aplica a política aprovada de inclusão, segregação ou exclusão
**E** o manifesto registra a decisão sem inventar regra enquanto o gate estiver pendente.

**Dado** que um binário está removido, indisponível, em quarentena ou sem autorização
**Quando** o snapshot é formado
**Então** o pacote preserva os metadados e tombstone permitidos e registra a exclusão
**E** não substitui o arquivo ausente por conteúdo vazio apresentado como original.

**Dado** que a revisão final é apresentada
**Quando** o ator prepara a confirmação
**Então** visualiza domínios, período de referência, contagens, binários, exclusões, estimativa de tamanho e riscos
**E** precisa confirmar explicitamente o escopo completo.

**Dado** que a geração é confirmada
**Quando** o servidor revalida autenticação, capacidade, tenant e versões
**Então** cria solicitação assíncrona e fixa um snapshot coerente
**E** mudanças posteriores não são misturadas no pacote.

**Dado** que o pacote é produzido
**Quando** o worker conclui os componentes
**Então** utiliza ZIP64 versionado, manifesto, JSON canônico UTF-8, CSV, documentação e binários autorizados
**E** inclui instruções suficientes para um terceiro compreender estrutura, relações e formatos.

**Dado** que o manifesto institucional é criado
**Quando** os componentes são consolidados
**Então** contém versão, Condomínio, instante, timezone, escopo, exclusões, esquemas, arquivos, contagens, tamanhos e SHA-256
**E** permite verificar integridade de cada componente e do conjunto.

**Dado** que o pacote deve ser utilizável por terceiro
**Quando** sua documentação é validada
**Então** inclui dicionário de dados, chaves relacionais, convenções, estados e limitações conhecidas
**E** não depende de código interno, banco proprietário ou credencial do Burgoweb para interpretação.

**Dado** que um componente não pode ser produzido
**Quando** a ausência não compromete toda a coerência
**Então** a solicitação fica `Concluída com ressalvas` e documenta precisamente a lacuna
**E** exige reconhecimento antes do download.

**Dado** que manifesto, integridade ou coerência global falha
**Quando** a geração termina
**Então** o estado passa para `Falhou` e nenhum pacote é apresentado como utilizável
**E** novas tentativas não reutilizam artefato incompleto como sucesso.

**Dado** que o pacote está disponível
**Quando** o ator solicita download
**Então** o servidor revalida autenticação recente, capacidade, tenant, estado e validade
**E** fornece acesso privado, temporário, auditado e sujeito a limites de abuso.

**Dado** que o download termina
**Quando** o usuário verifica o pacote
**Então** pode conferir manifesto, contagens e hashes sem depender do Burgoweb
**E** divergência de integridade é tratada como falha e não como aviso dispensável.

**Dado** que o artefato expira
**Quando** alguém tenta acessá-lo
**Então** o servidor nega a entrega e preserva metadados, manifesto permitido e auditoria conforme política
**E** nova geração produz novo snapshot e identificador.

**Dado** que a Exportação Institucional é concluída
**Quando** o pacote é entregue
**Então** os dados originais permanecem no Burgoweb conforme retenção
**E** a exportação não elimina, transfere ou encerra automaticamente o Condomínio.

**Dado** que ocorre troca interna de Síndico
**Quando** a continuidade permanece dentro do Burgoweb
**Então** o mesmo Condomínio e seus dados são preservados sem exigir exportação e reimportação
**E** a Exportação Institucional continua sendo um mecanismo de saída ou custódia externa.

**Dado** que o pacote é comparado a backup ou restauração
**Quando** a finalidade é apresentada
**Então** o sistema esclarece que exportação institucional, backup da plataforma e recuperação de desastre são operações distintas
**E** não promete restauração automática do Burgoweb a partir do pacote.

**Dado** que alguém tenta importar automaticamente o pacote
**Quando** utiliza funcionalidades do MVP
**Então** o sistema informa que importação automática está fora do escopo
**E** isso não reduz a obrigação de o pacote ser documentado e reconstruível por terceiro.

**Dado** que a mesma confirmação é reenviada com a mesma chave idempotente
**Quando** ocorre repetição ou falha de rede
**Então** retorna a mesma solicitação
**E** não duplica snapshot, pacote ou auditoria.

**Dado** que geração, falha, download ou expiração é concluído
**Quando** o estado é persistido
**Então** solicitação, snapshot, manifesto, pacote, auditoria e ciclo de vida permanecem coerentes
**E** nenhum segredo ou conteúdo exportado é copiado para logs técnicos.

**Dado** que o fluxo é utilizado em mobile, desktop, teclado ou tecnologia assistiva
**Quando** escopo, riscos, progresso, ressalvas, verificação ou download são apresentados
**Então** cumprem WCAG 2.2 AA
**E** estados e resultados não dependem apenas de cor.

Rastreabilidade: FR-9 parcialmente quanto à continuidade, FR-22 parcialmente, FR-24, FR-26, FR-35 parcialmente, FR-37 parcialmente, FR-45 parcialmente, NFR-1, NFR-3, NFR-5–NFR-9, NFR-11–NFR-15, UX-DR1, UX-DR6, UX-DR12, UX-DR14, UX-DR16–UX-DR20, AD-4–AD-8, AD-11–AD-19, AD-22–AD-26 e gates jurídico, privacidade, segurança, portabilidade, capacidade e retenção.
