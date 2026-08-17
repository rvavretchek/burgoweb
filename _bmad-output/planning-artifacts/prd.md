---
title: "PRD — Burgoweb"
status: "final"
created: "2026-07-21"
updated: "2026-07-23"
---

# PRD — Burgoweb

## 0. Finalidade do documento

Este PRD define a primeira versão pública do Burgoweb para orientar UX, arquitetura, épicos, histórias e validação de lançamento. Ele consolida o discovery canônico, o relatório de prontidão, a proposta de mudança de sprint aprovada e as decisões posteriores do proprietário do produto. Mecanismos técnicos permanecem na arquitetura; conclusões jurídicas sobre LGPD permanecem pendentes de parecer profissional e constituem gate anterior ao lançamento.

### 0.1 Status executivo

| Dimensão | Status | Próxima evidência |
|---|---|---|
| Produto | Aprovado para derivar UX, arquitetura, épicos e histórias | Artefatos reconciliados com FR-1–FR-45 |
| Código atual | Protótipo histórico, não conforme para uso público e sem obrigação de compatibilidade | Implementação greenfield conforme §7.3 e arquitetura aprovada |
| Arquitetura e operação | Pendente de medição e definição | Capacidade, persistência, backup/restauração, segurança e limites operacionais |
| Jurídico e LGPD | Pendente de parecer profissional | Bases legais, retenção e agentes de tratamento incorporados |
| Lançamento público | Bloqueado | Cumprimento integral dos gates da §9 |

**Escopo em uma frase:** onboarding público, gestão financeira mínima, transparência por Papel, Pendências, histórico, Publicações versionadas e Exportação Institucional, sem boleto, contabilidade, folha, biometria ou automação bancária.

## 1. Visão

O Burgoweb é uma plataforma web gratuita de organização e transparência condominial para condomínios que não dispõem de estrutura administrativa ou sistema de gestão. Ele deve permitir que uma pessoa comece sem intermediação comercial, organize o cotidiano do condomínio e transforme registros financeiros dispersos em uma prestação de contas compreensível e portátil.

O primeiro momento de valor ocorre quando o responsável registra receitas e despesas, acompanha caixa e compromissos, fecha um período e disponibiliza aos moradores uma visão financeira que preserva dados pessoais. Pendências, responsáveis e histórico complementam esse núcleo ao tornar a operação acompanhável.

A transparência pode não existir enquanto o Condomínio for usado apenas internamente e nenhum Morador tiver sido cadastrado. Depois que Moradores forem cadastrados, a transparência financeira coletiva passa a ser uma característica permanente do serviço e não pode ser desativada unilateralmente pelo Síndico.

Como iniciativa de negócio, o Burgoweb funcionará principalmente como showroom público da capacidade profissional de seu proprietário. Monetização é um efeito colateral desejável, não o objetivo primário do MVP; isso favorece núcleo gratuito, demonstração ponta a ponta e operação sustentável por uma única pessoa.

## 2. Usuários e trabalhos a realizar

### 2.1 Usuários principais

- **Síndico:** iniciar o Condomínio, organizar contas e pendências, prestar contas e preservar continuidade entre gestões.
- **Auxiliar Administrativo:** executar atividades delegadas dentro de capacidades explícitas.
- **Morador:** acompanhar a situação financeira coletiva e consultar apenas a própria situação individual.
- **Conselheiro:** fiscalizar caixa, fluxo, receitas, despesas e previsões sem acessar Dados Pessoais.

### 2.2 Trabalhos a realizar

- Começar a usar gratuitamente sem depender de implantação assistida.
- Saber quanto entrou, quanto saiu, o que está previsto e como cada serviço está sendo pago.
- Produzir uma prestação de contas compreensível sem expor informações pessoais desnecessárias.
- Acompanhar Pendências, responsabilidades e decisões sem perder o histórico.
- Permitir fiscalização financeira com segregação de acesso.
- Transferir a gestão sem aprisionamento dos dados do Condomínio.

### 2.3 Jornadas principais

#### UJ-1. Márcia cria a base de gestão do condomínio

Márcia é uma síndica voluntária que chega à landing page, entende a proposta e seleciona **Utilize gratuitamente**. Ela cria sua Conta e o Condomínio no mesmo fluxo, comprova controle do e-mail e declara possuir autorização para administrar o Condomínio. O Burgoweb registra a declaração, mas não certifica externamente sua autenticidade. Nenhuma funcionalidade interna fica acessível antes da criação da Conta e do Condomínio. Ao concluir, Márcia recebe orientação para registrar a situação financeira inicial, convidar colaboradores ou começar sozinha.

#### UJ-2. Márcia registra, fecha e presta contas

Já autenticada, Márcia registra receitas, despesas, serviços e parcelamentos, acrescentando evidência opcional. Ela acompanha caixa, previsões e Pendências, confere o período e realiza seu fechamento. O produto apresenta uma prestação compreensível e permite publicá-la aos Moradores cadastrados, preservando Dados Pessoais e mantendo versões. Se uma Publicação expuser informação indevida, Márcia a suspende imediatamente, corrige e republica sem apagar a evidência da suspensão.

#### UJ-3. Ana acompanha o condomínio sem invadir a privacidade alheia

Ana recebe um Convite por e-mail, ativa sua Conta e acessa o Condomínio conforme seu Vínculo. Ela vê Contas Financeiras, receitas, despesas, serviços, parcelamentos e inadimplência agregada. Vê detalhes financeiros apenas da própria Unidade e não vê cadastro, dívida, remuneração ou dados trabalhistas de terceiros.

#### UJ-4. Carlos fiscaliza como Conselheiro

Carlos acessa caixa, fluxo de caixa, receitas, despesas e previsões. Ele consegue verificar os fatos econômicos necessários à fiscalização, mas não acessa cadastros, inadimplência por Unidade, informações trabalhistas individuais nem Anexos com Dados Pessoais não saneados.

#### UJ-5. Beatriz recebe uma gestão portátil

Ao assumir a gestão, Beatriz recebe o Papel de Síndico e acesso ao histórico institucional. A gestão anterior pode ser revogada sem apagar a memória do Condomínio. Uma Pessoa com capacidade de Exportação Institucional exporta dados e documentos em formatos utilizáveis para continuidade operacional ou envio à contabilidade, com registro da operação.

## 3. Glossário

