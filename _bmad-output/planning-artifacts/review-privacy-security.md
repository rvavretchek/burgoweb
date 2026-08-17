---
title: "Revisão especializada de privacidade e segurança — PRD Burgoweb"
reviewer: "Privacy and Security"
status: "complete"
reviewed: "2026-07-22"
iteration: 4
artifacts:
  - "prd.md"
  - "addendum.md"
verdict: "READY_FOR_UX_ARCHITECTURE_AND_EPICS_WITH_LAUNCH_GATES"
counts:
  critical: 0
  high: 0
  medium: 4
  low: 1
---

# Revisão especializada de privacidade e segurança

## Veredito por fase

- **UX:** **READY**. Os fluxos e estados necessários para privacidade, publicação, suspensão, identidade, delegação e conteúdo interno estão suficientemente definidos.
- **Arquitetura:** **READY**. O PRD estabelece invariantes e separa corretamente requisitos de mecanismos técnicos; o baseline brownfield identifica explicitamente o que não pode ser promovido ao ambiente público.
- **Épicos e histórias:** **READY**. Os FRs possuem fronteiras e consequências testáveis suficientes para decomposição. Cada história deverá herdar os NFRs e cenários negativos aplicáveis.
- **Lançamento público:** **BLOCKED BY EXPLICIT GATES**, como esperado. Parecer jurídico, evidências técnicas e validações operacionais continuam obrigatórios antes do lançamento, mas não impedem o trabalho downstream.

Não há alegação indevida de conformidade jurídica. Bases legais, retenção, categorias finais de direitos e qualificação de controlador, operador, encarregado e terceiros permanecem corretamente condicionadas a parecer profissional. `BURGOWEB_LGPD*.md` não foi tratado como parecer canônico.

## Resoluções confirmadas

- A matriz agora nega acesso de Conselheiro e Morador ao Anexo original e permite somente versão compartilhável autorizada, alinhada a FR-35.
- Papel, capacidade delegada, Vínculo e atribuição de Responsável Financeiro são conceitos separados.
- Ser Morador não concede automaticamente acesso à situação individual; a atribuição Pessoa–Unidade limita a consulta às Unidades relacionadas.
- Auxiliar não amplia os próprios poderes nem delega a terceiros; capacidades ausentes são negadas no servidor e possuem vigência/auditoria.
- Pendência é interna por padrão; Conselho só vê item fiscal explicitamente autorizado e Morador não vê Pendência administrativa.
- Comentário, Decisão Operacional e Evento de Auditoria possuem semântica, visibilidade e versionamento distintos; nenhum deles se torna Publicação automaticamente.
- Decisão Operacional não é apresentada como ata, deliberação assemblear ou certificação jurídica.
- Eventos de Auditoria são imutáveis para usuários, minimizam payload e excluem credenciais/segredos.
- Publicação, suspensão, Exportação, transferência, armazenamento e baseline brownfield continuam coerentes com os contratos aprovados nas revisões anteriores.

## Achados médios — refinamentos downstream, não bloqueadores

### PS-01 — Atribuir Responsável Financeiro está acoplado à capacidade ampla de gerir Vínculos

- **Localização:** FR-41 e FR-42.
- **Evidência:** Auxiliar com capacidade de gerir Vínculos pode atribuir ou remover Responsável Financeiro, concedendo acesso a informação financeira individual.
- **Risco:** uma pessoa encarregada apenas de cadastro pode receber indiretamente poder de conceder acesso financeiro sensível.
- **Correção proposta:** UX/arquitetura devem avaliar capacidade separada `gerir responsáveis financeiros` ou exigir confirmação específica dentro da gestão de Vínculos. Histórias devem testar que gerir cadastro sem essa capacidade não concede acesso financeiro.

### PS-02 — Atribuição financeira não exige notificação ao titular atribuído/removido

- **Localização:** FR-42.
- **Evidência:** concessão e remoção são auditadas, mas não há consequência explícita de notificação à Pessoa afetada.
- **Risco:** acesso sensível pode surgir ou desaparecer sem que a pessoa detecte erro ou abuso.
- **Correção proposta:** UX deve prever notificação de atribuição, remoção, Unidade abrangida e canal de contestação, sem transformar aceitação em requisito jurídico presumido. A necessidade de consentimento/base legal permanece no gate jurídico.

