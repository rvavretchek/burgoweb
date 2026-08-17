---
title: "Reconciliação do discovery canônico com o PRD"
product: "Burgoweb"
date: "2026-07-21"
status: "analysis"
scope: "PRD update — preparação para lançamento público"
sources:
  - "docs/product/discovery/00-index.md"
  - "docs/product/discovery/01-identidade-e-proposito.md"
  - "docs/product/discovery/02-problema-e-contexto.md"
  - "docs/product/discovery/03-segmentos-e-personas.md"
  - "docs/product/discovery/04-necessidades-e-jornadas.md"
  - "docs/product/discovery/05-proposta-de-valor-e-diferenciacao.md"
  - "docs/product/discovery/06-escopo-e-modelo-de-negocio.md"
  - "docs/product/discovery/07-mapa-de-capacidades.md"
  - "docs/product/discovery/08-decisoes-hipoteses-e-riscos.md"
  - "docs/product/discovery/09-handoff-para-bmad.md"
  - "_bmad-output/planning-artifacts/prd.md"
  - "_bmad-output/planning-artifacts/sprint-change-proposal-2026-07-21.md"
---

# Reconciliação do discovery canônico com o PRD

## 1. Objetivo e regra de precedência

Este relatório reconcilia os dez documentos canônicos de discovery (`00` a `09`) com o PRD atual, o Sprint Change Proposal aprovado e a decisão mais recente do proprietário de preparar o produto para **lançamento público**.

Conforme `AGENTS.md`, aplica-se a seguinte precedência:

1. decisão explícita mais recente do proprietário do produto;
2. discovery em `docs/product/discovery/`;
3. artefatos aprovados em `_bmad-output/planning-artifacts/`;
4. histórias;
5. inferências.

A decisão de lançamento público eleva o rigor exigido, mas não resolve silenciosamente as questões de escopo ainda abertas. O Sprint Change Proposal é uma decisão aprovada sobre o replanejamento; quando seu recorte conflita com o discovery, o PRD precisa expor o conflito e obter decisão explícita do proprietário.

## 2. Diagnóstico executivo

O PRD atual não representa o produto descoberto. Ele descreve principalmente um organizador de pendências para condomínios “pequenos e médios”, enquanto o discovery define uma plataforma institucional gratuita para condomínios sem estrutura administrativa, cujo valor inicial conecta registro financeiro, documento, prestação de contas, transparência, continuidade e portabilidade.

O Sprint Change Proposal corrige identidade, acesso, segurança, auditoria e exportação, mas introduz um “MVP operacional de validação” centrado em pendências e adia justamente financeiro, documentos e prestação de contas. Esse recorte é coerente como etapa técnica/beta, mas não sustenta sozinho a promessa canônica nem a preparação para lançamento público sem uma decisão de produto adicional.

Resultado da reconciliação: o PRD requer reescrita substancial, com requisitos rastreáveis, escopo público explícito, jornadas e métricas alinhadas, NFRs de produção e separação clara entre decisões, hipóteses e itens futuros.

## 3. Matriz de reconciliação por documento canônico

