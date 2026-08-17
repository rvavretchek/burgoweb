---
name: Burgoweb
status: final
updated: 2026-07-27
supersedes: ../../ux.md
sources:
  - ../../prd.md
  - ../../architecture.md
  - ../../epics.md
  - ../../implementation-readiness-report-2026-07-27.md
design: DESIGN.md
---

# Burgoweb — Experience Spine

Este contrato substitui integralmente `../../ux.md` de 2026-07-21. Aquele rascunho é histórico e não deve orientar implementação. Este spine governa como o produto funciona; `DESIGN.md` governa como se apresenta. Os spines vencem mocks, wireframes e imports.

## Foundation

Produto web responsivo, sem aplicativo nativo no MVP. Desktop/laptop é a superfície principal para administração densa; celular suporta integralmente landing, Conta + Condomínio, autenticação, Convites, registro financeiro, Publicação e consulta.

O modelo mental institucional é obrigatório: Conta autentica; Pessoa representa o indivíduo; Vínculo liga Pessoa, Condomínio e, quando aplicável, Unidade; Papel e capacidade autorizam; Responsável Financeiro é atribuição Pessoa–Unidade; Contato de Continuidade não recebe acesso por essa designação.

Toda tela autenticada mostra o Condomínio ativo. A interface adapta navegação e ações às capacidades efetivas, mas o servidor reautoriza cada operação. Revogação concorrente, rota direta e job assíncrono devem terminar no estado mais restritivo.

## Information Architecture

| Grupo | Superfícies | Quem alcança / finalidade |
|---|---|---|
| Acesso sem sessão | Landing, entrar, recuperar acesso, verificar e-mail, aceitar Convite | Visitante ou Pessoa sem sessão; sem enumeração de Conta. |
| Começar | Criar Conta + Condomínio, provisionamento, próximos passos | Responsável inicial; nada interno antes da criação conjunta e verificação. |
| Visão geral | Dashboard por Papel/capacidade, seletor de Condomínio | Resumos e próximas ações autorizadas, sem dados de outro tenant. |
| Pessoas e acesso | Pessoas, Unidades, Vínculos, Convites, Papéis, capacidades, Responsáveis Financeiros, sessões | Síndico e Auxiliar conforme capacidade; vigência e escopo sempre visíveis. |
| Finanças | Contas Financeiras, Lançamentos, Movimentos, Serviços, Obrigações, Caixa, Previsões, Fechamento | Gestão autorizada; Conselheiro recebe projeção minimizada. |
| Anexos | Upload, quarentena, originais privados, derivados saneados, Cota | Original privado; derivado continua privado até Publicação autorizada. |
| Transparência | Ativação, rascunhos, preview por audiência, Publicações, versões, suspensões/SLA | Publicador autorizado administra; Morador e Conselheiro consultam suas audiências. |
| Minha Unidade | Situação privada por Unidade | Somente Responsável Financeiro daquela Unidade. |
| Trabalho | Pendências, Comentários, Decisões Operacionais | Interno a Síndico/Auxiliar; Conselheiro só vê Pendência fiscal explicitamente visível. |
| Histórico | Linha do tempo compreensível, versões, Eventos de Auditoria | Projeção por capacidade; auditoria sensível e minimizada. |
| Privacidade e continuidade | Solicitações de Dados Pessoais, Contatos de Continuidade, transferência, contestação, contenção, incidente | Fluxos específicos e gated; contestar não concede acesso. |
| Portabilidade | Exportação Financeira e Institucional, validação, downloads | Capacidade específica, autenticação recente, pacote assíncrono e temporário. |
| Configurações | Condomínio, fuso, política/SLA permitido, Conta e sessões | Apenas controles autorizados; nenhuma opção para desligar transparência coletiva ativa. |

### Navegação e closure

O shell oferece Visão geral, Finanças, Transparência, Trabalho, Histórico e Configurações conforme capacidade. Pessoas e acesso, Anexos, Privacidade/continuidade e Exportações entram como subseções contextuais. Morador recebe navegação reduzida a Visão geral, Prestações, Minha Unidade quando aplicável e Conta. Conselheiro recebe Fiscalização, Publicações autorizadas e Pendências fiscais explícitas.

