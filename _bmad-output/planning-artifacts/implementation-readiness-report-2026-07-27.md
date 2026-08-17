---
stepsCompleted:
  - step-01-document-discovery
  - step-02-prd-analysis
  - step-03-epic-coverage-validation
  - step-04-ux-alignment
  - step-05-epic-quality-review
  - step-06-final-assessment
includedDocuments:
  prd:
    - _bmad-output/planning-artifacts/prd.md
  architecture:
    - _bmad-output/planning-artifacts/architecture.md
    - _bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/ARCHITECTURE-SPINE.md
    - _bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/reviews/review-rubric-walker.md
    - _bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/reviews/review-security-tenancy.md
    - _bmad-output/planning-artifacts/architecture/architecture-burgoweb-2026-07-23/reviews/review-stack.md
  epics:
    - _bmad-output/planning-artifacts/epics.md
  ux:
    - _bmad-output/planning-artifacts/ux.md
excludedDocuments:
  - path: _bmad-output/planning-artifacts/epics-and-stories.md
    reason: Artefato anterior substituído pelo novo epics.md, conforme confirmação do proprietário do produto.
---

# Relatório de Avaliação de Prontidão para Implementação

**Data:** 2026-07-27
**Projeto:** burgoweb

## 1. Inventário documental

### PRD

- `prd.md` — documento integral selecionado.
- Nenhuma versão fragmentada encontrada.

### Arquitetura

- `architecture.md` — documento integral selecionado.
- `ARCHITECTURE-SPINE.md` e os relatórios `review-rubric-walker.md`, `review-security-tenancy.md` e `review-stack.md` — pacote arquitetural complementar selecionado.
- O diretório complementar não possui `index.md` concorrente e será tratado como parte do mesmo conjunto arquitetural.

### Épicos e histórias

- `epics.md` — backlog final selecionado.
- `epics-and-stories.md` — excluído por ser artefato anterior substituído, conforme confirmação explícita do proprietário do produto.

### UX

- `ux.md` — documento integral selecionado.
- Nenhuma versão fragmentada encontrada.

### Resultado da descoberta

Os quatro conjuntos documentais obrigatórios foram localizados. A duplicidade de épicos foi resolvida antes da análise e não permanece ambiguidade sobre os arquivos selecionados.

## 2. Análise do PRD

### Requisitos funcionais

