---
stepsCompleted:
  - step-01-document-discovery
  - step-02-prd-analysis
  - step-03-epic-coverage-validation
  - step-04-ux-alignment
  - step-05-epic-quality-review
  - step-06-final-assessment
status: complete
readiness: NOT_READY
filesIncluded:
  prd: _bmad-output/planning-artifacts/prd.md
  architecture: _bmad-output/planning-artifacts/architecture.md
  epics: _bmad-output/planning-artifacts/epics-and-stories.md
  ux: _bmad-output/planning-artifacts/ux.md
supplementaryFiles:
  - _bmad-output/planning-artifacts/product-brief.md
  - _bmad-output/planning-artifacts/use-cases.md
---

# Implementation Readiness Assessment Report

**Date:** 2026-07-21
**Project:** burgoweb

## 1. Document Discovery

### Documentos obrigatórios selecionados

- PRD: `prd.md`
- Arquitetura: `architecture.md`
- Épicos e histórias: `epics-and-stories.md`
- UX: `ux.md`

### Documentos complementares

- `product-brief.md`
- `use-cases.md`

Não foram encontradas versões fragmentadas, duplicidades críticas ou documentos obrigatórios ausentes.

## 2. PRD Analysis

### Functional Requirements

FR1: O produto deve permitir criar um condomínio.

FR2: O produto deve permitir ao usuário acessar um condomínio.

FR3: O produto deve permitir registrar pendências.

FR4: O produto deve permitir atribuir responsáveis às pendências ou ações.

FR5: O produto deve permitir acompanhar e atualizar o status de tarefas ou pendências.

FR6: O produto deve manter histórico das ações realizadas.

FR7: O produto deve manter histórico das decisões do condomínio.

FR8: O produto deve facilitar comunicação interna básica.

FR9: O usuário deve conseguir visualizar pendências e ações do condomínio ao entrar no produto.

FR10: O usuário deve conseguir registrar ou atualizar informações da rotina condominial.

FR11: O produto deve oferecer transparência operacional básica sobre pendências, ações, responsabilidades e histórico.

**Total de FRs: 11.**

### Non-Functional Requirements

NFR1: A interface deve ser simples e intuitiva.

NFR2: A navegação deve ser clara para usuários com baixa familiaridade tecnológica.

NFR3: A experiência deve ser confiável mesmo para usuários que utilizem o produto apenas ocasionalmente.

NFR4: O núcleo do produto deve permanecer gratuito.

NFR5: A solução deve priorizar simplicidade sobre abrangência funcional e evitar sobrecarga na experiência inicial.

NFR6: A evolução do produto deve ser gradual e orientada pelo uso real.

NFR7: A experiência deve ser mais acessível do que ferramentas tradicionais de gestão, hipótese ainda sujeita a validação.

**Total de NFRs: 7.**

### Additional Requirements

- O primeiro ciclo exclui gestão financeira completa, automações avançadas, módulos muito especializados e integrações complexas.
- O produto deve manter foco em transparência e organização do cotidiano e não evoluir prematuramente para um sistema complexo.
- O público declarado inclui síndicos, administradores informais, pequenos times operacionais e moradores interessados em acompanhar ações e decisões.
- O sucesso deve ser observado por menor esforço para organizar pendências, maior transparência da comunicação, clareza de responsabilidades e adoção positiva por condomínios pequenos e médios.
- Permanecem como hipóteses a preferência por uma ferramenta simples, a gratuidade como diferencial, a percepção de valor de histórico/transparência e a necessidade de acessibilidade superior às ferramentas tradicionais.

### PRD Completeness Assessment

O PRD apresenta intenção, público, escopo e fluxo de valor, mas não está completo para orientar implementação sem inferências relevantes. Os requisitos não possuem identificadores próprios no documento original, critérios de aceitação, prioridades, regras de autorização, estados e transições, tratamento de erros ou definições de dados. Os critérios de sucesso são qualitativos e não incluem métricas, linha de base ou horizonte temporal.