- **Conta:** identidade autenticável de uma pessoa natural no Burgoweb.
- **Pessoa:** indivíduo representado no domínio, com ou sem Conta ativa.
- **Condomínio:** espaço institucional isolado que possui Unidades, dados, regras de acesso e histórico próprios.
- **Unidade:** unidade condominial à qual Pessoas podem estar vinculadas.
- **Vínculo:** relação temporal entre Pessoa, Condomínio e, quando aplicável, Unidade.
- **Papel:** conjunto predefinido de permissões associado a um Vínculo: Síndico, Auxiliar Administrativo, Conselheiro ou Morador no MVP.
- **Síndico:** Papel responsável pela administração e pela concessão ou revogação de acessos administrativos.
- **Auxiliar Administrativo:** Papel que recebe do Síndico capacidades operacionais explícitas e não pode ampliar os próprios poderes.
- **Conselheiro:** Papel de fiscalização financeira sem acesso geral a Dados Pessoais.
- **Morador:** Papel de transparência coletiva e acesso à situação da própria Unidade.
- **Responsável Financeiro:** atribuição do Vínculo entre Pessoa e Unidade que autoriza consulta da situação financeira individual somente das Unidades relacionadas; não é Papel global.
- **Contato de Continuidade:** Pessoa indicada para receber alertas e apoiar recuperação da gestão, sem receber automaticamente Papel administrativo ou acesso a Dados Pessoais.
- **Convite:** autorização temporária enviada a um e-mail para ativar uma Conta ou criar um Vínculo.
- **Lançamento:** registro de receita ou despesa do Condomínio.
- **Conta Financeira:** representação de conta bancária, caixa, fundo ou outra origem de saldo administrada pelo Condomínio, sem integração bancária automática no MVP.
- **Obrigação da Unidade:** receita esperada vinculada a uma Unidade, competência, vencimento e valor, usada para acompanhar quitação e inadimplência.
- **Movimento:** pagamento ou recebimento que realiza total ou parcialmente um Lançamento.
- **Anexo:** arquivo opcional associado a um Lançamento, privado por padrão.
- **Cota de Armazenamento:** limite configurável de conteúdo binário de Anexos atribuído a um Condomínio; não limita seus registros estruturados.
- **Pendência:** item operacional com descrição, responsável, estado e histórico.
- **Comentário:** comunicação humana contextual que não altera por si só estado, responsável, prazo ou decisão.
- **Decisão Operacional:** registro administrativo explícito e versionado; não equivale a ata ou deliberação assemblear.
- **Evento de Auditoria:** registro automático e imutável para usuários sobre ação relevante no produto; não se confunde com log técnico de infraestrutura.
- **Fechamento:** consolidação de um período financeiro para conferência e prestação de contas.
- **Publicação:** disponibilização controlada de informações financeiras aos Moradores.
- **Versão Publicada:** snapshot imutável do conteúdo efetivamente disponibilizado; uma correção cria outra versão sem sobrescrever o histórico.
- **Comunicado:** Publicação informativa do Condomínio com audiência definida por Papel e versões preservadas.
- **Suspensão de Publicação:** retirada temporária e auditável de uma Versão Publicada por possível exposição excessiva, erro material, incidente de segurança ou não conformidade.
- **Dado Pessoal:** informação relacionada a pessoa natural identificada ou identificável.
- **Exportação Institucional:** extração autorizada dos dados do Condomínio para continuidade da gestão; não se confunde com portabilidade individual prevista na LGPD.
- **Exportação Financeira:** snapshot operacional selecionado para validação por contador, setor de recursos humanos ou área tributária externa.

## 4. Funcionalidades e requisitos funcionais

### 4.1 Entrada pública e criação institucional

**Descrição:** A landing page explica o produto e conduz diretamente à criação da Conta e do Condomínio. Realiza UJ-1.

#### FR-1: Apresentação pública

O visitante pode compreender a proposta gratuita, o público atendido e o compromisso de organização e transparência antes de criar uma Conta.

#### FR-2: CTA de início

O visitante pode selecionar **Utilize gratuitamente** para iniciar a criação da Conta e do Condomínio.

#### FR-3: Criação conjunta

O responsável pode criar sua Conta e um Condomínio em um único fluxo orientado.

**Consequências testáveis:**

- Nenhuma funcionalidade interna é acessível sem Conta autenticada e Condomínio criado.
- O primeiro usuário recebe autoridade administrativa inicial somente sobre o Condomínio criado.
- A autoridade inicial decorre de autodeclaração vinculada à Conta e ao e-mail verificado; o sistema registra texto, versão, autor e instante sem afirmar certificação jurídica.
- Falhas não deixam um Condomínio utilizável sem um responsável autorizado.

### 4.2 Identidade, vínculos e acesso

**Descrição:** Pessoas, Contas, Vínculos e Papéis são conceitos separados para permitir convites, múltiplos relacionamentos e troca segura de gestão. Realiza UJ-1, UJ-3, UJ-4 e UJ-5.

#### FR-4: Autenticação da Conta

A pessoa pode autenticar-se, encerrar sua sessão e recuperar o acesso à Conta por meio do controle do e-mail verificado.

**Consequências testáveis:**

- O sistema diferencia e-mail verificado de identidade civil certificada.
- Recuperação concluída invalida tokens anteriores e oferece encerramento das demais sessões.
- Revogação de acesso encerra as sessões alcançadas e impede nova autorização pelo Vínculo revogado.

#### FR-5: Isolamento por Condomínio

Uma Conta acessa somente Condomínios e dados cobertos por Vínculos ativos e Papéis autorizados.

**Consequências testáveis:**

- Toda leitura, gravação, arquivo e Exportação protegidos verificam Conta, Condomínio, Vínculo e Papel no servidor.
- Alterar identificador, URL ou corpo de requisição não concede acesso a outro Condomínio.
- Suspender ou encerrar o Vínculo impede novos acessos sem apagar autoria histórica.

#### FR-6: Cadastro de Pessoas e Unidades

O Síndico ou o Auxiliar Administrativo autorizado pode cadastrar Pessoas, seus e-mails e seus Vínculos com Unidades.

**Consequências testáveis:**

- Pessoa, Conta e Vínculo permanecem registros distintos; cadastrar uma Pessoa não cria automaticamente credencial ativa.
- Uma Pessoa pode possuir mais de um Vínculo autorizado sem duplicação silenciosa de identidade.
- Criar, alterar ou encerrar Vínculo registra autor, instante, Unidade, Papel e período aplicável.

#### FR-7: Convite e ativação

O Síndico ou o Auxiliar Administrativo com capacidade delegada pode enviar, reenviar, acompanhar, cancelar e expirar Convites; o destinatário pode ativar ou associar sua Conta sem criar identidade duplicada indevida.

**Consequências testáveis:**

- Cada Convite possui destinatário, Condomínio, Papel, validade e estado explícitos.
- Convite utilizado, cancelado ou expirado não pode ser reutilizado.
- Alterar o e-mail destinatário exige novo Convite.

#### FR-8: Gestão temporal de Papéis

O Síndico pode conceder, suspender e revogar Papéis subordinados e delegar capacidades explícitas ao Auxiliar Administrativo, preservando quem realizou ações históricas. Um Auxiliar Administrativo com a capacidade delegada correspondente pode aplicar suspensão urgente e reversível; somente o Síndico confirma a revogação permanente desses Papéis.

**Consequências testáveis:**

- Suspensão e revogação exigem motivo, autor e instante.
- Suspensão urgente bloqueia imediatamente novos acessos e encerra sessões alcançadas.
- O Auxiliar Administrativo não pode confirmar a própria revogação nem revogar o Síndico.
- O Auxiliar Administrativo não pode ampliar as próprias capacidades nem conceder a outro Auxiliar o poder de delegação.
- Transferir o Papel de Síndico, confirmar revogação administrativa permanente, designar Contato de Continuidade e alterar a política de delegação são poderes não delegáveis no MVP.
- Revogar um Vínculo não apaga a Pessoa nem sua autoria histórica.

#### FR-9: Troca de gestão

O Condomínio pode substituir o Síndico ou Auxiliares Administrativos sem perder dados, histórico ou acesso institucional autorizado. A troca distingue transferência cooperativa, recuperação operacional e transferência contestada.

