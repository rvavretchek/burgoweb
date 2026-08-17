---
title: "Sprint Change Proposal — Reconciliação do MVP Burgoweb"
project: "burgoweb"
date: "2026-07-21"
status: "approved"
mode: "incremental"
change_scope: "major"
trigger: "implementation-readiness-report-2026-07-21.md"
---

# Sprint Change Proposal — Reconciliação do MVP Burgoweb

## 1. Issue Summary

O gate BMAD de prontidão concluiu que o Burgoweb está **NOT READY** para prosseguir com implementação orientada pelos artefatos atuais. O protótipo avançou antes da aprovação e rastreabilidade dos contratos de produto e arquitetura.

Como consequência, foram implementadas decisões sobre identidade, autenticação, convites, papéis e persistência que não estão formalizadas no PRD e, em alguns casos, conflitam com o discovery canônico, UX, arquitetura e histórias.

### Evidências

- PRD, UX, arquitetura e épicos permanecem `draft`.
- Não existem histórias individuais em `implementation-artifacts`.
- Convite e alteração de papéis foram implementados sem história específica.
- O código declara envio de e-mail sem integração de e-mail.
- A autenticação não possui sessão e confia em `actorUserId` informado pelo cliente.
- O modelo `StoredUser` conflita com Pessoa/Vínculo/Papel do discovery.
- A persistência JSON conflita com a arquitetura PostgreSQL.
- Portabilidade é princípio canônico sem requisito, história ou implementação.

### Classificação do problema

- entendimento insuficiente dos requisitos originais;
- abordagem de implementação que precisa ser revista;
- limitações técnicas descobertas no protótipo.

Não houve uma história isolada que revelou o problema. O gatilho foi a reconciliação sistêmica realizada pelo gate de prontidão.

## 2. Impact Analysis

### Epic Impact

#### Epic 1 — Base do produto

Não pode ser concluído com segurança como planejado. Mistura conta, condomínio, perfil, vínculo, nome, convite, senha, autenticação, autorização e dashboard. Deve ser redefinido como entrada institucional e acesso seguro, com histórias menores.

#### Epic 2 — Gestão de pendências

Permanece relevante, mas depende do novo modelo de identidade e autorização. Precisa definir responsável, estados, transições, visibilidade e auditoria.

#### Epic 3 — Comunicação e histórico

Permanece relevante, mas comentário, decisão e evento de auditoria devem ser separados. Regras de visibilidade precisam ser explícitas.

#### Epic 4 — Experiência e qualidade

Deve ser dissolvido. Qualidade, segurança, acessibilidade e testes são requisitos transversais e parte da Definition of Done.

#### Novo Epic 4 — Continuidade e portabilidade mínima

Deve cobrir exportação autorizada, formato aberto, autoria, escopo e validação de integridade.

### Story Impact

- História 1.1 deve ser dividida em registro, criação do condomínio, vínculo/papel e ativação.
- História 1.2 deve ser decomposta em ativação, sessão, logout e recuperação.
- História 1.3 deve ser adiada ou começar como estado vazio, pois depende de pendências futuras.
- Histórias 2.1–2.3 precisam de regras de autorização, transição e erro.
- História 3.1 deve separar comentário e decisão.
- História 3.2 deve definir auditoria, filtro, imutabilidade e visibilidade.
- Histórias 4.1–4.3 devem ser removidas como histórias autônomas e distribuídas transversalmente.

### Artifact Conflicts

#### Product Brief

Segmenta por porte em vez de grau de estrutura administrativa e reduz silenciosamente a proposta institucional a pendências.

#### PRD

Não possui requisitos rastreáveis para identidade, autenticação, autorização, e-mail, persistência, portabilidade e segurança. Critérios de sucesso são qualitativos.

#### UX

Não cobre onboarding institucional, ativação, sessão, recuperação, pessoas/papéis, autorização, falhas ou exportação.

#### Architecture

Não distingue protótipo e arquitetura-alvo. Simplifica o domínio para `Condominium → User` e apresenta opções de stack como decisões consolidadas.

#### Use Cases

Descreve e-mail, token/JWT, PostgreSQL, papéis e bibliotecas como comportamentos aprovados, embora os contratos superiores não estejam fechados.

### Technical Impact

O código deve ser tratado como protótipo brownfield. São bloqueadores para uso real:

- retorno de `passwordHash` no login;
- endpoints sem autenticação;
- identidade baseada em `actorUserId` enviado pelo cliente;
- ausência de sessão;
- `inviteEmailSent: true` sem envio;
- modelo de usuário que combina pessoa, conta, vínculo e papel;
- persistência JSON sem concorrência, transação ou recuperação;
- ausência de exportação autorizada.

O snapshot Git, a estrutura React/Vite, API Express, Zod, lógica básica de pendências e testes unitários devem ser preservados como evidência e material de reconciliação.

## 3. Recommended Approach

### Caminho escolhido

**Híbrido: revisão do PRD/MVP seguida de ajustes diretos.**

1. Atualizar e aprovar Product Brief e PRD/MVP.
2. Atualizar UX.
3. Ratificar arquitetura brownfield.
4. Regenerar casos de uso, épicos e histórias.
5. Mapear o código existente contra histórias aprovadas.
6. Preservar, adaptar ou substituir código por decisão explícita.
7. Executar novamente o gate de prontidão.

### Alternativas avaliadas

#### Ajuste direto isolado

- Viabilidade: parcial.
- Esforço: médio.
- Risco: alto.
- Motivo da rejeição isolada: histórias não corrigem conflitos superiores de produto e arquitetura.

#### Rollback do protótipo

- Viabilidade: possível, mas não recomendada.
- Esforço: médio.
- Risco: médio.
- Motivo: descarta aprendizado e testes sem resolver os contratos ausentes.

#### Revisão do MVP

- Viabilidade: necessária.
- Esforço: alto.
- Risco: médio.
- Benefício: alta redução de retrabalho e risco estrutural.

### Impacto em prazo e esforço

A proposta adiciona uma rodada formal de planejamento antes de nova implementação. O impacto imediato é alto no planejamento e moderado na engenharia, mas reduz o risco de migração tardia, falhas de autorização e consolidação de um domínio incorreto.

## 4. Detailed Change Proposals

### 4.1 Product Brief

#### Público-alvo

**Atual:** síndicos ou administradores informais de condomínios pequenos ou médios.

**Proposto:** condomínios autogeridos ou com pouca estrutura administrativa, independentemente de porte ou configuração física. O adotante inicial é o síndico ou responsável administrativo; moradores, proprietários, conselho e futuras gestões são beneficiários do registro institucional.

#### Escopo inicial

**Atual:** organização básica, pendências, ações, histórico e acesso simples para diferentes perfis.

**Proposto:** entrada institucional, identidade e acesso mínimos, acompanhamento de pendências, histórico rastreável e exportação básica. Financeiro, documentos e prestação de contas permanecem centrais, com inclusão no primeiro MVP decidida explicitamente no PRD.

#### Critérios de sucesso

Adicionar indicadores para onboarding, primeira pendência, consulta por participante autorizado, exportação, tempo/conclusão de fluxos e percepção em piloto.

### 4.2 PRD e MVP

Classificar o ciclo atual como **MVP operacional de validação**.

#### Incluído

1. criação do condomínio;
2. pessoa e conta do criador;
3. vínculo inicial;
4. papel administrativo inicial;
5. ativação segura;
6. login, logout e sessão;
7. convite de participante;
8. pendência com responsável e status;
9. histórico rastreável;
10. exportação básica.

#### Adiado explicitamente

- financeiro;
- documentos;
- prestação de contas;
- portal amplo de transparência;
- mandatos e troca completa de gestão;
- integrações contábeis e de folha.

O adiamento não modifica o discovery; delimita o experimento inicial.

#### Novos grupos de requisitos

- `FR-IDENTITY`: Pessoa, Conta, Vínculo, Papel e vigência distintos;
- `FR-AUTH`: ativação, login, logout, sessão e recuperação;
- `FR-ACCESS`: isolamento e autorização no servidor;
- `FR-INVITE`: token expirável, reenvio e falha;
- `FR-PENDING`: responsável, estados e transições;
- `FR-HISTORY`: comentário, decisão e auditoria separados;
- `FR-EXPORT`: exportação autorizada em formato aberto;
- `FR-ONBOARDING`: cadastro progressivo.

Adicionar NFRs mensuráveis de segurança, privacidade, acessibilidade, responsividade, desempenho, integridade, recuperação, auditoria, portabilidade e isolamento.

### 4.3 UX

Adicionar jornadas para criação institucional, ativação, sessão, convite, vínculo/papel, pendência, histórico e exportação.