| Fonte canônica | Decisão ou orientação | Situação no PRD atual | Mudança necessária no PRD |
|---|---|---|---|
| `00-index.md` — Síntese executiva e Estado das decisões | Plataforma gratuita de organização e transparência; público sem estrutura; financeiro inicial com registro, acompanhamento, fechamento e exportação; histórico institucional | Parcial/contraditória. Gratuidade e transparência aparecem, mas o público é por porte e financeiro foi excluído | Corrigir segmentação; recuperar registro institucional, financeiro mínimo e portabilidade como pilares |
| `01-identidade-e-proposito.md` — Propósito, Visão, Princípios | Organizar gestão, acompanhar gastos, prestar contas; valor antes de cadastro completo; transparência com privacidade; portabilidade e continuidade | Parcial. O PRD reduz a promessa a rotina e pendências e omite privacidade, portabilidade e troca de gestão | Reescrever objetivo/proposta de valor e regras de produto; incluir guardrails institucionais |
| `02-problema-e-contexto.md` — Problema e Limites | Problema central é ausência de registro institucional único; fragmentação afeta finanças, documentos, terceiros, transparência e continuidade | Incompleta. Cita comunicação, pendências e histórico, mas omite causas e resultados essenciais | Reformular problema, resultados desejados e limites; não prometer contabilidade/folha/banco completos |
| `03-segmentos-e-personas.md` — Segmentação, Unidade de valor e Modelo de participação | Segmentação por maturidade administrativa; condomínio é cliente; Pessoa, Conta/Usuário, Vínculo, Papel, Unidade e Mandato são distintos | Contraditória/ausente. Público por porte e modelo de identidade inexistente | Incluir segmentos/personas, atores beneficiados e requisitos de identidade/vínculos/papéis acumuláveis e temporais |
| `04-necessidades-e-jornadas.md` — Jornadas e Priorização | Núcleo: entrada, rotina mensal, transparência, preparação contábil e troca de gestão. Momento de valor: despesa + comprovante + prestação publicada | Contraditória. Fluxo principal é visualizar/atualizar pendências | Adotar Journey-led; definir a jornada pública mínima e seus momentos mensuráveis de valor |
| `05-proposta-de-valor-e-diferenciacao.md` — Proposta e Pilares | Gratuito no essencial, simples, transparência por padrão, continuidade, registro único e portabilidade obrigatória | Parcial. Simplicidade/gratuidade estão presentes; diferenciação institucional não | Reescrever posicionamento e razões para acreditar; evitar alegações de ERP/completude |
| `06-escopo-e-modelo-de-negocio.md` — Núcleo gratuito, Publicidade e Limites | Núcleo gratuito permanente inclui estrutura, pessoas, financeiro manual, prestação, portal, continuidade e exportação; publicidade responsável | Ausente/incompleta. “Gratuito no núcleo” não define núcleo nem monetização/neutralidade | Delimitar gratuitamente capacidades essenciais e guardrails de anúncios/dados; separar lançamento de monetização futura |
| `07-mapa-de-capacidades.md` — Essenciais e Horizontes | Horizonte A: estrutura, pessoas, financeiro básico, documentos, prestação, transparência, exportação, continuidade e auditoria; tarefas são Horizonte B | Contraditória com o PRD e o MVP operacional do Change Proposal | Definir fatia coerente do Horizonte A para lançamento; não elevar pendências isoladas à proposta central sem decisão explícita |
| `08-decisoes-hipoteses-e-riscos.md` — DEC/HYP/RSK | Decisões aceitas sobre público, free-first, financeiro, transparência e dados; hipóteses precisam de evidência; riscos de escopo, disciplina, privacidade e lock-in | Incompleta. Mistura critérios qualitativos e hipóteses genéricas; não possui evidências/metas | Preservar IDs de decisões/hipóteses quando útil; criar métricas, experimentos e mitigação; não converter hipóteses em requisitos confirmados |
| `09-handoff-para-bmad.md` — Regras de síntese e prontidão | Discovery não deve ser sobrescrito; conflitos/lacunas/hipóteses devem ser explicitados; tecnologia não deve ser antecipada | Processo anterior não preservou alinhamento suficiente | Manter rastreabilidade `fonte → objetivo → FR/NFR → jornada → métrica`; atualizar artefatos derivados, não o discovery |

## 4. Decisões canônicas que o PRD atualizado deve preservar

### 4.1 Produto, público e valor

- O Burgoweb é produto independente e plataforma gratuita de organização e transparência condominial (`01`, Natureza/Categoria; `08`, DEC-001).
- O segmento prioritário é definido pela ausência de estrutura administrativa, não por porte, nem pela forma física do condomínio (`03`, Princípio de segmentação; `08`, DEC-003/004).
- O condomínio é a unidade institucional de valor; o síndico é adotante, mas o produto também serve moradores, conselho, terceiros e futuras gestões (`03`, Unidade de valor).
- O diferencial não é quantidade de módulos: é combinar simplicidade, transparência, continuidade, registro único e portabilidade (`00`, Síntese; `05`, Pilares).