Cobertura visual: [Dashboard](mockups/dashboard.html) ancora Visão geral e UJ-1; [preview de Publicação](mockups/publication-preview.html) ancora Transparência e UJ-2. Acesso sem sessão/Começar, Pessoas e acesso, Finanças, Anexos, Minha Unidade, Trabalho, Histórico, Privacidade/continuidade, Portabilidade e Configurações permanecem **spine-only**: suas tabelas, estados e componentes são o contrato suficiente para a primeira implementação; mock adicional deve ser criado somente quando uma história revelar decisão espacial nova. Os spines vencem os mocks.

## Voice and Tone

Microcopy é simples, direta e não presume conhecimento contábil ou jurídico.

| Use | Evite |
|---|---|
| “Registrar despesa” | “Efetuar lançamento contábil” |
| “Valor previsto; ainda não pago” | “Débito conciliado” |
| “Esta pendência continua interna” | “Salvar e publicar” |
| “Serão compartilhados: período, valores e 2 anexos revisados” | “Publicar dados” |
| “Seu acesso mudou. Recarregue para continuar.” | “Erro 403” |
| “Não foi possível salvar porque o registro mudou” | “Conflito de versão” sem explicação |
| “Solicitação registrada; a análise depende da política aprovada” | promessa de prazo jurídico não aprovado |

Mensagens de autenticação e permissão não confirmam se e-mail, Pessoa, Unidade ou recurso protegido existe. Mensagens financeiras nunca alegam conciliação bancária. Decisão Operacional nunca é chamada de ata ou certificação.

## Content, Audience and Editorial Contract

Toda operação editorial apresenta três dimensões separadas:

1. **Natureza:** Pendência, Comentário, Decisão Operacional, Evento de Auditoria, Publicação geral ou comunicado privado.
2. **Audiência efetiva:** Papéis e, quando privado, escopo de Unidade permitido. “Público” significa coletivo dentro do Condomínio, nunca internet.
3. **Estado editorial:** rascunho, pronto, publicado, substituído, suspenso em tratamento ou suspenso vencido.

Pendência, Comentário e Decisão permanecem internos. Uma comunicação a Moradores nasce como Publicação separada. Original de Anexo é privado; derivado saneado também é privado; apenas uma versão compartilhável ligada ao snapshot publicado alcança audiência.

## Role and Visibility Contract

| Papel/atribuição | Pode ver/agir | Nunca implica |
|---|---|---|
| Síndico | Gestão detalhada, originais, autoridade institucional e capacidades não delegáveis | Prova externa de identidade ou autoridade civil. |
| Auxiliar Administrativo | Somente capacidades explícitas e vigentes | Autodelegação, delegar outro Auxiliar, transferir Síndico ou revogar Síndico. |
| Conselheiro | Caixa, fluxo, receitas, despesas, previsões, inadimplência agregada, compartilháveis autorizados e Pendência fiscal explícita | Cadastros, originais, dado trabalhista individual ou inadimplência individual. |
| Morador | Conteúdo publicado para todos os Moradores ativos e histórico público permitido | Pendências, Comentários, Decisões internas ou originais. |
| Responsável Financeiro | Situação privada das Unidades atribuídas | Papel global ou acesso a outra Unidade. |
| Contato de Continuidade | Alertas e apoio definidos | Papel, dados pessoais ou autoridade permanente. |

Acúmulo de Papéis une apenas capacidades explícitas dentro do mesmo Condomínio e escopo. A interface não usa hierarquia informal de “papel maior”.

## Component Patterns