- **FR-1:** O visitante pode compreender a proposta gratuita, o público atendido e o compromisso de organização e transparência antes de criar uma Conta.
- **FR-2:** O visitante pode selecionar **Utilize gratuitamente** para iniciar a criação da Conta e do Condomínio.
- **FR-3:** O responsável pode criar sua Conta e um Condomínio em um único fluxo orientado.
- **FR-4:** A pessoa pode autenticar-se, encerrar sua sessão e recuperar o acesso à Conta por meio do controle do e-mail verificado.
- **FR-5:** Uma Conta acessa somente Condomínios e dados cobertos por Vínculos ativos e Papéis autorizados.
- **FR-6:** O Síndico ou o Auxiliar Administrativo autorizado pode cadastrar Pessoas, seus e-mails e seus Vínculos com Unidades.
- **FR-7:** O Síndico ou o Auxiliar Administrativo com capacidade delegada pode enviar, reenviar, acompanhar, cancelar e expirar Convites; o destinatário pode ativar ou associar sua Conta sem criar identidade duplicada indevida.
- **FR-8:** O Síndico pode conceder, suspender e revogar Papéis subordinados e delegar capacidades explícitas ao Auxiliar Administrativo, preservando quem realizou ações históricas. Um Auxiliar Administrativo com a capacidade delegada correspondente pode aplicar suspensão urgente e reversível; somente o Síndico confirma a revogação permanente desses Papéis.
- **FR-9:** O Condomínio pode substituir o Síndico ou Auxiliares Administrativos sem perder dados, histórico ou acesso institucional autorizado. A troca distingue transferência cooperativa, recuperação operacional e transferência contestada.
- **FR-10:** O Síndico ou o Auxiliar Administrativo autorizado pode criar, corrigir e classificar Lançamentos de receita e despesa com descrição, categoria, competência, vencimento, valor previsto, Conta Financeira, situação, contraparte e Anexo quando aplicáveis.
- **FR-11:** O Síndico ou o Auxiliar Administrativo autorizado pode registrar um serviço com descrição, valor, forma de pagamento e progresso da parcela no formato `x de n`.
- **FR-12:** O Síndico e os Auxiliares Administrativos com a capacidade delegada correspondente podem consultar por Conta Financeira saldo inicial, Movimentos, saldo final, receitas e despesas realizadas, valores previstos e compromissos futuros conforme a matriz de visibilidade.
- **FR-13:** O Síndico ou o Auxiliar Administrativo autorizado pode conduzir um período por `Aberto`, `Conferido`, `Fechado` e `Publicado`, criando snapshot auditável no Fechamento.
- **FR-14:** O Síndico ou o Auxiliar Administrativo autorizado pode associar foto ou arquivo a um Lançamento, mas o Anexo não é publicado automaticamente a Moradores ou Conselheiros.
- **FR-15:** O Condomínio pode operar internamente antes de cadastrar Moradores. Depois do primeiro cadastro destinado ao acesso de Morador, a transparência financeira coletiva não pode ser desativada unilateralmente. Somente uma Publicação específica pode ser suspensa nas hipóteses previstas, sem apagar seu histórico nem afetar as demais Publicações.
- **FR-16:** O Morador pode consultar Contas Financeiras, receitas, despesas, serviços, parcelamentos e prestações publicadas do Condomínio, sem acessar os demais dados administrativos internos.
- **FR-17:** Moradores e Conselheiros visualizam mão de obra direta, salários, encargos, benefícios e horas extras somente de forma agregada, com reagrupamento ou supressão quando houver risco evidente de reidentificação.
- **FR-18:** Relatórios gerais, telas destinadas ao Papel Conselheiro e materiais de assembleia apresentam inadimplência somente de forma agregada, sem nome nem identificação de Unidade.
- **FR-19:** Somente o Síndico, o Auxiliar Administrativo especificamente autorizado e o Responsável Financeiro da própria Unidade podem consultar detalhes de inadimplência por Unidade, dentro de seus respectivos limites.
- **FR-20:** O Conselheiro pode consultar caixa, fluxo de caixa, receitas, despesas e previsões, mas não cadastros, inadimplência individual, dados trabalhistas individuais ou Dados Pessoais presentes em Anexos não saneados.
- **FR-21:** O Síndico ou o Auxiliar Administrativo com capacidade específica pode criar Pendências internas com título, descrição, categoria e prioridade opcionais, responsável, prazo, estado, comentários, histórico e referências permitidas.
- **FR-22:** O sistema preserva autor, instante e natureza das mudanças relevantes em Lançamentos, Fechamentos, Publicações, acessos e Pendências.
- **FR-23:** Comentários, Decisões Operacionais e Eventos de Auditoria são distinguíveis, possuem semânticas próprias e seguem permissões específicas.
- **FR-24:** O Síndico ou outro Papel explicitamente autorizado pode gerar snapshot institucional completo, documentado e utilizável por terceiro para continuidade, auditoria ou saída do Burgoweb.
- **FR-25:** O Síndico ou o Auxiliar Administrativo autorizado pode gerar Exportação Financeira selecionando período, categorias, Lançamentos, referências e Anexos necessários ao operador externo, sem exigir que o Burgoweb execute escrituração contábil.
- **FR-26:** O sistema registra quem solicitou a Exportação Institucional, quando ela ocorreu e qual escopo foi incluído; arquivos gerados recebem acesso restrito e ciclo de vida controlado.
- **FR-27:** Comunicados, Fechamentos, prestações e demais snapshots publicados possuem versões imutáveis; corrigir conteúdo publicado cria uma nova Versão Publicada.
- **FR-28:** O Síndico, o Auxiliar Administrativo com a capacidade delegada correspondente ou o operador do Burgoweb, diante de incidente técnico, pode suspender imediatamente uma Publicação específica por possível exposição excessiva, erro material, incidente de segurança ou não conformidade.
- **FR-29:** Cada Condomínio possui um SLA finito para corrigir, republicar ou justificar a continuidade de uma Suspensão de Publicação, com padrão inicial de 72 horas. O Síndico pode configurar o prazo para casos futuros; o SLA mede o tratamento e não autoriza republicação automática.
- **FR-30:** A Pessoa pode iniciar uma solicitação sobre seus Dados Pessoais. O sistema autentica o solicitante, encaminha a solicitação ao responsável definido para sua categoria e registra o pedido, a decisão e a resposta.
- **FR-31:** O Síndico pode designar Pessoas para receber alertas e apoiar a recuperação operacional sem conceder a elas, por essa designação, Papel administrativo ou acesso adicional aos dados do Condomínio.
- **FR-32:** Uma Pessoa pode registrar pedido contestado de transferência, declarar sua autoridade e apresentar evidências, sem receber acesso aos dados enquanto a disputa não for resolvida.
- **FR-33:** O Burgoweb pode suspender uma Conta administrativa sob suspeita de comprometimento sem transferir automaticamente sua autoridade.
- **FR-34:** O Síndico ou o Auxiliar Administrativo com a capacidade delegada correspondente pode publicar conteúdo institucional após conferir uma pré-visualização da versão e da audiência; Morador e Conselheiro não publicam conteúdo institucional no MVP.
- **FR-35:** O Anexo original permanece privado; qualquer versão compartilhável é um objeto distinto, associado explicitamente a uma audiência e a uma Versão Publicada.
- **FR-36:** Corrigir conteúdo publicado cria nova versão e comunica à audiência quando a mudança alterar valor, período, audiência ou Anexo.
- **FR-37:** Cada Condomínio possui Cota de Armazenamento configurável e pode acompanhar consumo, disponibilidade e alertas antes do esgotamento.
- **FR-38:** O Síndico ou o Auxiliar Administrativo autorizado pode criar, ativar e encerrar Contas Financeiras com nome, tipo, saldo inicial e data de referência.
- **FR-39:** O Síndico ou o Auxiliar Administrativo autorizado pode criar individualmente ou em lote Obrigações da Unidade para uma competência, sem emitir boleto ou iniciar cobrança automática.
- **FR-40:** O sistema apresenta receitas esperadas, despesas esperadas, parcelas futuras, Obrigações em aberto e saldo projetado separadamente do caixa realizado.
- **FR-41:** O Síndico pode delegar individualmente ao Auxiliar Administrativo capacidades para Pessoas/Unidades/Vínculos, Convites, suspensão urgente, Lançamentos, Obrigações, Movimentos, Fechamentos, Publicações, Anexos originais, Pendências, Exportações, solicitações de titulares e tratamento de suspensões.
- **FR-42:** O Síndico ou Auxiliar com capacidade de gerir Vínculos pode atribuir ou remover Responsável Financeiro por relação Pessoa-Unidade.
- **FR-43:** Uma Pessoa com acesso ao objeto pode comentar sem alterar automaticamente estado, responsável, prazo ou Decisão Operacional.
- **FR-44:** O Síndico ou Auxiliar com capacidade específica pode confirmar Decisão Operacional com título, contexto, resultado, responsável, data, alcance, visibilidade e objetos relacionados.
- **FR-45:** O sistema gera Evento de Auditoria para autenticação e recuperação, Convites, Vínculos, Papéis e capacidades, ações financeiras, Fechamentos, Publicações, Anexos, Exportações, solicitações de titulares, transferência de gestão e alteração de Cota de Armazenamento.

