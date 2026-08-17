# Compose

O ambiente local é iniciado na raiz com `npm run dev`. O orquestrador gera
credenciais efêmeras, inicia PostgreSQL 18 no Docker Engine do WSL e encerra o
container ao receber `Ctrl+C`. A porta PostgreSQL é exposta somente em
`127.0.0.1:55432` e os dados ficam em `tmpfs`.