Cada jornada deve documentar estados vazio, carregamento, sucesso, validação, falha, acesso negado, expiração, reenvio e confirmação de ação sensível.

Arquitetura da informação proposta:

- Entrada e ativação;
- Visão geral;
- Pendências;
- Histórico;
- Pessoas e acessos;
- Dados do condomínio;
- Exportação.

Adicionar critérios verificáveis de teclado, foco, contraste, rótulos, erros, leitores de tela, mobile, desktop e prevenção de perda de dados.

### 4.4 Architecture

Registrar o estado brownfield: React/Vite, Express, JSON temporário e autenticação incompleta.

#### Invariantes

1. Dados condominiais exigem identidade autenticada.
2. Autorização ocorre no servidor por vínculo ativo.
3. `actorUserId` do cliente não comprova identidade.
4. Pessoa, Conta, Vínculo e Papel são distintos.
5. Auditoria não é conteúdo editável.
6. Dados são exportáveis em formato aberto.
7. Segredos não ficam no código nem na resposta da API.
8. Migrações preservam dados e rastreabilidade.

#### Direções aprovadas

- preferir sessão em cookie `HttpOnly`, `Secure` e `SameSite`, salvo ADR contrário;
- usar Argon2id + pepper com gestão segura de segredos;
- PostgreSQL como alvo de produção;
- interfaces de repositório para migração do JSON;
- adaptador de e-mail com token de uso único, expiração e reenvio;
- separar comentário, decisão e auditoria;
- tenancy baseada em vínculos.

Criar ADRs de identidade/autorização, sessão, persistência/migração, e-mail, auditoria e exportação.

React, TypeScript, Vite, Node e Express ficam ratificados pelo brownfield. As demais bibliotecas permanecem opções até justificativa.

### 4.5 Epics and Stories

#### Epic 1 — Criar o espaço institucional e obter acesso seguro

- registrar pessoa e conta;
- criar condomínio e vínculo;
- ativar credencial;
- entrar, manter sessão e sair;
- recuperar ou reenviar acesso;
- convidar participante;
- atribuir ou revogar vínculo/papel.

#### Epic 2 — Organizar e acompanhar pendências

- criar pendência;
- atribuir responsável;
- atualizar status válido;
- consultar conforme visibilidade;
- tratar concorrência e alteração inválida.

#### Epic 3 — Preservar contexto e histórico

- registrar comentário;
- registrar decisão;
- registrar auditoria imutável;
- consultar e filtrar histórico;
- restringir conteúdo sensível.

#### Epic 4 — Garantir continuidade e portabilidade mínima

- solicitar exportação autorizada;
- gerar formato aberto;
- registrar autoria/data/escopo;
- validar integridade e legibilidade.

Remover o épico técnico de qualidade. Todas as histórias terão FRs, dependências, critérios Given/When/Then, falhas, autorização, mudanças de dados e evidências de teste.

### 4.6 Use Cases

Regenerar após aprovação dos documentos superiores. Usar atores de negócio, domínio ratificado, autorizações, falhas, auditoria e exportação. Remover o desenvolvedor como ator e não apresentar opções de stack como comportamento aprovado.

### 4.7 Existing Code and Tests

#### Preservar

- React/Vite;
- Express;
- Zod;
- lógica básica de pendências;
- testes unitários;
- snapshot Git;
- hashing **Argon2id + pepper**, após implementar gestão segura do pepper.

#### Temporário

- JSON;
- senha temporária devolvida pela API;
- frontend monolítico;
- perfis fixos;
- papel único `admin/member`;
- `actorUserId` fornecido pelo cliente.

#### Bloqueado para uso real

- `passwordHash` em respostas;
- endpoints sem autenticação;
- convite ficticiamente marcado como enviado;
- ausência de sessão;
- autorização baseada em identificador do cliente;
- isolamento condominial insuficiente.

Após as histórias revisadas, mapear código → história, criar testes de caracterização, implementar identidade/sessão em fatias, introduzir persistência abstrata e migrar dados apenas com plano explícito.

`data/storage.json` permanece local e ignorado.

## 5. Implementation Handoff

### Scope Classification

**Major — fundamental replan required.**

### Recipients and Responsibilities

#### Product Manager

- atualizar Product Brief e PRD;
- formalizar requisitos e recorte do MVP;
- obter aprovação explícita do proprietário do produto.

