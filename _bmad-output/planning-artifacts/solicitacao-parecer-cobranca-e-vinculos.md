# Solicitação de análise jurídica — cobrança condominial, saída de ocupante e tratamento de dados

Prezado(a) Dr.(a),

Como complemento ao material anteriormente encaminhado para análise de LGPD do Burgoweb, solicito seu parecer sobre a modelagem jurídica e operacional de cobranças condominiais quando moradores, locatários, responsáveis financeiros, proprietários, possuidores ou adquirentes entram e saem de uma unidade.

O objetivo não é fazer o Burgoweb determinar responsabilidade jurídica automaticamente. Precisamos definir comportamentos conservadores, limites de acesso, registros necessários e pontos que obrigatoriamente devem depender de análise humana ou documentação externa.

## 1. Contexto do produto

O Burgoweb é uma plataforma gratuita de organização e transparência condominial. No modelo atual:

- `Pessoa`, `Conta`, `Unidade`, `Vínculo`, `Papel` e `Responsável Financeiro` são conceitos separados;
- o `Vínculo` registra a relação temporal de uma Pessoa com uma Unidade e com o Condomínio;
- `Responsável Financeiro` é uma atribuição Pessoa–Unidade, não um Papel global;
- as Obrigações Financeiras são vinculadas à Unidade e à competência de origem;
- inadimplência coletiva é apresentada somente de forma agregada;
- detalhes de cobrança são privados e acessíveis apenas a Pessoas expressamente autorizadas;
- o novo ocupante não deve receber dívida nem dados pessoais do ocupante anterior;
- encerramento de Vínculo não pode apagar autoria, pagamentos, documentos ou evidências históricas legítimas.

## 2. Situação que precisamos disciplinar

Uma Pessoa deixa de ser Morador, ocupante ou locatário de determinada Unidade. Podem ocorrer duas situações:

1. não existem obrigações pendentes relacionadas ao período de sua ocupação;
2. existem obrigações pendentes, acordos, pagamentos parciais, contestação ou possível responsabilidade referente ao período anterior à saída.

Nossa proposta provisória é encerrar o Vínculo de Morador/ocupante na data efetiva da saída em ambos os casos. A existência de pendência não manteria artificialmente a Pessoa como Morador, pois isso poderia conceder acesso indevido a informações e Publicações posteriores.

Quando juridicamente necessário, seria criada uma relação separada de cobrança ou acompanhamento pós-saída, limitada às próprias obrigações, comunicações e documentos da Pessoa. Essa relação não reativaria o Papel Morador nem concederia acesso a dados coletivos, dados do novo ocupante ou Publicações posteriores à saída.

## 3. Entendimento preliminar a ser validado

O material de pesquisa preliminar considerou que:

- a contribuição condominial possui natureza vinculada ao imóvel;
- o Código Civil atribui ao condômino o dever de contribuir e ao síndico o dever de cobrar as contribuições;
- na relação de locação, a Lei nº 8.245/1991 atribui despesas ordinárias ao locatário e despesas extraordinárias ao locador;
- essa distribuição contratual não necessariamente define, por si só, contra quem o Condomínio deve cobrar;
- proprietário, possuidor, promitente comprador ou outro sujeito com relação jurídica material direta com o imóvel podem receber tratamento diferente conforme a situação concreta;
- a saída do locatário não deve transferir automaticamente obrigações anteriores ao novo ocupante;
- conservação de dados para obrigação legal ou exercício regular de direitos não deve significar manutenção de acesso amplo como Morador.

Esses pontos são hipóteses de trabalho, não conclusões jurídicas adotadas pelo produto.

## 4. Questões para parecer

### 4.1 Responsabilidade perante o Condomínio