**Consequências testáveis:**

- Na transferência cooperativa, o Síndico atual indica o sucessor, o sucessor aceita pelo e-mail verificado e ambos veem os poderes transferidos antes da conclusão.
- A conclusão registra antecessor, sucessor, instante e destino do Papel anterior.
- Recuperar uma Conta não transfere por si só a autoridade de Síndico.
- Uma disputa não concede acesso automático ao requerente nem transforma usuários cadastrados em quórum jurídico.

### 4.3 Gestão financeira mínima

**Descrição:** O Condomínio registra os fatos econômicos necessários à organização e à prestação de contas, sem substituir folha de pagamento ou contabilidade. Realiza UJ-2.

#### FR-10: Lançamentos financeiros

O Síndico ou o Auxiliar Administrativo autorizado pode criar, corrigir e classificar Lançamentos de receita e despesa com descrição, categoria, competência, vencimento, valor previsto, Conta Financeira, situação, contraparte e Anexo quando aplicáveis.

**Consequências testáveis:**

- Estados mínimos distinguem `Previsto`, `Em aberto`, `Parcial`, `Pago/Recebido`, `Vencido` e `Cancelado`.
- Valor realizado deriva dos Movimentos; realização parcial mantém saldo em aberto.
- Cancelamento e correção exigem motivo e preservam o histórico.
- Repetir a mesma solicitação não duplica Movimento; falha de gravação não deixa metade de uma operação financeira persistida.

#### FR-11: Serviços e parcelamentos

O Síndico ou o Auxiliar Administrativo autorizado pode registrar um serviço com descrição, valor, forma de pagamento e progresso da parcela no formato `x de n`.

**Consequências testáveis:**

- O serviço preserva valor total, fornecedor, número de parcelas, vencimentos, valores pagos e saldo.
- A visão publicada apresenta `x de n`, valor da parcela, total e situação sem Dado Pessoal desnecessário.

#### FR-12: Caixa e previsões

O Síndico e os Auxiliares Administrativos com a capacidade delegada correspondente podem consultar por Conta Financeira saldo inicial, Movimentos, saldo final, receitas e despesas realizadas, valores previstos e compromissos futuros conforme a matriz de visibilidade.

**Consequências testáveis:**

- `saldo inicial + receitas recebidas - despesas pagas = saldo final` para o período.
- Previsão e caixa realizado permanecem separados; valor previsto nunca é apresentado como disponível.
- Movimento cancelado não compõe o saldo e não há inversão silenciosa entre receita e despesa.
- O Condomínio utiliza uma moeda configurada; o MVP inicia com real brasileiro e aplica o fuso configurado às datas e competências.

#### FR-13: Fechamento do período

O Síndico ou o Auxiliar Administrativo autorizado pode conduzir um período por `Aberto`, `Conferido`, `Fechado` e `Publicado`, criando snapshot auditável no Fechamento.

**Consequências testáveis:**

- A conferência apresenta saldos, previstos e realizados, vencidos, inadimplência agregada, compromissos futuros e alertas de inconsistência.
- Após o Fechamento, mudança exige reabertura justificada ou Lançamento de ajuste.
- Reabertura, ajuste e republicação preservam autor, instante, motivo e versões anteriores.
- A Versão Publicada corresponde exatamente ao snapshot do Fechamento selecionado.

#### FR-14: Anexo privado por padrão

O Síndico ou o Auxiliar Administrativo autorizado pode associar foto ou arquivo a um Lançamento, mas o Anexo não é publicado automaticamente a Moradores ou Conselheiros.

**Consequências testáveis:**

- O sistema alerta que um Anexo pode conter Dados Pessoais antes de qualquer compartilhamento.
- A publicação de um Anexo exige ação explícita, pré-visualização da audiência e confirmação de uma Pessoa com capacidade de publicação.
- O histórico registra versão, audiência, autor, instante, suspensão e substituição do Anexo publicado.
- A ausência de Anexo não impede o registro nem a apresentação do fato econômico.

### 4.4 Transparência financeira e inadimplência

**Descrição:** A transparência apresenta fatos econômicos necessários, com visibilidade determinada por Papel e risco de identificação. Realiza UJ-2, UJ-3 e UJ-4.

#### FR-15: Ativação da transparência coletiva

O Condomínio pode operar internamente antes de cadastrar Moradores. Depois do primeiro cadastro destinado ao acesso de Morador, a transparência financeira coletiva não pode ser desativada unilateralmente. Somente uma Publicação específica pode ser suspensa nas hipóteses previstas, sem apagar seu histórico nem afetar as demais Publicações.

**Consequências testáveis:**

- A criação do primeiro Vínculo de Morador registra a ativação da transparência coletiva.
- Remover todos os Moradores não cria comando retroativo para apagar Publicações e histórico.
- Somente os fluxos de suspensão específica previstos em FR-28/FR-29 retiram conteúdo publicado.

#### FR-16: Visão do Morador

O Morador pode consultar Contas Financeiras, receitas, despesas, serviços, parcelamentos e prestações publicadas do Condomínio, sem acessar os demais dados administrativos internos.

**Consequências testáveis:**

- A visão inclui apenas Versões Publicadas destinadas ao Papel e dados individuais da própria Unidade quando a Pessoa for Responsável Financeiro.
- URLs, filtros e consultas não revelam cadastros, rascunhos, originais privados ou detalhes de outra Unidade.

#### FR-17: Proteção de informações trabalhistas

Moradores e Conselheiros visualizam mão de obra direta, salários, encargos, benefícios e horas extras somente de forma agregada, com reagrupamento ou supressão quando houver risco evidente de reidentificação.

**Consequências testáveis:**

- A visão coletiva não contém nome, matrícula, documento, remuneração, desconto, benefício ou evento trabalhista individual.
- Quando uma rubrica permitir associação evidente a uma única Pessoa, ela é reagrupada ou suprimida conforme política validada antes do lançamento.

#### FR-18: Inadimplência agregada

Relatórios gerais, telas destinadas ao Papel Conselheiro e materiais de assembleia apresentam inadimplência somente de forma agregada, sem nome nem identificação de Unidade.

**Consequências testáveis:**

- Uma Obrigação da Unidade vencida com saldo em aberto compõe a inadimplência; pagamentos parciais reduzem somente o saldo quitado.
- O total agregado corresponde à soma dos saldos detalhados autorizados, sem revelar Unidade.

#### FR-19: Inadimplência detalhada restrita

Somente o Síndico, o Auxiliar Administrativo especificamente autorizado e o Responsável Financeiro da própria Unidade podem consultar detalhes de inadimplência por Unidade, dentro de seus respectivos limites.

**Consequências testáveis:**

- O Responsável Financeiro nunca consulta Obrigação de outra Unidade sem outro Vínculo que o autorize.
- Uma Pessoa pode ser Responsável Financeiro de múltiplas Unidades e uma Unidade pode possuir múltiplos Responsáveis Financeiros, sempre por Vínculos explícitos.
- Ser Morador não concede automaticamente a atribuição de Responsável Financeiro.
- O Papel Conselheiro e o Papel Morador sem responsabilidade pela Unidade não recebem identificadores indiretos no relatório agregado.

#### FR-20: Visão do Conselheiro

