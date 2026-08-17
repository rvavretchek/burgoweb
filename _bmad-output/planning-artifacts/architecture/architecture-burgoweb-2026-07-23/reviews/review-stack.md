# Revisão independente final — stack e compatibilidade

**Data da verificação:** 2026-07-24  
**Artefato:** `ARCHITECTURE-SPINE.md`  
**Veredito:** **PASS WITH CONDITIONS** — não restam incompatibilidades ou versões inexistentes que impeçam a finalização. A matriz está atual, concreta e internamente coerente; as condições remanescentes já pertencem ao spike de bootstrap e ao baseline operacional.

## Critical / high

Nenhum.

## Compatibilidades confirmadas

| Combinação | Resultado |
| --- | --- |
| Node.js 24.18.0 + Vite 8.1.5 | Compatível; Vite 8 requer uma linha Node moderna e Node 24 atende. |
| Node.js 24.18.0 + Fastify 5.10.0 | Compatível; Fastify 5 suporta Node 20+. |
| NestJS 11.1.20 + `@nestjs/platform-fastify` 11.1.20 + Fastify 5.10.0 | Coerente; o adapter Nest 11 usa Fastify 5. Fixar core e adapter no mesmo patch evita drift. |
| Node.js 24.18.0 + Cypress 15.19.0 | Compatível; Cypress declara Node 20, 22 e 24+. |
| Cypress 15.19.0 + Vite 8.1.5 | Compatível; suporte a Vite 8 foi adicionado na linha 15.14 e está incluído em 15.19. |
| Cypress 15.19.0 + TypeScript 7.0.2 | Compatível; Cypress 15.19 adicionou suporte a TypeScript 7. |
| Vitest 4.1.10 + Vite 8.1.5 | Coerente na linha atual do ecossistema Vite; confirmar pelo smoke test do workspace. |
| React 19.2.7 + TanStack Start/Router 1.168.30 | Versões publicadas e plausíveis; Start continua em canal RC, portanto SSR/hydration e o par resolvido são condições do spike. |
| PostgreSQL 18.4 + Kysely 0.29.2 + kysely-codegen 0.20.0 | Nenhuma incompatibilidade oficial identificada; validar driver `pg`, introspecção multi-schema e migrations no spike. |
| Docker Engine 29.6.2 + Compose 5.1.4 | Releases oficiais atuais e compatíveis; Compose 5.1.4 usa dependências da linha Docker CLI 29. |
| Docker Engine 29.6.2 + Testcontainers 12.0.4 | Baseline atual plausível; smoke test ARM64 continua necessário. |
| Prometheus 3.13.0 LTS + Grafana 13.1 + Alloy 1.18 | Protocolos compatíveis; consumo real permanece sujeito ao soak test da e2-micro. |

## Condições remanescentes — medium

### M1 — TanStack Start permanece RC e tem alta cadência

- **Evidência:** a documentação oficial ainda classifica o Start como Release Candidate. Os pacotes usam numeração `1.x` contínua e publicações muito frequentes.
- **Risco:** um par apenas nominalmente igual de Start/Router não substitui a resolução real das dependências do pacote Start; SSR, hydration e plugin Vite podem revelar regressões do canal.
- **Condição:** manter `1.168.30` congelado apenas se o instalador/lockfile resolver o par com sucesso e o spike cobrir build, SSR, hydration, navegação e Cypress E2E. Registrar qualquer versão transitiva diferente resolvida pelo Start; não atualizar Start e Router de forma independente.
- **Fontes:** [status oficial do TanStack Start](https://tanstack.com/start/latest/docs/framework/react/overview), [pacote React Start](https://www.npmjs.com/package/@tanstack/react-start), [pacote React Router](https://www.npmjs.com/package/@tanstack/react-router).

### M2 — Três componentes operacionais ainda são pins de linha, não de artefato

- **Itens:** `Salt 3008 LTS`, `Grafana 13.1` e `Alloy 1.18` não informam patch; Salt delega o patch ao “baseline operacional”.
- **Risco:** a tabela é suficientemente específica para arquitetura, porém o deploy ainda não é bit-for-bit reproduzível até existir o inventário operacional com patch e digest.
- **Condição:** antes do provisionamento, fixar o pacote Salt exato do repositório da distribuição e as imagens Grafana/Alloy por patch e digest. O soak test deve usar esses mesmos artefatos.
- **Fontes:** [lifecycle Salt](https://docs.saltproject.io/salt/install-guide/en/latest/topics/salt-version-support-lifecycle.html), [Grafana releases](https://grafana.com/docs/grafana/latest/whatsnew/), [Grafana Alloy](https://grafana.com/docs/alloy/latest/).

## Evidência de versões atuais

- Node.js `24.18.0` permanece LTS. [Node releases](https://nodejs.org/en/about/previous-releases)
- React `19.2.7` é o patch documentado da linha 19.2. [React versions](https://react.dev/versions)
- Vite `8.1` é a linha suportada corrente. [Vite releases](https://vite.dev/releases)
- PostgreSQL `18.4` é o minor corrente e contém correções de segurança. [PostgreSQL versioning](https://www.postgresql.org/support/versioning/)
- Kysely `0.29.2`, kysely-codegen `0.20.0` e Testcontainers `12.0.4` são versões publicadas atuais. [Kysely releases](https://github.com/kysely-org/kysely/releases), [kysely-codegen](https://www.npmjs.com/package/kysely-codegen), [Testcontainers](https://www.npmjs.com/package/testcontainers)
- Cypress `15.19.0` declara suporte a TypeScript 7; TypeScript `7.0.2` é release estável publicada. [Cypress changelog](https://docs.cypress.io/app/references/changelog), [TypeScript](https://www.npmjs.com/package/typescript)
- Docker Engine `29.6.2` e Compose `5.1.4` são releases oficiais. [Engine 29](https://docs.docker.com/engine/release-notes/29/), [Compose releases](https://github.com/docker/compose/releases)
- Prometheus `3.13.0` é LTS corrente. [Prometheus downloads](https://prometheus.io/download/)

## Decisão do gate

A tabela pode ser finalizada. Não é necessário rebaixar versões preventivamente. O spike de bootstrap exigido pelo próprio spine deve converter os dois riscos residuais em evidência: lockfile funcional para TypeScript 7/TanStack RC e inventário por digest para os componentes operacionais.
