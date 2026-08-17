# Diretrizes LGPD para Sistema de Gestão de Condomínios

**Base Legal Principal:** Lei 13.709/2018 (LGPD), arts. 6º, 7º, 12 §2º; Código Civil, art. 1.348.

---

## 1. Dados que NÃO devem ser guardados (Excesso e Finalidade Exaurida)

São dados cuja conservação representa risco desnecessário e viola o princípio da minimização.

- **Dados bancários completos de condôminos** (número do cartão, CVV) para pagamento de cota.
  - *Guarde apenas:* comprovante de pagamento e, se necessário, banco/agência do depositante.
- **Dados de saúde sensíveis** em comprovantes de despesas médicas de funcionários (CID, exames).
  - *Registre apenas:* valor da despesa e nome do titular para reembolso ou contabilização de plano de saúde.
- **Cópia de documentos pessoais** (RG, CPF) de prestadores de serviço.
  - *Registre apenas:* nome, CNPJ/CPF para nota fiscal e dados bancários para pagamento.
- **Dados de menores** em cadastros de lazer (ex.: cópia de certidão de nascimento).
  - *Se essencial, guarde apenas:* nome e idade. Jamais cópia de documentos.
- **Biometria facial** para controle de acesso, se houver meio menos invasivo (ex.: cartão de proximidade).
  - *Se imprescindível:* jamais associar a dados de rastreamento de hábitos (horários de entrada/saída).

---

## 2. Acesso do Síndico

### 2.1 O que PODE acessar e exibir

- **Folha de pagamento (para balanço):** apenas o custo total por categoria (salários, encargos, benefícios) de forma agrupada e anonimizada. Jamais listar salário por funcionário.
- **Inadimplência:** internamente, nome e valor devido. No balanço contábil, apenas valores totais consolidados e gráficos percentuais sem identificação nominal.
- **Serviços, custos e despesas:** nome do credor, CNPJ/CPF, valor pago e descrição do serviço. São dados do condomínio (pessoa jurídica).
- **Relatórios de manutenção:** dados do equipamento, custo e prestador, sem dados pessoais do condômino solicitante.

### 2.2 O que NÃO deve mostrar (vedação absoluta)

- **Lista de inadimplentes com nome e unidade** em murais, grupos de WhatsApp ou assembleias. Configura exposição vexatória e cobrança abusiva (CDC e LGPD).
- **Salário individualizado de funcionário** em assembleia ou prestação de contas. O que se aprova é o gasto total com pessoal.
- **Dados de contato** de um condômino a outro sem consentimento prévio e explícito.
- **Imagens de câmeras de segurança** a condôminos que não são o titular dos dados. O acesso é restrito ao síndico/conselho para fins de segurança e investigação interna.
- **Multas e advertências** de uma unidade para terceiros. O processo é sigiloso entre as partes.

---

## 3. Acesso dos Condôminos

- **Balanço contábil:** receitas, despesas por categoria (água, luz, pessoal, manutenção), valores totais de inadimplência (sem nomes).
- **Contratos e notas fiscais** do condomínio, com valores, objeto e dados do prestador (CNPJ/nome).
- **Ficha financeira da própria unidade:** extrato de cotas, multas, acordos. Jamais a de outro condômino.
- **Atas de assembleia:** com deliberações, sem anexar listas nominais de inadimplentes.

---

## 4. Tratamento Técnico: Anonimização vs. Criptografia

| Processo | Aplicação | Exemplo |
| :--- | :--- | :--- |
| **Anonimizar** (irreversível) | Relatórios para público amplo ou estatísticas em que a identificação não é essencial. | Tabela de inadimplência para balanço: "Unidade X" ou código aleatório. Consumo de água/gás: gráficos sem nome, apenas padrões. |
| **Criptografar** (reversível, acesso controlado) | Dados em repouso que precisam ser recuperados por pessoas autorizadas. | Banco de dados de inadimplentes (nome, CPF, unidade): AES-256. Dados bancários (débito automático, folha): tráfego TLS 1.3 e armazenamento criptografado. Backups do sistema. |

---

## 5. Tabela-Resumo por Tipo de Dado

| Dado | Guardar? | Acesso Síndico | Acesso Condômino | Tratamento |
| :--- | :--- | :--- | :--- | :--- |
| **Inadimplência (nome e valor)** | Sim, até quitação + prescrição (5 anos). | Integral para gestão. | **Não.** Apenas o próprio. | Criptografar banco. Não exibir em ata. |
| **Inadimplência (p/ balanço)** | Sim, como saldo contábil. | Valor total anonimizado. | Valor consolidado sem nomes. | Anonimizar tabela. |
| **Salário de funcionário** | Sim, obrigação trabalhista. | Sim, para RH/síndico. | **Não.** | Criptografar banco. |
| **Custo total com pessoal** | Sim, contabilmente. | Sim. | Sim, no balancete. | Dado contábil (sem restrição). |
| **Nota fiscal de prestador** | Sim, 5 anos (contábil). | Sim. | Sim. | Dado do condomínio (CNPJ). |
| **Multa/Advertência** | Sim, pasta funcional/ cadastro da unidade. | Sim, para a unidade específica. | Só da própria unidade. | Criptografar. Base: execução contratual. |
| **Imagens de CFTV** | Sim, 30-90 dias (prazo razoável). | Sim, para investigar incidente. | **Não.** | Criptografar armazenamento. Registro de acesso. |

---

*Revisado em 21/07/2026. Consulte sempre o Encarregado de Dados (DPO) do condomínio para adequação de casos específicos.*