| Componente | Regra comportamental |
|---|---|
| Shell institucional | Mantém Condomínio ativo visível. A troca é atômica: cancela/ignora respostas e polling anteriores, invalida cache/preview, limpa filtros, seleções e rascunhos não portáveis, fecha overlays e revalida/substitui rota. History, URL, query e title não guardam dados pessoais. Foca o H1 e anuncia o novo contexto. |
| Button | Executa ação nomeada no `pointerup` ou teclado, previne duplo envio e expõe o motivo quando indisponível. |
| Form field | Valida no envio e, quando útil, no blur; leva foco ao resumo de erros e conecta cada erro ao campo. |
| Data table / record list | Mesmos filtros e contagens; paginação acessível; alternativa mobile sem perda de campo crítico. |
| Content card | Abre somente projeção autorizada e remove imediatamente conteúdo e metadados quando o escopo muda. |
| Money summary | Oferece rótulos, unidade, período e tabela equivalente para qualquer gráfico; leitura acessível explicita moeda, sinal, previsto/realizado e `x de n`. |
| Status badge | Expõe texto completo e descrição acessível; não executa transição sozinho. |
| Sensitive confirmation | Informa objeto, Condomínio, efeito, audiência e reversibilidade; solicita motivo quando o domínio exige. |
| Audience preview | Vincula tenant, ator/capacidades, audiência efetiva, snapshot, versões e hashes dos compartilháveis. O servidor revalida tudo na confirmação; divergência impede publicar, remove dado desautorizado e exige novo preview sem diff proibido. |
| Publication card | Abre snapshot imutável e histórico; corrigir cria substituta, nunca edita a versão publicada. |
| Pending item | Ações separadas para estado, responsável, Comentário e comunicação. Concluir, bloquear, cancelar e reabrir exigem resultado/motivo. |
| Comment | Adicionar não altera estado. Editar cria versão; moderar oculta com motivo e preserva original restrito. |
| Operational decision | Confirmar congela a versão; alterar cria Decisão substituta. |
| Audit event | Somente leitura e exportação autorizada; filtros não revelam campos protegidos. |
| Upload / quarantine | Upload direto informa progresso; processamento continua assíncrono; somente Liberado habilita uso. |
| Async job | Estados Solicitado, Processando, Pronto, Pronto com ressalvas, Falhou e Expirado; oferece retry/regeneração seguros. |
| Conflict resolver | Preserva entrada local, mostra o estado atual autorizado e oferece recarregar, comparar ou reaplicar. |
| State panel | Inclui próxima ação segura e ID de correlação quando houver falha de suporte. |
| Legal gate | Bloqueia apenas a execução não aprovada e explica o que ainda pode ser registrado/preparado. |
| Toast / live message | Anuncia apenas mudanças materiais; usa `status` para resultado comum e `alert` apenas para interrupção urgente. |
| Focus ring | Aparece em todo elemento interativo e acompanha foco em alto contraste; nunca é removido sem substituto equivalente. |

## State Patterns

| Estado | Tratamento |
|---|---|
| Vazio | Explica o que a lista representa e oferece uma única próxima ação autorizada; não infere quitação, inexistência de dívida ou ausência de recurso protegido. |
| Carregando | Skeleton com geometria estável e nome acessível; preserva foco. |
| Validação | Resumo + erros locais; dados digitados permanecem. |
| Sucesso | Confirma objeto e efeito na superfície; toast é complementar. |
| Conflito 409 | Não sobrescreve; preserva entrada e exige reconciliação. |
| Duplo envio/rede incerta | Desabilita repetição enquanto pendente e consulta resultado idempotente antes de tentar novamente. |
| Acesso negado/revogado | Interrompe ação; remove dado sensível de tela, rota, title, breadcrumb, cache e regiões live; foca heading neutro e anuncia uma vez sem enumerar recurso. |
| Indisponível | Mantém contexto não sensível, oferece retry e correlação; não promete prazo. |
| Processando | Mostra que fechar a tela não cancela o job e onde acompanhar. |
| Quarentena/rejeitado | Anexo indisponível; motivo seguro e caminho de substituição. |
| Expirado | Convite, token ou download não é reutilizado; oferece gerar novo quando autorizado. |
| Cota esgotada | Bloqueia somente novo upload; consulta, download, exportação e dados estruturados continuam. |
| Suspenso | Conteúdo específico fica indisponível e o card expõe somente metadados coletivos permitidos. Versão anterior nunca é fallback automático; só aparece se for Publicação distinta, ainda publicada, fora do incidente e autorizada à audiência atual. |
| SLA vencido | Escala e mantém suspenso; nunca republica automaticamente. |
| Sem conectividade | Leitura carregada recebe aviso de possível desatualização; mutação não é confirmada e preserva entrada segura; job é reconciliado ao reconectar. Não constitui modo offline. |
| Acesso revogado a artefato | Estado terminal distinto de falha técnica; remove contagens, nomes e links de exportação e exige nova autorização/snapshot para regenerar. |