O Conselheiro pode consultar caixa, fluxo de caixa, receitas, despesas e previsões, mas não cadastros, inadimplência individual, dados trabalhistas individuais ou Dados Pessoais presentes em Anexos não saneados.

**Consequências testáveis:**

- A mesma operação retorna visão compatível com o Papel, sem depender apenas de ocultação na interface.
- O Conselheiro não acessa Anexo original; somente versão compartilhável explicitamente autorizada para sua audiência.

### 4.5 Pendências, decisões e histórico

**Descrição:** O Condomínio acompanha ações operacionais sem confundir comentários, decisões e trilha de auditoria. Realiza UJ-2 e apoia a continuidade de UJ-5.

#### FR-21: Ciclo de Pendências

O Síndico ou o Auxiliar Administrativo com capacidade específica pode criar Pendências internas com título, descrição, categoria e prioridade opcionais, responsável, prazo, estado, comentários, histórico e referências permitidas.

**Consequências testáveis:**

- Estados válidos são `Aberta`, `Em andamento`, `Bloqueada`, `Concluída` e `Cancelada`; reabertura é evento que retorna a `Em andamento`.
- Iniciar exige responsável administrativo ativo; bloquear exige motivo; concluir exige resultado; cancelar e reabrir exigem justificativa.
- Prazo vencido marca atraso sem concluir ou cancelar automaticamente.
- Revogar o Papel do responsável preserva a Pendência e exige nova atribuição.
- Conselheiro acessa somente Pendência de fiscalização explicitamente marcada para esse Papel; Morador não acessa Pendência administrativa.
- Pendência, comentário ou Anexo interno não se torna público; comunicar resultado exige Publicação separada.
- O fluxo normal cancela em vez de apagar; eventual moderação preserva evento e respeita retenção.

#### FR-22: Histórico compreensível

O sistema preserva autor, instante e natureza das mudanças relevantes em Lançamentos, Fechamentos, Publicações, acessos e Pendências.

**Consequências testáveis:**

- Alteração relevante acrescenta evento; não reescreve silenciosamente autoria, motivo ou versão anterior.
- Eventos permanecem filtráveis por objeto, período, autor e natureza conforme Papel.

#### FR-23: Separação de registros

Comentários, Decisões Operacionais e Eventos de Auditoria são distinguíveis, possuem semânticas próprias e seguem permissões específicas.

**Consequências testáveis:**

- A interface e a exportação identificam inequivocamente o tipo de registro.
- Evento automático de auditoria não pode ser editado como comentário.
- Remover ou corrigir conteúdo humano preserva um Evento de Auditoria de moderação conforme a política de moderação vigente.

### 4.6 Exportação e continuidade

**Descrição:** Os dados pertencentes à operação do Condomínio permanecem recuperáveis para troca de gestão, conferência e tratamento externo. Realiza UJ-5.

#### FR-24: Exportação Institucional autorizada

O Síndico ou outro Papel explicitamente autorizado pode gerar snapshot institucional completo, documentado e utilizável por terceiro para continuidade, auditoria ou saída do Burgoweb.

**Consequências testáveis:**

- O escopo inclui configurações do Condomínio, Unidades, Pessoas referenciadas, Vínculos, Papéis e vigências, dados financeiros, inadimplência, Pendências, Decisões Operacionais, Fechamentos, Publicações, Versões Publicadas, Suspensões de Publicação, Comunicados, metadados e Anexos incluídos no escopo autorizado.
- Senhas, hashes de senha, tokens, pepper, chaves, segredos e dados internos de segurança são excluídos.
- O pacote declara categorias omitidas e o motivo da omissão.
- Troca de Síndico dentro do Burgoweb preserva o mesmo Condomínio e não depende de exportação e reimportação.

#### FR-25: Exportação financeira

O Síndico ou o Auxiliar Administrativo autorizado pode gerar Exportação Financeira selecionando período, categorias, Lançamentos, referências e Anexos necessários ao operador externo, sem exigir que o Burgoweb execute escrituração contábil.

**Consequências testáveis:**

- O usuário pode registrar aceitação ou rejeição informada pelo operador externo e gerar uma substituição.
- A exportação anterior permanece identificada como substituída, sem ser alterada silenciosamente.
- O Burgoweb não precisa integrar nem interpretar automaticamente o sistema externo no MVP.

#### FR-26: Registro e proteção da exportação

O sistema registra quem solicitou a Exportação Institucional, quando ela ocorreu e qual escopo foi incluído; arquivos gerados recebem acesso restrito e ciclo de vida controlado.

**Consequências testáveis:**

- A exportação identifica Condomínio, período ou instante do snapshot, solicitante, data, versão do formato, escopo, exclusões, contagem de registros e relatório de ausências ou erros.
- O pacote oferece dados estruturados em formato aberto, Anexos originais incluídos no escopo autorizado e manifesto com verificação de integridade por arquivo e do conjunto.
- Falha parcial ou total não produz arquivo apresentado como completo.
- O histórico permite registrar que uma exportação foi rejeitada externamente e substituída por outra.
- Registros posteriores ao início não contaminam parcialmente o snapshot; identificadores e relacionamentos permanecem estáveis no pacote.
- Uma pessoa pode validar estrutura, contagens e integridade sem acesso ao banco do Burgoweb.
- Geração exige autenticação recente, ocorre em área restrita e produz download temporário auditado; o pacote não é enviado como Anexo de e-mail.
- Expirar o download não apaga o histórico nem impede nova geração, inclusive quando a Cota de Armazenamento estiver esgotada.

### 4.7 Versionamento e suspensão de Publicações

**Descrição:** Conteúdo institucional publicado possui ciclo de vida explícito, versões imutáveis e suspensão específica auditável. Realiza UJ-2, UJ-3 e UJ-4.

#### FR-27: Versionamento de conteúdo publicado

Comunicados, Fechamentos, prestações e demais snapshots publicados possuem versões imutáveis; corrigir conteúdo publicado cria uma nova Versão Publicada.

**Consequências testáveis:**

- Apenas uma versão é indicada como atual, sem apagar as anteriores.
- Dashboards dinâmicos não são versionados continuamente; o snapshot efetivamente publicado é versionado.
- Versões anteriores permanecem disponíveis conforme o Papel e a política de retenção vigente.
- Cada versão registra tipo, título, descrição, período aplicável, audiência, Anexos compartilháveis, autor, publicador, instante e estado.
- Os estados mínimos são `Rascunho`, `Pronto para publicar`, `Publicado`, `Substituído`, `Suspensa — em tratamento` e `Suspensa — tratamento vencido`.

#### FR-28: Suspensão excepcional de Publicação

O Síndico, o Auxiliar Administrativo com a capacidade delegada correspondente ou o operador do Burgoweb, diante de incidente técnico, pode suspender imediatamente uma Publicação específica por possível exposição excessiva, erro material, incidente de segurança ou não conformidade.

**Consequências testáveis:**

- A transparência como capacidade não possui comando geral de desligamento.
- O conteúdo suspenso deixa de ser exibido, mas a existência da Publicação, a categoria do motivo e o estado de suspensão continuam visíveis sem reproduzir o dado indevido.
- Original, motivo detalhado, autor e instante permanecem em acesso restrito para auditoria.
- Correção e republicação criam nova versão; suspensão e versão anterior não são apagadas.
- Outras Publicações seguras continuam disponíveis.