Também não há requisitos explícitos para autenticação, convites, pessoas, vínculos, papéis, privacidade, persistência, retenção, backup, exportação ou portabilidade. Esses temas aparecem nas fontes canônicas de discovery e/ou no código, mas não estão formalizados neste PRD. Não há requisitos mensuráveis de desempenho, segurança, disponibilidade, acessibilidade, escalabilidade ou conformidade. Como o documento permanece com status `draft`, a extração acima precisou decompor declarações de alto nível em requisitos rastreáveis provisórios.

## 3. Epic Coverage Validation

### Coverage Matrix

| FR | Requisito do PRD | Cobertura em épicos/histórias | Status |
|---|---|---|---|
| FR1 | Criar um condomínio | Epic 1, História 1.1 | Coberto |
| FR2 | Acessar um condomínio | Epic 1, Histórias 1.1 e 1.2 | Coberto |
| FR3 | Registrar pendências | Epic 2, História 2.1 | Coberto |
| FR4 | Atribuir responsáveis | Epic 2, Histórias 2.1 e 2.3 | Coberto |
| FR5 | Acompanhar e atualizar status | Epic 2, História 2.2; Epic 1, História 1.3 | Coberto |
| FR6 | Manter histórico de ações | Epic 3, História 3.2; Epic 2, História 2.2 | Coberto |
| FR7 | Manter histórico de decisões | Epic 3, Histórias 3.1 e 3.2 | Coberto |
| FR8 | Facilitar comunicação interna básica | Epic 3, História 3.1 | Coberto |
| FR9 | Visualizar pendências e ações | Epic 1, História 1.3; Epic 2, História 2.1 | Coberto |
| FR10 | Registrar ou atualizar informações da rotina | Epic 2, Histórias 2.1–2.3; Epic 3, História 3.1 | Coberto de forma ampla |
| FR11 | Oferecer transparência operacional básica | Epics 2 e 3 | Coberto de forma transversal |

### Missing Requirements

Nenhum dos 11 FRs provisoriamente extraídos do PRD está completamente ausente dos épicos. Entretanto, FR10 e FR11 são amplos demais para demonstrar cobertura verificável: não definem quais informações compõem a rotina, quem pode vê-las nem o significado operacional de transparência.

### Requisitos introduzidos pelos épicos sem origem explícita no PRD

- Criação de conta administrativa com e-mail pessoal e perfis específicos.
- Validação de unicidade do nome do condomínio e sugestão de alternativa.
- Convite ou envio de e-mail para definição de senha.
- Autenticação com login, logout, Argon2id e pepper.
- Controle de acesso a dados restritos.
- Painel inicial com resumo de pendências e ações recentes.
- Responsável obrigatório/alterável em pendências.
- Comentários em pendências.
- Persistência das atribuições e alterações.
- Componentização de interface e framework interno.
- Testes E2E especificamente com Cypress.
- Linting, formatação e padrões de manutenção do código.

Esses itens podem ser decisões válidas, mas não possuem rastreabilidade explícita ao PRD. Autenticação, convite, perfis, persistência e autorização mudam materialmente o escopo e precisam ser formalizados antes de serem tratados como histórias aprovadas.

### Coverage Statistics

- Total de FRs do PRD: 11
- FRs nominalmente cobertos nos épicos: 11
- Cobertura nominal: 100%
- FRs com cobertura apenas ampla ou não verificável: 2
- Requisitos adicionais introduzidos pelos épicos: 12 grupos

A taxa de 100% não representa prontidão: ela reflete um PRD pequeno e genérico, enquanto os épicos adicionam decisões substanciais sem requisito de origem.

## 4. UX Alignment Assessment

### UX Document Status

Documento UX encontrado em `ux.md`, inteiro e com status `draft`.

### UX ↔ PRD Alignment

Há alinhamento geral em simplicidade, clareza, pendências, responsáveis, status, histórico e transparência. Os três cenários centrais de UX correspondem ao fluxo de valor do PRD.

Entretanto, o UX introduz funcionalidades não formalizadas no PRD:

- dashboard com resumo e ações recentes;
- área de perfil/configuração e permissões básicas;
- publicação de pendência;
- comentários associados à atualização de status;
- filtros de histórico por data ou tipo;
- registro explícito de decisões;
- navegação entre áreas distintas.