Máquinas de estado normativas: Pendência (`Aberta`, `Em andamento`, `Bloqueada`, `Concluída`, `Cancelada`); Lçamento (`Previsto`, `Em aberto`, `Parcial`, `Pago/Recebido`, `Vencido`, `Cancelado`); Fechamento (`Aberto`, `Conferido`, `Fechado`, `Publicado`); Publicação conforme contrato editorial. Atraso não altera Pendência automaticamente.

## Interaction Primitives

- `Tab` segue ordem visual; `Shift+Tab` retorna; `Esc` fecha a camada superior e devolve foco ao acionador.
- A primeira ação da página é “Pular para o conteúdo”; cada rota tem `document.title`, H1 único e `aria-current` na navegação. Filtro/paginação preserva foco no acionador e anuncia contagem; remoção foca o registro vizinho ou o heading da lista.
- `Enter` aciona botão focado, nunca confirma implicitamente ação sensível em campo multilinha.
- Busca e filtros mantêm botão “Aplicar” em telas densas; cada filtro ativo pode ser removido por teclado.
- Arraste/ordenação sempre oferece botões equivalentes. Conteúdo em hover/foco é dispensável com `Esc`, alcançável pelo ponteiro e persiste até dismiss/blur; informação essencial nunca fica apenas em tooltip.
- Diálogos empilham no máximo uma camada. Fluxos longos usam página/stepper com resumo anterior à confirmação.
- Diálogo/sheet usa `dialog` ou `alertdialog`, nome e descrição, fundo inerte, foco contido e restauração. Foco inicial vai ao título/conteúdo quando compreender precede agir, nunca ao destrutivo. Erro mantém a camada aberta, anuncia resumo e foca o erro; se o acionador sumir, foco vai ao destino lógico.
- Ações assíncronas não prendem a navegação; status persiste numa central contextual.
- Downloads sensíveis pedem autenticação recente, revalidam capacidade e informam expiração.
- Formulários usam `autocomplete`, `inputmode` e `aria-describedby`, permitem colagem/gerenciador de senha, explicam formato e correção. Obrigação, Publicação, transferência, fechamento, exportação e revogação exigem revisão editável antes da confirmação.
- Autenticação não exige memorização, puzzle ou transcrição como único método; códigos aceitam colagem integral e senha tem controle acessível de exibição. Expiração de sessão avisa antes e permite estender quando a política de segurança autorizar.
- Notificações externas indicam apenas que existe uma ação no Burgoweb; não expõem conteúdo sensível.

## Accessibility Floor

- WCAG 2.2 AA para todas as superfícies do MVP.
- HTML semântico; landmarks, headings e nomes acessíveis coerentes.
- Foco visível com `{components.focus-ring}` e restauração após modal, erro, atualização ou navegação.
- Teclado completo, sem armadilha; hover e gesto possuem alternativa persistente.
- Estados, séries financeiras e permissões não dependem apenas de cor, posição ou ícone.
- Regiões `aria-live` anunciam validação assíncrona, conflito, upload e job sem repetir mensagens.
- Tabelas preservam cabeçalhos/escopo; visualização mobile mantém nome de cada campo.
- Tabelas têm caption/nome, `th` + `scope` (ou `headers/id`), ordenação por botão com `aria-sort`, paginação em `nav` e seleção nomeada por registro. Record lists usam lista/descrição semântica com a mesma ordem, filtros e ações. Scroll essencial é focável e nomeado.
- Zoom de 200%, reflow a 320 CSS px e tamanho de alvo WCAG 2.2 são gates; alvos primários preferem 44×44 CSS px.
- Testar 400%/320 CSS px, text spacing 1.4.12, retrato/paisagem, teclado virtual, `prefers-reduced-motion` e Windows High Contrast. Alvos são ≥24×24 CSS px com espaçamento conforme 2.5.8; ações primárias/destrutivas e controles móveis são ≥44×44.
- Reflow proíbe scroll em duas dimensões, exceto em tabela/gráfico cuja relação espacial seja essencial; painéis, filtros, previews, diálogos e banners empilham sem cobrir conteúdo. `prefers-reduced-motion` remove movimento não essencial. Em `forced-colors`, bordas, foco, seleção, estados e ícones usam cores do sistema/`currentColor`.
- A raiz usa `lang="pt-BR"`; datas são inequívocas e mostram fuso quando relevante. Siglas são expandidas no primeiro uso.
- Upload/job marca região `aria-busy`, usa `progress` nomeado quando determinado e anuncia início, mudança material, conclusão ou falha — nunca cada incremento. Resultado persiste com link focável; foco só se move quando não é seguro continuar.
- Automação complementa, não substitui, revisão humana com leitor de tela e teclado.

