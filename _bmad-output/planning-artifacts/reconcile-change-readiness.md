---
title: "Reconciliação — PRD, Readiness Report e Sprint Change Proposal"
project: "burgoweb"
date: "2026-07-21"
status: "complete"
intent: "prd-update-input-reconciliation"
sources:
  - prd.md
  - implementation-readiness-report-2026-07-21.md
  - sprint-change-proposal-2026-07-21.md
---

# Reconciliação do sinal de mudança e do gate de prontidão

## 1. Objetivo e regra de precedência

Este relatório compara o PRD atual com o diagnóstico do gate de prontidão e com o Sprint Change Proposal aprovado, para orientar a atualização do PRD sem incorporar detalhes de implementação que pertencem à arquitetura ou a ADRs.

A precedência aplicada é:

1. decisões explícitas mais recentes do proprietário do produto nesta conversa;
2. Sprint Change Proposal aprovado;
3. discovery canônico;
4. Implementation Readiness Assessment Report;
5. PRD atual.

As decisões mais recentes relevantes são:

- o produto está em **preparação para lançamento público**, não apenas em experimento interno ou piloto;
- a atualização seguirá **Coaching path com entrada Journey-led**;
- o protótipo deve ser preservado como brownfield;
- o hashing aprovado é **Argon2id + pepper**, com gestão segura do pepper.

Consequência: a expressão do Sprint Change Proposal “MVP operacional de validação” não deve ser transportada literalmente ao novo PRD. O conjunto funcional aprovado continua válido como recorte inicial, mas deve ser descrito como **escopo da primeira versão pública**, sujeito a critérios de lançamento mais rigorosos.

## 2. Síntese da divergência

O PRD atual expressa corretamente a intenção geral — organização, transparência, simplicidade e gratuidade no núcleo — mas é curto e genérico demais para uma versão pública. Ele não formaliza identidade, autenticação, autorização, convites, persistência, privacidade, portabilidade ou requisitos operacionais verificáveis. O gate concluiu `NOT READY`; a proposta de mudança, posteriormente aprovada, redefiniu o recorte, os grupos de requisitos e a sequência de planejamento.

O PRD não deve ser apenas complementado com algumas linhas. Ele requer uma revisão estrutural que preserve a visão e substitua requisitos amplos por capacidades numeradas, limites claros, jornadas e critérios mensuráveis.

## 3. Matriz de reconciliação do PRD

