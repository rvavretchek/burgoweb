---
title: "Necessidades e jornadas"
product: "Burgoweb"
document_order: 4
status: "draft"
version: "0.1"
last_updated: "2026-07-20"
bmad_phase: "analysis"
---

# Necessidades e jornadas

## Necessidades estruturantes

| Necessidade | Resultado esperado |
|---|---|
| Organizar a operação | Centralizar compromissos, registros e documentos |
| Controlar finanças | Saber o que entrou, saiu, venceu e foi pago |
| Prestar contas | Demonstrar gastos e decisões com evidências |
| Preservar histórico | Manter informação entre gestões |
| Apoiar terceiros | Entregar dados estruturados para contabilidade e folha |
| Acompanhar obras | Relacionar aprovação, execução e pagamentos |
| Informar moradores | Disponibilizar informações sem sobrecarregar o síndico |
| Controlar acessos | Expor o necessário e proteger dados restritos |

## Jornada 1 — Entrada do condomínio

```mermaid
flowchart LR
    A[Descoberta] --> B[Cadastro mínimo]
    B --> C[Configuração progressiva]
    C --> D[Convites]
    D --> E[Importação inicial]
    E --> F[Primeiro registro]
    F --> G[Primeira publicação]
    G --> H[Valor percebido]
```

### Objetivo

Começar a usar o sistema sem reconstruir previamente toda a história do condomínio.

### Momento de valor

A síndica registra uma despesa com comprovante e consegue disponibilizá-la em uma prestação de contas compreensível.

### Requisitos derivados

- cadastro progressivo;
- importação simples;
- convite por link, e-mail ou código;
- checklist de implantação;
- modelos iniciais;
- dados de exemplo;
- correção sem perda de histórico.

## Jornada 2 — Rotina mensal do síndico

```mermaid
flowchart LR
    A[Planejar mês] --> B[Registrar fatos]
    B --> C[Anexar documentos]
    C --> D[Classificar]
    D --> E[Acompanhar gastos]
    E --> F[Conferir pendências]
    F --> G[Fechar competência]
    G --> H[Exportar]
    G --> I[Publicar prestação]
```

### Resultado esperado

Chegar ao fim do mês sem procurar documentos ou reconstruir os acontecimentos.

### Pendências que o produto deve evidenciar

- lançamento sem documento;
- vencimento não tratado;
- pagamento pendente;
- categoria não definida;
- informação não enviada ao contador;
- horas sem aprovação;
- prestação não publicada.

## Jornada 3 — Transparência para o morador

```mermaid
sequenceDiagram
    participant M as Morador
    participant B as Burgoweb
    participant S as Síndico

    M->>B: Consulta gasto, decisão ou projeto
    B-->>M: Exibe resumo, origem e documentos publicados
    alt Informação suficiente
        M->>B: Finaliza consulta
    else Precisa de esclarecimento
        M->>B: Registra pergunta vinculada
        B->>S: Notifica responsável
        S->>B: Publica esclarecimento
        B-->>M: Mantém resposta no histórico
    end
```

### Níveis de informação

1. **Coletiva:** visível aos usuários autorizados do condomínio.
2. **Administrativa restrita:** visível a funções determinadas.
3. **Pessoal ou trabalhista:** acesso estritamente necessário.

### Momento de valor

O morador encontra sozinho a resposta para uma dúvida comum e confia na origem da informação.

## Jornada 4 — Dados para contabilidade

```mermaid
flowchart LR
    A[Registrar lançamento] --> B[Anexar documento]
    B --> C[Classificar]
    C --> D[Conferir pendências]
    D --> E[Fechar competência]
    E --> F[Exportar pacote]
    F --> G[Contador revisa]
    G --> H{Há divergência?}
    H -- Sim --> I[Solicitar correção vinculada]
    I --> D
    H -- Não --> J[Confirmar recebimento]
```

### Dados mínimos

- competência;
- vencimento;
- pagamento;
- natureza;
- categoria;
- fornecedor ou origem;
- descrição;
- valor;
- forma de pagamento;
- projeto ou centro de custo;
- documento;
- situação;
- responsável.

### Limite

O Burgoweb estrutura e exporta dados, mas não realiza inicialmente escrituração, cálculo tributário ou obrigação acessória.

## Jornada 5 — Eventos para folha

```mermaid
flowchart LR
    A[Funcionário registra evento] --> B[Anexa justificativa]
    B --> C[Gestor confere]
    C --> D{Aprovar?}
    D -- Não --> E[Corrigir]
    E --> C
    D -- Sim --> F[Fechar período]
    F --> G[Exportar eventos]
    G --> H[Operador de folha processa]
```

### Eventos iniciais

- horas extras;
- faltas;
- atrasos;
- plantões;
- substituições;
- férias;
- afastamentos;
- feriados;
- adicional noturno;
- compensações.

### Limite

Não calcular folha, encargos ou regras sindicais no núcleo inicial.

## Jornada 6 — Obra ou projeto

```mermaid
flowchart LR
    A[Necessidade] --> B[Avaliação e escopo]
    B --> C[Propostas]
    C --> D[Deliberação]
    D --> E[Contratação]
    E --> F[Execução]
    F --> G[Medições e pagamentos]
    G --> H[Prestação de contas]
    H --> I[Encerramento e garantia]
```

### Relações indispensáveis

- decisão e orçamento aprovado;
- fornecedor e contrato;
- etapa e evidência;
- pagamento e entrega;
- alteração de escopo e justificativa;
- conclusão e garantia.

## Jornada 7 — Troca de gestão

```mermaid
flowchart LR
    A[Registrar fim do mandato] --> B[Inventariar pendências]
    B --> C[Revisar documentos e acessos]
    C --> D[Designar nova gestão]
    D --> E[Encerrar permissões antigas]
    E --> F[Registrar aceite da transição]
    F --> G[Manter histórico acessível]
```

### Resultado esperado

O novo síndico inicia o mandato conhecendo compromissos, documentos, contratos, obras e pendências sem depender da memória da gestão anterior.

## Jornadas complementares

### Ocorrência

```mermaid
flowchart LR
    A[Registrar] --> B[Classificar]
    B --> C[Designar responsável]
    C --> D[Executar providência]
    D --> E[Anexar evidência]
    E --> F[Informar solicitante]
    F --> G[Encerrar]
```

### Contratação

```mermaid
flowchart LR
    A[Necessidade] --> B[Especificação]
    B --> C[Solicitar propostas]
    C --> D[Comparar]
    D --> E[Aprovar]
    E --> F[Contratar]
    F --> G[Acompanhar]
    G --> H[Avaliar]
```

### Assembleia futura

```mermaid
flowchart LR
    A[Convocação] --> B[Documentos prévios]
    B --> C[Pauta]
    C --> D[Debate]
    D --> E[Votação]
    E --> F[Ata]
    F --> G[Tarefas decorrentes]
    G --> H[Acompanhamento]
```

## Priorização das jornadas

### Núcleo

1. entrada do condomínio;
2. rotina mensal;
3. transparência e consulta;
4. preparação contábil;
5. troca de gestão.

### Segunda camada

6. horas e eventos de folha;
7. projetos e obras;
8. tarefas e ocorrências;
9. fornecedores e contratos.

### Futuro

10. assembleias virtuais;
11. reuniões híbridas;
12. boletos e integração bancária;
13. leilão reverso;
14. marketplace;
15. multiconomínio avançado.