**Total de requisitos funcionais: 45.** As consequências testáveis associadas a cada requisito no PRD permanecem parte normativa do requisito e serão consideradas na validação de cobertura, ainda que a lista acima reproduza o enunciado principal integral de cada FR.

### Requisitos não funcionais

- **NFR-1:** O produto deve coletar e expor apenas dados necessários à finalidade de cada fluxo.
- **NFR-2:** Conteúdo coletivo deve ocultar, agregar ou reagrupar Dados Pessoais quando atender aos critérios de risco de reidentificação definidos na política de privacidade aprovada para o lançamento.
- **NFR-3:** Toda operação de tratamento relevante deve possuir finalidade, acesso, retenção e base legal documentáveis antes do lançamento público.
- **NFR-4:** O produto deve oferecer canal, autenticação, encaminhamento, estado, resposta justificada e trilha de auditoria para solicitações de titulares aplicáveis.
- **NFR-5:** A política de retenção deve abranger somente dados efetivamente mantidos no Burgoweb. A exportação ao contador não encerra o tratamento das cópias remanescentes.
- **NFR-6:** A autorização deve ser verificada no servidor em toda operação protegida, considerando Conta, Condomínio, Vínculo e Papel.
- **NFR-7:** Nenhum identificador previsível ou manipulação de requisição pode permitir acesso cruzado entre Condomínios.
- **NFR-8:** Credenciais, sessões, segredos e dados armazenados ou transmitidos devem atender aos controles definidos no baseline de segurança aprovado pela arquitetura para cada classe de risco.
- **NFR-9:** Eventos relevantes de autenticação, permissão, publicação, alteração financeira e exportação devem ser auditáveis sem registrar segredos ou dados excessivos.
- **NFR-10:** Antes do lançamento, o produto deve possuir procedimento verificável para detectar, conter, preservar evidências, avaliar impacto, corrigir, restaurar, comunicar quando aplicável e revisar incidentes de confidencialidade, integridade ou disponibilidade.
- **NFR-10A:** O procedimento deve cobrir, no mínimo, Conta comprometida, Convite ou recuperação abusados, sessão não revogada, acesso entre Condomínios, Publicação ou exportação indevida, exposição de banco ou backup, vazamento de segredo, alteração não autorizada e perda de dados.
- **NFR-11:** Os fluxos críticos devem ser utilizáveis por teclado, com foco visível, rótulos compreensíveis, contraste adequado e mensagens que não dependam somente de cor.
- **NFR-12:** Landing page, criação da Conta e do Condomínio, autenticação, convite, registro financeiro, publicação e consulta devem funcionar em telas móveis e desktop suportadas.
- **NFR-13:** Linguagem financeira e administrativa deve ser compreensível para usuários sem formação técnica ou contábil.
- **NFR-14:** Operações de gravação não podem produzir duplicidade silenciosa diante de repetição, falha de rede ou reenvio.
- **NFR-15:** O sistema deve possuir backup e restauração testados, com objetivos de recuperação definidos antes do lançamento.
- **NFR-16:** Metas quantitativas de disponibilidade, latência, capacidade e recuperação serão propostas pela arquitetura somente após medir a infraestrutura disponível, custos, carga de referência e capacidade operacional; o gate de lançamento validará os limites aprovados.
- **NFR-17:** O MVP não pode depender de NOC, plantão permanente ou equipe dedicada; a operação inicial será realizada por uma pessoa com disponibilidade parcial e responsabilidades externas.
- **NFR-18:** A arquitetura deve reduzir tarefas manuais recorrentes, oferecer diagnóstico suficiente para investigação posterior e definir verificações proporcionais ao risco mesmo sem monitoração ativa inicial.
- **NFR-19:** Limitações de disponibilidade, suporte, manutenção, recuperação e capacidade devem ser documentadas e comunicadas de forma compatível com a realidade operacional.
- **NFR-20:** Nenhuma meta operacional será apresentada como compromisso público antes de existir evidência de que infraestrutura e rotina do operador conseguem sustentá-la.

