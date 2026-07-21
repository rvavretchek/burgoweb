# AGENTS.md — Burgoweb

## Projeto

Burgoweb é uma plataforma gratuita de organização e transparência
condominial, voltada inicialmente a condomínios sem estrutura
administrativa ou sistema de gestão.

## Método de trabalho

Este projeto utiliza o BMAD Method.

Os agentes e workflows estão instalados em:

- `_bmad/`
- `.agents/skills/`

Os artefatos gerados pelos workflows devem ser mantidos em:

- `_bmad-output/planning-artifacts/`
- `_bmad-output/implementation-artifacts/`

## Fontes canônicas de produto

Antes de produzir PRD, UX, arquitetura, épicos ou histórias, leia:

1. `docs/product/discovery/00-index.md`
2. `docs/product/discovery/01-identidade-e-proposito.md`
3. `docs/product/discovery/02-problema-e-contexto.md`
4. `docs/product/discovery/03-segmentos-e-personas.md`
5. `docs/product/discovery/04-necessidades-e-jornadas.md`
6. `docs/product/discovery/05-proposta-de-valor-e-diferenciacao.md`
7. `docs/product/discovery/06-escopo-e-modelo-de-negocio.md`
8. `docs/product/discovery/07-mapa-de-capacidades.md`
9. `docs/product/discovery/08-decisoes-hipoteses-e-riscos.md`
10. `docs/product/discovery/09-handoff-para-bmad.md`

## Precedência documental

Em caso de conflito:

1. decisão explícita mais recente do proprietário do produto;
2. documentos em `docs/product/discovery/`;
3. artefatos aprovados em `_bmad-output/planning-artifacts/`;
4. histórias em `_bmad-output/implementation-artifacts/`;
5. inferências feitas pelo agente.

Não altere decisões de produto silenciosamente.

## Regras de execução

- Utilize um workflow BMAD por conversa.
- Não pule etapas obrigatórias do workflow.
- Não implemente funcionalidades ainda classificadas como futuras.
- Não converta hipóteses em requisitos confirmados.
- Registre decisões relevantes nos artefatos correspondentes.
- Execute testes e validações aplicáveis antes de concluir uma tarefa.
- Não altere arquivos fora do escopo solicitado sem justificar.
- Preserve portabilidade e exportação dos dados do condomínio.

## Idioma

- Comunicação e documentação: português do Brasil.
- Código, nomes técnicos e identificadores: inglês, salvo decisão
  arquitetural contrária.