### PS-03 — Leituras sensíveis precisam ser enumeradas na política de auditoria

- **Localização:** FR-42, FR-45, NFR-9 e addendum §2.4.
- **Evidência:** `consultas auditáveis aplicáveis` e eventos de Anexos/Exportações deixam à arquitetura definir quais leituras geram Evento de Auditoria.
- **Risco:** leitura de inadimplência detalhada, Anexo original, solicitação de titular ou pacote de Exportação pode não ser investigável; registrar tudo sem critério também aumenta exposição.
- **Correção proposta:** arquitetura deve enumerar operações de leitura sensível, usar payload mínimo, proteger integridade e limitar acesso à trilha. Histórias de autorização devem incluir evidência positiva e negativa de auditoria.

### PS-04 — Moderação preserva original, mas não define quem pode consultá-lo

- **Localização:** FR-43 e addendum §2.4.
- **Evidência:** remover/moderar Comentário mantém original em acesso restrito, sem definir a audiência desse original.
- **Risco:** moderador ou usuário do objeto pode continuar vendo conteúdo removido além da finalidade necessária.
- **Correção proposta:** UX/arquitetura devem restringir o original moderado ao conjunto mínimo necessário para revisão, incidente ou disputa, com acesso auditado e retenção condicionada à política jurídica.

## Achado baixo

### PS-05 — Terminologia de propriedade de dados permanece ambígua

- **Localização:** descrição da seção 4.6.
- **Evidência:** `dados pertencentes à operação do Condomínio` pode ser interpretado como propriedade sobre Dados Pessoais.
- **Correção proposta:** usar `dados institucionais sob gestão do Condomínio e dados exportáveis conforme autorização, finalidade e direitos aplicáveis`.

## Condições para histórias prontas

Os itens abaixo não impedem criar épicos, mas devem aparecer nos critérios das histórias correspondentes:

- autorização sempre no servidor, incluindo acumulação de Papéis/Vínculos e capacidades com vigência;
- testes negativos entre Condomínios, Unidades e Papéis para telas, APIs, arquivos, buscas, histórico e Exportações;
- revogação/suspensão com encerramento de sessões alcançadas e preservação de autoria;
- publicação somente após preview de audiência/campos/Anexos e confirmação explícita;
- original privado separado da versão compartilhável;
- Pendência, Comentário e Decisão interna nunca publicados implicitamente;
- auditoria sem segredos ou conteúdo pessoal excessivo;
- rastreabilidade explícita do código brownfield preservado, substituído ou removido.

## Bloqueadores reais por fase

### UX, arquitetura e épicos

**Nenhum bloqueador de privacidade/segurança remanescente.** Os quatro achados médios podem ser resolvidos durante UX, arquitetura e escrita das histórias sem alterar a direção do produto.

### Lançamento público

1. **Jurídico/LGPD:** incorporar parecer sobre bases legais, retenção/descarte, direitos aplicáveis, papéis dos agentes e responsabilidades entre Condomínio, Burgoweb e terceiros.
2. **Privacidade:** aprovar inventário de dados/campos, matriz final de visibilidade, critérios de minimização/reidentificação e fluxo de Anexos compartilháveis.
3. **Identidade e autorização:** demonstrar autenticação, recuperação, revogação de sessão, catálogo de capacidades e isolamento multi-tenant com testes negativos completos.
4. **Brownfield:** substituir `actorUserId` confiado ao cliente, ausência de sessão, Convite fictício/senha temporária e persistência JSON; código existente não é evidência de conformidade.
5. **Auditoria e incidentes:** validar trilha mínima, exercer resposta a incidente e comprovar capacidade de identificar escopo, conter, restaurar e comunicar quando aplicável.
6. **Persistência e recuperação:** demonstrar transações financeiras, backup/restauração, integridade de snapshots, armazenamento de Anexos e objetivos operacionais aprovados.
7. **Exportação e continuidade:** validar geração/download ponta a ponta, integridade, expiração, autorização por Condomínio e cenário de troca de gestão.
8. **Capacidade operacional:** medir carga, Cota, disponibilidade e recuperação; publicar limitações compatíveis com operação individual e sem NOC.