**Total de identificadores de requisitos não funcionais: 21.** O total inclui o requisito complementar NFR-10A.

### Requisitos e restrições adicionais

- A matriz de visibilidade do MVP é normativa por Papel: dados coletivos sensíveis devem ser agregados; inadimplência individual restringe-se à gestão autorizada e ao Responsável Financeiro da própria Unidade; Anexos originais são privados.
- O MVP inclui os fluxos de entrada, identidade e acesso, gestão financeira, publicação, portabilidade, continuidade, privacidade, auditoria e cota de Anexos enumerados na seção 7.1 do PRD.
- Permanecem explicitamente fora do MVP boletos, folha de pagamento, escrituração contábil, NF-e/NFS-e estruturada, biometria/CFTV, automação bancária, aplicativos nativos, votação eletrônica, Papéis personalizados e demais itens da seção 7.2.
- A implementação será **greenfield dentro do repositório existente**. O protótipo não estabelece compatibilidade de API, migração, endpoints ou reutilização obrigatória; só pode ser reaproveitado mediante conformidade integral demonstrada.
- O lançamento público depende dos cinco gates: jurídico/LGPD, segurança, privacidade, portabilidade e qualidade/capacidade.
- Bases legais, retenção, papéis de tratamento, parâmetros operacionais, contrato técnico de Exportação e limites de armazenamento permanecem questões abertas com responsáveis e marcos definidos.
- As decisões jurídicas são provisórias: inadimplência coletiva agregada, Conselheiros sem Dados Pessoais, Anexos privados por padrão e nenhuma base legal ou retenção presumida como definitivamente aprovada até parecer profissional.
- A transparência coletiva, uma vez ativada pelo primeiro cadastro de Morador, não pode ser desligada em bloco; apenas Publicações específicas admitem suspensão auditável.
- O núcleo gratuito e a portabilidade dos dados do Condomínio são restrições de produto; monetização do núcleo gratuito não integra o escopo aprovado.

### Avaliação inicial da completude do PRD

O PRD apresenta requisitos numerados, consequências testáveis, matriz de visibilidade, limites do MVP, baseline brownfield, métricas e gates de lançamento. A extração não revelou lacunas de numeração entre FR-1 e FR-45 nem entre NFR-1 e NFR-20; NFR-10A é um complemento intencional. A principal condicionante de prontidão não é ausência de escopo funcional, mas a existência deliberada de decisões jurídicas e metas operacionais ainda abertas, que devem permanecer gates de lançamento e ser verificadas quanto à representação nos épicos e na arquitetura.

## 3. Validação da cobertura dos épicos

### Cobertura de requisitos funcionais extraída

O mapa de cobertura do `epics.md` atribui FR-1–FR-9, FR-41 e FR-42 ao Épico 1; FR-10–FR-13 e FR-38–FR-40 ao Épico 2; FR-14 e FR-37 ao Épico 3; FR-15–FR-20, FR-27–FR-29 e FR-34–FR-36 ao Épico 4; FR-21–FR-23 e FR-43–FR-45 ao Épico 5; FR-30–FR-33 ao Épico 6; e FR-24–FR-26 ao Épico 7.

Além da declaração por épico, todos os FRs aparecem na rastreabilidade de pelo menos uma história concreta. A matriz abaixo aponta a cobertura primária; “e correlatas” indica que critérios complementares aparecem em outras histórias do mesmo ou de outro épico.

### Matriz de cobertura