| Área | PRD atual | Diagnóstico / decisão aprovada | Tratamento necessário no PRD atualizado |
|---|---|---|---|
| Estágio e rigor | Não declara estágio de entrega | SCP chama de validação; proprietário decidiu depois “preparação para lançamento público” | Declarar primeira versão pública e adotar critérios de segurança, privacidade, acessibilidade, confiabilidade e operação compatíveis |
| Público | Síndicos, administradores informais, pequenos times e moradores; problema associado a condomínios pequenos e médios | Público canônico é definido por baixa estrutura administrativa, não por porte | Reescrever para condomínios autogeridos ou com pouca estrutura administrativa, independentemente de porte/configuração; explicitar adotante e beneficiários |
| Proposta de valor | Organização de rotina, transparência, pendências e facilidade | Discovery preserva ambição institucional; SCP evita reduzir o produto permanentemente a pendências | Manter visão institucional e deixar claro que o primeiro release é uma fatia, não uma redefinição do produto |
| Escopo incluído | Condomínio, pendências, responsáveis, histórico e comunicação básica | Inclusões aprovadas abrangem identidade, acesso, convite e exportação | Substituir o escopo genérico pelo conjunto explícito da primeira versão pública |
| Escopo adiado | Financeiro completo, automações, módulos especializados e integrações complexas | Adiamento aprovado é mais preciso | Nomear financeiro, documentos, prestação de contas, portal amplo de transparência, mandatos/troca completa de gestão e integrações contábeis/folha |
| Identidade | Ausente | Pessoa, Conta, Vínculo, Papel e vigência devem ser distintos; gate pede decisão sobre Unidade | Criar grupo funcional de identidade; manter Unidade/cardinalidades como decisão bloqueadora até confirmação |
| Autenticação | Apenas “acessar um condomínio” | Ativação, login, logout, sessão e recuperação foram aprovados | Criar requisitos verificáveis de acesso seguro, sem prescrever mecanismo técnico |
| Autorização e isolamento | Ausentes | Identidade verificável, autorização no servidor por vínculo ativo e isolamento entre condomínios são invariantes | Definir outcomes de autorização, mínimo privilégio, acesso negado e ausência de mistura de dados |
| Convites | Ausentes | Convite real, ativação expirável, reenvio e falha foram aprovados | Criar grupo funcional e jornada de convite/ativação; não declarar envio concluído sem confirmação operacional |
| Pendências | Alto nível; sem estados/regras | Responsável, estados, transições, visibilidade, erros e concorrência precisam ser definidos | Decompor em requisitos estáveis; manter estados e matriz de permissão como decisões abertas antes da finalização |
| Comunicação e histórico | Mistura histórico de ações, decisões e comunicação | Comentário, decisão e auditoria devem ser separados; auditoria é imutável | Definir três capacidades e seus outcomes/visibilidades, evitando tratá-las como sinônimos |
| Portabilidade | Ausente | Princípio canônico e novo escopo aprovado | Incluir exportação autorizada, aberta, íntegra e legível, com autoria, data e escopo |
| Persistência e continuidade | Ausentes | JSON é temporário; dados reais exigem integridade, recuperação e migração | Incluir requisitos de durabilidade, integridade, backup/recuperação e continuidade; deixar tecnologia/migração para arquitetura |
| Experiência | “simples”, “intuitiva” e “confiável” | Termos não mensuráveis; faltam estados e acessibilidade verificável | Derivar requisitos de jornada e NFRs testáveis para teclado, foco, contraste, mensagens, mobile/desktop e prevenção de perda |
| Métricas | Apenas resultados qualitativos | Medidas foram aprovadas, mas sem metas numéricas | Incluir indicadores e marcar metas/linha de base/horizonte como decisões obrigatórias antes de tornar o PRD final |
| Requisitos | Lista sem IDs, prioridade ou critérios | Gate exige rastreabilidade e capacidade verificável | Usar IDs estáveis e globais, agrupar capacidades e explicitar regras, limites, falhas e prioridade |

## 4. Escopo reconciliado da primeira versão pública

### 4.1 Inclusões aprovadas

1. criação progressiva do condomínio;
2. pessoa e conta do criador;
3. vínculo inicial com o condomínio;
4. papel administrativo inicial;
5. ativação segura da credencial;
6. login, manutenção de sessão e logout;
7. recuperação ou reenvio de acesso;
8. convite de participante;
9. atribuição e revogação de vínculo/papel dentro do modelo aprovado;
10. criação e acompanhamento de pendência com responsável e status;
11. comentário, decisão e histórico/auditoria rastreável como conceitos distintos;
12. exportação básica autorizada em formato aberto.

O item de recuperação/reenvio e a distinção entre comentário, decisão e auditoria estão implícitos nos grupos de requisitos e nas jornadas aprovadas, mesmo não aparecendo como linhas próprias na lista de dez itens do SCP.

### 4.2 Adiamentos aprovados

- gestão financeira;
- documentos;
- prestação de contas;
- portal amplo de transparência;
- mandatos e troca completa de gestão;
- integrações contábeis e de folha;
- automações avançadas e módulos altamente especializados.

Esses adiamentos delimitam a primeira versão pública. Não alteram a visão do produto nem convertem capacidades futuras em descartadas.

## 5. Grupos de requisitos a incorporar

O PRD atualizado deve criar requisitos funcionalmente numerados sob, no mínimo, os seguintes grupos:

- **Onboarding institucional:** cadastro progressivo, validações e retomada segura;
- **Identidade:** Pessoa, Conta, Vínculo, Papel e vigência como conceitos distintos;
- **Autenticação:** ativação, login, sessão, logout e recuperação/reenvio;
- **Acesso:** autorização por vínculo ativo, mínimo privilégio e isolamento por condomínio;
- **Convites:** emissão, entrega, token expirável de uso único, reenvio e tratamento de falha;
- **Pendências:** criação, responsável, estados, transições, visibilidade, validação e conflito;
- **Contexto e histórico:** comentário, decisão e auditoria separados, com visibilidade e imutabilidade adequadas;
- **Portabilidade:** solicitação autorizada, formato aberto, conteúdo, integridade, legibilidade e registro da exportação.