### 4.2 Núcleo gratuito e monetização

- O núcleo institucional deve permanecer útil e gratuito; não se deve cobrar para preservar histórico ou exercer transparência (`06`, Modelo proposto).
- Monetização não pode criar assimetria de acesso ou comprometer neutralidade; o morador não é o pagador principal (`06`, Pagadores potenciais).
- Publicidade deve ser identificada, contextual e excluída de áreas oficiais, financeiras, de auditoria, exportação e dados sensíveis; perfilamento sensível é proibido (`06`, Publicidade; `08`, DEC-010/RSK-004).

### 4.3 Dados, acesso e continuidade

- O histórico pertence ao condomínio, não à gestão corrente (`01`, princípio 5; `08`, DEC-008).
- Pessoa, conta/usuário, vínculo, unidade, papel e mandato não podem ser condensados em um usuário com papel fixo (`03`, Modelo conceitual; `07`, Pessoas, vínculos e permissões).
- Transparência coletiva deve coexistir com acesso mínimo para dados administrativos, pessoais e trabalhistas (`04`, Jornada 3; `08`, RSK-003).
- Portabilidade por formatos abertos e exportação integral é capacidade institucional obrigatória (`01`, princípio 9; `07`, caps. 11/12; `08`, RSK-008).

### 4.4 Limites

O lançamento não deve alegar que o Burgoweb é sistema contábil, folha, banco, instituição de pagamento, administradora, escritório jurídico, sistema oficial de ponto, garantidor ou responsável técnico por obras (`02`, Limites; `06`, Limites do produto).

## 5. Hipóteses e decisões ainda abertas

Os seguintes pontos precisam aparecer no PRD como hipóteses, experimentos ou decisões pendentes — nunca como fatos confirmados:

1. Qual é o menor conjunto capaz de gerar fechamento mensal e prestação útil (`08`, Pergunta 1).
2. Quais informações nascem coletivas/publicadas e quais exigem publicação explícita (`08`, Pergunta 2).
3. Qual estrutura mínima de unidade e vínculo atende diferentes tipologias (`08`, Pergunta 3).
4. Como comprovar autoridade para cadastrar ou assumir um condomínio (`08`, Pergunta 4).
5. Como transferir controle entre gestões e revogar acesso anterior (`08`, Pergunta 5).
6. Quais formatos de exportação têm valor real para contadores (`08`, HYP-005/Pergunta 7).
7. Se publicidade é tolerada e economicamente sustentável sem afetar confiança (`08`, HYP-006/008).
8. Quais metas numéricas demonstram adoção, transparência, confiança e continuidade (`08`, Pergunta 9).

Como a intenção agora é lançamento público, comprovação de autoridade, recuperação de conta, privacidade, termos, governança de dados e resposta a incidentes deixam de ser detalhes de piloto e passam a exigir critérios verificáveis antes do go-live.

## 6. Lacunas e divergências prioritárias

### 6.1 Recorte do lançamento não entrega o momento de valor canônico — bloqueador de produto

O PRD atual e o Sprint Change Proposal priorizam pendências, responsável, status e histórico. Entretanto:

- o momento de valor da entrada é registrar despesa com comprovante e publicá-la em prestação compreensível (`04`, Jornada 1);
- a rotina núcleo termina em fechamento, exportação e publicação (`04`, Jornada 2);
- financeiro inicial é decisão aceita (`08`, DEC-006);
- a métrica principal é o percentual de condomínios que conclui fechamento mensal e publica prestação (`06`, Métrica principal);
- tarefas/ocorrências pertencem ao Horizonte B, após o núcleo institucional (`07`, Horizontes).

