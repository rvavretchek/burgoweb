## Document Summary

- **Purpose:** Orientar PM, UX, arquitetura, criação de épicos/histórias e gates de lançamento a partir de um contrato de produto chain-top único e rastreável.
- **Audience:** Agentes LLM e responsáveis de PM, UX, arquitetura, produto, testes e engenharia que extraem decisões, requisitos e dependências.
- **Reader type:** llm
- **Structure model:** Strategic/Context (Pyramid) no documento principal, com Reference/Database para o catálogo de requisitos e Prompt/Task Definition para gates e handoffs.
- **Current length:** 9.307 palavras em 105 seções com heading — 7.542 palavras/91 headings no PRD e 1.765 palavras/14 headings no addendum; consideradas 25 seções principais de nível 2.
- **Core question:** Qual contrato de produto deve orientar a primeira versão pública do Burgoweb e quais decisões, restrições e gates cada workflow downstream deve respeitar?
- **Existence statement:** Este conjunto existe para ajudar PM, UX, arquitetura e agentes de backlog a extrair, sem inferência silenciosa, o escopo, os contratos funcionais e as condições de lançamento do Burgoweb.

### Current structure map

| Documento | Seção principal | Palavras | Serve diretamente ao propósito? |
|---|---|---:|---|
| PRD | 0. Finalidade do documento | 68 | Sim; define precedência e uso downstream |
| PRD | 1. Visão | 185 | Sim; contém tese, momento de valor e modelo de negócio |
| PRD | 2. Usuários e trabalhos a realizar | 443 | Sim; orienta Journey-led UX e prioridade |
| PRD | 3. Glossário | 487 | Sim; é dependência crítica para leitor LLM |
| PRD | 4. Funcionalidades e requisitos funcionais | 4.367 | Sim; conteúdo central, mas grande demais para o fluxo piramidal |
| PRD | 5. Matriz de visibilidade do MVP | 233 | Sim; parcialmente redundante com FR-41/FR-42 |
| PRD | 6. Requisitos não funcionais e guardrails | 517 | Sim; orienta arquitetura e gates |
| PRD | 7. Escopo do MVP | 639 | Sim; deveria anteceder o catálogo detalhado |
| PRD | 8. Métricas de sucesso e critérios de lançamento | 222 | Sim; está enterrada após 5 mil palavras de detalhes |
| PRD | 9. Gates anteriores ao lançamento público | 129 | Sim; está enterrada apesar de controlar decisão |
| PRD | 10. Questões abertas | 162 | Sim; precisa ficar junto dos gates e donos |
| PRD | 11. Decisões jurídicas provisórias | 74 | Sim; pode ser integrada ao bloco de gates/assumptions |
| Addendum | 1. Autenticação e credenciais | 160 | Sim; contém restrições técnicas e baseline |
| Addendum | 1.1 Autoridade declarada e governança de acesso | 265 | Parcial; repete FR-3/FR-8/FR-9/FR-31–FR-33/FR-41–FR-42 |
| Addendum | 2. Exportação e persistência | 228 | Sim, mas mistura implicações arquiteturais com repetição de FR-24–FR-26 |
| Addendum | 2.1 Capacidade e armazenamento de Anexos | 170 | Sim; os números de OCI pertencem à arquitetura/pesquisa técnica |
| Addendum | 2.1.1 Realidade operacional | 110 | Sim; restrição arquitetural crítica |
| Addendum | 2.2 Núcleo financeiro | 95 | Parcial; resume FR-10–FR-13/FR-38–FR-40 quase sem nova decisão |
| Addendum | 2.3 Pendências | 78 | Parcial; repete FR-21 |
| Addendum | 2.4 Comentários, decisões e auditoria | 96 | Parcial; repete FR-43–FR-45 |
| Addendum | 3. Hipótese inicial de agentes de tratamento | 88 | Sim; entrada para revisão jurídica, não técnica |
| Addendum | 4. Anexos e saneamento | 66 | Sim; separa capacidade funcional e técnica |
| Addendum | 4.1 Versionamento e suspensão | 229 | Parcial; repete FR-27–FR-29/FR-34–FR-36 |
| Addendum | 4.2 Resposta a incidentes | 70 | Sim; orienta arquitetura e runbook |
| Addendum | 5. Insumos jurídicos preliminares | 75 | Sim; metadado de precedência jurídica |

## Recommendations

### 1. MOVE - Front-load status, decisão e gates