| FR | Requisito do PRD | Cobertura primária efetiva | Status |
|---|---|---|---|
| FR-1 | Apresentação pública | Épico 1 / Story 1.1 | Coberto |
| FR-2 | CTA de início | Épico 1 / Story 1.1 | Coberto |
| FR-3 | Criação conjunta | Épico 1 / Stories 1.2–1.3 | Coberto |
| FR-4 | Autenticação da Conta | Épico 1 / Stories 1.3–1.5 | Coberto |
| FR-5 | Isolamento por Condomínio | Épico 1 / Stories 1.2–1.11 e correlatas | Coberto |
| FR-6 | Cadastro de Pessoas e Unidades | Épico 1 / Story 1.6 | Coberto |
| FR-7 | Convite e ativação | Épico 1 / Story 1.7 | Coberto |
| FR-8 | Gestão temporal de Papéis | Épico 1 / Stories 1.7–1.9 e 1.11 | Coberto |
| FR-9 | Troca de gestão | Épico 1 / Story 1.11; Épico 6 / Stories 6.3–6.5 | Coberto |
| FR-10 | Lançamentos financeiros | Épico 2 / Stories 2.2–2.8 | Coberto |
| FR-11 | Serviços e parcelamentos | Épico 2 / Story 2.4 e correlatas | Coberto |
| FR-12 | Caixa e previsões | Épico 2 / Stories 2.1–2.8 | Coberto |
| FR-13 | Fechamento do período | Épico 2 / Story 2.8; publicação no Épico 4 | Coberto |
| FR-14 | Anexo privado por padrão | Épico 3 / Stories 3.1–3.5 | Coberto |
| FR-15 | Ativação da transparência coletiva | Épico 4 / Stories 4.1, 4.4 e 4.8 | Coberto |
| FR-16 | Visão do Morador | Épico 4 / Stories 4.4–4.5 | Coberto |
| FR-17 | Proteção de informações trabalhistas | Épico 4 / Stories 4.2, 4.4 e 4.6 | Coberto |
| FR-18 | Inadimplência agregada | Épico 4 / Stories 4.2, 4.4–4.6 | Coberto |
| FR-19 | Inadimplência detalhada restrita | Épico 4 / Story 4.5; fundações nas Stories 1.10 e 2.5 | Coberto |
| FR-20 | Visão do Conselheiro | Épico 4 / Story 4.6; original privado na Story 3.2 | Coberto |
| FR-21 | Ciclo de Pendências | Épico 5 / Stories 5.1–5.2 e correlatas | Coberto |
| FR-22 | Histórico compreensível | Épico 5 / Stories 5.2–5.6 e critérios transversais | Coberto |
| FR-23 | Separação de registros | Épico 5 / Stories 5.1–5.6 | Coberto |
| FR-24 | Exportação Institucional autorizada | Épico 7 / Story 7.3 | Coberto |
| FR-25 | Exportação financeira | Épico 7 / Stories 7.1–7.2 | Coberto |
| FR-26 | Registro e proteção da exportação | Épico 7 / Stories 7.1–7.3; auditoria na Story 5.6 | Coberto |
| FR-27 | Versionamento de conteúdo publicado | Épico 4 / Stories 4.2–4.8 | Coberto |
| FR-28 | Suspensão excepcional de Publicação | Épico 4 / Story 4.8; incidente na Story 6.6 | Coberto |
| FR-29 | SLA de tratamento da suspensão | Épico 4 / Story 4.8 | Coberto |
| FR-30 | Atendimento a direitos sobre Dados Pessoais | Épico 6 / Stories 6.1–6.2 e 6.6 | Coberto, condicionado ao gate jurídico |
| FR-31 | Contatos de Continuidade | Épico 6 / Story 6.3 | Coberto |
| FR-32 | Transferência contestada | Épico 6 / Stories 6.4 e 6.6 | Coberto, condicionado ao gate jurídico |
| FR-33 | Contenção de Conta administrativa comprometida | Épico 6 / Stories 6.5–6.6 e critérios da Story 1.5 | Coberto |
| FR-34 | Conferência e autorização da Publicação | Épico 4 / Stories 4.2–4.3 e 4.7–4.8 | Coberto |
| FR-35 | Original e versão compartilhável do Anexo | Épico 4 / Stories 4.2–4.7; preparação privada no Épico 3 | Coberto |
| FR-36 | Correção e comunicação da Publicação | Épico 4 / Stories 4.7–4.8 | Coberto |
| FR-37 | Cota de Armazenamento de Anexos | Épico 3 / Stories 3.1–3.5 | Coberto |
| FR-38 | Contas Financeiras | Épico 2 / Stories 2.1–2.3 e correlatas | Coberto |
| FR-39 | Obrigações por Unidade | Épico 2 / Stories 2.5, 2.7–2.8 | Coberto |
| FR-40 | Previsões financeiras | Épico 2 / Stories 2.2–2.8 | Coberto |
| FR-41 | Capacidades do Auxiliar Administrativo | Épico 1 / Stories 1.8–1.10 | Coberto |
| FR-42 | Atribuição de Responsável Financeiro | Épico 1 / Story 1.10; uso nas Stories 2.5 e 4.5 | Coberto |
| FR-43 | Comentários versionados | Épico 5 / Stories 5.1, 5.3, 5.5–5.6 | Coberto |
| FR-44 | Decisões Operacionais | Épico 5 / Stories 5.4–5.6 | Coberto |
| FR-45 | Eventos de Auditoria | Épico 5 / Story 5.6 e critérios transversais | Coberto |

### Requisitos sem cobertura

Nenhum requisito funcional do PRD ficou sem épico e sem história. Também não foram encontrados identificadores `FR-*` no mapa de épicos que não existam no PRD.