**Decisão requerida:** para lançamento público, incluir uma fatia institucional mínima — despesa manual, comprovante, classificação, fechamento simples, publicação controlada e exportação — ou reposicionar explicitamente a entrega como beta operacional, sem usar ainda a promessa pública completa. A primeira opção é a recomendada.

### 6.2 Identidade, autoridade e governança de acesso — bloqueador de segurança

O PRD atual não possui requisitos para Pessoa, Conta, Vínculo, Papel, Unidade, Mandato, convite, revogação, sessão, recuperação ou prova de autoridade. O Change Proposal cobre parte desse vazio, mas a comprovação da autoridade inicial continua aberta.

**Caminho:** requisitos numerados para criação/ativação de conta, vínculo e papéis acumuláveis com vigência, sessão, recuperação, convite/revogação, isolamento por condomínio, transição de gestão e trilha de auditoria. A regra de prova de autoridade deve ser definida antes do lançamento público.

### 6.3 Transparência, privacidade e publicação — bloqueador de confiança/conformidade

“Transparência” aparece como intenção genérica, sem modelo de visibilidade, conteúdo publicável, tratamento de dados pessoais/trabalhistas, retenção ou auditoria. Também não há fluxo de pergunta/esclarecimento vinculado.

**Caminho:** classificar dados em coletivo, administrativo restrito e pessoal/trabalhista; definir defaults seguros, autorização no servidor, publicação explícita quando aplicável, registro de autoria/data/origem e critérios de exclusão lógica. Incluir revisão jurídica/LGPD como dependência de lançamento, sem inventar conclusão jurídica no PRD.

### 6.4 Portabilidade e continuidade estão subespecificadas — bloqueador institucional

“Exportação básica” no Change Proposal não define escopo, formatos, documentos, histórico, metadados ou integridade. Isso não garante a exportação integral e a troca de gestão previstas no discovery.

**Caminho:** definir pacote exportável em formatos abertos, incluindo estrutura, pessoas/vínculos conforme autorização, registros, histórico e documentos; registrar autoria/data/escopo; validar legibilidade/integridade; definir transferência de controle e preservação após revogação da gestão anterior.

### 6.5 Critérios de sucesso e NFRs não suportam lançamento público — bloqueador de gate

O PRD usa avaliações vagas (“menos esforço”, “adoção positiva”) e não cobre disponibilidade, desempenho, acessibilidade, segurança, privacidade, recuperação, observabilidade, backup ou isolamento.

**Caminho:** transformar hipóteses em métricas de funil e valor — onboarding, ativação, primeiro registro, fechamento, publicação, consulta por participante, exportação válida e retorno — e adicionar NFRs mensuráveis. Metas sem evidência devem ser marcadas como `[ASSUMPTION]` e validadas antes de se tornarem compromisso.

## 7. Escopo recomendado para o PRD de lançamento público

### 7.1 Fatia mínima recomendada

1. **Entrada institucional segura:** cadastro progressivo, pessoa/conta, condomínio, estrutura mínima, vínculo e papel administrativo, com autoridade verificável.
2. **Acesso e participação:** ativação, login/logout/sessão, recuperação, convite, revogação, papéis acumuláveis e isolamento por condomínio.
3. **Registro financeiro mínimo:** receita/despesa manual, competência, vencimento/pagamento, categoria, fornecedor/origem, valor, responsável e comprovante.
4. **Fechamento e transparência:** pendências de qualidade dos dados, fechamento simples, prestação compreensível, visibilidade e publicação controladas, consulta por morador/conselho.
5. **Memória e auditoria:** autoria, data/hora, alterações, documentos relacionados, comentários/esclarecimentos separados de eventos imutáveis.
6. **Continuidade e portabilidade:** exportação aberta/integral da fatia implementada, histórico de exportação, transferência de gestão e expiração de acessos.

Pendências/tarefas podem existir como apoio à rotina e ao fechamento, mas não devem substituir o núcleo financeiro/documental na proposta pública.

### 7.2 Explicitamente fora do primeiro lançamento

