# Spine Pair Review — Burgoweb

## Overall verdict

O par final está **adequado como contrato downstream e não apresenta achado crítico ou alto**. Fluxos, tokens, componentes bilaterais, estados, forma e referências visuais fecham mecanicamente; os remanescentes são de consistência/extração e risco de drift documental.

## 1. Flow coverage — adequate

As jornadas UJ-1 a UJ-5 mantêm nomes verbatim do PRD, protagonista nomeado, passos numerados, clímax e falha. A nova tabela relaciona todos os UX-DR1–UX-DR23 a contratos e fluxos e esclarece a distinção entre UJ-3 e UJ-4.

### Findings

- **medium** A rastreabilidade usa faixas (`UX-DR1–UX-DR3`, etc.), portanto cada requisito e seu nome canônico ainda não são extraíveis individualmente; FR-1–FR-45 e NFRs são delegados integralmente a `epics.md` (EXPERIENCE.md, § Coverage and Guardrails / Rastreabilidade UX-DR). *Fix:* desdobrar uma linha por UX-DR com o nome verbatim; para FR/NFR, incluir ao menos uma coluna/referência nominal compacta ou declarar explicitamente no frontmatter um artefato de traceabilidade consumível.

## 2. Token completeness — strong

Todos os tokens de cor possuem hex, os tipos seguem a especificação e todas as referências `{path.to.token}` resolvem. O spine agora compromete pares normativos, pisos WCAG e tratamento de foco sobre superfícies claras, cromáticas e forced-colors.

### Findings

Nenhum miss mecânico.

## 3. Component coverage — adequate

As tabelas agora contêm o mesmo conjunto de 21 nomes canônicos, incluindo os pares antes ausentes: Button, Content card, Money summary, Toast / live message, Async job, Conflict resolver e Focus ring. Todos possuem regras visuais e comportamentais substantivas.

### Findings

- **medium** Os IDs no frontmatter ainda não coincidem literalmente com os nomes declarados canônicos (`button-primary`/`Button`, `sensitive-action`/`Sensitive confirmation`, `audience-preview`/`Audience preview`, `legal-gate`/`Legal gate`, `focus-ring`/`Focus ring`); não há mapa formal ID↔nome (DESIGN.md, frontmatter `components` e § Components). *Fix:* usar um ID canônico idêntico em todos os lugares ou acrescentar uma coluna `ID` que estabeleça o join mecânico.

## 4. State coverage — adequate

A matriz adicionada cobre os grupos centrais da IA e o texto transversal define carregamento, validação, sucesso, conflito, negação/revogação, indisponibilidade e conectividade. Estados de foco e restauração também foram fortalecidos nos componentes e primitives.

### Findings

- **low** A matriz opera por grupos amplos, não por cada superfície nomeada dentro deles; isso ainda exige inferência para, por exemplo, entrar versus recuperar acesso, ou upload versus consulta de originais (EXPERIENCE.md, mesma matriz). *Fix:* quando os deltas divergirem dentro de um grupo, listar sub-superfícies separadamente ou apontar para o componente/fluxo normativo.

## 5. Visual reference coverage — strong

Foram encontrados `mockups/dashboard.html` e `mockups/publication-preview.html`; `imports/` está vazio e não há arquivos em `wireframes/`. Ambos os mocks estão ligados inline nos dois spines, no contexto relevante, com descrição do que ilustram; as superfícies sem mock estão classificadas como **spine-only** e a precedência dos spines está declarada.

### Findings

Nenhum miss mecânico.

## 6. Bloat & overspecification — adequate

As correções adicionam regras downstream relevantes, e tabelas concentram os pontos comparativos. Ainda existe alguma duplicação de normas upstream.

### Findings

- **medium** `Role and Visibility Contract`, partes de `High-risk Domain Rules` e a lista `Fora do MVP` reexpõem material do PRD/arquitetura e podem sofrer drift (EXPERIENCE.md, seções citadas). *Fix:* conservar apenas deltas de UX e referenciar a fonte canônica para escopo e autorização normativa.
- **low** Larguras e breakpoints literais coexistem com tokens de spacing sem aliases semânticos de layout (DESIGN.md, § Layout & Spacing). *Fix:* promover valores load-bearing a tokens ou declarar a camada responsiva que os governa.

## 7. Inheritance discipline — adequate

As quatro fontes, `design` e `supersedes` resolvem; nomes UJ e vocabulário institucional permanecem coerentes; todas as referências de EXPERIENCE a DESIGN resolvem. O spine agora declara explicitamente que não herda biblioteca externa implícita.

### Findings

- **medium** A disciplina de nomes é completa entre as duas tabelas, mas não entre tabelas e chaves de `components` no frontmatter, impedindo join literal por consumidores automáticos (DESIGN.md, frontmatter e § Components). *Fix:* normalizar IDs ou fornecer mapeamento formal único.

## 8. Shape fit — strong

DESIGN.md mantém todas as seções na ordem canônica. EXPERIENCE.md contém todos os defaults, Responsive & Platform está presente por ser aplicável e as seções adicionais justificam-se pelos riscos do domínio. Inspiration & Anti-patterns segue não acionada pelas fontes atuais.

### Findings

Nenhum miss mecânico.

## Mechanical notes

- Fontes: todos os caminhos de frontmatter resolvem.
- Tokens: todas as referências resolvem e toda cor tem hex; `border: #657785` atende ao piso declarado de 3:1 sobre as superfícies claras especificadas.
- Componentes: 21/21 nomes pareados nas tabelas; IDs YAML ainda divergentes dos nomes canônicos.
- Estados: matriz presente, incluindo linha explícita para Configurações.
- Referências visuais: `mockups/dashboard.html` e `mockups/publication-preview.html` resolvem e estão ligados inline nos dois spines; sem órfãos; `imports/` vazio e nenhum wireframe.
- Mermaid: nenhum bloco presente.
- Status: ambos os spines estão `final`, com `updated: 2026-07-27`.
