# PRD Quality Review — Burgoweb

## Overall verdict

O PRD está pronto para avançar a UX e arquitetura: decisões de permissões, Responsável Financeiro, Pendências, Comentários, Decisões Operacionais e Auditoria fecharam as lacunas funcionais relevantes, somando-se aos contratos já sólidos de financeiro, Publicação, Exportação, Cota e continuidade. Antes de regenerar o backlog final, resta atualizar a rastreabilidade e o baseline para incluir FR-41–FR-45; parecer jurídico e números operacionais medidos permanecem corretamente como gates posteriores ao planejamento, não como bloqueios desta fase.

## Decision-readiness — adequate

As escolhas que moldam UX e arquitetura estão explícitas. O MVP usa Papéis predefinidos, capacidades delegáveis e poderes não delegáveis (§3; §4.2/FR-8; §4.13/FR-41); Responsável Financeiro é atribuição Pessoa–Unidade, não Papel global (§3; §4.13/FR-42). Transferência cooperativa, contestada, recuperação e contenção não se confundem (§4.2/FR-9; §4.9/FR-31–FR-33).

O documento também registra honestamente o estágio das decisões que dependem de evidência externa. Parecer jurídico antecede lançamento (§9.1; §10.1–§10.3), enquanto disponibilidade, latência, capacidade e recuperação serão propostas pela arquitetura depois de medir infraestrutura e operação individual (§6.4/NFR-16; §6.5/NFR-17–NFR-20; §9.5; addendum §2.1.1). Essa diferenciação é adequada e acionável.

### Findings

- **medium** Procedimento excepcional de transferência continua como gate posterior (§4.9/FR-32; addendum §1.1) — O estado seguro, notificações, evidências e ausência de tomada automática estão definidos; faltam critérios finais de decisão e recurso. *Fix:* produzir playbook jurídico-operacional antes de habilitar execução excepcional em produção, sem bloquear UX/arquitetura do fluxo seguro já definido.

## Substance over theater — strong

Os requisitos novos têm função real no produto. FR-41 impede que Auxiliares ampliem poderes e define capacidades auditáveis; FR-42 limita acesso financeiro à relação Pessoa–Unidade. FR-21 modela Pendências com estados, justificativas, atraso e reatribuição. FR-43–FR-45 impedem que conversa informal vire decisão ou evidência de auditoria e separam histórico funcional de log técnico (§4.5, §4.13–§4.14; addendum §2.3–§2.4).

O mesmo rigor aparece nos contratos financeiro, Publicação, Exportação e Cota: eles possuem invariantes e efeitos específicos do domínio, não adjetivos genéricos (§4.3, §4.6–§4.12). O baseline brownfield confronta mecanismos existentes em vez de tratá-los como conformes (§7.3).

### Findings

## Strategic coherence — strong

A tese continua clara: transformar registros financeiros dispersos em prestação compreensível, protegida e portátil para condomínios sem estrutura (§1). Permissões, responsabilidade financeira, registros operacionais e auditoria apoiam essa tese sem deslocar o núcleo para um gerenciador genérico de tarefas (§2.2; §4.3–§4.14).

O posicionamento de showroom público operado por uma pessoa explica gratuidade, demonstração ponta a ponta, Cota, operação enxuta e contramétrica de crescimento (§1; §6.5; §8/SM-1, SM-5 e SM-C4). Metas operacionais medidas na arquitetura são coerentes com essa estratégia e evitam compromissos fictícios.

### Findings

## Done-ness clarity — adequate

Os contratos funcionais agora cobrem os caminhos que antes estavam subespecificados. Isolamento e Vínculos possuem consequências de servidor e preservação histórica (§4.2/FR-5–FR-6); financeiro possui estados, equações, idempotência e snapshots (§4.3/FR-10–FR-13; §4.12/FR-38–FR-40); transparência e inadimplência têm limites observáveis (§4.4/FR-15–FR-20); Pendências e registros operacionais possuem estados e semânticas próprias (§4.5/FR-21–FR-23; §4.14/FR-43–FR-45).

Publicação, Exportação, continuidade e Cota também possuem consequências suficientes para decomposição (§4.6–§4.11). Os NFRs operacionais não trazem números ainda inexistentes, mas definem processo, dono, evidência e gate para obtê-los (§6.4–§6.5; §9.5), o que é adequado à decisão do proprietário.

### Findings

- **medium** Direitos dos titulares aguardam estados e prazos finais (§4.8/FR-30; §6.1/NFR-4; §9.1) — O fluxo define autenticação, encaminhamento, acompanhamento e resposta, mas prazo, complementação e recurso dependem do parecer. *Fix:* completar a máquina de estados após parecer jurídico e antes das histórias dessa capacidade; não bloquear as demais jornadas.
- **medium** Matriz de visibilidade ainda usa algumas expressões abertas (§5) — “Conforme capacidade delegada”, “quando necessário” e “conforme Papel” são menos precisas que FR-41/FR-42. *Fix:* substituir cada célula por capacidade ou regra nomeada e usar negação por padrão; isso pode ser consolidado na especificação UX/autorização.
- **low** Baseline de acessibilidade ainda precisa ser ratificado (§6.3/NFR-11–NFR-13) — Os resultados são claros, mas versão/nível e tecnologias suportadas não estão definidos. *Fix:* UX propõe baseline; arquitetura e estratégia de teste ratificam-no antes do gate de qualidade.