O UX não descreve onboarding, login, logout, convite por e-mail, definição/recuperação de senha, gestão de pessoas ou papéis, embora esses fluxos sejam exigidos pelos épicos. Também não define estados vazios, carregamento, erros, indisponibilidade, confirmação de ações, responsividade por dispositivo ou fluxos para usuários sem permissão.

As personas de UX foram reduzidas a síndico/administrador informal e morador. Pequenos times operacionais citados no PRD e as personas/vínculos mais ricos do discovery não possuem jornadas correspondentes.

### UX ↔ Architecture Alignment

A arquitetura proposta suporta conceitualmente uma aplicação web responsiva com dashboard, pendências, comunicação, autenticação e permissões. A separação frontend/API e o uso previsto de componentes acessíveis podem sustentar os fluxos descritos.

Problemas de alinhamento:

- O UX não exige TanStack, shadcn/ui, Radix ou Tailwind; essas escolhas aparecem como decisões arquiteturais sem necessidade rastreável.
- A arquitetura define autenticação, banco relacional, papéis e permissões que não foram especificados pelo UX nem pelo PRD.
- Não existem metas de tempo de resposta, carregamento ou operação em conectividade limitada para validar a experiência “rápida”, “confiável” e de “poucos passos”.
- A arquitetura cita acessibilidade e frontend responsivo, mas não define padrões verificáveis como WCAG, breakpoints, suporte a teclado, leitores de tela ou contraste.
- A estratégia de navegação do UX pressupõe múltiplas áreas, enquanto a arquitetura lista alternativas e estrutura sugerida sem fechar rotas, guardas de acesso ou sessão.
- O domínio arquitetural `Condominium → User` e `Permission` é insuficiente para o modelo canônico de pessoa, vínculo, unidade, papel acumulável e vigência descrito no discovery.

### Warnings

- UX, PRD e arquitetura permanecem `draft`; não há evidência de aprovação.
- Os critérios de usabilidade são qualitativos e não testáveis.
- Os fluxos de segurança e administração de acesso estão ausentes do UX.
- A arquitetura contém mais decisões técnicas do que os requisitos justificam e não registra ADRs ou trade-offs.
- Portabilidade e exportação, princípios canônicos do produto, não aparecem no UX nem na arquitetura do MVP.

## 5. Epic Quality Review

### Avaliação dos épicos

| Épico | Valor ao usuário | Independência | Avaliação |
|---|---|---|---|
| Epic 1 — Base do produto | Parcial: onboarding, acesso e painel entregam valor, mas o título é técnico/genérico | Pode sustentar os demais, porém agrupa fundação, identidade, e-mail, segurança e dashboard | Requer decomposição |
| Epic 2 — Gestão de pendências | Sim | Depende apenas da base e autenticação do Epic 1 | Estrutura aceitável, critérios insuficientes |
| Epic 3 — Comunicação e histórico | Sim | Pode usar pendências do Epic 2 sem dependências futuras | Estrutura aceitável, fronteira entre comentário, decisão e auditoria indefinida |
| Epic 4 — Experiência e qualidade | Não como épico autônomo; é um marco técnico transversal | Seus resultados deveriam acompanhar todas as histórias anteriores | Violação crítica de estrutura |

### Critical Violations

1. **Epic 4 é um épico técnico sem incremento autônomo de valor ao usuário.** Componentização, testes e qualidade devem fazer parte da Definition of Done e dos critérios das histórias funcionais. Remediação: dissolver o épico, distribuir requisitos de qualidade e manter apenas eventual trabalho habilitador claramente justificado.

2. **História 1.1 é grande demais e combina múltiplos resultados:** conta, perfis, condomínio, unicidade de nome, sugestão, convite/e-mail, senha e liberação de acesso. Ela não é implementável/testável como unidade independente. Remediação: separar registro de pessoa/conta, criação do condomínio, vínculo/papel, ativação de credencial e tratamento de possíveis duplicidades — depois que o modelo canônico for decidido.

3. **História 1.2 pressupõe infraestrutura e comportamento não especificados:** serviço de e-mail, definição de senha, pepper, sessão, logout e autorização. A história depende de decisões ausentes no PRD/UX e parcialmente embutidas na História 1.1. Remediação: formalizar requisitos e arquitetura de identidade/sessão antes de aprová-la.