Os condicionamentos jurídicos de FR-30 e FR-32, assim como aspectos pós-saída ligados a FR-6, FR-19 e FR-42, não são ausência de cobertura: as histórias registram explicitamente o bloqueio por gate e evitam converter a pendência jurídica em decisão de produto silenciosa.

### Estatísticas de cobertura

- Total de FRs no PRD: **45**.
- FRs declarados no mapa de épicos: **45**.
- FRs rastreados por histórias concretas: **45**.
- FRs ausentes: **0**.
- Cobertura funcional: **100%**.

## 4. Avaliação de alinhamento de UX

### Situação do documento de UX

O documento `_bmad-output/planning-artifacts/ux.md` existe, mas permanece marcado como **`status: draft`**, com criação e última atualização em 2026-07-21. Ele é anterior ao PRD final, à arquitetura final e à decomposição final de épicos. Não há pacote UX final ou documento fragmentado complementar no inventário selecionado.

### Alinhamento UX ↔ PRD

Há alinhamento nos princípios gerais de simplicidade, clareza, linguagem acessível, transparência, controle, Pendências e histórico. Entretanto, o documento de UX não cobre grande parte do MVP final: onboarding, autenticação e Convites, gestão de Vínculos/Papéis/capacidades, finanças e Fechamento, visibilidade por Papel, publicação versionada, Anexos/quarentena/cota, inadimplência privada, exportações, LGPD, continuidade, incidentes e estados excepcionais.

Foram identificados conflitos objetivos:

- O Fluxo A termina em **“Salva e publica”** a Pendência. O PRD (FR-21, FR-23, FR-34 e FR-44) exige que Pendência, Comentário e Decisão permaneçam internos e que qualquer comunicação a Moradores seja uma Publicação separada e explicitamente autorizada.
- A persona/cenários e a navegação sugerem que Morador acompanha “demandas”, Pendências e histórico genérico. A matriz de visibilidade do PRD restringe Pendências administrativas ao Síndico/Auxiliar e, excepcionalmente, Pendência fiscal explicitamente marcada ao Conselheiro; Morador recebe apenas resultado por Publicação.
- “Permissões básicas” não representa o modelo final de Papéis, capacidades granulares, vigências, Responsável Financeiro por Unidade e negação server-side.
- O UX não distingue natureza do conteúdo, audiência efetiva e estado editorial, distinção essencial às decisões finais sobre Publicação geral, Comunicado privado e cobrança.
- Não há especificação suficiente de estados vazio, carregamento, validação, conflito, acesso negado, indisponibilidade, quarentena, expiração ou recuperação, embora esses estados sejam exigidos pelo PRD e pelas histórias.

O `epics.md` introduz UX-DR1–UX-DR23 e corrige explicitamente os conflitos, inclusive a separação entre conteúdo interno/publicado e as regras de audiência. Isso torna o backlog mais alinhado ao PRD do que o próprio `ux.md`, mas não transforma automaticamente o UX draft em artefato final canônico.

### Alinhamento UX ↔ arquitetura

A arquitetura oferece suporte adequado aos requisitos UX finais que aparecem no PRD e nos épicos:

- AD-1 e AD-3 estabelecem aplicação web separada e contrato HTTP gerado.
- AD-8, AD-12, AD-13 e AD-25 sustentam autorização granular, estados editoriais, originais/derivados privados e máquinas de estado.
- AD-11 e AD-17 suportam conflitos, idempotência, processamento assíncrono e estados recuperáveis.
- AD-24 e AD-26 tornam responsividade, teclado, foco, WCAG 2.2 AA, E2E e revisão humana parte do gate.
- O mapa de capacidades localiza a experiência web em `apps/web` e design system.

Não foi identificado impedimento arquitetural para implementar os requisitos UX reconciliados. Contudo, a arquitetura deliberadamente não substitui arquitetura da informação, fluxos, componentes, conteúdo, comportamento responsivo e critérios de usabilidade próprios de um UX final.

### Problemas e avisos

1. **Alta prioridade — ausência de UX final consolidado:** o artefato selecionado está em draft e não representa o escopo final. Antes de executar histórias intensivas em interface, deve ser atualizado e aprovado ou formalmente substituído por um UX final que incorpore UX-DR1–UX-DR23.
2. **Alta prioridade — conflitos de autorização/publicação:** remover do UX o fluxo implícito “salvar e publicar” Pendência e qualquer acesso genérico de Morador a Pendências internas.
3. **Média prioridade — cobertura insuficiente dos fluxos críticos:** documentar jornadas, arquitetura de informação, estados, componentes e critérios verificáveis para todos os domínios do MVP.
4. **Média prioridade — status e precedência:** registrar no novo UX quais partes do documento de 2026-07-21 foram substituídas, evitando que implementação futura siga o desenho obsoleto em vez do PRD/épicos.

### Conclusão de alinhamento

