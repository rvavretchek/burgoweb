# Lembrança da sessão — Épicos, publicações e cobrança no Burgoweb

**Data:** 25 de julho de 2026  
**Contexto:** atualização de épicos e histórias a partir do PRD, addendum, UX, arquitetura e gates finais.

## A mesa

- 📋 **Maya — Produto:** protegeu valor ao usuário, fronteiras de épicos e decisões explícitas do proprietário.
- 🏛️ **Aria — Arquitetura:** separou conceitos, dependências e invariantes que não podem virar um booleano simplista.
- 🎨 **Freya — UX:** traduziu regras de privacidade e audiência em experiências compreensíveis.
- 🛠️ **Dex — Desenvolvimento:** defendeu fatias verticais pequenas dentro de épicos completos.
- 🧪 **Quinn — Qualidade:** insistiu em cenários negativos, isolamento, idempotência e gates verificáveis.
- ⚖️ **Lia — Jurídico:** distinguiu comportamento conservador de conclusão jurídica e encaminhou as dúvidas ao parecer profissional.

## O debate que mudou a estrutura

A mesa começou discutindo se uma “versão compartilhável” poderia ser criada no Épico 3 e receber audiência apenas no Épico 4. A resposta foi não: sem audiência e sem vínculo com uma Versão Publicada, o objeto ainda não é efetivamente compartilhável. Ele é apenas um derivado saneado que continua privado.

Disso resultou a fronteira aprovada:

- **Épico 3:** originais e derivados privados, upload, quarentena, armazenamento, integridade e Cota;
- **Épico 4:** versão compartilhável, audiência, Publicação, correção, suspensão e histórico editorial.

FR-35 foi movido integralmente para o Épico 4.

## Público não significa internet

O proprietário do produto estabeleceu que algumas Publicações são coletivas por definição e outras são privadas por definição. Comunicados podem ser coletivos ou privados:

- Comunicado geral precisa alcançar toda a audiência geral definida;
- Comunicado de cobrança precisa permanecer privado;
- cobrança alcança somente Responsáveis Financeiros vigentes das Unidades abrangidas;
- conteúdo coletivo obrigatório não pode excluir silenciosamente Morador ativo;
- conteúdo privado obrigatório não pode receber audiência coletiva.

A mesa registrou três dimensões independentes:

1. natureza do conteúdo;
2. audiência efetiva;
3. estado editorial.

“Público” significa coletivo dentro da audiência autorizada do Condomínio, nunca necessariamente acessível publicamente na internet.

## Saída de Morador e pendências

A discussão jurídica concluiu apenas um baseline conservador, sujeito ao parecer consolidado:

- a saída encerra o Vínculo ativo de Morador, exista ou não pendência;
- histórico Pessoa–Unidade e autoria são preservados;
- a Obrigação continua ligada à Unidade e à competência de origem;
- dívida e dados do ocupante anterior não passam ao novo ocupante;
- eventual relação de cobrança pós-saída é separada do Papel Morador;
- eventual acesso pós-saída é mínimo, temporário, auditado e restrito às próprias cobranças e documentos;
- responsabilidade, corresponsabilidade, retenção e bases legais não serão decididas automaticamente antes do parecer.

## Encaminhamento jurídico

Foi produzido o documento `solicitacao-parecer-cobranca-e-vinculos.md`, com perguntas sobre:

- responsabilidade perante o Condomínio;
- despesas ordinárias e extraordinárias;
- saída e acesso posterior;
- troca de ocupante;
- comunicação e práticas de cobrança;
- LGPD, retenção e compartilhamento;
- parametrização e decisão humana.

O texto foi encaminhado ao advogado junto do material de LGPD, com solicitação de parecer consolidado.

## Estrutura final dos épicos

1. Começar a gestão e formar uma equipe autorizada.
2. Organização e controle financeiro.
3. Guardar documentos com privacidade e controle de espaço.
4. Prestar contas e fiscalizar com transparência segura.
5. Coordenar o trabalho e preservar decisões confiáveis.
6. Proteger dados e preservar a autoridade em situações excepcionais.
7. Garantir portabilidade e continuidade institucional.

## Frases que ficaram

> “Criar um derivado saneado não concede acesso a ninguém.”

> “Pequena significa um resultado; não significa ignorar invariantes.”

> “Público no Condomínio não significa público na internet.”

> “Conservar dados para exercer direitos não significa manter alguém como Morador.”

## Resultado

O backlog foi decomposto em épicos e histórias com 45 FRs cobertos, gates jurídicos explícitos e estas invariantes:

- nenhuma história depende de história futura;
- nenhuma autorização é satisfeita somente pela interface;
- nenhum fluxo sensível é aceito apenas pelo happy path;
- nenhum requisito deferido vira decisão silenciosa;
- auditoria, privacidade, segurança e exportabilidade são construídas desde o primeiro incremento relevante;
- a implementação permanece condicionada à execução e aprovação do gate de prontidão mais recente.

Este registro é memória histórica de apoio ao planejamento; não substitui as fontes canônicas nem altera sua precedência.