4. **A sequência declarada trata “Base do produto” e “Autenticação e acesso” como etapas separadas, embora autenticação esteja dentro do Epic 1.** A ordem não corresponde à estrutura do backlog e impede rastreamento confiável.

### Major Issues

1. Nenhum critério de aceitação usa Given/When/Then, e a maioria cobre somente happy path.
2. História 1.1 não define duplicidade de e-mail, prova de autoridade sobre o condomínio, falha de e-mail, expiração/reenvio de convite ou rollback parcial.
3. História 1.2 não define credenciais inválidas, bloqueio/rate limiting, recuperação de senha, expiração/revogação de sessão, CSRF/cookies ou critérios de autorização.
4. História 1.3 usa “clara”, “objetiva” e “sem dificuldade”, termos não mensuráveis; também depende das pendências ainda entregues apenas no Epic 2.
5. História 2.1 exige responsável, mas não define quem pode ser responsável, se é obrigatório, estados permitidos, validações ou visibilidade.
6. História 2.2 usa “usuário adequado” sem matriz de permissões; não define transições válidas, concorrência, idempotência ou erro.
7. História 2.3 duplica parte da História 2.1 e não define notificação, remoção de responsável nem histórico da mudança.
8. História 3.1 mistura comentário, atualização e decisão, conceitos com semântica e visibilidade potencialmente diferentes.
9. História 3.2 alterna entre histórico de uma ação e histórico geral; não define paginação, filtro, retenção, imutabilidade ou controle de acesso.
10. Histórias 4.1–4.3 são amplas, técnicas e sem entrega independente; “consistente”, “padrões definidos” e “reduzir regressão” não são verificáveis.
11. Não há história de configuração inicial do projeto, CI/CD ou ambiente, embora os documentos tratem o projeto como greenfield. O código já existente, por outro lado, torna o cenário brownfield; essa transição não foi reconhecida no backlog.
12. Não há estratégia incremental de criação/migração de dados para as entidades exigidas por cada história.

### Minor Concerns

- As histórias não possuem identificadores estáveis como `E1-S1`, prioridade, estimativa, dependências ou estado de aprovação.
- Não existe mapa explícito FR → história; a cobertura precisou ser inferida.
- O backlog usa “Task” na arquitetura e “pendência” nos documentos, sem definição de linguagem ubíqua.
- Cypress é imposto no backlog enquanto a arquitetura o trata como recomendação; não há justificativa de ferramenta.
- Não existe Definition of Ready nem Definition of Done.

### Dependency Analysis

- História 1.1: não é independente por incorporar ativação por e-mail e credenciais.
- História 1.2 → 1.1: dependência retroativa aceitável, mas o contrato entre as histórias é indefinido.
- História 1.3 → Epic 2: dependência futura indevida, pois o painel exige pendências e ações recentes antes de elas serem entregues.
- Epic 2 → Epic 1: dependência aceitável.
- Epic 3 → Epic 2: dependência aceitável para comentários/histórico de pendência.
- Epic 4 → todos os épicos anteriores: dependência transversal tardia; qualidade não deveria ser postergada.

### Actionable Recommendations

1. Aprovar primeiro um modelo mínimo de identidade: pessoa, conta, vínculo, papel, vigência e permissão.
2. Reescrever Epic 1 como incrementos menores de valor, separando onboarding institucional de autenticação e ativação.
3. Mover o dashboard para depois do primeiro fluxo de pendências ou entregar uma versão vazia independente.
4. Separar comentário, decisão e evento de auditoria.
5. Reescrever todos os critérios em formato testável, cobrindo sucesso, validação, autorização e falha.
6. Transformar qualidade, segurança e testes em requisitos transversais/Definition of Done.
7. Adicionar rastreabilidade explícita entre discovery, PRD, FRs, épicos e histórias.

## 6. Reconciliation with Discovery and Existing Code

### Requisitos implementados sem história aprovada ou explícita

