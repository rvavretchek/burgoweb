---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
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

<!-- As seções de épicos e histórias serão adicionadas nas próximas etapas do workflow. -->
