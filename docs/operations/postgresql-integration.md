# Integração PostgreSQL 18 em revisões

O gate PostgreSQL não depende exclusivamente de Docker/WSL. Neste workstation existe o serviço Windows `postgresql-x64-18-burgoweb`, normalmente em `127.0.0.1:55432`.

## Comando canônico

Execute sempre `npm run test:integration` na raiz do projeto. O dispatcher escolhe automaticamente:

- Windows sem URL explícita: serviço `postgresql-x64-18-burgoweb` em `127.0.0.1:55432`;
- ambiente com `BURGOWEB_INTEGRATION=1`: URL externa configurada ou Testcontainers;
- Linux/CI sem URL explícita: Testcontainers.

No Windows, o runner confirma PostgreSQL 18+, cria um banco UTF-8 isolado, define as variáveis de integração, executa a suíte e remove o banco no `finally`. `npm run test:integration:local` permanece como diagnóstico explícito do serviço Windows.

O comando interno `npm run test:integration:raw` não deve ser usado como gate manual: ele pressupõe que `BURGOWEB_INTEGRATION=1` e a URL já foram configurados. Executá-lo sem essas variáveis coleta testes como `skipped`, o que não comprova integração.

## Ordem obrigatória para agentes de revisão

1. Execute `npm run test:integration`.
2. Confirme que o resumo contém testes `passed`; uma coleta somente com `skipped` não satisfaz o gate.
3. Somente declare bloqueio após falha concreta do dispatcher e após verificar o serviço Windows quando estiver neste workstation.
4. Indisponibilidade de Docker/WSL, isoladamente, não é bloqueio neste workstation.
5. Não reutilize banco de desenvolvimento nem deixe banco temporário após a revisão.

Variáveis opcionais: `BURGOWEB_LOCAL_POSTGRES_ROOT`, `BURGOWEB_LOCAL_POSTGRES_PORT`, `BURGOWEB_LOCAL_POSTGRES_USER` e `BURGOWEB_LOCAL_POSTGRES_PASSWORD`. Os defaults pertencem somente à instância local de testes.

Para servidor externo, configure `BURGOWEB_INTEGRATION=1` e `BURGOWEB_INTEGRATION_DATABASE_URL` antes do comando canônico.