| Implementação existente | Evidência no código | Situação documental |
|---|---|---|
| Convite de novos usuários | `POST /api/condominiums/:id/invite` e `inviteUser()` | Não existe história específica para convidar membros; História 1.1 trata apenas a criação inicial da conta administrativa |
| Alteração de papel `admin/member` | `PATCH /api/condominiums/:id/users/:userId/role` e `changeUserRole()` | Não existe história de gestão de papéis |
| Persistência em arquivo JSON | `storage.ts` e `data/storage.json` | Não existe história habilitadora; contradiz a arquitetura que define banco relacional/PostgreSQL |
| Identificadores aleatórios e histórico técnico | `randomBytes()` em usuários, condomínios, pendências e histórico | Não especificado em PRD, arquitetura ou histórias |
| API de saúde | `GET /api/health` | Implementação operacional sem história ou requisito de observabilidade verificável |
| Seleção de quatro tipos de perfil | `profileOptions` e `onboardingSchema` | Aparece na História 1.1, mas não no PRD; o modelo conflita com o discovery canônico |

Os testes unitários existentes validam helpers de autenticação, onboarding, convite/papéis e pendências. Não existem histórias individuais aprovadas em `_bmad-output/implementation-artifacts/`, portanto nenhuma implementação pode ser rastreada a uma história formalmente executada pelo workflow de desenvolvimento.

### Autenticação e autorização

**Documentos:** os épicos exigem login/logout, Argon2id + pepper, e-mail de definição de senha e bloqueio de acesso sem permissão. A arquitetura prevê JWT ou cookie, papéis/permissões, variáveis de ambiente e proteção contra ataques comuns.

**Código:** há hash Argon2 e verificação de senha, mas não há pepper, sessão, JWT, cookie, logout, expiração, revogação, recuperação de senha ou rate limiting. O login devolve o objeto persistido do usuário, incluindo `passwordHash`. O frontend mantém apenas um `currentUser` em memória. Requisições mutáveis confiam em `actorUserId` enviado no corpo; esse identificador não comprova identidade. Endpoints GET de pendências e histórico não exigem autenticação.

**Veredito:** implementação parcial e insegura em relação às próprias histórias/arquitetura. Bloqueador para uso além de protótipo local.

### Convite por e-mail

**Documentos:** Histórias 1.1 e 1.2 afirmam que o sistema envia e-mail para definição de senha e liberação de acesso.

**Código:** não existe provedor, fila, template, token de ativação ou envio de e-mail. `inviteEmailSent` é retornado como `true` mesmo sem envio. A senha temporária é devolvida pela API e mostrada diretamente na interface de onboarding.

**Veredito:** divergência funcional explícita e indicador de sucesso incorreto. O comportamento atual não satisfaz os critérios de aceitação.

### Modelo de pessoas, vínculos e papéis

**Discovery canônico:** separa Pessoa, Usuário, Vínculo, Unidade, Papel, atribuição de papel e vigência/mandato; permite papéis acumuláveis e históricos.

**Planejamento:** PRD omite o modelo. Épicos introduzem quatro `profileType`; arquitetura reduz o domínio a `Condominium has User` e `Permission`.

**Código:** `StoredUser` combina identidade pessoal, credencial, perfil, papel e vínculo com um único condomínio. `profileType` é uma enumeração fixa e `role` só aceita `admin/member`. Não há unidade, múltiplos vínculos, papéis acumuláveis, vigência, mandato ou revogação temporal.

**Veredito:** conflito estrutural com a fonte canônica. Evoluir o modelo atual sem decisão explícita tende a gerar migração cara e perda de semântica.

### Persistência

**Arquitetura:** banco relacional, PostgreSQL, camada de persistência/repositórios e auditoria em tabelas específicas.

**Código:** um único arquivo JSON é carregado em memória no início e regravado integralmente. Não há transações, concorrência, locking, migrações, constraints, índices, backup, recuperação ou isolamento por tenant na camada de dados. JSON inválido resulta silenciosamente em store vazio.

**Veredito:** aceitável apenas como mecanismo descartável de protótipo, mas não foi documentado como tal. É divergente da arquitetura e arriscado para dados reais.

### Portabilidade e exportação

**Discovery e AGENTS.md:** portabilidade, formatos abertos e exportação integral são princípios institucionais obrigatórios.