## Responsive & Platform

| Faixa | Comportamento |
|---|---|
| `< 768 px` | Navegação em sheet; uma coluna; tabelas viram record lists; previews por audiência empilham; ações sensíveis permanecem visíveis no fluxo. |
| `768–1023 px` | Shell compacto; formulários uma ou duas colunas; tabelas com scroll rotulado apenas quando record list perderia comparação. |
| `≥ 1024 px` | Barra lateral persistente; superfícies densas podem usar painel de detalhe lado a lado. |

Landing, Conta + Condomínio, autenticação, Convites, registro financeiro, Publicação e consulta têm paridade funcional mobile/desktop. Não existe promessa de uso offline no MVP; falha de conectividade preserva entrada local apenas durante a sessão quando seguro e nunca confirma gravação inexistente.

## High-risk Domain Rules

### Finanças e fechamento

Previsto, realizado, saldo, obrigação, vencido e inadimplência têm rótulos diferentes. Obrigação em lote exige preview de Unidades/valores e verificação de duplicidade. Fechar mostra saldos, inconsistências, vencidos, inadimplência agregada e compromissos; reabrir exige motivo. Nenhuma tela afirma conciliação bancária.

### Transparência e suspensão

Antes do primeiro Vínculo de Morador, a interface explica que a transparência coletiva passará a ser permanente. Depois, não existe toggle global. Publicar exige preview fiel, confirmação e versão imutável. Correção material cria substituta e notifica. Suspensão é específica, motivada e auditável; vencimento não republica.

### Privacidade, segurança e continuidade

Dados coletivos sensíveis são agregados, reagrupados ou suprimidos. Nenhuma URL, filtro, contagem ou estado vazio revela Pessoa/Unidade. Transferência contestada aceita registro e evidências, mas não transfere controle. Contenção e incidente usam console operacional restrito. Bases legais, retenção e execução definitiva permanecem gates visíveis.

### Exportação e portabilidade

O assistente coleta finalidade, escopo e período, mostra preview de contagens/exclusões, pede autenticação recente e acompanha job. “Pronto com ressalvas” não parece sucesso total. Antes de emitir e consumir cada link, o servidor revalida autenticação recente, tenant, Vínculo, capacidade, escopo, estado e validade. Revogação/contenção invalida links e polling e produz `Acesso revogado a artefato`. Download é temporário e nunca enviado como anexo de e-mail. Importação automática fica fora do MVP.

## Key Flows

### UJ-1. Márcia cria a base de gestão do condomínio

1. Márcia, síndica voluntária, abre a landing no celular e escolhe **Utilize gratuitamente**.
2. Informa dados da Conta, do Condomínio e declara sua autoridade inicial.
3. Confirma o e-mail; o provisionamento mostra progresso recuperável.
4. Entra no Condomínio e escolhe entre registrar situação financeira, convidar equipe ou começar sozinha.
5. Cadastra Unidade, Pessoa e Vínculo sem confundir identidade com autorização.
6. Convida Ana como Conselheira e define vigência.
7. **Clímax:** o dashboard mostra o Condomínio ativo, próximas ações e Ana como Convite pendente — a instituição existe sem depender do caderno de Márcia.