**Rationale:** O modelo Pyramid exige que o leitor encontre primeiro tese, escopo decidido, estado de prontidão e bloqueios; hoje gates e questões abertas aparecem somente após cerca de 6.900 palavras do PRD.
**Impact:** ~0 palavras; reduz drasticamente o caminho até as condições de uso do documento.
**Comprehension note:** Criar após §1 um bloco estruturado `Status / Decisões / Gates / Open items / Próximo consumidor`, referenciando as seções detalhadas sem duplicá-las.

### 2. MOVE - Reorder the PRD by downstream dependency

**Rationale:** Para reader_type `llm`, conceitos, escopo e restrições devem preceder jornadas e requisitos; o Glossário atualmente vem depois de termos usados em §2, e o Escopo vem depois dos 45 FRs.
**Impact:** ~0 palavras.
**Comprehension note:** Ordem proposta: `Finalidade e precedência → Visão/resultado → Status/gates → Glossário → Escopo/non-goals → Usuários/jornadas → Métricas → Baseline brownfield → Requisitos funcionais → Matriz de acesso → NFRs → Questões/hipóteses`.

### 3. SPLIT - Extract §4 into a requirements-catalog companion

**Rationale:** §4 ocupa 4.367 palavras, 58% do PRD, e transforma um documento estratégico chain-top em um híbrido difícil de escanear; um catálogo Reference/Database preserva todos os FRs e melhora random access.
**Impact:** ~0 palavras no conjunto; reduz o corpo do PRD principal em ~4.367 palavras e as mantém integralmente em um companion versionado.
**Comprehension note:** Preservar IDs FR-1–FR-45 e esquema uniforme; o PRD principal deve conter mapa de capacidades, ranges de FR, jornadas e link canônico para o catálogo. Se a equipe exigir arquivo único, manter §4, mas gerar índice/tabulação no início da seção.

### 4. MOVE - Place the brownfield baseline before detailed requirements

**Rationale:** O consumidor precisa saber o que existe e o que é incompatível antes de interpretar FRs como greenfield ou assumir conformidade do protótipo.
**Impact:** ~0 palavras.
**Comprehension note:** Mover §7.3 para depois de jornadas/métricas e antes do catálogo; atualizar o range final para FR-45 como parte da mesma mudança.

### 5. MERGE - Make permissions a single source of truth

**Rationale:** §5 repete em linguagem aberta regras agora definidas com maior precisão em FR-5, FR-8, FR-16–FR-20, FR-31, FR-34, FR-41 e FR-42.
**Impact:** ~80–120 palavras de redução.
**Comprehension note:** Manter a matriz porque ela é útil para LLM, mas substituir células vagas por IDs de capacidades/FRs e remover frases duplicadas; a matriz vira índice de autorização, não segunda especificação.

### 6. MERGE - Consolidate gates, questions, provisional decisions and assumptions

**Rationale:** §9, §10, §11 e partes do addendum §3/§5 representam o mesmo ciclo de decisão, mas estão separados por documento e não oferecem roundtrip único.
**Impact:** ~80–140 palavras de redução, além de eliminar risco de estado divergente.
**Comprehension note:** Criar uma tabela canônica com `ID, decisão/hipótese, owner, evidência, prazo/gate, status, fonte`; manter detalhes jurídicos no companion, referenciados pelo ID.

### 7. CONDENSE - Remove functional restatement from addendum §§1.1, 2.2, 2.3, 2.4 and 4.1

**Rationale:** Esses blocos repetem contratos já normativos em FR-3/8/9/10–13/21/27–29/31–45; duas formulações criam risco de drift para agentes LLM.
**Impact:** ~500–650 palavras de redução.
**Comprehension note:** No addendum, conservar somente implicações técnicas/jurídicas, decisões de fronteira e links por ID: por exemplo, `Contrato funcional: FR-21. Implicações arquiteturais: ...`.

### 8. SPLIT - Separate technical constraints from legal-review inputs

**Rationale:** O addendum mistura arquitetura, operação, LGPD e evidência jurídica, dificultando determinar precedência e owner de cada decisão.
**Impact:** ~0–50 palavras; principal ganho é separação de responsabilidade.
**Comprehension note:** Estrutura proposta: `architecture-constraints.md` para autenticação, persistência, capacidade, operação, ledger, incidentes; `legal-review-input.md` para agentes, direitos, retenção e status do parecer. O addendum pode virar um índice curto para ambos.

### 9. MOVE - Relocate OCI capacity facts to architecture research/ADR

**Rationale:** Limites específicos de OCI em addendum §2.1 são temporais e tecnológicos, pertencem ao desenho de implantação e podem contaminar o contrato duradouro do produto.
**Impact:** ~55–80 palavras removidas do conjunto PRD/addendum e transferidas sem perda para arquitetura.
**Comprehension note:** Preservar no addendum apenas a invariável: Cota e compromissos dependem de medição de capacidade, reserva e operação sustentável.