## Scope honesty — adequate

Incluído, excluído, baseline e gates estão explícitos (§7–§10). O PRD não apresenta transferência contestada, direitos, agentes de tratamento ou números operacionais como resolvidos antes das respectivas evidências. O addendum separa claramente operação funcional, mecanismo arquitetural e validação jurídica.

Ainda falta um índice mecânico para garantir o roundtrip das hipóteses e há um item de non-goal deslocado após a tabela brownfield (§7.3). São problemas editoriais, não bloqueios de decisão.

### Findings

- **medium** Hipóteses e gates não possuem índice único (§9–§11; addendum §3 e §5) — Donos e momentos de revisão existem, mas não há visão consolidada de evidência e estado. *Fix:* criar Assumptions Index antes do novo gate de prontidão.
- **low** Non-goal de monetização está deslocado (§7.3) — “Monetização do núcleo gratuito” aparece depois da tabela brownfield, fora da lista §7.2. *Fix:* mover o item para §7.2 e explicitar o tratamento de publicidade no primeiro lançamento.

## Downstream usability — thin

Glossário, UJs, FRs contínuos, consequências testáveis, seções com jornadas realizadas e baseline formam uma boa fonte para UX e arquitetura. A colisão da persona Patrícia foi resolvida com Beatriz em UJ-5 (§2.3), e os novos termos — Auxiliar Administrativo, Responsável Financeiro, Comentário, Decisão Operacional e Evento de Auditoria — são usados consistentemente no núcleo funcional (§3, §4.13–§4.14).

O bloqueio remanescente é rastreabilidade: §8 ainda valida intervalos antigos e não incorpora FR-27–FR-45 nem NFR-17–NFR-20. O baseline também afirma que áreas não implementadas exigem FR-10–FR-20 e FR-24–FR-40, omitindo explicitamente FR-41–FR-45 (§7.3). Isso não impede UX/arquitetura, mas deve ser corrigido antes de regenerar épicos e histórias.

### Findings

- **high** Rastreabilidade não cobre os requisitos aprovados mais recentes (§4/FR-27–FR-45; §6/NFR-17–NFR-20; §8) — SMs e referências ainda usam intervalos anteriores; permissões, Responsável Financeiro, Pendências detalhadas, comunicação, decisão e auditoria não têm vínculo individual a UJ, consequência, NFR e gate/métrica. *Fix:* criar matriz `UJ → FR → consequência → NFR → SM/gate`, incluindo todos os FR-1–FR-45.
- **high** Baseline brownfield ficou desatualizado com FR-41–FR-45 (§7.3) — A linha de funcionalidades ausentes termina em FR-40, embora catálogo de permissões e registros operacionais também não estejam implementados; as linhas de Papéis, Pendências e Histórico não referenciam os contratos novos. *Fix:* atualizar a tabela para FR-41–FR-45 e mapear explicitamente protótipo → requisito aprovado antes da decomposição do backlog.
- **low** Convenção de NFR possui exceção isolada (§6.2/NFR-10A) — O sufixo quebra a sequência NFR-1–NFR-20. *Fix:* renumerar ou documentar a convenção antes de criar referências permanentes.

## Shape fit — adequate

Journey-led é apropriado ao produto público multi-stakeholder, e as jornadas dirigem entrada, administração, transparência, fiscalização e continuidade (§2.3). O PRD evita tanto persona theater quanto uma especificação puramente técnica; permissões e auditoria aparecem porque alteram experiências e confiança.

O formato brownfield agora é adequado: §7.3 distingue exploração existente de conformidade, e o addendum registra mecanismos inseguros que não podem ser promovidos. A realidade operacional está representada como restrição arquitetural mensurável, sem forçar SLOs de uma operação com NOC inexistente (§6.5; addendum §2.1.1).

### Findings

## Mechanical notes

- UJ-1–UJ-5 e FR-1–FR-45 estão contínuos e únicos; NFR-10A é a única exceção de convenção entre NFR-1–NFR-20.
- A persona Beatriz em UJ-5 resolve o conflito anterior com Patrícia, que permanece disponível para futura jornada contábil.
- §8 e §7.3 ainda não incorporam FR-41–FR-45; §8 também não cobre FR-27–FR-40 individualmente.
- Não existe Assumptions Index nem tags `[ASSUMPTION]`.
- “administrador” ainda aparece em FR-7, FR-11, FR-13, FR-14, FR-25 e FR-39 sem entrada no Glossário; substituir por Síndico/Auxiliar autorizado.
- Há deriva leve entre “Dado Pessoal” e “Dados Pessoais”; padronizar singular/plural e capitalização.
- “Monetização do núcleo gratuito” está deslocada após §7.3.
- O front matter permanece `updated: 2026-07-21`; atualizar ao consolidar a revisão.