**Alinhamento parcial, com ressalva alta.** PRD, arquitetura e `epics.md` estão materialmente reconciliados; o documento de UX não está. Essa lacuna não impede o Sprint Planning técnico inicial se o sprint se limitar ao bootstrap e a fluxos já completamente especificados nas histórias, mas impede declarar o conjunto documental integralmente pronto para implementação de todo o produto sem uma atualização/aprovação do UX.

## 5. Revisão de qualidade dos épicos e histórias

### Estrutura e valor dos épicos

| Épico | Resultado para o usuário/stakeholder | Independência progressiva | Avaliação |
|---|---|---|---|
| 1 — Começar a gestão e formar uma equipe autorizada | Permite entrar, criar o Condomínio e formar equipe com autoridade delimitada | Funciona como base autônoma e habilita os demais | Conforme |
| 2 — Organização e controle financeiro | Permite registrar e compreender a operação financeira | Depende apenas da identidade/autorização do Épico 1; Anexos são opcionais | Conforme |
| 3 — Guardar documentos com privacidade e controle de espaço | Permite armazenar e gerir documentos privados | Funciona após a base do Épico 1; não depende da publicação futura | Conforme |
| 4 — Prestar contas e fiscalizar com transparência segura | Entrega Publicação e consulta por Morador/Conselheiro | Usa finanças e documentos dos Épicos 2/3, ambos anteriores | Conforme |
| 5 — Coordenar o trabalho e preservar decisões confiáveis | Entrega Pendências, colaboração, decisões e consulta de auditoria | Usa identidade e pode iniciar Publicação já entregue no Épico 4 | Conforme |
| 6 — Proteger dados e preservar autoridade | Entrega LGPD, continuidade, disputa, contenção e incidentes | Usa capacidades anteriores e bloqueia execução juridicamente não aprovada | Conforme com gate |
| 7 — Garantir portabilidade e continuidade institucional | Entrega Exportações utilizáveis e verificáveis | Compõe dados e projeções produzidos pelos épicos anteriores | Conforme |

Os títulos e objetivos são orientados a resultado, não a componentes técnicos. O bootstrap greenfield foi incorporado à primeira fatia de valor (Story 1.1), evitando um épico de infraestrutura sem resultado demonstrável.

### Dependências

- Não foi encontrada história que dependa de uma história numericamente posterior para cumprir seu resultado principal.
- O Épico 2 permite registrar fatos financeiros sem Anexo; portanto não depende do Épico 3.
- A Story 3.3 prepara derivado privado e declara corretamente que audiência e Publicação pertencem ao Épico 4; o derivado continua sendo um resultado utilizável por revisão editorial e não cria dependência funcional para concluir a Story 3.3.
- As referências das Stories 5.1 e 5.4 ao fluxo de Publicação apontam para o Épico 4, já anterior.
- A Story 6.4 encaminha transferência cooperativa ao Épico 1 e mantém bloqueada a execução contestada não aprovada; não antecipa decisão jurídica.
- O Épico 7 sucede intencionalmente os demais porque a Exportação Institucional deve compor o conjunto completo. Isso é dependência regressiva válida.

### Qualidade e tamanho das histórias

As 47 histórias seguem a estrutura “Como/Quero/Para” e possuem **695 cenários BDD em português** (`Dado/Quando/Então/E`), média de 14,8 cenários por história. Os critérios cobrem happy path, autorização, isolamento, concorrência, falhas, acessibilidade, auditoria e estados de recuperação com alto grau de especificidade.

Não há critérios vagos do tipo “funciona corretamente”; os resultados são verificáveis. A criação de schemas, tabelas e adapters aparece junto à primeira história que necessita do dado ou fluxo, e não como modelagem antecipada de todos os domínios.

### Violações críticas

Nenhuma violação crítica encontrada: não há épico puramente técnico, dependência futura bloqueante ou história sem resultado de usuário.

### Problemas maiores

1. **Histórias excessivamente grandes:**
   - Story 2.5 — 23 cenários, aproximadamente 1.056 palavras de corpo.
   - Story 2.8 — 24 cenários, aproximadamente 1.092 palavras.
   - Story 7.3 — 27 cenários, aproximadamente 1.055 palavras.

   Cada uma combina múltiplas preocupações de persistência, autorização, UI, auditoria, concorrência, acessibilidade e comportamento operacional. Mesmo que semanticamente coesas, há risco de exceder uma unidade de execução/revisão. Antes de comprometê-las em sprint, recomenda-se estimar e, se necessário, dividi-las em fatias verticais que preservem resultado demonstrável e não criem dependência para frente.

2. **Pipeline CI não está explicitamente aceito na primeira história:** AD-24 exige validação em CI, mas a Story 1.1 exige apenas build e testes fundamentais reproduzíveis. O backlog não contém critério inequívoco para criar/ativar o pipeline que valida OpenAPI/cliente, fronteiras de importação e testes iniciais. Recomenda-se acrescentar à Story 1.1 um cenário de CI mínimo, expandido incrementalmente por história.

### Preocupações menores

