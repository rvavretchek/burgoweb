---
title: "Revisão adversarial de produto — PRD Burgoweb"
project: "burgoweb"
date: "2026-07-22"
status: "complete"
review_type: "adversarial-product"
review_iteration: 4
artifacts_reviewed:
  - prd.md
  - addendum.md
precedence_notes:
  - todas as decisões recentes do PO são aprovadas
  - mecanismos e metas explicitamente deferidos à arquitetura não são reabertos
  - conclusões explicitamente deferidas ao jurídico não são reabertas
---

# Revisão adversarial de produto — gate final

## Veredito

**READY WITH CORRECTIONS — UX, arquitetura e épicos podem avançar. Não há bloqueador real de fase.**

Os contratos de identidade, autorização, finanças, inadimplência, Pendências, comentários, Decisões Operacionais, auditoria, Publicação, suspensão, continuidade, portabilidade, armazenamento e operação enxuta estão suficientemente definidos para os próximos artefatos. As questões quantitativas e jurídicas possuem owners, momento de revisão e gates explícitos; não constituem lacunas do PRD neste estágio.

Os achados remanescentes são inconsistências locais, rastreabilidade desatualizada e detalhes de handoff. Devem ser corrigidos antes de marcar o PRD como `final`, mas não exigem nova elicitação do PO nem impedem trabalho downstream.

## Achados

1. **[medium] A matriz de visibilidade contradiz FR-21 para Moradores.** A linha “Pendências e histórico” permite ao Morador “conteúdo publicado ou atribuído”, enquanto FR-21 afirma que Morador não acessa Pendência administrativa e que comunicação exige Publicação separada. “Atribuído” sugere que Morador pode ser responsável ou destinatário de Pendência no MVP, contrariando também §7.2, que exclui solicitações de moradores convertidas em Pendências. A matriz deve dizer apenas conteúdo publicado/histórico público permitido.

2. **[medium] “Quadro de anúncios” continua sem contrato funcional próprio.** FR-24, FR-27 e §7.1 o incluem em exportação, versionamento e escopo, mas não há definição, jornada ou requisito para criar, editar, publicar e consultar anúncio. Como o addendum já decide audiência por Papel, basta formalizar a capacidade ou substituir o termo por Publicação institucional genérica. Não requer decisão estratégica adicional, mas o épico correspondente precisa saber se existe.

3. **[medium] O ator genérico “administrador” sobrevive depois da adoção de Papéis predefinidos.** FR-7, FR-11, FR-13, FR-14, FR-25 e FR-39 usam “administrador”, termo ausente do glossário atual. O restante do PRD diferencia Síndico e Auxiliar com capacidade explícita. Substituir pelo Papel/capacidade aplicável para impedir que histórias criem uma quinta função implícita.

4. **[medium] A autoridade para configurar o SLA de suspensão não está associada ao catálogo de capacidades.** FR-29 torna o prazo configurável e auditável, mas FR-41 não lista essa configuração nem o PRD a classifica como poder não delegável. UX e arquitetura podem avançar com configuração protegida, porém o PRD deve indicar se apenas o Síndico ou também um Auxiliar autorizado altera o SLA.

5. **[medium] A política de remoção de Anexo precisa de uma invariável única.** FR-37 permite remoção explícita; FR-27 preserva snapshots; FR-35 separa original e versão compartilhável; o addendum §2.1 exige preservar metadados/hash após remoção futura. O handoff arquitetural deve afirmar se uma versão histórica mantém o binário, passa a registrar indisponibilidade ou impede remoção durante retenção. A escolha técnica é da arquitetura, mas o resultado histórico precisa respeitar uma regra única.

6. **[medium] O baseline brownfield ficou desatualizado depois dos novos FRs.** A linha de Pendências ainda diz “sem contrato completo”, embora FR-21 e addendum §2.3 agora definam o ciclo; a linha de Histórico ignora FR-43 a FR-45; e a linha final referencia somente FR-24 a FR-40, omitindo FR-41 a FR-45. Atualizar a tabela evita que a reconciliação do protótipo descarte requisitos recém-aprovados.

7. **[low] A rastreabilidade das métricas não acompanha a ampliação dos requisitos.** SM-1 ainda cita FR-1 a FR-3 e FR-10 a FR-18, embora sua demonstração ponta a ponta dependa de Publicação (FR-27 a FR-36), Contas/Obrigações/Previsões (FR-38 a FR-40) e autorização. SM-3 e SM-4 também poderiam referenciar continuidade e proteção da exportação. Corrigir referências, sem criar metas novas.

8. **[low] “Monetização do núcleo gratuito” está deslocado para depois da tabela de baseline.** O item pertence à lista “Fora do MVP”, mas aparece após §7.3. A posição atual cria um fragmento sem contexto e pode ser interpretada como conclusão técnica da baseline.

9. **[low] O catálogo do Auxiliar agrupa domínios, mas não explicita granularidade de ação.** FR-41 lista capacidades como “Lançamentos”, “Publicações” e “Exportações”; arquitetura e épicos ainda precisarão decompor ler/criar/corrigir/publicar/suspender/exportar. Isso é um handoff aceitável, desde que o artefato de arquitetura preserve deny-by-default e não interprete cada rótulo como acesso irrestrito a todas as ações.

10. **[low] A referência de acessibilidade permanece implícita.** NFR-11 oferece comportamentos mínimos úteis, mas não nomeia padrão ou nível. UX pode selecionar e documentar o critério verificável, desde que o gate de qualidade rastreie o padrão escolhido. Não é necessário decidir tecnologia no PRD.

11. **[low] O identificador `NFR-10A` quebra o padrão numérico simples.** O requisito é válido, mas identificadores estáveis serão usados em épicos e testes. Renumerar antes de criar rastreabilidade evita ordenação ambígua e referências especiais.

12. **[low] O frontmatter não registra a revisão atual.** `updated: 2026-07-21` precede as decisões e o gate de 2026-07-22. Atualizar a data quando o PRD for finalizado preserva a precedência documental.

## Contagem por severidade

| Severidade | Quantidade |
|---|---:|
| Critical | 0 |
| High | 0 |
| Medium | 6 |
| Low | 6 |
| **Total** | **12** |

## Bloqueadores reais

**Nenhum.**

As pendências jurídicas permanecem bloqueadores de **lançamento público**, conforme §9 e §10 do PRD, não bloqueadores para produzir UX, arquitetura ou épicos. As metas de capacidade e operação permanecem responsabilidade explícita da arquitetura após medição, conforme NFR-16 e NFR-20, e também não bloqueiam os próximos artefatos.

## Decisão do gate por artefato

| Próximo artefato | Gate | Condição |
|---|---|---|
| UX | GO | Corrigir a linha de Pendências na matriz durante a sincronização; não inventar Papel genérico “administrador” |
| Arquitetura | GO | Preservar deny-by-default, separar capacidades por ação e fechar ciclo de vida técnico de Anexos |
| Épicos e histórias | GO | Usar FR-1 a FR-45 e NFRs atualizados; não usar a tabela brownfield desatualizada como fonte única |
| Lançamento público | NO-GO por enquanto | Depende dos gates jurídico, segurança, privacidade, portabilidade, qualidade e capacidade já registrados no PRD |

## Recomendação

Aplicar as correções documentais de severidade média/baixa, atualizar o frontmatter e seguir para revisão de UX e arquitetura. Não é necessária nova rodada de decisão de produto para encerrar este gate.