- escrituração, cálculo tributário ou obrigação acessória;
- cálculo de folha e regras sindicais;
- banco, Pix, boletos, conciliação e cobrança;
- assembleias/votações digitais;
- marketplace e leilão reverso;
- multiconomínio e equipes de administradoras;
- integrações avançadas, OCR e automações;
- projetos/obras completos, ponto e operação trabalhista avançada.

### 7.3 Decisão comercial sugerida

Manter o núcleo gratuito como requisito de negócio. Não tornar publicidade requisito de go-live até existirem política, consentimentos/base aplicável, separação visual, áreas proibidas e métricas de confiança. Monetização pode ser uma fase posterior sem retirar capacidades institucionais essenciais.

## 8. Jornadas que devem estruturar o PRD atualizado

### Jornada A — Márcia cria o registro institucional e percebe valor

Descobre → comprova autoridade → cria conta/condomínio mínimo → configura estrutura progressivamente → registra primeira despesa e comprovante → convida participante → corrige pendências → fecha período → publica prestação → percebe redução de retrabalho.

### Jornada B — Ana/Carlos consultam e confiam

Ativam convite → entram com papel/vínculo correto → consultam resumo, origem e documento publicado → registram pergunta vinculada quando necessário → recebem esclarecimento preservado → não acessam conteúdo restrito.

### Jornada C — Patrícia recebe dados úteis

Acessa escopo autorizado ou recebe exportação → revisa dados e comprovantes → identifica divergência vinculada → recebe correção → confirma pacote, sem o Burgoweb executar escrituração.

### Jornada D — Nova gestão assume sem perda de memória

Mandato anterior é encerrado → pendências/documentos/acessos são inventariados → nova autoridade é validada → papéis antigos expiram → aceite é registrado → histórico e exportação permanecem disponíveis.

Cada jornada deve possuir happy path, falha, acesso negado, recuperação, estado vazio e evidência de auditoria.

## 9. Estrutura requerida para o novo PRD

O PRD atualizado deve conter, no mínimo:

1. visão, problema e posicionamento alinhados ao discovery;
2. nível de compromisso: preparação para lançamento público;
3. segmentos, personas, unidade institucional de valor e antipersonas/guardrails;
4. resultados de negócio e usuário;
5. escopo incluído, excluído e futuro;
6. jornadas prioritárias e momentos de valor;
7. requisitos funcionais numerados e rastreáveis;
8. requisitos não funcionais mensuráveis;
9. modelo conceitual de informação, acesso e visibilidade em nível de produto;
10. regras de gratuidade, monetização e publicidade;
11. métricas, hipóteses e plano de validação;
12. riscos, dependências, critérios de prontidão e go-live;
13. matriz de rastreabilidade `discovery → objetivo → FR/NFR → jornada → métrica`.

## 10. Caminho recomendado

1. Obter decisão explícita do proprietário sobre o momento de valor do lançamento: recomenda-se a fatia `despesa + comprovante + fechamento + prestação/publicação + exportação`.
2. Conduzir o coaching Journey-led começando por Márcia e validando, em seguida, as jornadas de transparência e troca de gestão.
3. Reescrever o PRD com requisitos numerados, NFRs públicos e marcações `[ASSUMPTION]` para metas ainda não evidenciadas.
4. Revisar Product Brief, UX e arquitetura brownfield a partir do PRD aprovado.
5. Regenerar casos de uso, épicos e histórias e repetir o gate de prontidão antes de nova implementação.

## 11. Conclusão

O propósito e a oportunidade permanecem consistentes, mas o PRD atual é insuficiente para lançamento público. A correção principal não é adicionar mais funcionalidades indiscriminadamente: é selecionar uma fatia vertical do núcleo institucional que prove a promessa de organização, prestação de contas, transparência e continuidade com acesso seguro e portabilidade real.

Até que a decisão de escopo e os requisitos públicos sejam aprovados, o protótipo deve continuar classificado como brownfield de aprendizagem, não como base pronta para lançamento.
