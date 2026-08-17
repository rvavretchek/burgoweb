---
name: Burgoweb
description: Sistema visual claro, confiável e acessível para organização e transparência condominial.
status: final
updated: 2026-07-27
sources:
  - ../../prd.md
  - ../../architecture.md
  - ../../epics.md
  - ../../implementation-readiness-report-2026-07-27.md
colors:
  brand-primary: '#236F9E'
  brand-primary-hover: '#19597F'
  on-brand: '#FFFFFF'
  accent-informative: '#F6E6A6'
  on-accent: '#332B12'
  canvas: '#F7F9FB'
  surface: '#FFFFFF'
  surface-subtle: '#EEF3F6'
  ink: '#17212B'
  ink-muted: '#536270'
  border: '#657785'
  focus-light: '#6D28D9'
  focus-dark: '#FFFFFF'
  success: '#176B45'
  success-surface: '#E7F5ED'
  warning: '#805D00'
  warning-surface: '#FFF4CC'
  danger: '#B42318'
  danger-surface: '#FDECEA'
  info: '#175CD3'
  info-surface: '#EAF2FF'
typography:
  display:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  heading:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 24px
    fontWeight: '650'
    lineHeight: '1.3'
  body:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
  meta:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
  '7': 48px
  page-mobile: 16px
  page-desktop: 32px
components:
  button-primary:
    background: '{colors.brand-primary}'
    foreground: '{colors.on-brand}'
    radius: '{rounded.md}'
  focus-ring:
    color: '{colors.focus-light}'
    width: 3px
    offset: 2px
  content-card:
    background: '{colors.surface}'
    border: '{colors.border}'
    radius: '{rounded.lg}'
  status-badge:
    radius: '{rounded.full}'
    foreground: '{colors.ink}'
  sensitive-action:
    background: '{colors.danger-surface}'
    foreground: '{colors.danger}'
    radius: '{rounded.md}'
  audience-preview:
    background: '{colors.info-surface}'
    foreground: '{colors.ink}'
    border: '{colors.info}'
    radius: '{rounded.md}'
  legal-gate:
    background: '{colors.warning-surface}'
    foreground: '{colors.on-accent}'
    border: '{colors.warning}'
    radius: '{rounded.md}'
---

# Burgoweb — Design Spine

Este arquivo governa como o Burgoweb se apresenta. `EXPERIENCE.md` governa comportamento. Os spines vencem qualquer mock, wireframe ou importação em caso de conflito.

## Brand & Style

O Burgoweb deve parecer uma instituição comunitária organizada, não um sistema contábil nem uma rede social. A expressão visual é sóbria, acessível e acolhedora: superfícies claras, hierarquia inequívoca, densidade controlada e linguagem visual que transmite rastreabilidade.

O azul deriva da marca existente e identifica navegação e ações primárias. O amarelo claro é reservado a contexto e orientação; nunca mascara alerta, erro ou permissão. A interface não usa ornamentação, gradientes ou gamificação.

## Colors

- `{colors.brand-primary}` identifica marca, links e ação principal. Texto branco sobre essa cor deve manter contraste AA.
- `{colors.canvas}`, `{colors.surface}` e `{colors.surface-subtle}` separam planos por tom, sem depender de sombras.
- `{colors.ink}` é texto principal; `{colors.ink-muted}` serve apenas a metadados que continuam legíveis.
- Sucesso, aviso, perigo e informação sempre combinam cor, ícone, rótulo textual e, quando necessário, explicação. Cor nunca é o único sinal.
- `{colors.focus-light}` é usado sobre superfícies claras. Sobre azul, perigo ou outro fundo cromático, usa-se anel composto: separador de 2 px na cor da superfície e anel externo `{colors.focus-dark}` de 3 px. Em `forced-colors`, o indicador usa `Highlight` e não é suprimido.

Combinações permitidas são normativas: `{colors.ink}` e `{colors.ink-muted}` sobre `{colors.canvas}`, `{colors.surface}` ou `{colors.surface-subtle}`; `{colors.on-brand}` sobre `{colors.brand-primary}` e `{colors.brand-primary-hover}`; cada cor semântica sobre sua superfície homônima; `{colors.on-accent}` sobre `{colors.accent-informative}` ou `{colors.warning-surface}`. Implementação deve comprovar ≥4,5:1 para texto normal, ≥3:1 para texto grande e ≥3:1 para bordas, ícones de estado e foco. Links em texto usam sublinhado persistente; controles desabilitados conservam rótulo legível e não dependem de opacidade.
- Dados restritos não recebem aparência chamativa; usam cadeado, rótulo de audiência e explicação de escopo.

## Typography

Inter é preferida; `system-ui` é fallback obrigatório. Texto-base tem 16 px e zoom de 200% não pode provocar perda de conteúdo ou ação. Títulos usam caixa normal, nunca sequências em maiúsculas. Valores financeiros usam algarismos tabulares quando disponíveis e incluem rótulo semântico: realizado, previsto, saldo, obrigação ou inadimplência.

## Layout & Spacing

A escala é 4/8/12/16/24/32/48. O shell usa barra lateral persistente a partir de 1024 px e cabeçalho compacto abaixo disso. A largura de leitura fica entre 720 e 960 px; superfícies financeiras podem ocupar até 1440 px.