#### UX Designer

- atualizar jornadas, estados e arquitetura da informação;
- definir critérios de acessibilidade e usabilidade verificáveis.

#### Solution Architect

- ratificar arquitetura brownfield;
- produzir ADRs;
- definir identidade, sessão, tenancy, persistência, e-mail, auditoria e exportação.

#### Product Owner / Product Manager

- regenerar épicos, histórias e rastreabilidade;
- assegurar critérios testáveis e dependências válidas.

#### Developer

- não iniciar nova funcionalidade antes do novo gate;
- mapear o protótipo para histórias aprovadas;
- preservar ou substituir código com testes de caracterização.

#### Test Architect

- revisar estratégia de segurança, autorização, isolamento, migração e exportação;
- assegurar cobertura transversal na Definition of Done.

### Success Criteria

- Product Brief, PRD, UX e arquitetura aprovados e alinhados ao discovery;
- ADRs críticos concluídos;
- mapa FR → épico → história completo;
- histórias independentes e testáveis;
- protótipo classificado e mapeado;
- novo gate BMAD com resultado `READY`;
- nenhuma implementação adicional antes da aprovação do gate.

## 6. Checklist Status

### Trigger and Context

- [N/A] 1.1 História isolada que revelou o problema.
- [x] 1.2 Problema definido e classificado.
- [x] 1.3 Evidências documentadas.

### Epic Impact

- [!] 2.1 Epic 1 requer redefinição.
- [!] 2.2 Alterações em todos os épicos documentadas.
- [!] 2.3 Dependências futuras revisadas.
- [!] 2.4 Epic técnico removido e portabilidade adicionada.
- [!] 2.5 Nova sequência aprovada.

### Artifact Conflicts

- [!] 3.1 PRD requer revisão.
- [!] 3.2 Arquitetura requer ratificação brownfield.
- [!] 3.3 UX requer novos fluxos e estados.
- [!] 3.4 Artefatos secundários e código identificados.

### Path Forward

- [x] 4.1 Ajuste direto avaliado como insuficiente isoladamente.
- [x] 4.2 Rollback avaliado e rejeitado.
- [x] 4.3 Revisão do MVP avaliada como necessária.
- [x] 4.4 Caminho híbrido aprovado.

### Proposal Components

- [x] 5.1 Resumo do problema.
- [x] 5.2 Impacto em épicos e artefatos.
- [x] 5.3 Caminho recomendado.
- [x] 5.4 Impacto no MVP e plano de alto nível.
- [x] 5.5 Handoff definido.

### Final Review

- [x] 6.1 Checklist revisado.
- [x] 6.2 Proposta revisada quanto a consistência, clareza e acionabilidade.
- [x] 6.3 Proposta aprovada explicitamente pelo proprietário do produto em 2026-07-21.
- [N/A] 6.4 Não existe `sprint-status.yaml` para atualização.
- [x] 6.5 Handoff confirmado para Product Manager e Solution Architect, seguido por UX, backlog, desenvolvimento e testes.

## 7. Approval and Handoff Record

### Approval

- Decision: **Approved**
- Approved on: 2026-07-21
- Approval condition: preservar o protótipo como brownfield e adotar hashing **Argon2id + pepper** com gestão segura do pepper.

### Change Scope

**Major — fundamental replan required.**

### Primary Handoff

1. Product Manager: atualizar Product Brief e PRD/MVP.
2. UX Designer: atualizar fluxos e critérios de experiência.
3. Solution Architect: ratificar arquitetura brownfield e ADRs.
4. Product Manager/Product Owner: regenerar épicos, histórias e rastreabilidade.
5. Test Architect: revisar estratégia transversal.
6. Developer: reconciliar o protótipo somente depois de novo gate `READY`.

### Workflow Execution Log

- Issue addressed: desalinhamento entre discovery, planejamento e protótipo identificado pelo gate de prontidão.
- Selected approach: revisão do PRD/MVP seguida de ajustes diretos.
- Artifacts analyzed: Product Brief, PRD, UX, Architecture, Epics and Stories, Use Cases, readiness report, discovery e código existente.
- Artifact produced: `sprint-change-proposal-2026-07-21.md`.
- Existing artifacts modified by this workflow: nenhum, além do relatório de prontidão previamente concluído e desta proposta.
- Routed to: Product Manager e Solution Architect como responsáveis primários.