#### FR-29: SLA de tratamento da suspensão

Cada Condomínio possui um SLA finito para corrigir, republicar ou justificar a continuidade de uma Suspensão de Publicação, com padrão inicial de 72 horas. O Síndico pode configurar o prazo para casos futuros; o SLA mede o tratamento e não autoriza republicação automática.

**Consequências testáveis:**

- O prazo configurado e sua alteração são visíveis e auditáveis.
- Auxiliar Administrativo não altera o SLA no MVP.
- Alterar a configuração não modifica o prazo de suspensões já abertas.
- Durante o SLA, o estado é `Suspensa — em tratamento`; depois do vencimento, passa automaticamente a `Suspensa — tratamento vencido`.
- O vencimento não republica conteúdo potencialmente indevido e notifica o Síndico, os Auxiliares Administrativos autorizados e os Conselheiros.
- Moradores continuam vendo que uma Publicação existia, quando foi suspensa, a categoria pública do motivo e que o tratamento venceu, sem reprodução do conteúdo indevido.
- A última Versão Publicada que permaneça aprovada para a audiência continua disponível; se ela não existir, a indisponibilidade é mostrada explicitamente.
- Prorrogação exige nova justificativa auditável, preserva o vencimento original e não altera retroativamente o SLA do caso.
- Relatórios permitem identificar quantidade, duração e reincidência de suspensões por gestão.

### 4.8 Direitos sobre Dados Pessoais

**Descrição:** Solicitações individuais seguem canal autenticado e responsabilidade encaminhada, sem antecipar conclusões do parecer jurídico. Apoia UJ-3.

#### FR-30: Atendimento a direitos sobre Dados Pessoais

A Pessoa pode iniciar uma solicitação sobre seus Dados Pessoais. O sistema autentica o solicitante, encaminha a solicitação ao responsável definido para sua categoria e registra o pedido, a decisão e a resposta.

**Consequências testáveis:**

- O fluxo distingue consulta, correção e demais categorias aplicáveis sem prometer eliminação incompatível com obrigação de conservação.
- O solicitante acompanha o estado e recebe justificativa de atendimento total, parcial ou negativa.
- O acesso ao pedido e aos dados de resposta é restrito aos responsáveis e ao titular autenticado.

### 4.9 Continuidade e disputa de gestão

**Descrição:** Recuperação operacional, transferência cooperativa e contestação preservam dados sem conceder tomada automática de controle. Realiza UJ-5.

#### FR-31: Contatos de Continuidade

O Síndico pode designar Pessoas para receber alertas e apoiar a recuperação operacional sem conceder a elas, por essa designação, Papel administrativo ou acesso adicional aos dados do Condomínio.

**Consequências testáveis:**

- A designação é notificada, aceita por meio do e-mail verificado e auditada. A remoção é notificada e auditada.
- O Contato de Continuidade não pode consultar Dados Pessoais, Publicações restritas ou Exportações sem outro Papel que o autorize.
- Conta administrativa comprometida ou processo de transferência contestada notifica os Contatos de Continuidade ativos.

#### FR-32: Transferência contestada

Uma Pessoa pode registrar pedido contestado de transferência, declarar sua autoridade e apresentar evidências, sem receber acesso aos dados enquanto a disputa não for resolvida.

**Consequências testáveis:**

- O estado `Transferência contestada` preserva dados, permissões, logs e evidências.
- A gestão atual e os Contatos de Continuidade são notificados, salvo impedimento registrado por segurança ou determinação aplicável.
- A transferência somente é executada por concordância da gestão atual, por resolução externa reconhecida pelo procedimento jurídico-operacional ou por procedimento excepcional documentado pelo suporte do Burgoweb.
- A ação excepcional registra solicitante, evidências apresentadas, decisão, responsável e instante, sem afirmar que o Burgoweb certificou juridicamente a eleição.

#### FR-33: Contenção de Conta administrativa comprometida

O Burgoweb pode suspender uma Conta administrativa sob suspeita de comprometimento sem transferir automaticamente sua autoridade.

**Consequências testáveis:**

- Sessões e Convites associados podem ser revogados como medida de contenção.
- Publicações, alterações de permissão e Exportações recentes podem ser sinalizadas para revisão.
- Recuperação da Conta e transferência do Papel de Síndico permanecem processos distintos.

### 4.10 Autorização e correção de Publicações

**Descrição:** Publicar exige conferência de audiência e separação entre original privado e versão compartilhável. Realiza UJ-2, UJ-3 e UJ-4.

#### FR-34: Conferência e autorização da Publicação

O Síndico ou o Auxiliar Administrativo com a capacidade delegada correspondente pode publicar conteúdo institucional após conferir uma pré-visualização da versão e da audiência; Morador e Conselheiro não publicam conteúdo institucional no MVP.

**Consequências testáveis:**

- Salvar ou fechar um Rascunho não o publica.
- A pré-visualização apresenta audiência, valores, período, campos visíveis por Papel, Anexos incluídos e alertas de possível Dado Pessoal.
- A confirmação é explícita e registra autor e publicador, que podem ser Pessoas diferentes.
- Papel suspenso ou revogado não pode aprovar nem publicar.
- Prestação e Fechamento de transparência alcançam todos os Moradores ativos; não é possível excluir silenciosamente uma Pessoa específica da audiência coletiva.
- Comunicados podem definir audiência por Papel, não por seleção oculta de indivíduos.

#### FR-35: Original e versão compartilhável do Anexo

O Anexo original permanece privado; qualquer versão compartilhável é um objeto distinto, associado explicitamente a uma audiência e a uma Versão Publicada.

**Consequências testáveis:**

- O publicador pré-visualiza o arquivo e confirma a revisão de Dados Pessoais antes de compartilhar.
- Suspender somente o Anexo compartilhável não suspende o restante da Publicação quando o conteúdo remanescente for seguro.
- Retirar ou substituir Anexo compartilhável cria nova Versão Publicada e preserva a trilha do original restrito.
- O acesso ao original é verificado independentemente do acesso à versão compartilhável.

#### FR-36: Correção e comunicação da Publicação

Corrigir conteúdo publicado cria nova versão e comunica à audiência quando a mudança alterar valor, período, audiência ou Anexo.

**Consequências testáveis:**

- A versão anterior indica que foi substituída e aponta para a atual conforme permissão.
- Correção material gera notificação; correção apenas de apresentação permanece no histórico sem exigir notificação.
- A classificação da correção, o responsável e o instante permanecem auditáveis.

### 4.11 Capacidade de Anexos

**Descrição:** A Cota de Armazenamento protege a sustentabilidade do serviço sem bloquear os registros estruturados do Condomínio. Apoia UJ-2 e UJ-5.

#### FR-37: Cota de Armazenamento de Anexos

Cada Condomínio possui Cota de Armazenamento configurável e pode acompanhar consumo, disponibilidade e alertas antes do esgotamento.

**Consequências testáveis:**