Falha: e-mail já associado, token expirado ou provisionamento parcial não duplica recursos; a interface explica correção/retomada sem enumerar Conta alheia.

### UJ-2. Márcia registra, fecha e presta contas

1. Márcia cria Conta Financeira e registra uma despesa prevista.
2. Registra pagamento parcial; o saldo restante continua explícito.
3. Anexa comprovante, aguarda a verificação e prepara derivado saneado.
4. Confere o período, reconhece inconsistências e fecha com snapshot.
5. Cria Publicação separada, escolhe audiência coletiva e revisa o preview de Morador.
6. Confirma a versão e acompanha o envio de notificação minimizada.
7. **Clímax:** a prestação publicada mostra valores compreensíveis e somente o Anexo compartilhável; o original permanece privado.

Falha: alteração concorrente após o preview gera conflito, preserva o rascunho e exige nova conferência; alerta bloqueante de dado pessoal impede publicar.

### UJ-3. Ana acompanha o condomínio sem invadir a privacidade alheia

1. Ana aceita o Convite de Conselheira e entra no Condomínio correto.
2. Abre Fiscalização e consulta caixa realizado, despesas, previsões e fechamento.
3. Vê inadimplência somente agregada e Anexos apenas quando compartilháveis.
4. Filtra o período e abre a versão publicada correspondente.
5. Registra dúvida no contexto permitido, sem alterar estado financeiro.
6. **Clímax:** Ana consegue verificar o fechamento de ponta a ponta sem encontrar nome, Unidade, remuneração individual ou original privado.

Falha: tentativa por URL direta recebe projeção negada sem confirmar a existência do recurso; o evento é auditado de forma minimizada.

### UJ-4. Carlos fiscaliza como Conselheiro

1. Carlos abre o painel de fiscalização no desktop.
2. Compara realizado, previsto e compromissos, cada um rotulado sem depender de cor.
3. Abre um Serviço e compreende total, forma de pagamento e parcela `x de n`.
4. Consulta uma Pendência fiscal explicitamente compartilhada com o Conselho.
5. Abre histórico de versões e identifica a correção material notificada.
6. **Clímax:** Carlos reconstrói o fato econômico e sua correção sem precisar pedir planilha ao Síndico.

Falha: Publicação suspensa mostra categoria, estado e tratamento sem revelar conteúdo; a última versão segura aparece somente quando permitido.

### UJ-5. Beatriz recebe uma gestão portátil

1. Beatriz, sucessora indicada, recebe proposta de transferência e confirma e-mail.
2. Revisa poderes, consequências e Condomínio antes de aceitar.
3. Márcia conclui a transferência cooperativa; sessões e capacidades são atualizadas.
4. Beatriz solicita Exportação Institucional com autenticação recente.
5. Revisa escopo, exclusões e contagens; acompanha o processamento.
6. Baixa o pacote temporário e verifica manifesto/integridade.
7. **Clímax:** Beatriz assume no mesmo Condomínio e recebe histórico verificável sem credenciais, segredos ou reconstrução manual.

Falha: pacote com ressalvas ou falha parcial não é apresentado como completo; download expirado exige regeneração e nova autorização. Transferência contestada apenas registra evidências e nunca concede acesso automaticamente.

## Coverage and Guardrails

### Cobertura de estados por superfície

Todos os grupos aplicam Carregando, Validação quando houver entrada, Sucesso quando houver mutação, Conflito em objeto versionado, Acesso negado/revogado, Indisponível e Sem conectividade. Deltas:

| Superfície | Estados adicionais obrigatórios |
|---|---|
| Acesso sem sessão / Começar | vazio N/A; token expirado/usado; provisionamento processando/falhou/retomado; sessão expirada. |
| Dashboard | vazio útil; contexto trocado; dado desatualizado. |
| Pessoas e acesso | lista vazia; Convite pendente/aceito/cancelado/expirado; Papel programado/ativo/suspenso/revogado. |
| Finanças | lista vazia; duplicidade; período Conferido/Fechado; conflito e reabertura. |
| Anexos | vazio; enviando; quarentena; liberado; rejeitado; cota esgotada. |
| Transparência | sem Publicação; preview invalidado; publicado; substituído; suspenso; SLA vencido. |
| Minha Unidade | nenhum resultado autorizado, sem inferir inexistência/quitação. |
| Trabalho / Histórico | vazio; transição negada; conteúdo moderado; paginação atualizada. |
| Privacidade e continuidade | gate jurídico; solicitação/contestação por estado; contenção ativa. |
| Portabilidade | Solicitado; Processando; Pronto; Pronto com ressalvas; Falhou; Expirado; Acesso revogado a artefato. |
| Configurações | carregando; validação; sucesso; conflito; acesso negado; valor herdado/padrão; mudança com efeito futuro. |

### Capacidades sensíveis

Visualizar original, preparar derivado, aprovar compartilhável, publicar, suspender/tratar, exportar financeiro, exportar institucional, gerir Vínculos, atender solicitação e operar contenção são capacidades distintas. Botão, rota, projeção, job e download verificam a capacidade específica; nunca usam `isAdmin` ou o Papel agregado. Facetas, totais, sugestões, paginação e estados vazios são calculados apenas sobre a projeção autorizada; filtros não aceitam nem ecoam valores fora dela.

Original, derivado candidato e compartilhável exibem rótulo persistente de natureza/versão e ações separadas. Não há URL estável de storage no DOM/endereço. Cada visualização/download reautoriza; somente compartilhável liberado entra no snapshot.

### Gates jurídicos provisórios

| Fluxo | Permitido no MVP | Bloqueado até decisão incorporada |
|---|---|---|
| Direitos sobre Dados Pessoais | registrar, autenticar, acompanhar, analisar e preparar resposta | prometer prazo/base legal ou concluir eliminação definitiva não aprovada |
| Retenção e descarte | aplicar preservação/tombstone aprovados e registrar impedimento | expurgo físico definitivo ou prazo inventado |
| Transferência contestada | registrar requerente/evidências e acompanhar | transferir controle ou conceder acesso automaticamente |
| Saída de ocupante/cobrança | encerrar Vínculo, preservar histórico e obrigação por competência | criar corresponsabilidade, transferir dívida ou conceder acesso pós-saída |
| Incidente | detectar, conter, preservar evidência e preparar comunicação | afirmar obrigação/prazo jurídico não aprovado |

A interface explica o bloqueio e não apresenta ação proibida como conclusão disponível.

### Rastreabilidade UX-DR

| Requisito | Contrato principal | Fluxos |
|---|---|---|
| UX-DR1–UX-DR3 | Voice and Tone; IA; Foundation | UJ-1–UJ-5 |
| UX-DR4–UX-DR6 | Content, Audience and Editorial Contract; Role and Visibility | UJ-2–UJ-4 |
| UX-DR7–UX-DR10 | Sensitive confirmation; Audience preview; capacidades sensíveis | UJ-1, UJ-2, UJ-5 |
| UX-DR11–UX-DR15 | High-risk Domain Rules; Async job; portabilidade | UJ-2–UJ-5 |
| UX-DR16 | State Patterns e matriz por superfície | UJ-1–UJ-5 |
| UX-DR17–UX-DR18 | Accessibility Floor; Responsive & Platform; componentes bilaterais | UJ-1–UJ-5 |
| UX-DR19–UX-DR21 | Pendência/Comentário/Decisão; Histórico; conflitos | UJ-2–UJ-4 |
| UX-DR22–UX-DR23 | Legal gate; privacidade/continuidade e baseline provisório | UJ-1, UJ-5 |

UJ-3 valida minimização e limites de visibilidade; UJ-4 valida reconstrução do fato econômico e de suas versões. A rastreabilidade FR-1–FR-45, NFRs e critérios BDD permanece em `../../epics.md`; este spine registra apenas os deltas de interação.

Fora do MVP: boleto, contabilidade/folha/SPED, NF-e/NFS-e estruturada, conciliação bancária, app nativo, votação/quórum, Papéis personalizados, pedido de Morador convertido em Pendência, automações complexas, compra de cota, armazenamento próprio, expurgo assistido e importação automática.
