# Addendum técnico e jurídico do PRD — Burgoweb

Este addendum preserva decisões e aprofundamentos relevantes que não pertencem ao nível funcional do PRD. Ele orienta arquitetura e revisão jurídica, mas não substitui esses documentos.

## 0. Estratégia de implementação

- A implementação será greenfield dentro do repositório existente.
- O protótipo atual não estabelece contratos de API, modelo de dados, compatibilidade, migração ou obrigação de reutilização.
- O histórico Git e os artefatos BMAD serão preservados.
- Tooling, dependências, configuração, estilos, testes ou código somente serão reutilizados quando a arquitetura justificar benefício real e conformidade com o PRD.
- `data/storage.json` e demais dados locais do protótipo não serão migrados para a nova aplicação.
- O protótipo não será apagado antes de existir um snapshot Git revisável e uma nova base capaz de compilar e executar os testes fundamentais.
- A arquitetura deve registrar explicitamente quais elementos serão reaproveitados, substituídos ou removidos e por quê.

## 1. Autenticação e credenciais

- A decisão aprovada para senhas é **Argon2id com pepper**.
- O pepper deve ser gerenciado como segredo fora do repositório e fora da persistência de usuários, com procedimento seguro de disponibilização e rotação.
- Parâmetros, biblioteca, versionamento do hash, migração e estratégia de recuperação pertencem à arquitetura e devem ser validados por testes de segurança.
- Sessões, recuperação de acesso e proteção contra abuso devem ser especificadas pela arquitetura sem enfraquecer o requisito de isolamento entre Condomínios.
- O controle de e-mail comprova posse do canal no MVP, não identidade civil.
- Recuperação de Conta, revogação de Vínculo e resposta a incidente devem permitir invalidação das sessões alcançadas.
- O protótipo atual autentica senha, mas não implementa contrato de sessão e algumas operações confiam em identificador de ator enviado pelo cliente; isso não pode ser promovido à implantação pública.
- Respostas e logs não devem expor hash de senha, senha temporária, token ou segredo.

## 1.1 Autoridade declarada e governança de acesso

- O criador da Conta e do Condomínio recebe autoridade inicial por autodeclaração registrada; o Burgoweb não certifica que ele seja juridicamente o Síndico.
- Atas, mandatos e documentos de gestão poderão ser associados futuramente como evidência e proveniência, sem converter automaticamente o Burgoweb em certificador.
- Auxiliares autorizados podem aplicar suspensão urgente e reversível; o Síndico confirma revogações permanentes de Papéis subordinados.
- Transferência contestada do próprio Síndico não será decidida por simples maioria de usuários cadastrados. O procedimento excepcional dependerá de definição jurídica e operacional posterior.
- A transferência cooperativa exige iniciativa da gestão atual e aceitação do sucessor, com registro dos poderes transferidos e do destino do Papel anterior.
- Contatos de Continuidade recebem alertas e apoiam recuperação, mas não ganham automaticamente Papel administrativo nem acesso a Dados Pessoais.
- Uma transferência contestada preserva o acesso existente e não concede dados ao requerente até concordância, resolução externa reconhecida pelo procedimento jurídico-operacional ou procedimento excepcional documentado.
- O suporte registra as evidências e a execução excepcional sem afirmar que o Burgoweb certifica juridicamente uma eleição.
- A contenção de Conta comprometida é separada da transferência de autoridade: sessões e Convites podem ser revogados sem nomear automaticamente novo Síndico.
- O MVP usa Papéis predefinidos. O Síndico delega capacidades explícitas a Auxiliares, que não podem ampliar os próprios poderes ou delegar a terceiros.
- Transferência do Síndico, revogação administrativa permanente, Contatos de Continuidade e política de delegação são poderes não delegáveis.
- Responsável Financeiro é escopo do Vínculo Pessoa-Unidade e não Papel global; Contato de Continuidade é somente designação de recuperação/notificação.

## 2. Exportação e persistência

- A Exportação Institucional é requisito de continuidade do Condomínio; não deve ser confundida com o direito individual de portabilidade da LGPD.
- Exportação Financeira operacional, Exportação Institucional e solicitação individual do titular são operações distintas; esta última aguarda definição jurídica.
- A Exportação Institucional inclui dados, relacionamentos, histórico, versões e Anexos incluídos no escopo autorizado necessários à reconstrução por terceiro, excluindo segredos e credenciais.
- O pacote é um snapshot coerente com manifesto, versão, escopo, exclusões, contagens e verificação de integridade. Formatos exatos, compactação, criptografia e expiração são decisões arquiteturais posteriores.
- Importação automática fica fora do MVP. Continuidade dentro do Burgoweb preserva o mesmo Condomínio; saída usa o pacote e recuperação de desastre usa backup/restauração da plataforma.
- Geração e download exigem autorização, autenticação recente, área autenticada, expiração do artefato temporário e auditoria; o pacote não é enviado anexado a e-mail.
- O operador externo valida a Exportação Financeira e pode pedir nova geração; rejeição e substituição ficam registradas sem integração automática no MVP.
- Exportar dados ao escritório de contabilidade não encerra o tratamento das cópias que permanecerem no Burgoweb.
- Persistência local de desenvolvimento, como `data/storage.json`, não representa o modelo de implantação pública nem deve conter dados reais versionados.
- O armazenamento JSON atual não atende concorrência, transações financeiras, isolamento, backup ou recuperação exigidos; sua substituição é decisão obrigatória de arquitetura.