- O consumo apresenta o total utilizado, o total disponível e a distribuição pela categoria de Anexo definida no produto, permitindo localizar os maiores Anexos.
- Ao atingir a Cota de Armazenamento, somente novos uploads são bloqueados; Lançamentos sem Anexo e os demais registros estruturados continuam funcionando.
- Anexos existentes permanecem consultáveis, baixáveis, publicáveis ou exportáveis conforme permissões.
- O sistema não elimina Anexos automaticamente para liberar espaço.
- A remoção autorizada exige ação explícita, respeita a política de retenção vigente e preserva a trilha histórica correspondente.
- Anexo que integrou uma Versão Publicada não desaparece silenciosamente: sua retirada cria nova versão e preserva metadados, hash e evento de remoção conforme retenção.

### 4.12 Contas, obrigações e previsões

**Descrição:** Contas Financeiras e Obrigações da Unidade completam o núcleo de caixa, previsão e inadimplência sem automação bancária. Realiza UJ-2, UJ-3 e UJ-4.

#### FR-38: Contas Financeiras

O Síndico ou o Auxiliar Administrativo autorizado pode criar, ativar e encerrar Contas Financeiras com nome, tipo, saldo inicial e data de referência.

**Consequências testáveis:**

- Encerrar uma Conta Financeira não apaga Movimentos nem permite novos Lançamentos nela.
- O produto não afirma que o saldo foi conciliado com instituição financeira no MVP.
- Saldos consolidados permanecem decomponíveis por Conta Financeira.

#### FR-39: Obrigações por Unidade

O Síndico ou o Auxiliar Administrativo autorizado pode criar individualmente ou em lote Obrigações da Unidade para uma competência, sem emitir boleto ou iniciar cobrança automática.

**Consequências testáveis:**

- Cada Obrigação registra Unidade, competência, vencimento, valor, Movimentos, saldo e situação.
- Geração em lote apresenta Unidades e valores antes da confirmação e não duplica obrigação já confirmada para a mesma regra sem alerta explícito.
- Vencimento com saldo remanescente altera a situação para inadimplente.
- Cancelamento ou correção exige motivo e histórico.

#### FR-40: Previsões financeiras

O sistema apresenta receitas esperadas, despesas esperadas, parcelas futuras, Obrigações em aberto e saldo projetado separadamente do caixa realizado.

**Consequências testáveis:**

- O saldo projetado indica período e premissas incluídas.
- Quitar, cancelar ou alterar um item atualiza a projeção sem reescrever snapshots fechados.

### 4.13 Catálogo de permissões

**Descrição:** Papéis predefinidos e capacidades delegáveis tornam autorização compreensível e auditável sem editor arbitrário de Papéis. Realiza UJ-1, UJ-3, UJ-4 e UJ-5.

#### FR-41: Capacidades do Auxiliar Administrativo

O Síndico pode delegar individualmente ao Auxiliar Administrativo capacidades para Pessoas/Unidades/Vínculos, Convites, suspensão urgente, Lançamentos, Obrigações, Movimentos, Fechamentos, Publicações, Anexos originais, Pendências, Exportações, solicitações de titulares e tratamento de suspensões.

**Consequências testáveis:**

- Capacidade não concedida é negada no servidor mesmo que a interface ou rota seja conhecida.
- Toda concessão ou retirada registra Síndico, Auxiliar, capacidade, instante e vigência.
- O Auxiliar não concede capacidade a si nem a outro Auxiliar.
- Acumular Papéis e Vínculos produz somente a união dos acessos explicitamente autorizados dentro de cada Condomínio e Unidade.

#### FR-42: Atribuição de Responsável Financeiro

O Síndico ou Auxiliar com capacidade de gerir Vínculos pode atribuir ou remover Responsável Financeiro por relação Pessoa-Unidade.

**Consequências testáveis:**

- A atribuição concede apenas consulta às Obrigações das Unidades relacionadas, sem elevar o Papel global.
- Remoção bloqueia novos acessos e preserva o histórico da atribuição e das consultas auditáveis aplicáveis.
- Encerrar o Vínculo remove a atribuição ativa sem apagar autoria ou registros financeiros.

### 4.14 Comunicação, decisão e auditoria

**Descrição:** Comunicação humana, decisão administrativa e evidência automática permanecem separadas para evitar que conversa informal altere estado ou adquira aparência jurídica. Apoia UJ-2, UJ-4 e UJ-5.

#### FR-43: Comentários versionados

Uma Pessoa com acesso ao objeto pode comentar sem alterar automaticamente estado, responsável, prazo ou Decisão Operacional.

**Consequências testáveis:**

- Editar o próprio Comentário cria versão e preserva autor e instantes.
- Remoção ou moderação substitui a exibição por indicação correspondente, registra motivo e mantém original em acesso restrito.
- Síndico ou Auxiliar com capacidade delegada pode moderar; Comentário interno nunca vira Publicação automaticamente.
- Anexo de Comentário herda a visibilidade restrita do objeto e permanece privado por padrão.

#### FR-44: Decisões Operacionais

O Síndico ou Auxiliar com capacidade específica pode confirmar Decisão Operacional com título, contexto, resultado, responsável, data, alcance, visibilidade e objetos relacionados.

**Consequências testáveis:**

- Confirmar é ação explícita; Comentário não é promovido automaticamente a Decisão Operacional.
- Decisão confirmada não é editada silenciosamente; correção ou mudança cria outra que referencia e substitui a anterior.
- O Conselheiro pode registrar manifestação fiscal em espaço próprio sem convertê-la automaticamente em decisão administrativa.
- Comunicar a Moradores exige Publicação separada.
- O produto não apresenta Decisão Operacional como ata, deliberação assemblear ou certificação jurídica.

#### FR-45: Eventos de Auditoria

O sistema gera Evento de Auditoria para autenticação e recuperação, Convites, Vínculos, Papéis e capacidades, ações financeiras, Fechamentos, Publicações, Anexos, Exportações, solicitações de titulares, transferência de gestão e alteração de Cota de Armazenamento.

**Consequências testáveis:**

- Cada Evento de Auditoria contém somente os campos necessários: ator, ação, Condomínio, objeto, instante, resultado, motivo, referência relacionada e identificador de correlação.
- Senha, token, pepper, chave, segredo e conteúdo pessoal excessivo nunca são registrados.
- Usuários não editam nem removem eventos; falhas relevantes também podem gerar registro.
- Síndico acessa eventos institucionais permitidos; Auxiliar Administrativo somente conforme capacidade; Conselheiro recebe eventos fiscais permitidos; Morador recebe apenas histórico público de versões e suspensões.
- A Exportação Institucional preserva Comentários, Decisões Operacionais e Eventos de Auditoria dentro do escopo autorizado e da retenção aplicável.

## 5. Matriz de visibilidade do MVP

