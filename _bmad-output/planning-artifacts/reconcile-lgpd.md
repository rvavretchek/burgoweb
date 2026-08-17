---
title: "Reconciliação dos insumos LGPD com o PRD — Burgoweb"
status: "complete"
created: "2026-07-21"
updated: "2026-07-21"
inputs:
  - "BURGOWEB_LGPD.md"
  - "BURGOWEB_LGPD_2.md"
  - "prd.md"
---

# Reconciliação dos insumos LGPD com o PRD

## Resultado

Os dois documentos LGPD reforçam minimização, segregação de acesso, transparência sem exposição indevida e privacidade desde a concepção. Entretanto, eles não constituem parecer jurídico validado para o produto, divergem entre si em pontos relevantes e incluem afirmações categóricas sobre bases legais, retenção e permissões que não devem ser convertidas diretamente em requisitos confirmados.

As decisões explícitas mais recentes do proprietário do produto prevalecem. Bases legais, períodos de retenção e a qualificação dos papéis de controlador, operador, encarregado e eventuais suboperadores permanecem dependentes de parecer jurídico antes do lançamento público.

## Decisões reconciliadas

### Inadimplência

- Para moradores em geral e assembleias, exibir somente informação agregada, sem nomes, unidades ou outro identificador que permita apontar o inadimplente.
- O detalhe de inadimplência fica restrito ao síndico e à equipe administrativa autorizada, dentro da finalidade de gestão e cobrança.
- Cada titular pode consultar somente a situação financeira da própria unidade, observadas as regras aplicáveis ao vínculo com ela.

Essa decisão é mais restritiva que `BURGOWEB_LGPD_2.md`, que admite números de unidades em assembleia. Tal alternativa fica rejeitada para o escopo atual. Ela também corrige a ambiguidade de `BURGOWEB_LGPD.md`, cujo exemplo de anonimização por “Unidade X” ainda pode permitir reidentificação no contexto condominial.

### Conselho

- O conselho terá acesso apenas às informações financeiras necessárias à sua atuação.
- Esse acesso não inclui dados pessoais individualizados por padrão.
- Exceções não devem ser inferidas a partir dos documentos LGPD e dependem de decisão de produto amparada por parecer jurídico.

Essa decisão substitui as afirmações dos insumos que atribuem ao conselho acesso a holerites, imagens de CFTV ou pastas integrais com dados pessoais.

### Dados e capacidades fora do escopo

- Biometria está fora do produto atual.
- Folha de pagamento e prontuários trabalhistas estão fora do produto atual.
- Contabilidade completa está fora do produto atual.

Consequentemente, recomendações dos insumos sobre coleta biométrica, salários, holerites, dados trabalhistas e prazos correspondentes não geram requisitos neste PRD. A transparência financeira do lançamento não deve ser descrita como módulo contábil ou de folha.

### Documentos e anexos

- Anexos não serão publicados automaticamente.
- A existência de um arquivo no sistema não implica visibilidade para moradores, assembleia ou conselho.
- Publicação exige ação explícita de pessoa autorizada, definição de audiência e prevenção de exposição de dados pessoais; os critérios jurídicos finais permanecem pendentes.

Isso limita as afirmações dos insumos de que notas fiscais ou documentos de prestação de contas devem ser exibidos integralmente. Mesmo documentos de pessoa jurídica podem conter dados pessoais em campos, anexos ou metadados.

## Lacunas no PRD atual

1. **Matriz de visibilidade ausente.** O PRD ainda não transforma as decisões sobre visão geral, própria unidade, síndico/equipe e conselho em requisitos funcionais e critérios de aceitação verificáveis.
2. **Publicação de anexos não especificada.** Faltam requisitos para estado privado por padrão, publicação explícita, audiência autorizada, revisão antes da publicação, revogação de acesso e registro da ação.
3. **Fronteira financeira ambígua.** O PRD precisa distinguir transparência financeira mínima de contabilidade completa e registrar expressamente biometria, folha e contabilidade entre as exclusões do lançamento.
4. **Dependências jurídicas não registradas como gate.** Bases legais por finalidade, retenção por categoria e papéis dos agentes de tratamento precisam permanecer como questões abertas com responsável e condição de resolução antes do lançamento.
5. **Requisitos transversais incompletos.** Ainda faltam minimização por campo, prevenção de reidentificação, canal para direitos dos titulares, trilha de acesso/publicação e resposta a incidentes como requisitos verificáveis, sem antecipar solução técnica.

## Guardrails para atualização do PRD

- Não copiar prazos de retenção, bases legais ou permissões dos documentos de entrada como fatos aprovados.
- Não descrever o conselho como extensão da equipe administrativa.
- Não usar número de unidade, pseudônimo ou agrupamento pequeno como sinônimo automático de anonimização.
- Não fazer publicação automática de anexos nem presumir que todo documento financeiro é seguro para exposição.
- Manter as decisões jurídicas pendentes visíveis como bloqueadores de lançamento, com validação por profissional jurídico responsável.