1. **Densidade dos critérios:** 21 histórias têm 15 ou mais cenários. Isso melhora a cobertura, mas pode dificultar estimativa e revisão. O Sprint Planning deve distinguir critério do domínio, guardrail transversal reutilizável e evidência do gate para evitar repetição operacional sem perder obrigatoriedade.
2. **Starter template:** a arquitetura não prescreve um repositório/template externo; prescreve um Structural Seed. A Story 1.1 cobre monorepo, lockfile e smoke tests, portanto não há ausência de “clonar starter”, mas convém registrar explicitamente no planejamento que o seed arquitetural é o ponto de partida aprovado.
3. **Critérios juridicamente diferidos:** Stories 1.6, 1.10, 2.5, 4.2, 4.5, 6.1, 6.2 e 6.4 mantêm gates explícitos. Esses critérios devem entrar no Sprint Planning como bloqueios/feature flags ou escopo de registro sem execução definitiva, nunca como autorização para inventar a decisão pendente.

### Conclusão de qualidade

Os épicos atendem às boas práticas de valor, ordenação e rastreabilidade. A qualidade dos critérios é alta, mas o backlog precisa de uma decisão operacional antes do sprint sobre a divisão das três histórias muito grandes e de um critério explícito para o pipeline CI inicial.

## 6. Síntese e recomendações

### Status geral de prontidão

**NEEDS WORK — requer ajustes antes de declarar prontidão integral para implementação.**

O conjunto possui PRD final completo, arquitetura final aprovada, 100% de cobertura dos 45 FRs e backlog orientado a valor sem dependências futuras bloqueantes. A arquitetura foi aprovada pelos gates de rubric, segurança/tenancy e stack; o último permanece **PASS WITH CONDITIONS**, com smoke test do TanStack Start/Router e pins/digests operacionais a comprovar no bootstrap.

O status não é `READY` porque o único documento de UX selecionado continua em draft, está incompleto e contém conflitos diretos com o PRD. As correções existem no `epics.md`, mas não foram consolidadas num UX final. Há também duas correções de backlog recomendadas antes do compromisso de sprint: CI explícito e avaliação/divisão de histórias grandes.

### Questões críticas que exigem ação imediata

Não foi encontrada falha crítica de cobertura funcional, arquitetura ou ordenação que obrigue descartar o backlog.

Existe, porém, **uma ressalva alta bloqueante para a declaração de prontidão integral**:

1. **UX final ausente e UX draft conflitante:** consolidar e aprovar um artefato UX final alinhado ao PRD e aos UX-DR1–UX-DR23. Em particular, eliminar “salva e publica” para Pendência e o acesso genérico de Morador a registros administrativos internos.

### Outras questões que requerem atenção

2. **Pipeline CI não explícito:** incluir na Story 1.1 critérios para pipeline mínimo que execute build, testes, contrato OpenAPI/cliente e fronteiras estruturais, expandindo-o incrementalmente.
3. **Tamanho das Stories 2.5, 2.8 e 7.3:** estimar antes do sprint e dividir se não couberem numa unidade segura de implementação/revisão.
4. **Gates jurídicos pendentes:** manter bloqueadas as decisões sobre cobrança/vínculo pós-saída, execução de transferência contestada, bases legais, retenção e direitos de titulares até o parecer consolidado; implementar apenas comportamento provisório explicitamente aprovado.
5. **Condições da stack:** a Story 1.1 deve produzir evidência do smoke test TanStack/TypeScript e o baseline operacional deve fixar Salt, Grafana e Alloy por patch/digest antes do provisionamento.

### Próximos passos recomendados

1. Atualizar e aprovar `ux.md`, incorporando o escopo final, jornadas, arquitetura de informação, estados, audiências, componentes, responsividade e critérios de acessibilidade de UX-DR1–UX-DR23.
2. Corrigir o `epics.md` com o cenário de CI na Story 1.1 e registrar a decisão de manter ou dividir Stories 2.5, 2.8 e 7.3.
3. Reexecutar este gate de prontidão após essas correções; se não surgirem novos conflitos, avançar ao Sprint Planning.
4. Enquanto o parecer jurídico não chega, o Sprint Planning pode preparar somente histórias não bloqueadas e tarefas de infraestrutura/evidência, marcando dependências jurídicas de forma visível e sem transformar provisões em decisões definitivas.
5. No primeiro sprint, tratar os smoke tests e pins da stack como evidência de aceite do bootstrap, não como pendência informal posterior.

### Nota final

A avaliação identificou **5 questões acionáveis em 3 categorias**: documentação UX, qualidade/operacionalização do backlog e gates/condições externos. Nenhuma reduz a cobertura funcional de 100% nem invalida a arquitetura final. A correção prioritária é o UX final; depois dela e dos dois ajustes de backlog, o projeto estará em posição adequada para repetir o gate e iniciar o Sprint Planning com base documental coerente.

**Avaliador:** Codex, executando o workflow BMAD Implementation Readiness  
**Data:** 2026-07-27