**PRD/UX/épicos/arquitetura/código:** não há requisito detalhado, fluxo, história, contrato de exportação, endpoint ou teste. O fato de o armazenamento atual ser JSON não equivale a uma exportação segura, documentada e autorizada.

**Veredito:** requisito canônico sem cobertura. Bloqueador de alinhamento, ainda que a entrega possa ser planejada para um incremento posterior claramente definido.

### Outras divergências relevantes entre histórias e código

- Pendências não possuem responsável, apesar de Histórias 2.1 e 2.3 exigirem atribuição e alteração.
- Não existe comentário em pendência, apesar da História 3.1.
- Não há histórico independente de decisões; somente eventos técnicos de pendências e administração de usuários.
- O frontend não possui dashboard, rotas ou áreas separadas conforme UX/História 1.3.
- A validação de status não aplica schema em runtime; um valor fora da união TypeScript pode chegar pela API.
- A sugestão de nome não garante unicidade quando a alternativa com cidade já existe.
- A API declara convite enviado e onboarding bem-sucedido sem integração externa correspondente.
- A stack implementada usa React/Express/CSS simples/JSON; TanStack, shadcn/ui, Radix, Tailwind, Prisma e PostgreSQL estão apenas planejados.

## 7. Summary and Recommendations

### Overall Readiness Status

**NOT READY**

O produto não está pronto para prosseguir com implementação orientada pelos artefatos atuais. Já existe um protótipo funcional, mas ele foi construído sobre documentos ainda `draft`, contém funcionalidades sem história formal, não satisfaz critérios centrais de autenticação/e-mail e conflita com o modelo canônico de identidade e com a arquitetura de persistência.

### Critical Issues Requiring Immediate Action

1. Aprovar um modelo mínimo de Pessoa, Conta, Vínculo, Papel, Unidade e vigência compatível com o discovery.
2. Corrigir a definição de autenticação e autorização antes de expor dados: sessão/identidade verificável, proteção de endpoints, não retornar `passwordHash` e não confiar em `actorUserId` do cliente.
3. Decidir explicitamente o fluxo de convite: e-mail real com token ou remover dos critérios qualquer alegação de envio até existir integração.
4. Classificar o JSON como persistência temporária de protótipo e definir a estratégia de migração para o mecanismo aprovado.
5. Introduzir portabilidade/exportação no PRD, arquitetura e backlog com escopo e critérios verificáveis.
6. Reescrever os épicos e histórias para remover decisões sem origem, dependências futuras e o épico técnico de qualidade.
7. Aprovar PRD, UX, arquitetura e backlog antes de executar novas histórias.

### Recommended Next Steps

1. Executar um workflow de correção de curso ou atualização do PRD usando discovery e este relatório como fontes.
2. Atualizar o PRD com requisitos numerados, prioridades, regras de acesso, NFRs mensuráveis, persistência temporária e portabilidade.
3. Atualizar UX com onboarding, ativação/login/logout, erros, estados vazios, permissões e fluxos responsivos/acessíveis.
4. Atualizar arquitetura com decisões fechadas e ADRs para identidade, sessão, tenancy, persistência, e-mail, auditoria, backup e exportação.
5. Regenerar épicos e histórias com mapa explícito FR → história e critérios Given/When/Then.
6. Criar histórias individuais em `implementation-artifacts` e reconciliar o protótipo existente como código brownfield, evitando reimplementação cega.
7. Executar novamente este gate; somente um resultado `READY` deve liberar a próxima rodada de implementação.

### Final Note

Foram identificados **7 bloqueadores críticos**, **12 grupos de requisitos introduzidos sem origem explícita**, **12 problemas principais de qualidade de histórias** e múltiplas divergências de implementação em **6 categorias**: completude do PRD, rastreabilidade, UX, arquitetura, backlog e código.

O protótipo e seus 8 testes unitários constituem evidência útil e devem ser preservados. Eles não demonstram, porém, prontidão do produto nem conformidade com os artefatos canônicos. Corrigir primeiro os contratos de produto e arquitetura reduzirá o risco de consolidar um modelo incorreto.

**Assessment date:** 2026-07-21

**Assessor:** Codex — BMAD Implementation Readiness