1. Em uma locação residencial comum, contra quem o Condomínio deve dirigir a cobrança das cotas condominiais: proprietário, locatário, ambos ou outro sujeito?
2. A distinção entre despesas ordinárias e extraordinárias altera apenas a relação interna entre locador e locatário ou também altera a legitimidade para cobrança pelo Condomínio?
3. Em quais circunstâncias um locatário ou ex-locatário pode ser cobrado diretamente pelo Condomínio?
4. Receber cobranças em seu nome, realizar pagamentos, firmar acordo ou confessar dívida cria relação jurídica direta ou corresponsabilidade? Quais efeitos e limites surgem em cada caso?
5. Existe diferença relevante entre locatário residencial, arrendatário, comodatário, possuidor, promitente comprador e proprietário registral que o produto deve representar explicitamente?
6. O Condomínio pode adotar o proprietário como destinatário padrão da cobrança e deixar ao proprietário eventual regresso contra o ex-inquilino? Há exceções em que esse comportamento seria inadequado?
7. A convenção condominial ou decisão assemblear pode modificar alguma dessas conclusões? Quais limites legais permanecem inderrogáveis?

### 4.2 Saída, encerramento de Vínculo e acesso posterior

8. O Vínculo de Morador/ocupante pode ser encerrado na data da saída mesmo quando existirem valores pendentes?
9. Existe alguma obrigação jurídica que exija manter o ex-inquilino cadastrado como Morador ativo ou com acesso às informações correntes do Condomínio?
10. É juridicamente adequado substituir o acesso de Morador por um acesso pós-saída limitado exclusivamente às cobranças, acordos, pagamentos, contestações e documentos próprios?
11. Quais informações o ex-ocupante deve continuar podendo consultar e por quanto tempo?
12. O acesso pós-saída deve ser obrigatório, facultativo ou substituível por outro canal formal de comunicação?
13. Em que momento esse acesso e o tratamento associado devem terminar?

### 4.3 Obrigação vinculada à Unidade e troca de ocupante

14. É correto manter cada obrigação vinculada à Unidade e à competência de origem, registrando separadamente proprietário, ocupante, destinatário da cobrança e possíveis responsáveis?
15. O novo inquilino deve ser completamente impedido de consultar cobranças e inadimplência anteriores à sua entrada?
16. Há alguma informação histórica da Unidade que o novo ocupante possa ou deva consultar sem revelar dados pessoais do ocupante anterior?
17. Como o sistema deve tratar mudança de proprietário, promessa de compra e venda, posse sem registro, espólio, usufruto ou outras situações especiais?
18. Quais documentos e evidências são necessários antes de alterar o responsável jurídico ou incluir possível corresponsável?

### 4.4 Cobrança, comunicação e restrições

19. Quais Pessoas podem receber comunicação de cobrança e quais informações mínimas podem constar nela?
20. Uma comunicação de cobrança pode ser enviada a todos os Responsáveis Financeiros vigentes da Unidade? Há necessidade de consentimento, aviso ou fundamento específico?
21. Quais limites se aplicam a e-mail, notificações internas, documentos para download e histórico de cobranças?
22. Que cautelas devem impedir exposição de inadimplência a Moradores, Conselheiros, novos ocupantes ou terceiros?
23. Quais práticas de cobrança, restrições de acesso, negativação ou impedimento de uso devem ser proibidas ou condicionadas a procedimento específico?
24. Como evitar cobrança duplicada quando existirem proprietário, possuidor, ex-inquilino, acordo ou corresponsabilidade possível?

### 4.5 LGPD, retenção e compartilhamento

25. Quais bases legais podem sustentar o tratamento de dados de proprietário, locatário, ex-locatário, possuidor, Responsável Financeiro e novo ocupante em cada etapa?
26. Quais finalidades devem ser documentadas separadamente para gestão do Vínculo, cobrança, negociação, defesa, auditoria e conservação histórica?
27. Quais dados devem ser eliminados ou anonimizados após o encerramento do Vínculo e quais podem ser conservados para obrigação legal ou exercício regular de direitos?
28. Quais prazos ou critérios de retenção devem ser usados para cobranças, acordos, notificações, comprovantes, logs de acesso e documentos anexados?
29. Quais dados o Condomínio pode fornecer ao proprietário para eventual cobrança regressiva do ex-inquilino?
30. O Burgoweb pode oferecer acesso restrito ao ex-ocupante sem assumir finalidade própria ou responsabilidade adicional incompatível com seu papel de operador?
31. Como devem ser qualificados Condomínio, Burgoweb, proprietário, administradora, contador, escritório de cobrança e advogado em cada operação?

