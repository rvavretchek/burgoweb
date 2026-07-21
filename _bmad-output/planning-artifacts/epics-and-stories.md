---
title: "Épicos e Histórias – Burgoweb"
status: "draft"
created: "2026-07-21"
updated: "2026-07-21"
---

# Épicos e Histórias – Burgoweb

## 1. Objetivo

Este documento organiza o desenvolvimento do Burgoweb em épicos e histórias de implementação, com foco no MVP inicial: organização de condomínio, pendências, histórico e transparência.

## 2. Epic 1 – Base do produto

### Objetivo

Disponibilizar a estrutura inicial da plataforma para que um condomínio possa criar sua presença no sistema, acessar áreas básicas e utilizar o fluxo principal de organização.

### Histórias

#### História 1.1 – Cadastro de condomínio e conta administrativa
Como representante do condomínio, quero criar a conta administrativa do condomínio junto com o nome do condomínio para começar a organizar as informações do ambiente.

Critérios de aceitação:
- o usuário inicia o cadastro criando uma conta administrativa com seu e-mail pessoal;
- no fluxo de onboarding, o usuário informa se é apenas síndico, apenas morador, morador e proprietário, ou morador, proprietário e síndico;
- o usuário informa o nome do condomínio no mesmo fluxo de onboarding;
- o sistema valida se o nome do condomínio é único ou sugere alternativas quando já existe um nome semelhante;
- o sistema permite que o usuário escolha um nome único ou aceite uma sugestão como Camélias-Bauru quando houver conflito;
- a criação da conta gera um convite ou envio de e-mail para definição de senha e liberação de acesso;
- após a criação, a conta administrativa fica vinculada ao condomínio e pode acessar o painel inicial.

#### História 1.2 – Autenticação e acesso
Como usuário, quero acessar a plataforma com credenciais seguras para proteger as informações do condomínio.

Critérios de aceitação:
- o login é realizado com e-mail pessoal e senha definida após o convite;
- o sistema envia e-mail de criação de senha e liberação de acesso no momento da criação da conta;
- login e logout funcionam corretamente;
- a autenticação utiliza Argon2id + pepper;
- usuários sem permissão não acessam dados restritos.

#### História 1.3 – Organização inicial do painel
Como usuário, quero visualizar um painel inicial com informações principais do condomínio para entender rapidamente o que está acontecendo.

Critérios de aceitação:
- o painel exibe resumo de pendências e ações recentes;
- a interface é clara e objetiva;
- o usuário consegue navegar para áreas principais sem dificuldade.

## 3. Epic 2 – Gestão de pendências

### Objetivo

Permitir que o condomínio registre, acompanhe e atualize pendências de forma simples e transparente.

### Histórias

#### História 2.1 – Cadastro de pendência
Como síndico, quero criar uma pendência para registrar problemas ou tarefas a serem resolvidas.

Critérios de aceitação:
- o usuário cria uma pendência com título, descrição e responsável;
- a pendência fica visível na lista do condomínio;
- o status inicial é definido corretamente.

#### História 2.2 – Atualização de status
Como usuário responsável, quero atualizar o status de uma pendência para refletir o andamento da tarefa.

Critérios de aceitação:
- o status pode ser alterado pelo usuário adequado;
- a mudança fica registrada;
- a alteração é refletida na interface.

#### História 2.3 – Atribuição de responsável
Como síndico, quero atribuir um responsável a uma pendência para aumentar clareza operacional.

Critérios de aceitação:
- o responsável pode ser alterado;
- a atribuição é exibida na interface;
- a mudança é persistida no sistema.

## 4. Epic 3 – Comunicação e histórico

### Objetivo

Garantir que decisões, comentários e ações sejam registrados de forma clara, permitindo transparência e auditoria simples.

### Histórias

#### História 3.1 – Registro de comentário ou atualização
Como usuário, quero registrar comentários em uma pendência para documentar evoluções e decisões.

Critérios de aceitação:
- o comentário é salvo corretamente;
- o histórico fica visível para os participantes;
- o sistema mantém consistência na ordenação das entradas.

#### História 3.2 – Histórico de ações
Como usuário, quero consultar o histórico de uma ação para entender o contexto e o andamento da situação.

Critérios de aceitação:
- o histórico é apresentado de forma organizada;
- entradas antigas e novas são exibidas em ordem lógica;
- o usuário consegue localizar registros anteriores facilmente.

## 5. Epic 4 – Experiência e qualidade

### Objetivo

Garantir que a plataforma seja simples, confiável e consistente, com foco em qualidade técnica e experiência do usuário.

### Histórias

#### História 4.1 – Componentização de interface
Como equipe de desenvolvimento, queremos identificar padrões reutilizáveis para componentizar a interface e construir um embrião de framework interno.

Critérios de aceitação:
- componentes reutilizáveis são criados a partir de padrões repetitivos;
- o código se torna mais consistente;
- o projeto passa a acumular um conjunto inicial de abstrações reutilizáveis.

#### História 4.2 – Testes de fluxo principal
Como equipe, quero testar os fluxos principais com Cypress para garantir confiabilidade da experiência.

Critérios de aceitação:
- fluxos críticos são cobertos por testes E2E;
- falhas de navegação ou interação são detectadas cedo;
- a regressão de fluxos principais é reduzida.

#### História 4.3 – Qualidade de código e segurança
Como equipe, quero manter padrões de qualidade e segurança para reduzir riscos técnicos e proteger os dados.

Critérios de aceitação:
- regras de linting e formatação são aplicadas;
- a autenticação segue os padrões de segurança definidos;
- o código segue princípios de manutenção e legibilidade.

## 6. Ordem sugerida de implementação

1. Base do produto
2. Autenticação e acesso
3. Gestão de pendências
4. Comunicação e histórico
5. Qualidade, testes e componentização

## 7. Entregas de MVP

O MVP inicial deve contemplar:

- cadastro de condomínio;
- autenticação segura;
- cadastro e acompanhamento de pendências;
- histórico básico de ações;
- interface simples e consistente.
