# Revisão adversarial — Privacidade, autorização e tenancy

## Veredito geral

O par de spines está **forte** nesta lente. A verificação final não encontrou achados remanescentes de privacidade, autorização, isolamento por Condomínio, transparência segura ou gates jurídicos.

Contagem final: **0 críticos, 0 altos, 0 médios e 0 baixos**.

## Achados remanescentes

Nenhum.

## Verificações finais

- **Troca atômica de Condomínio:** cancela ou ignora respostas e polling anteriores; invalida cache e preview; limpa estado não portável; fecha overlays; revalida rota; higieniza history, URL, query e title (`EXPERIENCE.md` § Component Patterns / Shell institucional).
- **Preview editorial:** vincula tenant, ator/capacidades, audiência efetiva, snapshot, versões e hashes; confirmação revalida tudo e bloqueia divergência sem exibir diff proibido (`EXPERIENCE.md` § Component Patterns / Audience preview).
- **Suspensão:** retira o conteúdo, mantém somente metadados coletivos permitidos e proíbe versão anterior como fallback automático (`EXPERIENCE.md` § State Patterns / Suspenso).
- **Exportação e download:** revalidam autenticação recente, tenant, Vínculo, capacidade, escopo, estado e validade antes de emitir e consumir o link; revogação ou contenção invalida links e polling (`EXPERIENCE.md` § Exportação e portabilidade).
- **Papel e capacidade:** ações sensíveis verificam capacidades específicas em botão, rota, projeção, job e download; Papel agregado e `isAdmin` são proibidos (`EXPERIENCE.md` § Capacidades sensíveis).
- **Filtros e inferência:** facetas, totais, sugestões, paginação e estados vazios derivam exclusivamente da projeção autorizada; filtros não aceitam nem ecoam valores fora dela (`EXPERIENCE.md` § Capacidades sensíveis).
- **Original, derivado e compartilhável:** natureza e versão são persistentes, ações são separadas, não existe URL estável de storage no DOM/endereço e cada visualização ou download reautoriza (`EXPERIENCE.md` § Capacidades sensíveis).
- **Gates jurídicos:** a tabela provisória distingue, por fluxo, o que pode ser registrado/preparado e o que permanece bloqueado para direitos sobre Dados Pessoais, retenção/descarte, transferência contestada, saída/cobrança e incidente (`EXPERIENCE.md` § Gates jurídicos provisórios).
- **Taxonomia de acesso:** superfícies sem autenticação usam `Acesso sem sessão`; “público” permanece restrito ao sentido explicitamente definido de conteúdo coletivo dentro do Condomínio, nunca internet (`EXPERIENCE.md` § Information Architecture e § Content, Audience and Editorial Contract).

## Conclusão

Esta lente não bloqueia a finalização dos spines. A aprovação não substitui os gates de lançamento do PRD nem o parecer jurídico profissional ainda exigido; confirma apenas que o contrato UX representa esses condicionamentos sem convertê-los em decisões silenciosas.