### 4.6 Parametrização e decisão humana

32. Quais regras devem ser fixas no produto e não alteráveis pelo Síndico?
33. Quais regras podem ser parametrizadas pelo Condomínio, como prazo, canal, quantidade de notificações, parcelamento e encaminhamento jurídico?
34. É juridicamente adequado implementar uma tabela de decisões versionada e auditável que sugira responsáveis possíveis sem decidir automaticamente legitimidade ou responsabilidade?
35. Quais casos devem obrigatoriamente ser bloqueados e encaminhados para análise jurídica antes de qualquer cobrança ou mudança de acesso?

## 5. Comportamento provisório proposto para validação

Até receber o parecer, propomos o seguinte comportamento conservador:

1. Encerrar o Vínculo de Morador/ocupante na data efetiva da saída, exista ou não pendência.
2. Preservar o histórico temporal Pessoa–Unidade sem manter acesso a conteúdo posterior.
3. Manter a obrigação vinculada à Unidade e à competência de origem.
4. Não transferir saldo, cobrança ou dados do ocupante anterior ao novo ocupante.
5. Usar o proprietário como destinatário padrão do fluxo de cobrança do Condomínio, sem impedir registro de situações juridicamente excepcionais.
6. Registrar possível responsabilidade do ex-inquilino somente em relação separada, apoiada por fundamento e evidência.
7. Se necessário, oferecer acesso pós-saída estritamente limitado às próprias cobranças, acordos, pagamentos, contestações e documentos.
8. Não permitir que esse acesso revele Publicações posteriores, dados coletivos do Condomínio ou dados do novo ocupante.
9. Impedir que o Síndico crie livremente corresponsabilidade jurídica por mera configuração.
10. Preservar auditoria, finalidade, vigência, justificativa e responsável por toda inclusão, alteração ou encerramento de relação de cobrança.
11. Não aplicar negativação, restrição de áreas comuns, exposição pública ou outra medida coercitiva sem procedimento juridicamente validado.
12. Marcar casos especiais como pendentes de análise humana, sem decisão automática do Burgoweb.

Solicitamos que o parecer confirme, corrija ou substitua essas regras e indique os fundamentos legais, precedentes, documentos necessários, prazos de retenção e textos de transparência recomendados.

## 6. Fontes preliminares consultadas

- Código Civil — Lei nº 10.406/2002, especialmente regras sobre despesas condominiais, cobrança pelo síndico e responsabilidade ligada à unidade: <https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm>
- Lei do Inquilinato — Lei nº 8.245/1991, especialmente arts. 22, 23 e 25: <https://planalto.gov.br/ccivil_03/leis/l8245compilado.htm>
- LGPD — Lei nº 13.709/2018, especialmente arts. 7º, 15 e 16: <https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm>
- STJ, REsp 1.704.498/SP — cobrança contra arrendatária com relação material direta com o imóvel: <https://processo.stj.jus.br/jurisprudencia/externo/informativo/?livre=%40CNOT%3D016645>
- STJ, Tema 886 e REsp 1.910.280 — responsabilidade em promessa de compra e venda e posse: <https://processo.stj.jus.br/repetitivos/temas_repetitivos/pesquisa.jsp?cod_tema_final=886&cod_tema_inicial=886&novaConsulta=true&tipo_pesquisa=T>
- Material interno preliminar `BURGOWEB_COBRANÇA.md`, que deverá ser revisto à luz do parecer.

Atenciosamente,

Responsável pelo produto Burgoweb