| Informação | Síndico | Auxiliar Administrativo autorizado | Conselheiro | Morador | Referência |
|---|---:|---:|---:|---:|---|
| Caixa, fluxo, receitas e despesas | Detalhado | Conforme capacidade delegada | Financeiro, sem Dados Pessoais | Publicado | FR-10–FR-13, FR-20 |
| Previsões e compromissos | Detalhado | Conforme capacidade delegada | Sim | Quando publicados | FR-12, FR-40 |
| Inadimplência geral | Agregada e detalhada | Detalhada se autorizada | Somente agregada | Somente agregada | FR-18–FR-19 |
| Inadimplência da própria Unidade | Quando necessário à gestão | Quando autorizado | Não | Apenas Responsável Financeiro | FR-19, FR-39, FR-42 |
| Cadastros pessoais | Conforme necessidade | Conforme capacidade delegada | Não | Próprios dados | FR-5–FR-8, FR-41 |
| Dados trabalhistas individuais | Fora da transparência; somente se necessários à administração externa | Conforme necessidade externa | Não | Não | FR-17 |
| Anexo original | Sim | Somente com capacidade delegada | Não; somente versão compartilhável autorizada | Não; somente versão compartilhável autorizada | FR-14, FR-35 |
| Pendências e histórico | Gerenciar | Somente com capacidade delegada | Apenas Pendência fiscal explicitamente visível | Não no MVP; resultado somente por Publicação | FR-21–FR-23, FR-43–FR-45 |
| Suspensão de Publicação | Aplicar e tratar | Aplicar se autorizado | Ver estado e histórico permitido | Ver estado sem conteúdo indevido | FR-28–FR-29 |
| Alertas de continuidade | Configurar e receber | Conforme designação | Receber se também for Contato de Continuidade | Não, salvo designação própria | FR-31–FR-33 |

## 6. Requisitos não funcionais e guardrails

### 6.1 Privacidade e proteção de dados

- **NFR-1:** O produto deve coletar e expor apenas dados necessários à finalidade de cada fluxo.
- **NFR-2:** Conteúdo coletivo deve ocultar, agregar ou reagrupar Dados Pessoais quando atender aos critérios de risco de reidentificação definidos na política de privacidade aprovada para o lançamento.
- **NFR-3:** Toda operação de tratamento relevante deve possuir finalidade, acesso, retenção e base legal documentáveis antes do lançamento público.
- **NFR-4:** O produto deve oferecer canal, autenticação, encaminhamento, estado, resposta justificada e trilha de auditoria para solicitações de titulares aplicáveis.
- **NFR-5:** A política de retenção deve abranger somente dados efetivamente mantidos no Burgoweb. A exportação ao contador não encerra o tratamento das cópias remanescentes.

### 6.2 Segurança e isolamento

- **NFR-6:** A autorização deve ser verificada no servidor em toda operação protegida, considerando Conta, Condomínio, Vínculo e Papel.
- **NFR-7:** Nenhum identificador previsível ou manipulação de requisição pode permitir acesso cruzado entre Condomínios.
- **NFR-8:** Credenciais, sessões, segredos e dados armazenados ou transmitidos devem atender aos controles definidos no baseline de segurança aprovado pela arquitetura para cada classe de risco.
- **NFR-9:** Eventos relevantes de autenticação, permissão, publicação, alteração financeira e exportação devem ser auditáveis sem registrar segredos ou dados excessivos.
- **NFR-10:** Antes do lançamento, o produto deve possuir procedimento verificável para detectar, conter, preservar evidências, avaliar impacto, corrigir, restaurar, comunicar quando aplicável e revisar incidentes de confidencialidade, integridade ou disponibilidade.
- **NFR-10A:** O procedimento deve cobrir, no mínimo, Conta comprometida, Convite ou recuperação abusados, sessão não revogada, acesso entre Condomínios, Publicação ou exportação indevida, exposição de banco ou backup, vazamento de segredo, alteração não autorizada e perda de dados.

### 6.3 Acessibilidade e usabilidade

- **NFR-11:** Os fluxos críticos devem ser utilizáveis por teclado, com foco visível, rótulos compreensíveis, contraste adequado e mensagens que não dependam somente de cor.
- **NFR-12:** Landing page, criação da Conta e do Condomínio, autenticação, convite, registro financeiro, publicação e consulta devem funcionar em telas móveis e desktop suportadas.
- **NFR-13:** Linguagem financeira e administrativa deve ser compreensível para usuários sem formação técnica ou contábil.

### 6.4 Confiabilidade, desempenho e recuperação

- **NFR-14:** Operações de gravação não podem produzir duplicidade silenciosa diante de repetição, falha de rede ou reenvio.
- **NFR-15:** O sistema deve possuir backup e restauração testados, com objetivos de recuperação definidos antes do lançamento.
- **NFR-16:** Metas quantitativas de disponibilidade, latência, capacidade e recuperação serão propostas pela arquitetura somente após medir a infraestrutura disponível, custos, carga de referência e capacidade operacional; o gate de lançamento validará os limites aprovados.

### 6.5 Operação enxuta

- **NFR-17:** O MVP não pode depender de NOC, plantão permanente ou equipe dedicada; a operação inicial será realizada por uma pessoa com disponibilidade parcial e responsabilidades externas.
- **NFR-18:** A arquitetura deve reduzir tarefas manuais recorrentes, oferecer diagnóstico suficiente para investigação posterior e definir verificações proporcionais ao risco mesmo sem monitoração ativa inicial.
- **NFR-19:** Limitações de disponibilidade, suporte, manutenção, recuperação e capacidade devem ser documentadas e comunicadas de forma compatível com a realidade operacional.
- **NFR-20:** Nenhuma meta operacional será apresentada como compromisso público antes de existir evidência de que infraestrutura e rotina do operador conseguem sustentá-la.

## 7. Escopo do MVP

### 7.1 Incluído

- Landing page e CTA **Utilize gratuitamente**.
- Criação e autenticação de Conta e Condomínio.
- Pessoas, Unidades, Vínculos, Papéis e Convites.
- Gestão e revogação de acesso, incluindo troca de gestão.
- Contatos de Continuidade, contenção de Conta administrativa e transferência contestada sem tomada automática de controle.
- Receitas, despesas, serviços, parcelamentos, caixa e previsões.
- Contas Financeiras, Movimentos e Obrigações por Unidade geradas individualmente ou em lote.
- Fechamento e Publicação financeira.
- Transparência por Papel e inadimplência agregada.
- Anexos opcionais e privados por padrão.
- Versionamento básico de Comunicados, Fechamentos e snapshots publicados.
- Fluxo de Rascunho, conferência, audiência, autorização, correção e notificação de Publicações.
- Suspensão excepcional e auditável de Publicação específica, com SLA de tratamento configurável e vencimento visível.
- Cota configurável de Anexos, medição de consumo, alertas e bloqueio restrito a novos uploads.
- Pendências, responsáveis, estados, comentários, decisões e histórico.
- Exportação Institucional e financeira autorizada.
- Controles de privacidade, segurança, auditoria e acessibilidade necessários ao lançamento público.
- Papéis predefinidos, capacidades delegáveis ao Auxiliar e Responsável Financeiro por Vínculo com Unidade.
- Comentários versionados, Decisões Operacionais e Eventos de Auditoria com visibilidade própria.

### 7.2 Fora do MVP

- Geração, registro, envio ou download de boletos.
- Processamento de folha de pagamento.
- Escrituração contábil, SPED ou substituição do escritório de contabilidade.
- Emissão, importação estruturada ou interpretação de NF-e/NFS-e.
- Biometria, reconhecimento facial e CFTV.
- Automação bancária, conciliação automática e integrações financeiras complexas.
- Aplicativos móveis nativos.
- Votação eletrônica, validação jurídica de atas ou cálculo automático de quórum assemblear.
- Editor de Papéis personalizados ou delegação de permissões entre Auxiliares.
- Solicitações de moradores convertidas em Pendências, recorrência, automações e dependências complexas entre Pendências.
- Ampliação paga de Cota de Armazenamento, conexão de armazenamento próprio e expurgo assistido de Anexos após download.
- Importação automática de pacote institucional; recuperação de desastre utiliza backup e restauração da plataforma.