O PRD deve descrever capacidades e resultados, não escolher cookie, JWT, banco, framework, biblioteca ou provedor.

## 6. Requisitos não funcionais necessários para lançamento público

O PRD atual não possui NFRs implementáveis. A atualização deve definir critérios mensuráveis para:

- segurança de credenciais e sessões;
- proteção de dados e privacidade por padrão;
- autorização, mínimo privilégio e isolamento entre condomínios;
- acessibilidade, incluindo teclado, foco, contraste, rótulos, erros e tecnologias assistivas;
- responsividade e suporte aos fluxos essenciais em dispositivos móveis e desktop;
- desempenho dos fluxos principais;
- disponibilidade e tratamento de indisponibilidade;
- integridade, durabilidade, backup e recuperação dos dados;
- imutabilidade e rastreabilidade da auditoria;
- portabilidade e validade do pacote exportado;
- prevenção de perda de dados em formulários e ações sensíveis;
- observabilidade operacional suficiente para sustentar o lançamento;
- qualidade e testes como critérios transversais, não como um épico posterior.

Os valores concretos de SLO, tempos, retenção, recuperação e conformidade ainda não foram aprovados e não devem ser inventados.

## 7. Jornadas exigidas pela entrada Journey-led

O PRD atual tem apenas um fluxo genérico. A atualização deve capturar jornadas narradas pelo proprietário para protagonistas concretos, ao menos nos seguintes contextos:

1. responsável administrativo cria o espaço institucional e obtém acesso;
2. participante recebe convite, ativa a conta e entra;
3. administrador concede, altera ou revoga acesso;
4. participante autorizado cria uma pendência e define responsável;
5. responsável atualiza a pendência e preserva o contexto;
6. outro participante consulta ações, decisões e histórico conforme sua permissão;
7. administrador solicita e valida uma exportação dos dados do condomínio;
8. usuário enfrenta erro, convite expirado, acesso negado ou indisponibilidade e consegue se recuperar.

Cada jornada deve revelar motivação, sequência, resultado esperado, pontos de confiança, falhas e informações necessárias. O PRD não deve inventar essas narrativas: elas precisam ser elicitas e confirmadas durante o Coaching path.

## 8. Métricas reconciliadas

Indicadores já aprovados para o PRD:

- taxa de conclusão do onboarding;
- taxa de ativação de convites;
- conclusão da primeira pendência e do primeiro fluxo completo de acompanhamento;
- sucesso de acesso por participante convidado;
- consulta do histórico por participante autorizado;
- sucesso e validade da exportação;
- tempo e taxa de conclusão dos fluxos principais;
- incidentes de autorização, acesso indevido ou mistura de dados;
- percepção de clareza, confiança e utilidade.

Lacuna: ainda faltam definição operacional, linha de base, meta, janela de medição e contramétricas. Como se trata de preparação para lançamento público, essas definições são bloqueadoras para um PRD final.

## 9. Decisões abertas e bloqueadores da atualização

### 9.1 Bloqueadores de produto

1. **Modelo mínimo de identidade:** confirmar se Unidade integra a primeira versão e definir múltiplos vínculos, papéis acumuláveis, vigência, revogação e relação entre pessoa e conta.
2. **Autoridade e duplicidade no onboarding:** definir quem pode criar o condomínio, como se trata condomínio/e-mail já existente e como se evita apropriação indevida.
3. **Matriz de acesso:** definir quem pode convidar, gerir papéis, criar/atribuir/alterar pendências, visualizar conteúdo sensível e exportar dados.
4. **Ciclo de pendência:** definir estados, transições, obrigatoriedade/elegibilidade do responsável, remoção de responsável e comportamento diante de alterações concorrentes.
5. **Escopo de exportação:** definir conteúdo, formato de produto, destinatários autorizados, prazo de geração, retenção e critérios de validade.
6. **Critérios de lançamento:** estabelecer metas mensuráveis, janela, SLOs mínimos e condições de go/no-go.