## 2.1 Capacidade e armazenamento de Anexos

- O MVP terá Cota de Armazenamento configurável por Condomínio; atingir o limite bloqueia somente novos uploads e nunca elimina conteúdo automaticamente.
- Ampliação paga, armazenamento próprio e download seguido de expurgo são hipóteses futuras, não compromissos do MVP.
- O banco deve manter metadados, autorização, versões, hashes e referências; o conteúdo binário deve possuir abstração de armazenamento separada, mesmo que a implantação inicial compartilhe infraestrutura.
- Na OCI Always Free, os 200 GB de Block Volume incluem volumes de inicialização e volumes adicionais; duas VMs com volumes padrão consomem parcela relevante antes de banco, arquivos, logs e margem de recuperação. O Object Storage gratuito possui limite próprio menor. Esses números devem ser verificados novamente no desenho de implantação.
- A capacidade inicial depende de reserva para sistema, banco, logs, backups, crescimento, tamanho máximo de arquivo e quantidade esperada de Condomínios.
- Remoção futura de Anexo publicado deve preservar manifesto, metadados, hash, relacionamento, responsável e instante, além de respeitar retenção, incidente e disputa.

## 2.1.1 Realidade operacional

- O Burgoweb será inicialmente um showroom público, não uma operação dedicada à monetização direta.
- Não existe NOC, plantão permanente nem equipe dedicada. O proprietário operará o serviço sozinho, em disponibilidade parcial dividida com produtos pagos e consultoria.
- Disponibilidade, latência, carga, RPO, RTO, monitoração e alertas não serão inventados no PRD: a arquitetura deverá medir a infraestrutura e propor compromissos sustentáveis.
- O gate de lançamento exige limites e riscos comunicados, backup/restauração proporcional e capacidade demonstrada; não exige promessas incompatíveis com a operação real.
- A infraestrutura deve privilegiar baixo esforço recorrente, diagnóstico posterior, automação simples e contenção de falhas antes de sofisticação operacional.

## 2.2 Núcleo financeiro

O contrato funcional está em PRD §4.3 e §4.12. A arquitetura deve definir ledger, idempotência, transações, precisão decimal e cálculo de saldo sem alterar suas equações e invariantes.

## 2.3 Pendências

O contrato funcional está em PRD §4.5. A arquitetura deve preservar transições, autorização, histórico e separação entre conteúdo interno e Publicação.

## 2.4 Comentários, decisões e auditoria

O contrato funcional está em PRD §4.14. Logs técnicos, retenção, armazenamento imutável e correlação pertencem à arquitetura; não podem enfraquecer a separação semântica nem registrar segredos.

## 3. Hipótese inicial de agentes de tratamento

Esta hipótese deve ser substituída ou confirmada pelo parecer jurídico:

- o Condomínio tende a decidir finalidades da gestão e pode atuar como controlador nessas operações;
- o Burgoweb tende a atuar como operador ao processar dados por instrução do Condomínio;
- o Burgoweb pode atuar como controlador em operações próprias de Conta, segurança, prevenção de fraude e relacionamento direto;
- administradora, contador, nuvem e e-mail devem ser qualificados por atividade, contrato e finalidade, não apenas pelo nome do fornecedor.

## 4. Anexos e saneamento

- O MVP não interpreta NF-e, NFS-e nem SPED.
- Fotos e arquivos anexados podem conter Dados Pessoais incidentais, mesmo quando emitidos por pessoa jurídica.
- Técnicas de detecção, tarja, geração de versão saneada e armazenamento de originais pertencem à UX e à arquitetura.
- Até que exista fluxo validado, o original permanece privado por padrão e não é publicado automaticamente.

## 4.1 Versionamento e suspensão

Os contratos funcionais estão em PRD §4.7 e §4.10. A arquitetura deve implementar snapshots imutáveis, autorização independente de original e versão compartilhável, SLA sem republicação automática, preservação da última versão segura e auditoria de prorrogações.

## 4.2 Resposta a incidentes

- Incidentes de conteúdo incluem audiência errada, Anexo não saneado, inadimplência identificada e informação pessoal publicada indevidamente.
- Incidentes técnicos incluem Conta comprometida, abuso de Convite ou recuperação, falha de autorização entre Condomínios, exportação exposta, vazamento de segredo, alteração indevida, indisponibilidade e perda de dados.
- Criptografia em trânsito e repouso é necessária, mas não substitui autorização, isolamento, revogação, auditoria, backups e resposta a incidentes.

## 5. Insumos jurídicos preliminares

- `BURGOWEB_LGPD.md` e `BURGOWEB_LGPD_2.md` são insumos produzidos com auxílio de IA e não constituem parecer jurídico.
- Afirmações sobre base legal, retenção, anonimização, identificação por Unidade, acesso dos Conselheiros, biometria e agentes de tratamento não devem ser adotadas sem validação profissional.
- A solicitação de análise foi encaminhada ao advogado pelo proprietário do produto; o retorno será uma entrada posterior de revisão do PRD, deste addendum e dos documentos derivados.