### 7.3 Baseline brownfield

O código existente é um protótipo exploratório e não constitui evidência de atendimento deste PRD. UX, arquitetura, épicos e histórias devem preservar somente comportamentos compatíveis e substituir mecanismos inseguros ou insuficientes.

**Estratégia aprovada:** a nova aplicação será implementada como greenfield dentro do repositório existente. O protótipo não impõe compatibilidade de API, migração de dados, preservação de estruturas, continuidade de endpoints nem reutilização de código. Histórico Git, configuração de desenvolvimento e componentes atuais serão reutilizados somente quando a arquitetura demonstrar benefício técnico e conformidade integral com este PRD.

| Área | Estado observado | Relação com o PRD |
|---|---|---|
| Criação de Conta e Condomínio | Protótipo funcional com senha temporária | FR-3 parcialmente explorado; faltam declaração, e-mail verificado, segurança e jornada pública completa |
| Login | Verificação básica de senha Argon2 | FR-4 parcialmente explorado; faltam sessões seguras, recuperação, revogação e pepper aprovado |
| Convite | Cria usuário com senha temporária e marca envio de e-mail | Não atende FR-7: faltam entrega real, token, validade, estados, aceitação e não reutilização |
| Papéis | Apenas `admin` e `member` com alteração básica | Não atende o modelo de Pessoa, Vínculo, Papel, suspensão, revogação, Conselho e continuidade |
| Isolamento | Algumas operações verificam pertencimento por identificador informado pelo cliente; outras leituras não autenticam | Não atende FR-5 nem NFR-6/NFR-7; deve ser redesenhado antes de qualquer uso público |
| Pendências | Criação e mudança entre `open`, `in-progress` e `done` | Explora parte de FR-21, sem contrato completo de responsáveis, comentários, decisões e autorização |
| Histórico | Eventos simples de Pendências, Convites e Papéis | Explora parte de FR-22/FR-23, sem trilha de auditoria suficiente |
| Persistência | Arquivo JSON local | Adequado somente ao protótipo; não atende persistência, concorrência, backup, isolamento ou recuperação pública |
| Financeiro, Publicação, Anexos, Exportação, Cota, permissões e registros semânticos | Não implementados | FR-10 a FR-20 e FR-24 a FR-45 exigem implementação orientada por arquitetura e histórias aprovadas |

Nenhuma rota, tela ou teste atual recebe status “conforme” apenas por existir. A rastreabilidade de implementação será construída por FR nas histórias e validada novamente no gate de prontidão.

Até a arquitetura definir a nova base, o protótipo permanece preservado como referência recuperável. Sua remoção ocorrerá somente depois que o estado atual estiver registrado no Git e a nova estrutura possuir build e testes fundamentais funcionais.
- Monetização do núcleo gratuito.

## 8. Métricas de sucesso e critérios de lançamento

### 8.1 Resultado principal

- **SM-1:** O proprietário consegue demonstrar ponta a ponta UJ-1 e UJ-2 — criar a base, registrar um período e disponibilizar uma prestação financeira — como evidência concreta de capacidade de produto, UX e engenharia. Valida FR-1 a FR-3 e FR-10 a FR-18.

### 8.2 Resultados secundários

- **SM-2:** Moradores convidados conseguem ativar a Conta e localizar a prestação financeira e a própria situação sem suporte. Valida FR-7, FR-16 e FR-19.
- **SM-3:** Uma troca de gestão preserva histórico e permite revogar a gestão anterior. Valida FR-8, FR-9 e FR-22.
- **SM-4:** Uma Pessoa com capacidade de Exportação Institucional consegue gerar um pacote utilizável sem assistência técnica. Valida FR-24 a FR-26.
- **SM-5:** O produto pode permanecer público com carga operacional compatível com uma pessoa em disponibilidade parcial, dentro dos limites que a arquitetura medir e publicar.

### 8.3 Contramétricas

- **SM-C1:** Não maximizar volume de dados coletados ou anexados; crescimento de dados sem finalidade aumenta custo e risco.
- **SM-C2:** Não maximizar transparência pelo número de campos expostos; sucesso é compreensão financeira com exposição mínima de Dados Pessoais.
- **SM-C3:** Não otimizar criação de Condomínios sem acompanhar a conclusão do primeiro Fechamento e Publicação.
- **SM-C4:** Não maximizar usuários, armazenamento ou adoção além da capacidade operacional apenas para produzir métricas de crescimento.

## 9. Gates anteriores ao lançamento público

1. **Jurídico e LGPD:** receber e incorporar o parecer sobre bases legais por operação, retenção, controlador/operador/encarregado, direitos dos titulares e responsabilidades entre Condomínio, Burgoweb e contador; validar o fluxo de atendimento antes do lançamento.
2. **Segurança:** comprovar autenticação, autorização no servidor, isolamento entre Condomínios, gestão segura de credenciais e segredos, auditoria e resposta a incidentes.
3. **Privacidade:** validar matriz de visibilidade, risco de reidentificação, anexos privados por padrão e ausência de exposição de inadimplência individual.
4. **Portabilidade:** testar Exportação Institucional e restauração/continuidade em cenário de troca de gestão.
5. **Qualidade e capacidade:** a arquitetura deve medir a infraestrutura, propor limites e metas realistas, testar os fluxos críticos e publicar as limitações operacionais antes do lançamento; o PRD não antecipa números sem evidência.

## 10. Questões abertas

1. Quais bases legais se aplicam a cada operação de tratamento? **Responsável:** advogado; **revisão:** antes do lançamento público.
2. Quais prazos de retenção e descarte se aplicam às categorias efetivamente mantidas no Burgoweb? **Responsável:** advogado + produto; **revisão:** antes do lançamento público.
3. Como qualificar Condomínio, Burgoweb, administradora, contador e fornecedores como controlador, operador ou suboperador em cada atividade? **Responsável:** advogado; **revisão:** antes do lançamento público.
4. Quais baselines medidos, limites de carga, metas de disponibilidade, latência e recuperação, e quais rotinas mínimas de backup e diagnóstico são sustentáveis sem NOC e com operador único? **Responsável:** arquitetura + proprietário; **revisão:** no gate operacional.
5. Quais formatos abertos, compactação, criptografia do pacote e prazo de expiração implementarão o contrato aprovado de Exportação? **Responsável:** arquitetura; **revisão:** antes dos épicos de portabilidade.
6. Qual Cota de Armazenamento inicial, tamanho máximo por arquivo, alertas e reserva operacional sustentam a implantação pública? **Responsável:** produto + arquitetura; **revisão:** no desenho de capacidade e custo.

## 11. Decisões jurídicas provisórias

Os arquivos `BURGOWEB_LGPD.md` e `BURGOWEB_LGPD_2.md` são análises preliminares produzidas com auxílio de IA. Eles não constituem parecer jurídico nem têm precedência sobre este PRD. Até a revisão profissional:

- inadimplência coletiva permanece exclusivamente agregada;
- Conselheiros permanecem sem acesso a Dados Pessoais;
- Anexos permanecem privados por padrão;
- biometria, folha e contabilidade permanecem fora do MVP;
- nenhuma base legal ou retenção exata será presumida como definitivamente aprovada.