### 9.2 Decisões que podem ser diferidas com owner e condição

- profundidade do dashboard/visão geral, que pode começar como estado orientativo;
- filtros avançados e paginação do histórico;
- notificações além das indispensáveis para convite/ativação;
- suporte completo a mandatos e troca de gestão, explicitamente adiado;
- automações e integrações externas não essenciais.

## 10. Conteúdo destinado ao addendum técnico ou à arquitetura

Os seguintes detalhes são relevantes, mas não devem ocupar o corpo normativo do PRD:

- React, TypeScript, Vite, Node, Express e Zod existentes;
- PostgreSQL como alvo e JSON como persistência temporária;
- interfaces de repositório e estratégia de migração do JSON;
- cookie `HttpOnly`, `Secure`, `SameSite` versus JWT;
- Argon2id + pepper, armazenamento, rotação e operação do segredo;
- CSRF, rate limiting e mecanismos específicos de proteção;
- provedor, fila, template e adaptador de e-mail;
- desenho físico de tenancy e constraints;
- bibliotecas opcionais como TanStack, shadcn/ui, Radix, Tailwind, Prisma e Cypress;
- IDs aleatórios, endpoint de saúde, rotas e guardas;
- testes de caracterização e estratégia incremental de substituição do protótipo;
- detalhes do arquivo local `data/storage.json`.

O PRD deve conservar apenas os resultados exigidos: identidade verificável, sessão segura e revogável, segredo não exposto, autorização no servidor, convite confiável, persistência durável e recuperável e exportação aberta/autorizada. A decisão aprovada de Argon2id + pepper deve ser preservada no addendum/ADR e referenciada como restrição de segurança já decidida, sem transformar o PRD em desenho de solução.

## 11. Elementos do PRD atual a preservar

- objetivo de reduzir caos operacional e perda de informação;
- foco em organização e transparência;
- simplicidade para pessoas com baixa familiaridade tecnológica;
- confiabilidade para uso ocasional;
- núcleo gratuito;
- evolução gradual orientada por uso real;
- resistência à complexidade prematura.

Esses elementos precisam ganhar definições e métricas, mas não devem ser descartados.

## 12. Elementos a substituir ou remover

- substituir segmentação por “pequenos e médios” por segmentação por baixa estrutura administrativa;
- substituir requisitos em bullets sem IDs por requisitos estáveis e verificáveis;
- substituir “comunicação básica” por capacidades delimitadas de comentário, decisão e auditoria;
- substituir o fluxo único genérico por jornadas confirmadas;
- substituir critérios puramente qualitativos por métricas operacionais;
- remover qualquer implicação de que identidade, convite, sessão, portabilidade ou persistência sejam detalhes opcionais;
- evitar citar ferramentas técnicas ou afirmar comportamentos que o produto ainda não consegue garantir.

## 13. Caminho recomendado

1. Elicitar e confirmar as jornadas prioritárias com protagonistas concretos.
2. Resolver os bloqueadores de identidade, acesso, ciclo de pendência, exportação e critérios de lançamento.
3. Reescrever o PRD como primeira versão pública, com grupos de capacidades e IDs globais estáveis.
4. Definir métricas, contramétricas e NFRs mensuráveis sem prescrever solução técnica.
5. Encaminhar detalhes de implementação e decisões brownfield para addendum/arquitetura/ADRs.
6. Reconciliar o novo PRD com discovery e proposta aprovada antes da revisão final.
7. Somente depois atualizar UX, arquitetura e backlog e repetir o gate BMAD.

## 14. Veredito da reconciliação

**O PRD atual não está pronto para edição cosmética nem para finalização.** Ele precisa de revisão substancial, mas a visão central permanece aproveitável. O Sprint Change Proposal fornece um recorte funcional aprovado; a decisão posterior de preparação para lançamento público eleva o rigor e prevalece sobre a linguagem anterior de validação. As maiores lacunas são identidade/acesso, portabilidade, NFRs públicos, métricas e jornadas confirmadas.