No celular, tabelas densas viram listas de registros com os mesmos campos, estado, audiência e ações. Não ocultar colunas críticas apenas para caber. Formulários usam uma coluna até 768 px e no máximo duas acima disso. Ações sensíveis nunca ficam em barra flutuante que cubra conteúdo.

## Elevation & Depth

Hierarquia vem de espaçamento, borda e tom. Sombras são discretas e restritas a menus, popovers e diálogos. Estados de erro, suspensão e quarentena não usam elevação como significado.

## Shapes

Campos usam `{rounded.sm}`, botões `{rounded.md}` e cartões/diálogos `{rounded.lg}`. Pílulas ficam restritas a badges curtos. Blocos grandes totalmente arredondados e formas lúdicas não pertencem ao produto.

## Components

| Componente | Especificação visual |
|---|---|
| Shell institucional | Logo, nome do Condomínio selecionado, seletor contextual e navegação por capacidade. Mudança de Condomínio exige destaque textual persistente. |
| Button | Primário usa `{colors.brand-primary}`; secundário é bordado; destrutivo usa `{colors.danger}`. Estado desabilitado inclui explicação adjacente quando a causa não for óbvia. |
| Form field | Label persistente, ajuda antes do erro e erro junto ao campo. Placeholder não substitui label. Obrigatoriedade é textual. |
| Status badge | Texto + ícone + cor. Vocabulá vem da máquina de estados do domínio; nunca abreviar estados sensíveis. |
| Content card | `{components.content-card}`; título, natureza, estado, audiência e última alteração quando aplicável. |
| Data table / record list | Cabeçalhos semânticos, ordenação anunciada, paginação por cursor, resumo dos filtros e versão em lista no celular. |
| Money summary | Valores alinhados, rótulos completos e separação visual/textual entre previsto e realizado. Gráfico nunca é a única representação. |
| Audience preview | `{components.audience-preview}`; mostra natureza, audiência efetiva, campos, período, valores e Anexos que serão compartilhados. |
| Sensitive confirmation | Resumo do efeito, risco, audiência e irreversibilidade; campo de motivo quando exigido; botão nomeia a ação. |
| Publication card | Distingue Rascunho, Publicado, Substituído e Suspenso; mostra versão e audiência. Nunca se parece com Pendência interna. |
| Pending item | Estado, responsável, prazo e próxima ação; aparência administrativa neutra, sem marca de publicação. |
| Comment | Balão discreto com autor, instante e indicador de versão/moderação. Não usa badge de estado. |
| Operational decision | Bloco formal com título, confirmação, autor e versão; nunca rotulado como ata, deliberação jurídica ou certificação. |
| Audit event | Linha cronológica técnica e minimizada: ator, ação, objeto, resultado, instante e correlação, sem payload sensível. |
| Upload / quarantine | Progresso determinado quando conhecido; depois, estados Enviando, Em verificação, Liberado, Rejeitado ou Falhou. Anexo não parece disponível antes de Liberado. |
| State panel | Vazio, carregando, erro, indisponível, negado, conflito, processando, expirado e recuperação usam título, explicação e ação segura. |
| Legal gate | `{components.legal-gate}`; identifica decisão pendente e o que pode ou não ser feito, sem simular conclusão jurídica. |
| Toast / live message | Apenas feedback transitório; resultados persistentes também aparecem na superfície. Erros críticos não dependem de toast. |
| Async job | Painel persistente com rótulo, progresso/estado textual e link para o resultado; progresso não depende de animação. |
| Conflict resolver | Compara estado atual e entrada preservada em blocos rotulados; ação primária nunca sobrescreve silenciosamente. |
| Focus ring | Anel simples em superfície clara e composto em fundo cromático, conforme a regra de contraste acima. |

Os nomes desta tabela são canônicos e devem ser usados literalmente em `EXPERIENCE.md`. O frontmatter registra deltas visuais; componentes sem delta herdam HTML semântico e os tokens globais deste spine, não uma biblioteca externa implícita.

Referências de composição: [Dashboard](mockups/dashboard.html) ilustra Shell institucional, Content card, Money summary, Pending item e Focus ring; [preview de Publicação](mockups/publication-preview.html) ilustra Audience preview, Sensitive confirmation, Publication card, Legal gate e Focus ring. Os spines vencem os mocks.

## Do's and Don'ts

| Faça | Não faça |
|---|---|
| Mostre Condomínio, Papel/capacidade e audiência no contexto da ação. | Trate ocultar um botão como controle de autorização. |
| Separe claramente registro interno, conteúdo privado e versão publicada. | Use “salvar e publicar” para Pendência, Comentário ou Decisão. |
| Represente previsto e realizado por rótulo, estrutura e cor. | Use apenas verde/vermelho para significado financeiro. |
| Preserve entrada do usuário em conflito ou falha recuperável. | Sobrescreva silenciosamente uma versão concorrente. |
| Explique por que um dado foi agregado, suprimido ou restringido. | Exponha Pessoa/Unidade por tooltip, URL, filtro, contagem ou estado vazio. |
| Use confirmação específica para publicar, suspender, fechar, transferir e exportar. | Use confirmação genérica “Tem certeza?”. |
| Preserve operação estruturada quando a cota de Anexos acabar. | Sugira exclusão automática ou compra de espaço no MVP. |
| Ofereça teclado, foco visível e áreas de toque de pelo menos 24×24 CSS px, preferencialmente 44×44. | Crie affordance apenas por hover, gesto ou cor. |
