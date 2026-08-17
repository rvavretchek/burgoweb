# Reconciliação — Arquitetura

Fonte: `../../architecture.md`, que aponta para a espinha arquitetural canônica.

## Incorporado

- Produto web responsivo e contexto explícito de tenant.
- Autorização server-side, revogação concorrente, idempotência, conflito 409 e jobs assíncronos recuperáveis.
- Upload, quarentena, promoção de Anexo e downloads temporários reautorizados.
- Snapshots imutáveis, suspensão restritiva, auditoria minimizada e exportações protegidas.
- Gates de teclado, foco, viewports, E2E e revisão humana.

## Limites preservados

O UX não inventa SLOs, cotas numéricas, retenção, criptografia adicional ou capacidades genéricas sem requisito de produto.

## Ideias descartadas

Nenhuma decisão arquitetural aplicável ao UX foi descartada.