### 10. CONDENSE - Replace repeated prose with structured requirement metadata

**Rationale:** Expressões repetidas como “autor, instante, motivo, versão/histórico” e “não apaga” aparecem em muitos FRs e podem ser centralizadas como invariantes transversais com referências explícitas.
**Impact:** ~220–320 palavras de redução.
**Comprehension note:** Criar uma tabela de invariantes (`AUD-1`, `AUTH-1`, `VER-1`, `PRIV-1`, `TEN-1`) e manter em cada FR apenas exceções e consequências específicas; não remover exemplos nem estados de domínio.

### 11. MERGE - Consolidate Publicação lifecycle sections

**Rationale:** Requisitos de Publicação estão espalhados entre §4.4, §4.7 e §4.10, embora formem uma única máquina de estados e audiência.
**Impact:** ~60–100 palavras de redução em descrições repetidas.
**Comprehension note:** Agrupar `ativação/visibilidade → rascunho/conferência → publicação/versionamento → correção → suspensão/SLA`; preservar os IDs atuais para estabilidade downstream.

### 12. MERGE - Consolidate financial capability sections

**Rationale:** §4.3 e §4.12 pertencem ao mesmo modelo financeiro; separar Contas/Obrigações/Previsões dos Lançamentos/Movimentos/Fechamento obriga o LLM a reconstruir dependências distantes.
**Impact:** ~30–60 palavras de redução em descrições.
**Comprehension note:** Ordenar por dependência: `Conta Financeira → Obrigação/Lançamento → Movimento → Caixa/Previsão → Serviço/parcelamento → Fechamento`; manter IDs FR-10–FR-13 e FR-38–FR-40.

### 13. MOVE - Place metrics immediately after journeys

**Rationale:** Métricas validam a tese e as jornadas, mas atualmente aparecem depois do catálogo; a distância favorece requisitos sem resultado rastreável.
**Impact:** ~0 palavras.
**Comprehension note:** Após UJ-1–UJ-5, apresentar SM-1–SM-5 e contramétricas, seguidas da matriz `UJ → FR → NFR → SM/gate`.

### 14. CONDENSE - Normalize section descriptions and remove orientation repetition

**Rationale:** Cada subseção de §4 repete “Descrição”, “Realiza/Apoia UJ” e frases já expressas no heading, que podem virar metadados compactos.
**Impact:** ~100–160 palavras de redução.
**Comprehension note:** Usar esquema uniforme por grupo: `Purpose | Journeys | FR range | Dependencies`; isso melhora extração automática sem reduzir conteúdo normativo.

### 15. QUESTION - Decide whether Publicação, anúncio and quadro de anúncios share one bounded context

**Rationale:** “Quadro de anúncios”, “anúncios” e Publicações financeiras aparecem no mesmo versionamento/audiência, mas o documento não mostra estruturalmente se são uma família ou capacidades distintas.
**Impact:** ~0 palavras; pode evitar duplicidade futura.
**Comprehension note:** Não alterar a decisão de produto; apenas escolher uma localização e taxonomia única, com termos distintos se os ciclos de vida diferirem.

### 16. PRESERVE - Keep glossary, explicit states, formulas, exclusions and brownfield table

**Rationale:** Esses elementos podem parecer longos para leitores humanos, mas são âncoras essenciais contra inferência e alucinação para reader_type `llm`.
**Impact:** ~0 palavras; preserva aproximadamente 1.200–1.500 palavras de alta densidade.
**Comprehension note:** Não converter estados, equações, exclusões de Exportação, non-goals ou tabela brownfield em prosa resumida.

### 17. PRESERVE - Keep the PRD/addendum boundary for mechanisms, but enforce directional references

**Rationale:** Separar “o quê” do “como” é correto; o problema atual é repetição bidirecional, não a existência do addendum.
**Impact:** ~0 palavras.
**Comprehension note:** PRD é normativo para produto; companions referenciam FR/NFR e acrescentam apenas implicações ou decisões próprias, nunca uma segunda formulação do contrato funcional.

## Summary

- **Total recommendations:** 17
- **Estimated reduction:** 1.125–1.600 palavras (12%–17% do conjunto), sem contar a extração organizacional de §4 para companion
- **Meets length target:** No target specified
- **Comprehension trade-offs:** Para reader_type `llm`, a redução proposta remove duplicidade e orientação, não estados, fórmulas, exemplos de domínio, exclusões ou baseline. A extração do catálogo melhora densidade do PRD, mas exige links canônicos e versionamento conjunto para não fragmentar a fonte de verdade.
