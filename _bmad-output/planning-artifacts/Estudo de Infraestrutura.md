Esta foi a "conversa" que eu tive com a Perplexity para tentar encontrar uma alternativa à solução OCI always free + Aiven always free.

	"Liste os provedores se infraestrutura cloud do mundo. Não precisam ser só os grandes, servem regionais também. IBM, Huawei, Wasabi ... não se limite aos listados ou citados aqui. Expanda sua busca para cada país, cada região do globo. Eu quero encontrar um provedor que seja mais barato ou, melhor ainda, que possua solução always free."

Você está procurando uma lista **ampla** de provedores de infraestrutura cloud, incluindo regionais, e com foco em custo baixo ou **always free**. Não existe uma lista “completa do mundo inteiro” realmente fechada, mas dá para montar um mapa útil por categoria e destacar quem costuma ser mais barato ou tem camadas gratuitas permanentes.[[pricestorm](https://www.pricestorm.cloud/)]

## Grandes globais

- AWS.
    
- Microsoft Azure.
    
- Google Cloud.
    
- Oracle Cloud Infrastructure.
    
- IBM Cloud.
    
- Alibaba Cloud.
    
- Huawei Cloud.
    
- Tencent Cloud.
    
- DigitalOcean.
    
- Akamai Connected Cloud.
    
- OVHcloud.
    
- Hetzner.
    
- Vultr.
    
- Linode/Akamai.
    
- Cloudflare.
    
- Salesforce Cloud.
    
- Rackspace.[[cloudhosting.com](https://www.cloudhosting.com.br/artigos/os-20-principais-provedores-de-cloud-computing-em-2025/)]
    

## Candidatos com foco em baixo custo

- **Hetzner**: muito forte em preço por CPU/RAM na Europa.
    
- **OVHcloud**: competitivo na Europa e Canadá.
    
- **DigitalOcean**: simples, popular para SMBs e devs.
    
- **Vultr**: ampla presença regional, bom para VPS.
    
- **Cloudflare**: ótimo para borda, DNS, segurança e algumas funções serverless.
    
- **Oracle Cloud**: costuma ser o destaque em free tier permanente.
    
- **AWS / Azure / GCP**: têm free tiers, mas normalmente com limites e, em parte, exigem verificação de cobrança.[[atraca.com](https://atraca.com.br/servicos-de-nuvem-gratuitos/)]
    

## Always free e free tier

Os fornecedores com proposta mais interessante de “sempre gratuito” ou algo próximo disso incluem **Oracle Cloud**, **AWS**, **Google Cloud**, **Azure**, **Cloudflare** e **IBM Cloud**, mas com limites de uso bem diferentes.[[onedollarvps](https://onedollarvps.com/br/blogs/6-forever-free-cloud-services-for-life)]

- **Oracle Cloud Infrastructure**: frequentemente citado como o free tier mais generoso para compute e self-hosting.[[atraca.com](https://atraca.com.br/servicos-de-nuvem-gratuitos/)]
    
- **AWS**: tem mais de 30 serviços “sempre gratuitos”, com limites mensais.[[aws.amazon](https://aws.amazon.com/pt/free/)]
    
- **Google Cloud**: oferece créditos de teste e alguns recursos always-free.[[atraca.com](https://atraca.com.br/servicos-de-nuvem-gratuitos/)]
    
- **Azure**: mistura crédito inicial, ofertas do primeiro ano e serviços always-free.[[atraca.com](https://atraca.com.br/servicos-de-nuvem-gratuitos/)]
    
- **Cloudflare**: forte em edge, WAF, DNS e algumas funções gratuitas.[[onedollarvps](https://onedollarvps.com/br/blogs/6-forever-free-cloud-services-for-life)]
    
- **IBM Cloud**: também possui ofertas gratuitas e trial em alguns serviços.[[atraca.com](https://atraca.com.br/servicos-de-nuvem-gratuitos/)]
    

## Regionais por bloco geográfico

- **América do Norte**: AWS, Azure, GCP, Oracle, IBM, Vultr, DigitalOcean, Cloudflare, Akamai, Rackspace, OVHcloud.[[pricestorm](https://www.pricestorm.cloud/)]
    
- **Europa**: Hetzner, OVHcloud, Scaleway, UpCloud, IONOS, Exoscale, Aruba Cloud, WEDOS, Contabo, Seeweb.[[cloudhosting.com](https://www.cloudhosting.com.br/artigos/os-20-principais-provedores-de-cloud-computing-em-2025/)]
    
- **América Latina**: além das grandes globais, há provedores locais e regionais como HostDime, UOL Host, Locaweb, KingHost, Hostinger, Azion e vários data centers nacionais/regionais no Brasil e países vizinhos.[[guiadohost](https://guiadohost.com/2025/04/23/os-5-melhores-e-mais-baratos-servidores-cloud-do-brasil/)]
    
- **Ásia-Pacífico**: Alibaba Cloud, Tencent Cloud, Huawei Cloud, Sakura Internet, Cloud Cone, Asia Pacific Network e provedores locais de Japão, Coreia, Singapura, Índia e Austrália.[[cloudhosting.com](https://www.cloudhosting.com.br/artigos/os-20-principais-provedores-de-cloud-computing-em-2025/)]
    
- **Oriente Médio e África**: provedores regionais de telecom e data center, além das nuvens globais com regiões locais; a oferta costuma ser mais fragmentada e muito ligada a compliance e baixa latência.[[pricestorm](https://www.pricestorm.cloud/)]
    

## Como achar o mais barato

O melhor caminho é comparar por **região + tipo de instância + tráfego + armazenamento**, porque o preço muda muito entre países e zonas de disponibilidade. Ferramentas de comparação de preços multi-cloud mostram justamente essa variação entre provedores e regiões.[[cloudprice](https://cloudprice.net/aws/regions)]

## Recomendação prática

Se sua prioridade é **free tier real**, comece por Oracle Cloud, AWS, Google Cloud, Azure e Cloudflare. Se sua prioridade é **VPS barato de verdade**, vale olhar Hetzner, OVHcloud, Vultr, DigitalOcean e provedores regionais do Brasil e Europa.[[guiadohost](https://guiadohost.com/2025/04/23/os-5-melhores-e-mais-baratos-servidores-cloud-do-brasil/)]

Posso transformar isso em uma **planilha comparando provedor, região, tipo de oferta free e faixa de preço mínimo**.

	"Preciso que verifique nestes provedores que você listou, uma oferta que seja preferencialmente always free, ou que seja always free com limite ou que seja free no primeiro ano - ou mais - para atender à necessidade de uma solução de gerenciamento de condomínios multitenant que será gratuita em React.js + Node.js + PostgreSQL.
	Por enquanto, a minha saída para a primeira versão desta solução é utilizar as instâncias always free da OCI (na verdade, para poder trabalhar com essa solução, que demanda processamento e armazenamento, vou utilizar 2 VMs OCI always free e 1 instância aiven.io do PostgreSQL). 
	Preciso encontrar uma alternativa de outro provedor (qualquer um dos listados) para eu avaliar (pode ser cloud ou hosting, desde que always free, always free com limites ou free por 1 ano ou mais). Verifique se há outra oferta de VMs ou K3s ou K8s ou Swarm + DB + armazenamento que viabilize fazer o mesmo que vou fazer com OCI + Aiven  (o armazenamento é necessário para banco de dados e anexos da solução)."

A alternativa mais próxima do que você já faz com **OCI + Aiven** é montar algo em **AWS, Azure ou Google Cloud** combinando free tier de compute + banco gerenciado + storage; todas têm ofertas **always free** e/ou **12 meses free** que, com cuidado nos limites, suportam um backend Node.js + PostgreSQL e um frontend React multitenant pequeno.[[cloud.google](https://cloud.google.com/free)]

Vou focar em opções reais (não só teóricas) para **VM/K8s + DB + storage**.

## 1. AWS Free Tier (compute + DB + storage)

AWS é uma candidata forte porque tem combinações de **12 meses free** e **always free** em vários serviços.[[aws.amazon](https://aws.amazon.com/free/free-tier-faqs/)]

Principais componentes para o seu cenário:

- **Compute**
    
    - EC2 t2.micro/t3.micro: 750 horas/mês por 12 meses (dá 1 VM ligada o mês inteiro).[[awsglossary](https://awsglossary.org/terms/free-tier)]
        
    - Alternativas serverless: Lambda (1M requisições/mês always free) + API Gateway (1M chamadas/mês por 12 meses) para reduzir custo de compute.[[awsglossary](https://awsglossary.org/terms/free-tier)]
        
- **Banco PostgreSQL**
    
    - Amazon RDS: há oferta de free tier de 12 meses para instância micro (MySQL/PostgreSQL), com limite de horas e armazenamento (tipicamente ~20 GB).[[awsglossary](https://awsglossary.org/terms/free-tier)]
        
    - Depois disso, você pode mover para Aurora Serverless v2 ou EC2 + PostgreSQL manual, mas aí sai do “free”.
        
- **Storage**
    
    - Amazon S3: 5 GB de storage, 20.000 GET e 2.000 PUT por mês no free tier (12 meses) e alguns recursos always free dependendo da classe.[[aws.amazon](https://aws.amazon.com/free/free-tier-faqs/)]
        
    - CloudFront e outros serviços têm pequenas cotas gratuitas para entrega de conteúdo estático.[[awsglossary](https://awsglossary.org/terms/free-tier)]
        

Em termos de arquitetura, você poderia:

- Colocar o Node.js em uma **EC2 micro** ou container em ECS/Fargate usando free tier (nos primeiros 12 meses).
    
- Servir o React estático do S3 + CloudFront.
    
- Armazenar anexos no S3 e usar **RDS PostgreSQL** dentro do free tier.
    

Pró: muito próximo de um setup “enterprise”, documentação abundante e monitoramento de limites via API.[[aws.amazon](https://aws.amazon.com/free/free-tier-faqs/)]  
Contra: depois de 12 meses, é fácil estourar o free tier se o projeto crescer.

## 2. Azure Free Services (App Service + PostgreSQL + storage)

Azure combina **US$ 200 em crédito no primeiro mês** com serviços **always free** e um conjunto de serviços gratuitos por 12 meses.[[learn.microsoft](https://learn.microsoft.com/en-us/azure/postgresql/compute-storage/concepts-storage)]

Componentes relevantes:

- **Compute / app**
    
    - Azure App Service: há camadas gratuitas (F1/D1) que suportam pequenos sites ou APIs, útil para hospedar Node.js sem gerenciar VM.[[azure.microsoft](https://azure.microsoft.com/en-us/pricing/free-services/)]
        
    - Também é possível usar **Azure Functions** para um backend serverless com limites gratuitos mensais.[[azure.microsoft](https://azure.microsoft.com/en-us/pricing/free-services/)]
        
- **Banco PostgreSQL**
    
    - Azure Database for PostgreSQL (Flexible Server): tem níveis de entrada com oferta promocional (não exatamente always free, mas pode ser subsidiado por créditos iniciais).[[learn.microsoft](https://learn.microsoft.com/en-us/azure/postgresql/compute-storage/concepts-storage)]
        
    - Alternativa é rodar PostgreSQL em uma VM pequena, usando o crédito do primeiro mês.
        
- **Storage**
    
    - Blob Storage: está em lista de serviços “always free” com uma pequena quantidade de armazenamento e transações gratuitas.[[azure.microsoft](https://azure.microsoft.com/en-us/pricing/free-services/)]
        

Arquitetura possível:

- React estático em **Azure Static Web Apps** ou Blob + CDN dentro dos free services.[[azure.microsoft](https://azure.microsoft.com/en-us/pricing/free-services/)]
    
- Node.js hospedado em **App Service Free** ou Functions.
    
- PostgreSQL em uma instância pequena (talvez parcialmente coberta por 12-month free + crédito inicial).
    

Pró: integração boa com CI/CD, GitHub, pipelines, e você não precisa subir VM.[[azure.microsoft](https://azure.microsoft.com/en-us/pricing/free-services/)]  
Contra: o banco gerenciado PostgreSQL não é claramente “always free”; depende de promoções e créditos.

## 3. Google Cloud Free Tier (f1-micro + Cloud SQL + storage)

O Google Cloud oferece **US$ 300 em créditos** para novos clientes e um conjunto de recursos **always free**, incluindo VM e alguns serviços managed.[[cloud.google](https://cloud.google.com/sql/pricing)]

Componentes-chave:

- **Compute**
    
    - Compute Engine: 1 instância **f1-micro** (em algumas regiões dos EUA) sempre gratuita, com limite de horas mensais.[[serverfault](https://serverfault.com/questions/886242/can-i-use-windows-f1-micro-instance-in-google-cloud-platform-always-free-usage)]
        
    - Cloud Run / Cloud Functions também têm cotas mensais gratuitas para requests e compute.[[cloud.google](https://cloud.google.com/free)]
        
- **Banco PostgreSQL**
    
    - Cloud SQL: não tem um “always free” como o f1-micro, mas pode ser utilizado com parte dos US$ 300 de crédito em fase inicial.[[cloud.google](https://cloud.google.com/sql/pricing)]
        
- **Storage**
    
    - Cloud Storage: pequena quantidade de armazenamento e operações gratuitas como parte do free usage.[[cloud.google](https://cloud.google.com/free)]
        

Arquitetura possível:

- React em Cloud Storage + Cloud CDN ou em Firebase Hosting (que também tem free tier para projetos pequenos).
    
- Node.js em **Cloud Run** (container) ou em uma **VM f1-micro**.
    
- Banco de dados: PostgreSQL em Cloud SQL, consumindo créditos; ou PostgreSQL autopoiado na f1-micro (mais apertado).[[cloud.google](https://cloud.google.com/sql/pricing)]
    

Pró: boa experiência para containers (Cloud Run) e integração com CI/CD; free tier bem documentado.[[cloud.google](https://cloud.google.com/free)]  
Contra: DB gerenciado não é always free; você vai queimar créditos relativamente rápido.

## 4. DigitalOcean, Hetzner e similares

- **DigitalOcean**: não possui free tier de VM “always free”; oferece **US$ 200 de créditos por 60 dias**, 3 sites estáticos gratuitos no App Platform, funções serverless com cotas gratuitas e DNS grátis.[[agentdeals](https://agentdeals.dev/digitalocean-free-tier-2026)]
    
    - Você poderia hospedar o React em App Platform (static), usar Functions para partes do backend, mas para Node.js + PostgreSQL persistente você sairia do free rapidamente.[[agentdeals](https://agentdeals.dev/digitalocean-free-tier-2026)]
        
- **Hetzner**: conhecida pelo baixo custo, mas não oferece **always free**; o foco é preço agressivo por VM/cluster.[[agentdeals](https://agentdeals.dev/vendor/hetzner)]
    
    - Boa candidata para quando você aceitar pagar pouco por mês, mas não atende ao requisito de free tier.
        

Ou seja, esses players são excelentes para custo baixo, mas não resolvem “always free” para VM+DB+storage; são mais adequados para quando você sair dessa fase.[[agentdeals](https://agentdeals.dev/vendor/hetzner)]

## 5. Em relação ao que você já planejou (OCI + Aiven)

Sua solução atual:

- **2 VMs sempre free na OCI** para backend Node.js/React/K3s/K8s/Swarm.[[github](https://github.com/nce/oci-free-cloud-k8s)]
    
- **1 instância PostgreSQL no Aiven** para DB gerenciado.
    
- Storage em blocos/objetos na OCI para banco e anexos.
    

Esse setup é difícil de igualar 100% em outro provedor sem pagar nada, mas dá para chegar em algo funcional:

- AWS: EC2 micro + RDS PostgreSQL + S3 (12 meses) — bom para validar o produto e migrações futuras.[[aws.amazon](https://aws.amazon.com/free/free-tier-faqs/)]
    
- Azure: App Service + PostgreSQL + Blob (12 meses + always free) — menos controle de VM, mais PaaS.[[learn.microsoft](https://learn.microsoft.com/en-us/azure/postgresql/compute-storage/concepts-storage)]
    
- GCP: f1-micro + Cloud Run/Functions + Cloud SQL (via créditos) + Cloud Storage — mais serverless/container-focused.[[serverfault](https://serverfault.com/questions/886242/can-i-use-windows-f1-micro-instance-in-google-cloud-platform-always-free-usage)]
    

Se o requisito for **sempre free, para rodar em produção pequena**, **OCI continua sendo o campeão** em termos de generosidade (mais VMs, mais recursos). A alternativa mais pragmática é usar:

- **AWS** para um ambiente de teste/alternativo durante os primeiros 12 meses, replicando o stack com as limitações do free tier.[[awsglossary](https://awsglossary.org/terms/free-tier)]
    
- **Azure/GCP** como ambientes secundários para laboratório, usando os créditos iniciais e as instâncias always free para componentes menos críticos.[[cloud.google](https://cloud.google.com/free)]
    

---

Se quiser, posso montar uma **tabela comparando, para AWS/Azure/GCP/OCI, exatamente: tipo de compute free, DB relacional/free, storage free e prazo (sempre vs 12 meses)** para você decidir onde vale a pena replicar o ambiente de condomínio multitenant.


	"Gere a tabela"


Segue a tabela comparativa focada em **compute + banco relacional + armazenamento** em modo gratuito para o cenário React.js + Node.js + PostgreSQL, considerando **AWS, Azure, Google Cloud e OCI**.[[aws.amazon](https://aws.amazon.com/free/)]

> Observação: valores e limites podem mudar; sempre confira a página oficial de cada free tier antes de subir algo crítico.[[azure.microsoft](https://azure.microsoft.com/en-us/pricing/free-services/)]

## Recursos free por provedor (compute, DB, storage)

|Provedor|Compute free (tipo)|Tipo de gratuidade compute|Banco relacional/PG free|Tipo de gratuidade DB|Storage/objetos free|Tipo de gratuidade storage|
|---|---|---|---|---|---|---|
|**AWS**|EC2 instâncias micro (t2/t3.micro) com 750 h/mês para novos clientes, além de funções Lambda com 1M req/mês|**12 meses free** (EC2) + **always free** (Lambda e alguns outros serviços) [[awsglossary](https://awsglossary.org/terms/free-tier)]|Amazon RDS (incluindo PostgreSQL) em instâncias micro com horas limitadas por até 12 meses após criação da conta|**12 meses free** para instâncias elegíveis RDS/Aurora, limites de horas e armazenamento [[aws.amazon](https://aws.amazon.com/rds/free/)]|Amazon S3 com alguns GB de armazenamento e número limitado de requisições no free tier|Combinação de **12 meses free** e algumas cotas **always free** por serviço [[aws.amazon](https://aws.amazon.com/free/)]|
|**Azure**|App Service (camada gratuita para web/app), Azure Functions com 1M execuções/mês, além de VMs com uso limitado pelos US$ 200 de crédito inicial|**Always free** para App Service/Functions dentro de limites, + **12 meses free** para alguns serviços de compute, + **US$ 200** em crédito nos primeiros 30 dias [[azure.microsoft](https://azure.microsoft.com/en-us/pricing/free-services/)]|Azure Database for PostgreSQL (Flexible Server) pode ter ofertas de entrada e parte do uso coberto por 12 meses free/créditos; bancos totalmente always free não são destaque|Principalmente via **créditos iniciais** e promoções 12 meses; não há um Cloud SQL-like always free claro [[learn.microsoft](https://learn.microsoft.com/en-us/azure/postgresql/compute-storage/concepts-storage)]|Azure Blob Storage e outros serviços de armazenamento incluídos entre as 65+ ofertas always free, com limites de GB e operações por mês|**Always free** dentro dos limites listados + alguns serviços “12 meses free” [[azure.microsoft](https://azure.microsoft.com/en-us/pricing/free-services/)]|
|**Google Cloud**|1 instância f1-micro por mês em algumas regiões (sempre free), além de Cloud Run/Cloud Functions com cotas mensais gratuitas|**Always free** para f1-micro em regiões específicas e vários serviços (Cloud Run, Functions) + **US$ 300** de crédito por 90 dias [[cloud.google](https://cloud.google.com/free)][[youtube](https://www.youtube.com/watch?v=pmgGtqY53j0)]|Cloud SQL (PostgreSQL) não possui free tier pleno; o uso inicial é, na prática, coberto pelos **US$ 300** de crédito, depois passa a ser cobrado|Sem **always free** para Cloud SQL; uso gratuito depende dos créditos de boas-vindas [[cloud.google](https://cloud.google.com/sql/pricing)]|Cloud Storage com limites de armazenamento e operações mensais no free tier|Incluído no conjunto de mais de 20 produtos com **always free** até limites mensais [[cloud.google](https://cloud.google.com/free)][[youtube](https://www.youtube.com/watch?v=pmgGtqY53j0)]|
|**OCI (Oracle Cloud)**|VMs de pequeno porte (Ampere ARM e outras) com múltiplas instâncias **Always Free**, frequentemente citadas como mais generosas para compute|**Always free** com limite de número de OCPUs, RAM e instâncias, pensado para workloads pequenos/medianos [[github](https://github.com/nce/oci-free-cloud-k8s)]|Instâncias de banco (incluindo Autonomous DB) com capacidade limitada como parte do Always Free Tier|**Always free** para bancos de dados dentro dos limites de OCPUs/armazenamento permitidos [[atraca.com](https://atraca.com.br/servicos-de-nuvem-gratuitos/)]|Object Storage e Block Storage com certa quantidade de GB incluídos no Always Free Tier|**Always free** até os limites de GB/IOPS/documentados para conta Always Free [[atraca.com](https://atraca.com.br/servicos-de-nuvem-gratuitos/)]|

Nesta visão, para replicar o que você faz em **OCI + Aiven**, a combinação que chega mais perto, em termos de poder rodar React + Node + PostgreSQL com o mínimo de custo, é:

- **AWS**: EC2 micro + RDS PostgreSQL + S3 dentro de 12 meses free, depois revendo arquitetura.[[aws.amazon](https://aws.amazon.com/rds/free/)]
    
- **Azure**: App Service/Functions + PG (via Flexible Server) + Blob, com parte coberta por 12 meses/always free + créditos.[[agentdeals](https://agentdeals.dev/vendor/azure)]
    
- **GCP**: f1-micro/Cloud Run + Cloud SQL (coberto por créditos iniciais) + Cloud Storage, com foco em containers/serverless.[[cloud.google](https://cloud.google.com/free)]
    

Se quiser, posso derivar desta tabela **duas arquiteturas alternativas específicas** (por exemplo, “AWS minimal free” e “GCP minimal free”), com sizing de instância e limites aproximados pensando no seu multitenant de condomínios.


	"Faça isso"


Abaixo vão duas arquiteturas **free-tier first** para você validar uma solução multitenant de condomínios em React.js + Node.js + PostgreSQL, pensando em ambiente parecido com o que você quer na OCI + Aiven. A mais viável para ficar perto do “sempre grátis” continua sendo a OCI; as alternativas mais próximas são AWS e Azure, mas com mais limitações ou dependência de crédito inicial.[[aws.amazon](https://aws.amazon.com/free/)]

## Arquitetura 1: AWS free tier minimal

**Objetivo:** hospedar frontend, API e banco com o máximo possível dentro dos limites gratuitos.  
**Quando faz sentido:** protótipo, MVP pequeno, validação com poucos usuários e anexos modestos.[[repost](https://repost.aws/questions/QUy4aE4q5KTrGoCfwN3w7jZQ/how-much-is-amazon-aws-ec2-free-tier-bandwidth-limit)]

|Camada|Serviço|Gratuidade|Observação prática|
|---|---|---|---|
|Frontend React|S3 + CloudFront|free tier / limites mensais|Bom para site estático e baixo custo de entrega. [[aws.amazon](https://aws.amazon.com/free/)]|
|API Node.js|EC2 micro ou Lambda|12 meses free na EC2, always free em Lambda dentro de limites|Lambda reduz operação, mas pode exigir adaptação da API. [[aws.amazon](https://aws.amazon.com/free/)]|
|Banco PostgreSQL|RDS PostgreSQL|12 meses free para instâncias elegíveis|Serve para MVP, mas o free tier expira. [[aws.amazon](https://aws.amazon.com/rds/free/)]|
|Anexos/arquivos|S3|limites mensais gratuitos|Útil para fotos, boletos, documentos e uploads. [[aws.amazon](https://aws.amazon.com/free/)]|

**Leitura técnica:** essa opção é boa se você aceitar que o “free” é principalmente por **12 meses** para compute e DB, enquanto alguns serviços continuam com cotas gratuitas menores.[[aws.amazon](https://aws.amazon.com/rds/free/)]  
**Ponto forte:** stack muito próxima do padrão de mercado.  
**Ponto fraco:** depois do período gratuito, o custo sobe e você vai precisar controlar bem tráfego, armazenamento e requisições.[[aws.amazon](https://aws.amazon.com/free/)]

## Arquitetura 2: Azure free + créditos

**Objetivo:** usar serviços gratuitos permanentes e alguns meses iniciais cobertos por crédito/limites.  
**Quando faz sentido:** quando você quer menos operação de infraestrutura e aceita uma solução mais PaaS.[[azure.microsoft](https://azure.microsoft.com/en-us/pricing/free-services/)]

|Camada|Serviço|Gratuidade|Observação prática|
|---|---|---|---|
|Frontend React|Static Web Apps ou Blob + CDN|free / limites mensais|Bom para publicar SPA com CI/CD simples. [[azure.microsoft](https://azure.microsoft.com/en-us/pricing/free-services/)]|
|API Node.js|Azure Functions ou App Service Free|always free dentro de limites|Melhor para app pequeno e APIs leves. [[azure.microsoft](https://azure.microsoft.com/en-us/pricing/free-services/)]|
|Banco PostgreSQL|Azure Database for PostgreSQL|normalmente via créditos / ofertas de entrada|Não é o ponto mais forte do free tier. [[learn.microsoft](https://learn.microsoft.com/en-us/azure/postgresql/compute-storage/concepts-storage)]|
|Anexos/arquivos|Blob Storage|always free dentro de limites|Serve bem para documentos e mídia. [[azure.microsoft](https://azure.microsoft.com/en-us/pricing/free-services/)]|

**Leitura técnica:** Azure é atraente para o frontend e para funções leves, mas o PostgreSQL gerenciado não aparece como uma opção truly always free tão forte quanto a OCI.[[learn.microsoft](https://learn.microsoft.com/en-us/azure/postgresql/compute-storage/concepts-storage)]  
**Ponto forte:** muitos serviços free, boa integração com GitHub e tooling corporativo.  
**Ponto fraco:** o banco tende a depender mais de crédito e pode virar custo antes do esperado.[[azure.microsoft](https://azure.microsoft.com/en-in/pricing/free-services/)]

## Arquitetura 3: Google Cloud free tier

**Objetivo:** aproveitar VM pequena, storage e, se necessário, container/serverless.  
**Quando faz sentido:** se você quer testar abordagem mais moderna com containers e pouca gestão de servidor.[[cloud.google](https://cloud.google.com/free)]

|Camada|Serviço|Gratuidade|Observação prática|
|---|---|---|---|
|Frontend React|Cloud Storage para site estático|always free com limites|Pode servir SPA simples. [[cloud.google](https://cloud.google.com/free)]|
|API Node.js|Cloud Run ou VM f1-micro|always free / créditos|Cloud Run é mais flexível; VM é mais tradicional. [[cloud.google](https://cloud.google.com/free)]|
|Banco PostgreSQL|Cloud SQL|crédito inicial, não always free|É a parte mais fraca para operação sem custo contínuo. [[cloud.google](https://cloud.google.com/sql/pricing)]|
|Anexos/arquivos|Cloud Storage|always free com limites|Bom para anexos e imagens. [[cloud.google](https://cloud.google.com/free)]|

**Leitura técnica:** o GCP funciona bem para provar a aplicação, mas o PostgreSQL gerenciado não é gratuito de forma contínua; na prática, você consome os créditos iniciais.[[cloud.google](https://cloud.google.com/sql/pricing)]  
**Ponto forte:** bom para apps em container e serviços estáticos.  
**Ponto fraco:** banco gerenciado free é limitado ou inexistente.[[cloud.google](https://cloud.google.com/free)]

## Arquitetura 4: OCI como referência

**Objetivo:** manter a solução mais próxima do seu plano atual.  
**Quando faz sentido:** MVP real com mais chance de continuar sem custo por mais tempo.[[docs.oracle](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm)]

|Camada|Serviço|Gratuidade|Observação prática|
|---|---|---|---|
|Compute|VMs Always Free OCI|always free|É o ponto mais forte da OCI para seu caso. [[oracle](https://www.oracle.com/cloud/price-list/)]|
|Banco PostgreSQL|Autonomous DB / recursos free da OCI|always free dentro de limites|Melhor encaixe para seu uso gratuito prolongado. [[docs.oracle](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm)]|
|Armazenamento|Object Storage|always free com limite de 20 GB|Bom para anexos e arquivos do sistema. [[docs.oracle](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm)]|

**Leitura técnica:** para o seu cenário, a OCI segue sendo a opção mais consistente para manter compute, banco e storage no modelo gratuito por mais tempo.[[oracle](https://www.oracle.com/cloud/price-list/)]  
**Ponto forte:** é a única da lista que realmente se aproxima de um “stack completo free” com menos gambiarra.  
**Ponto fraco:** há limites de capacidade e você precisa dimensionar bem o uso de disco e CPU.[[docs.oracle](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm)]

## Escolha recomendada

Se você quer **replicar o seu MVP sem pagar** o máximo de tempo possível, a recomendação prática é:

1. **OCI** como base principal.[[oracle](https://www.oracle.com/cloud/price-list/)]
    
2. **AWS** como plano alternativo para validar arquitetura padrão de mercado, sabendo que o free é mais temporário.[[aws.amazon](https://aws.amazon.com/rds/free/)]
    
3. **Azure** como opção PaaS para frontend/API, se quiser simplificar operação.[[agentdeals](https://agentdeals.dev/vendor/azure)]
    
4. **GCP** como laboratório moderno com Cloud Run e storage, mas não como melhor opção para PostgreSQL gratuito contínuo.[[cloud.google](https://cloud.google.com/sql/pricing)]
    

Se você quiser, eu posso montar a próxima etapa em formato de **matriz de decisão** com colunas como: custo zero, facilidade de deploy, PostgreSQL gerenciado, storage para anexos, risco de cobrança e adequação para multitenancy.


	"É possível colocar o Frontend em um provedor de forma gratuita, o backend em outro, também gratuitamente e utilizar um banco gerenciado ou instalar um em uma VM gratuita em um terceiro provedor? A latência poderia ser tolerada pela gratuidade. O que me preocupa é viabilidade técnica e financeira (Seria seguro? Acabaria incorrendo em custos?) desta abordagem."

É tecnicamente possível separar frontend, backend e banco em provedores diferentes usando apenas camadas gratuitas, mas isso traz risco real de **custos inesperados** (principalmente de egress) e de **complexidade/segurança** que, em geral, não compensa para um SaaS pequeno como o seu.[[oracle](https://www.oracle.com/cloud/data-egress-costs/)]

## Viabilidade técnica

- **Funciona do ponto de vista de protocolo**:
    
    - React estático em um provedor (ex.: S3, Azure Static Web Apps, Cloud Storage).
        
    - Node.js em outro (ex.: Lambda/EC2, App Service, Cloud Run).
        
    - PostgreSQL gerenciado ou em VM em um terceiro (ex.: RDS/Cloud SQL/OCI VM).
        
    - Comunicação via HTTPS entre eles é trivial de implementar.[[cloudoptimo](https://www.cloudoptimo.com/blog/the-hidden-complexity-of-going-multi-cloud/)]
        
- **Latência**:
    
    - Se cada componente estiver em regiões geográficas diferentes, você soma RTTs de internet pública entre clouds, o que aumenta a latência e a variabilidade.[[megaport](https://www.megaport.com/blog/how-to-reduce-latency-in-your-multicloud-environment/)]
        
    - Como você mesmo colocou, a latência “poderia ser tolerada pela gratuidade”, mas isso só é aceitável se o seu SLA for bem relaxado.
        
- **Complexidade operacional**:
    
    - Multi-cloud aumenta a necessidade de padronizar IaC, observabilidade e IAM (você passa a gerenciar identidades, logs e pipelines em ambientes diferentes).[[newhorizons](https://www.newhorizons.com/resources/blog/multi-cloud-challenges)]
        
    - Há recomendações fortes para só adotar multi-cloud quando houver uma justificativa clara (compliance, features exclusivas, etc.) porque a operação fica mais cara e difícil.[[forbes](https://www.forbes.com/councils/forbestechcouncil/2025/02/06/multi-cloud-environments-balancing-cost-efficiency-and-security/)]
        

## Risco financeiro (custos escondidos)

O maior problema aqui não é a VM/DB em si, e sim **tráfego de saída (egress)**:

- **Egress entre clouds**:
    
    - Data ingress (entrando na nuvem) normalmente é gratuito, mas **data egress**, inclusive para outra nuvem ou internet, é cobrado pela maioria dos provedores.[[lowcloud](https://lowcloud.io/en/blog/cloud-egress-fees)]
        
    - Há grande variação: alguns cobram algo em torno de 0,05–0,09 USD/GB já nos primeiros GB além de pequenas cotas free.[[gpuperhour](https://gpuperhour.com/reference/data-egress)]
        
- **Sua arquitetura multi-cloud**:
    
    - Backend chamando um DB em outro provedor → todo tráfego de queries/respostas sai de uma nuvem para outra (cobrança no lado “saída”).
        
    - Frontend no Provedor A consumindo API no Provedor B → novamente tráfego de saída no B; se a API baixar arquivos do DB/Storage em C, você encadeia egress B→C e C→B dependendo do fluxo.[[oracle](https://www.oracle.com/cloud/data-egress-costs/)]
        
    - Em multi-cloud, a recomendação é justamente minimizar esse tráfego cruzado, porque pode virar a maior parte da conta.[[gpuperhour](https://gpuperhour.com/reference/data-egress)]
        
- **Free tiers não cobrem tudo**:
    
    - Free tier costuma dar uma pequena franquia de egress para internet (por exemplo, ~100 GB/mês em alguns casos), e depois cobra por GB.[[lowcloud](https://lowcloud.io/en/blog/cloud-egress-fees)]
        
    - Em ambientes multi-cloud, o volume do seu tráfego “interno” vira egress tarifado, porque está saindo para outra nuvem, não para o mesmo provedor.[[oracle](https://www.oracle.com/cloud/data-egress-costs/)]
        

Resultado: é relativamente fácil ficar dentro do free tier em compute/storage, mas escapar dele em **tráfego** se a app começa a gerar I/O intenso entre clouds.

## Segurança e confiabilidade

- **Superfície de ataque maior**:
    
    - Cada provedor traz seu modelo de IAM, segurança, logging, etc. Se um deles estiver mal configurado, pode expor dados ou permitir acesso indevido.[[fortinet](https://www.fortinet.com/resources/cyberglossary/multi-cloud-security)]
        
    - Multi-cloud mal governado é conhecido por gerar “gaps” de segurança (regras inconsistentes, falta de zero trust, monitoração fragmentada).[[fortinet](https://www.fortinet.com/resources/cyberglossary/multi-cloud-security)]
        
- **Gestão de credenciais**:
    
    - Você precisa gerenciar secrets (tokens, chaves, certificados) em múltiplos ambientes, o que aumenta o risco operacional.[[cloudoptimo](https://www.cloudoptimo.com/blog/the-hidden-complexity-of-going-multi-cloud/)]
        
- **Observabilidade e debugging**:
    
    - Problemas de performance ou falhas de rede ficam mais difíceis de isolar, porque você depende de logs distribuídos, traceroute entre clouds etc.[[megaport](https://www.megaport.com/blog/how-to-reduce-latency-in-your-multicloud-environment/)]
        

## Conclusão prática para o seu caso

Pensando no seu SaaS de condomínios:

- **Tecnicamente viável?**
    
    - Sim, você consegue colocar frontend, backend e DB em clouds diferentes. Do ponto de vista de protocolos e stack (React/Node/PostgreSQL), não há impedimento.[[fluence](https://www.fluence.network/blog/multi-cloud-architecture/)]
        
- **Financeiramente seguro?**
    
    - Não é garantido. Qualquer aumento de usuários ou volume de dados entre clouds pode estourar facilmente as cotas de egress e gerar cobrança, mesmo que compute e storage estejam no free tier.[[lowcloud](https://lowcloud.io/en/blog/cloud-egress-fees)]
        
    - Como você está mirando “gratuidade” e não apenas “baixo custo”, multi-cloud tende a **aumentar o risco** de contas surpresa, não reduzi-lo.
        
- **Recomendação pragmática**:
    
    - Se o objetivo é **MVP gratuito** ou o mais barato possível, é bem mais seguro concentrar ao máximo em um único provedor que tenha free tier generoso (como você já faz com **OCI**), eventualmente usando um segundo provider apenas para um componente bem isolado (por exemplo, CDN/Static Hosting) que tenha política clara de always-free.[[docs.oracle](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm)]
        
    - Se você ainda quiser experimentar multi-cloud free, faça:
        
        - Logging detalhado do tráfego entre serviços.
            
        - Alertas de billing em todos os provedores.
            
        - Limitação rígida de throughput (rate limits, caps) no backend para evitar explosão de egress.
            

Se quiser, posso te sugerir **dois desenhos mais “seguros”**:

1. tudo em OCI + um segundo provider só para CDN/Static Hosting;
    
2. tudo em AWS free-tier em uma única região, com fallback manual em OCI.


		"Eu quero duas ou três sugestões de deploy always free multi-cloud. Você disse que é possível, isso quer dizer que há ofertas always free para cada "pedaço" da aplicação (front, back e banco). Apresente 2 ou 3 sugestões."

É possível montar arquiteturas multi-cloud “always free” combinando ofertas específicas de front, back e banco, desde que você aceite limites bem apertados e controle de tráfego/egress. Abaixo vão três sugestões bem concretas, com foco em viabilidade técnica e risco financeiro controlado.[[htmlpub](https://htmlpub.com/blog/static-site-hosting-comparison-2026)]

---

## Sugestão 1: Front no Cloudflare, backend Node em Render, PostgreSQL no Aiven

**Objetivo:** tudo sempre free, sem cartão, com foco em simplicidade.

## Componentes

- **Frontend (React SPA)**
    
    - **Cloudflare Pages** ou similar (ex.: Netlify/Vercel Hobby, GitHub Pages).
        
    - Plataformas de static hosting listadas como gratuitas entregam HTML/CSS/JS com HTTPS e CDN global no plano free.[[hostmora](https://hostmora.com/blog/free-static-website-hosting/)]
        
    - Ideal para React buildado como site estático.
        
- **Backend (Node.js)**
    
    - **Render free Web Service** ou plataforma similar de Node free:
        
        - Comparativos recentes citam Render, Vercel (serverless functions), Netlify Functions, Suga, etc., como opções de hosting Node gratuito com limites de CPU/RAM e cold start.[[techbloat](https://www.techbloat.com/8-best-free-node-js-hosting-providers-apr-2026.html)]
            
        - Render, por exemplo, oferece um web service gratuito com ~512 MB de RAM, 0,1 CPU, que hiberna após inatividade e volta ao receber requisição (adequado para uso moderado).[[dev](https://dev.to/sparrowhawk705/seven-free-nodejs-hosting-platforms-worth-trying-in-2026-25c1)]
            
- **Banco de dados (PostgreSQL) – gerenciado**
    
    - **Aiven Free PostgreSQL**:
        
        - Plano sempre gratuito com ~1 GB de storage, ~1 GB de RAM, 1 CPU, sem limite de tempo, incluindo backups e rede, sem cartão de crédito.[[aiven](https://aiven.io/free-postgresql-database)]
            
        - Vários comparativos colocam Aiven e outras PaaS de PostgreSQL em listas de “free PostgreSQL hosting” com limites pequenos, mas permanentes.[[codeless](https://codeless.co/free-postgresql-hosting/)]
            

## Viabilidade técnica / financeira

- **Técnico:**
    
    - Latência extra entre Cloudflare/Render/Aiven é aceitável para app de gestão de condomínios sem SLA crítico, desde que o backend e DB estejam em regiões geográficas próximas.[[megaport](https://www.megaport.com/blog/how-to-reduce-latency-in-your-multicloud-environment/)]
        
    - Você precisa cuidar de CORS, autenticação e TLS ponto a ponto.
        
- **Financeiro:**
    
    - Frontend e backend têm planos realmente gratuitos para projetos pequenos; o risco maior é exceder limites de requisições ou CPU e ser forçado a upgrade, mas não há “cobrança surpresa” automática se você ficar nos free tiers.[[htmlpub](https://htmlpub.com/blog/static-site-hosting-comparison-2026)]
        
    - Aiven explicitamente se apresenta como always free para esse plano, sem cartão e sem time-box.[[aiven](https://aiven.io/free-postgresql-database)]
        

---

## Sugestão 2: Front no Firebase Hosting / Netlify, backend Node em AWS Lambda, DB PostgreSQL no Aiven

**Objetivo:** aproveitar serverless always free da AWS e um PostgreSQL gerenciado sempre free em terceiro provedor.

## Componentes

- **Frontend (React SPA)**
    
    - **Firebase Hosting** (ou Netlify):
        
        - Firebase Hosting é citado como free para sites estáticos com deploy simples e delivery rápido; Netlify/Vercel também têm planos hobby sempre free para static sites.[[dev](https://dev.to/vinishbhaskar/9-best-free-static-website-hosting-7ki)]
            
- **Backend (Node.js)**
    
    - **AWS Lambda + API Gateway**:
        
        - AWS tem 1 milhão de requisições/mês e uma quantidade de compute time sempre free em Lambda, além de free tier em API Gateway para volume baixo.[[aws.amazon](https://aws.amazon.com/free/)]
            
        - Backend em Node.js pode ser empacotado em funções Lambda, com endpoints no API Gateway.
            
- **Banco de dados (PostgreSQL)**
    
    - Novamente **Aiven Free PostgreSQL** (ou outro PaaS de PostgreSQL always free da lista curated de serviços gratuitos).[[github](https://github.com/alexeyfv/awesome-free-postgres)]
        

## Viabilidade técnica / financeira

- **Técnico:**
    
    - Lambda chamando Aiven via internet pública adiciona latência e exige boa gestão de conexões (pooling/conexão fria) para não estourar limites de conexão do plano free.[[codeless](https://codeless.co/free-postgresql-hosting/)]
        
    - Para Node serverless, é importante usar drivers ou layers que aguentem conexões curtíssimas e pooling reciclado.
        
- **Financeiro:**
    
    - Lambda e API Gateway têm cotas **always free** razoáveis; se você ficar abaixo de ~1M chamadas/mês e dentro dos limites de tempo/GB-segundo, não paga.[[cloudtoggle](https://www.cloudtoggle.com/blog-en/amazon-free-tier-aws/)]
        
    - Aiven continua always free; o ponto de atenção é o **egress** da AWS para internet (consulta ao Aiven). Para cargas pequenas, isso tende a ficar dentro ou perto das cotas free de saída ou gerar centavos, mas exige observabilidade de billing.[[lowcloud](https://lowcloud.io/en/blog/cloud-egress-fees)]
        

---

## Sugestão 3: Front no Cloudflare/Vercel, backend Node em OCI Always Free VM, PostgreSQL free em Aiven

**Objetivo:** reaproveitar as VMs always free da OCI como backend central, usando outros provedores para front e DB.

## Componentes

- **Frontend (React SPA)**
    
    - **Cloudflare Pages**, **Vercel (Hobby)** ou outra das 8 opções free comparadas (Netlify, GitHub Pages, etc.).[[hostmora](https://hostmora.com/blog/free-static-website-hosting/)]
        
    - Você builda o React em static files e faz deploy nesses providers.
        
- **Backend (Node.js)**
    
    - **OCI Always Free VM**:
        
        - Oracle Cloud oferece VMs Ampere/ARM e outros tipos como Always Free com limites de OCPUs/RAM que são considerados generosos para workloads pequenos.[[docs.oracle](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm)]
            
        - Você já planeja usar isso, e a mesma VM pode hospedar o backend Node (e até K3s/K8s/Swarm se quiser).
            
- **Banco de dados (PostgreSQL)**
    
    - **Aiven Free PostgreSQL** ou outro PaaS free como ElephantSQL/Scalingo/serviços citados em listas de “best free PostgreSQL hosting”, desde que as restrições de tamanho (20 MB–1 GB) sejam aceitáveis para o MVP.[[github](https://github.com/alexeyfv/awesome-free-postgres)]
        

## Viabilidade técnica / financeira

- **Técnico:**
    
    - Backend em OCI falando com Aiven via internet é similar ao caso anterior; a preocupação são latências e limites de conexão.[[cloudoptimo](https://www.cloudoptimo.com/blog/the-hidden-complexity-of-going-multi-cloud/)]
        
    - Frontend em Cloudflare/Vercel consome o backend em OCI via HTTPS, o que é trivial de configurar.
        
- **Financeiro:**
    
    - OCI VMs Always Free não têm limite de tempo; você só precisa cuidar de CPU, disco e egress, que têm limites definidos.[[oracle](https://www.oracle.com/cloud/price-list/)]
        
    - Front e DB permanecem em planos marcados como always free até os limites de uso; o grande risco aqui também é **tráfego de saída entre provedor e usuários**, que deve ser monitorado, mas em MVP costuma ser baixo.[[oracle](https://www.oracle.com/cloud/data-egress-costs/)]
        

---

## Notas importantes para todas as sugestões

- **Latência:**
    
    - Os três desenhos adicionam alguma latência inter-cloud, mas, para um sistema de gestão de condomínios free, isso é geralmente aceitável se você não estiver vendendo SLA agressiva.[[megaport](https://www.megaport.com/blog/how-to-reduce-latency-in-your-multicloud-environment/)]
        
- **Segurança:**
    
    - Cada novo provedor é outra superfície de ataque e outro painel de IAM. Aplicar boas práticas de multi-cloud security (segregação de credenciais, TLS end-to-end, monitoramento centralizado) é essencial mesmo em ambiente free.[[fortinet](https://www.fortinet.com/resources/cyberglossary/multi-cloud-security)]
        
- **Custos ocultos (egress):**
    
    - A peça mais delicada são custos de **data egress** entre clouds e para internet, que variam bastante entre provedores e podem ir de quase zero a >0,09 USD/GB.[[gpuperhour](https://gpuperhour.com/reference/data-egress)]
        
    - Para manter o “always free” na prática, vale:
        
        - Minimizar tráfego entre backend e DB (queries enxutas, compressão).
            
        - Colocar backend e DB em regiões geograficamente próximas.
            
        - Configurar alertas de billing e limites de orçamento em todos os provedores.[[lowcloud](https://lowcloud.io/en/blog/cloud-egress-fees)]
            

Se você quiser, eu posso pegar uma dessas três sugestões (por exemplo, “Cloudflare + Render + Aiven”) e desenhar um fluxo mais detalhado, incluindo diagrama textual de componentes, portas, TLS, e como você faria o deploy em pipeline (GitHub Actions/CI) respeitando esses free tiers.

---

# Reavaliação arquitetural das alternativas — 24/07/2026

## Escopo e critérios de eliminação

Esta seção reavalia as alternativas anteriores para o Burgoweb e deriva novos cenários híbridos. Complexidade de implantação, esforço operacional e quantidade de tecnologias não eliminam uma alternativa: são registrados para que seu valor como projeto de portfólio possa ser comparado.

Um cenário somente é considerado inviável quando apresenta pelo menos uma destas condições:

1. alta probabilidade de gerar custos, especialmente por tráfego de saída;
2. impossibilidade de proteger adequadamente os dados;
3. inviabilidade técnica ou funcionamento previsivelmente errático, como suspensões e timeouts recorrentes.

O baseline comparado é:

- frontend TanStack Start e API NestJS/Fastify separados, inicialmente implantados na mesma origem;
- uma VM OCI Ampere A1 com 2 OCPUs e 12 GB de RAM;
- K3s de nó único;
- PostgreSQL Free no Aiven;
- OCI Object Storage para Anexos, exportações e recuperação;
- SaltStack para provisionamento, configuração e deploy;
- telemetria OpenTelemetry exportada para uma solução externa.

## Correções factuais do levantamento anterior

### Render Free

A própria Render determina que instâncias gratuitas não sejam usadas para produção. O serviço hiberna após 15 minutos sem tráfego, leva aproximadamente um minuto para retornar e pode suspender aplicações gratuitas que gerem volume incomum de tráfego externo. Acesso contínuo ao Aiven e a um Object Storage é exatamente esse tipo de tráfego.

**Resultado:** eliminado por funcionamento potencialmente errático.

Fonte: [Render — Deploy for Free](https://render.com/docs/free).

### AWS Free Tier

Para contas novas, o programa geral mudou em julho de 2025 para créditos de até US$ 200 e plano gratuito por no máximo seis meses. Há serviços com cotas permanentes, mas a combinação antiga de EC2 e RDS gratuitos por doze meses não deve ser tratada como infraestrutura always free de produção.

**Resultado:** AWS permanece útil como laboratório, mas não como baseline gratuito permanente.

Fonte: [AWS — novo Free Tier](https://aws.amazon.com/about-aws/whats-new/2025/07/aws-free-tier-credits-month-free-plan/).

### Google Cloud

A VM permanente gratuita atual é `e2-micro`, restrita a regiões específicas dos Estados Unidos. Ela possui 30 GB de Persistent Disk e apenas 1 GB mensal de saída gratuita. Não há recursos suficientes para K3s, frontend, API e PostgreSQL no mesmo host com comportamento estável.

O Cloud Run possui franquia de compute, mas seu tráfego de saída para internet tem somente 1 GiB gratuito mensal na América do Norte. Uma API acessando continuamente um PostgreSQL em outro provedor transforma tráfego interno em egress faturável.

**Resultado:** VM inadequada por capacidade; Cloud Run inadequado como baseline por risco financeiro de egress.

Fontes: [Google Cloud Free Tier](https://docs.cloud.google.com/free/docs/free-cloud-features) e [Cloud Run Pricing](https://cloud.google.com/run/pricing).

### Azure App Service Free

O plano gratuito possui cota de 60 minutos de CPU por dia. Isso não representa uma aplicação disponível continuamente e pode produzir indisponibilidade sob carga normal de SSR e API.

**Resultado:** eliminado para o runtime público principal.

Fonte: [Azure — limites do App Service](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits).

### Cloudflare Workers e TanStack Start

TanStack Start possui integração oficial com Cloudflare Workers. Entretanto, o plano Workers Free limita cada invocação a 10 ms de CPU. A documentação do Cloudflare informa que SSR, autenticação e processamento mais pesado frequentemente consomem de 10 a 20 ms.

**Resultado:** tecnicamente interessante para conteúdo estático ou prerenderizado; SSR completo precisa de benchmark antes de ser considerado confiável.

Fontes: [TanStack Start — Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) e [Cloudflare Workers — Limits](https://developers.cloudflare.com/workers/platform/limits/).

## Cenários reavaliados e derivados

| Cenário | Custo provável | Segurança possível | Viabilidade | Valor de portfólio | Complexidade |
|---|---|---|---|---|---|
| A. OCI/K3s + Aiven + OCI Object Storage | Muito baixo | Sim | Boa, condicionada à medição OCI–Aiven | Alto | Alta |
| B. OCI/K3s + Aiven + R2 para Anexos + OCI para recuperação | Muito baixo com cotas rígidas | Sim | Muito boa | Muito alto | Alta |
| C. OCI/K3s + PostgreSQL no host + OCI Object Storage | Muito baixo | Sim | Condicionada a carga e restauração | Muito alto | Muito alta |
| D. OCI/K3s + PostgreSQL no host + R2 para Anexos + OCI para recuperação | Muito baixo com cotas rígidas | Sim | Condicionada a carga e restauração | Máximo | Muito alta |
| E. TanStack Start no Cloudflare + API OCI + Aiven + R2 | Baixo | Sim | Condicionada ao limite de CPU do Workers | Muito alto | Muito alta |
| F. Duas VMs OCI, aplicação e banco separados | Muito baixo | Sim | Viável sem K3s suportado | Alto | Muito alta |
| G. Lambda/Cloud Run + banco externo + R2 | Médio ou alto | Sim | Possível, mas com egress e conexões delicados | Alto para serverless | Alta |
| H. Render Free + Aiven | Baixo | Sim | Errática | Médio | Média |
| I. Docker Compose + Salt + Aiven + storage híbrido | Muito baixo com cotas rígidas | Sim | Muito boa | Muito alto | Média/alta |
| J. Duas VMs OCI: aplicação Docker e operações externas | Muito baixo | Sim | Boa, com observabilidade dimensionada | Máximo | Muito alta |

### Cenário A — baseline atual

```text
Internet
   │
OCI Load Balancer
   │
OCI A1: K3s, TanStack Start e NestJS
   ├── Aiven PostgreSQL Free
   └── OCI Object Storage
```

Pontos fortes:

- 2 OCPUs e 12 GB permitem executar K3s em configuração oficialmente suportada;
- Aiven remove a administração diária do PostgreSQL;
- OCI oferece 20 GB de Object Storage e 10 TB mensais de saída;
- o runtime permanece concentrado em um host, sem alegação de alta disponibilidade.

Limitações:

- Aiven Free possui 1 GB de disco, 20 conexões, nó único e nenhum pooling gerenciado;
- não é possível escolher sua região e o provedor pode alterá-la;
- Anexos, exportações e cópias independentes concorrem pelos mesmos 20 GB;
- K3s consome recursos para um plano de controle que não tem outro nó para coordenar.

### Cenário B — storage híbrido

```text
                         ┌── Aiven PostgreSQL Free
OCI A1 / K3s ────────────┤
TanStack Start + NestJS  ├── Cloudflare R2: Anexos
                         └── OCI Object Storage: recuperação e exportações
```

O R2 oferece gratuitamente 10 GB-mês, 1 milhão de operações de classe A, 10 milhões de operações de classe B e saída sem cobrança. Isso permite reservar o OCI Object Storage para recuperação e exportações e utilizar o R2 para os Anexos do produto.

O risco financeiro é controlável se:

- somente a aplicação puder gravar no bucket;
- o bucket for privado;
- a cota física global da aplicação for inferior à franquia, por exemplo 8 GB;
- uploads forem recusados antes que a reserva seja superada;
- credenciais sejam limitadas ao bucket e às operações estritamente necessárias;
- URLs assinadas tenham validade curta e nunca sejam persistidas.

Fonte: [Cloudflare R2 — Pricing](https://developers.cloudflare.com/r2/pricing/).

### Cenário C — PostgreSQL autogerenciado no host OCI

```text
OCI A1 — 2 OCPUs / 12 GB
├── PostgreSQL 18 como serviço do host
└── K3s
    ├── TanStack Start
    ├── NestJS
    └── workers
         │
         └── OCI Object Storage
```

O PostgreSQL ficaria fora do K3s e seria configurado pelo SaltStack. Isso evita que uma alteração do cluster ou do volume de um pod seja também uma alteração do banco.

Ganhos:

- elimina o limite de 1 GB e 20 conexões do Aiven;
- banco não precisa ser exposto à internet;
- latência local baixa e região conhecida;
- controle completo de PostgreSQL, extensões, WAL, backups e parâmetros;
- elevado valor demonstrativo de administração e recuperação.

Custos arquiteturais:

- aplicação e banco compartilham CPU, disco e domínio de falha;
- o operador assume patches, WAL, backup, restauração e verificação;
- os dois OCPUs precisam sustentar simultaneamente K3s, aplicações e banco;
- nenhuma decisão pode ser final sem teste de carga e ensaio de restauração.

Não é inviável e não configura quebra de segurança. A ausência de HA precisa apenas ser documentada, acompanhada por RPO/RTO realistas e compensada por recuperação externa testada.

### Cenário D — PostgreSQL autogerenciado e storage híbrido

```text
Cloudflare R2
    │ Anexos
    │
OCI A1
├── PostgreSQL 18 no host
└── K3s
    ├── TanStack Start
    ├── NestJS
    └── workers
         │
         └── OCI Object Storage: recuperação e exportações
```

É o cenário de maior densidade técnica: K3s, SaltStack, PostgreSQL, recuperação, S3 multicloud e observabilidade. Também é o cenário que mais pressiona os dois OCPUs. Seu valor de portfólio é máximo, mas a decisão depende de evidência de capacidade.

### Cenário E — frontend no edge

O TanStack Start pode executar no Cloudflare Workers e a API NestJS permanecer na OCI. Isso demonstra edge SSR e separação pública real de frontend e backend. O plano gratuito, porém, pode interromper SSR que ultrapasse 10 ms de CPU.

Uma variante segura é publicar somente landing page e conteúdo prerenderizado no Cloudflare, mantendo a aplicação autenticada na OCI. Ela evita erros de SSR, mas cria dois modos de implantação para pouco ganho funcional.

### Cenário F — duas VMs OCI com separação de aplicação e banco

O limite total pode ser dividido em duas VMs de 1 OCPU e 6 GB. Isso permite aplicação em uma VM e PostgreSQL em outra, conectados pela rede privada OCI.

O servidor K3s exige oficialmente 2 cores e 2 GB, sem incluir os workloads. Portanto:

- duas VMs com Docker Compose ou Swarm são viáveis;
- duas VMs de 1 OCPU com um servidor K3s não formam uma configuração suportada;
- uma VM com 2 OCPUs e K3s permanece suportada.

Fonte: [K3s — Requirements](https://docs.k3s.io/installation/requirements).

## Bancos PostgreSQL gratuitos

| Serviço | Capacidade gratuita | Comportamento | Adequação ao Burgoweb |
|---|---|---|---|
| Aiven | 1 GB, 1 CPU, 1 GB RAM, 20 conexões | sem prazo; pode desligar por inatividade; região não selecionável | melhor baseline gerenciado |
| Neon | 0,5 GB e 100 CU-h por projeto/mês | scale-to-zero, pooling e restauração de seis horas | alternativa técnica e ambiente de teste |
| Supabase | 500 MB de banco, 1 GB de arquivos, 5 GB de egress | pausa após baixa atividade e pode entrar em somente leitura | inferior ao Aiven para o baseline |
| Render PostgreSQL | 1 GB | expira em 30 dias e não possui backup | inviável |

Fontes: [Aiven Free](https://aiven.io/docs/products/postgresql/concepts/pg-free-tier), [Neon Free](https://neon.com/pricing) e [Supabase Free](https://supabase.com/docs/guides/platform/billing-on-supabase).

## Reavaliação do runtime: remover K3s

### Ganho mensurável

K3s é leve em comparação com Kubernetes convencional, mas não é gratuito em recursos. O perfil oficial mediu aproximadamente 1,6 GB de RAM para um servidor K3s de nó único com workload simples. Esse número não inclui agentes de gerenciamento do host, imagens nem o consumo específico do Burgoweb.

Fonte: [K3s — Resource Profiling](https://docs.k3s.io/reference/resource-profiling).

Ao substituir K3s por Docker Engine + Compose, deixam de existir no host:

- API Server;
- Controller Manager;
- Scheduler;
- datastore do cluster;
- kubelet, kube-proxy e CNI;
- Traefik e ServiceLB empacotados pelo K3s, quando não substituídos;
- reconciliação e objetos Kubernetes que não oferecem redundância em um único nó.

Os recursos recuperados podem ser entregues ao Node.js, PostgreSQL, cache de imagens, processamento de exportações ou margem para picos.

### O que se perde

- manifests e APIs Kubernetes como contrato de implantação;
- reconciliação declarativa mais rica;
- rolling update e rollback padronizados;
- readiness/liveness probes integrados ao scheduler;
- namespaces, NetworkPolicies e ServiceAccounts;
- caminho direto para acrescentar nós no futuro;
- demonstração explícita de Kubernetes no portfólio.

Em um nó único, K3s reinicia containers, mas não consegue realocá-los quando a própria VM falha. Docker possui restart policies e healthchecks, embora não ofereça toda a reconciliação de Kubernetes.

### Como SaltStack substitui a camada de operação

SaltStack pode governar:

- pacotes e hardening do host;
- Docker Engine e plugins;
- arquivos Compose renderizados a partir de Pillar;
- secrets entregues ao host com permissões restritas;
- imagens fixadas por digest;
- redes, volumes e limites de CPU/memória;
- execução idempotente de `docker compose up`;
- healthchecks e verificação pós-deploy;
- retenção da composição e dos digests anteriores para rollback;
- timers de backup, limpeza e manutenção.

Docker Compose não deve ser usado apenas como um comando manual. O contrato de deploy deve ser Compose versionado + estados Salt idempotentes + verificação de saúde + rollback automatizado.

### Avaliação

Remover K3s **vale a pena arquiteturalmente** se o objetivo principal for maximizar recursos úteis e permitir que SaltStack seja o verdadeiro plano de controle operacional. O ganho não é somente simplicidade: recupera aproximadamente 1,6 GB de baseline, reduz I/O do plano de controle e possibilita dividir os recursos OCI em duas VMs de 1 OCPU/6 GB.

Manter K3s vale a pena se Kubernetes for uma demonstração deliberada do portfólio e existir intenção concreta de testar migração para múltiplos nós. Nesse caso, deve ser apresentado como experiência de implantação Kubernetes, não como mecanismo de alta disponibilidade.

Para o Burgoweb, Docker Compose + SaltStack é tecnicamente tão defensável quanto K3s e se alinha melhor ao número real de nós.

## Salt Master e observabilidade externos

### Salt Master externo

Um Salt Master externo é coerente: se a VM da aplicação ficar indisponível, o plano de gerenciamento continua disponível para diagnóstico e reprovisionamento. A aplicação já implantada também continua executando caso o Master fique indisponível; apenas novas ordens e atualizações ficam suspensas.

O Minion conecta-se ao Master e utiliza os canais Salt nas portas TCP 4505 e 4506. Essas portas não devem ficar abertas indistintamente para a internet. A ligação deve usar rede privada sobre WireGuard/Tailscale ou regras de firewall limitadas ao endereço da VM, mantendo a autenticação PKI do Salt.

Fonte: [Salt — walkthrough e portas](https://docs.saltproject.io/en/3008/topics/tutorials/walkthrough.html).

### Um Minion não substitui telemetria

Salt Minion é agente de configuração e execução remota, não um pipeline completo de observabilidade. Para métricas, logs e traces ainda é necessário pelo menos um componente leve no host:

- OpenTelemetry Collector ou `otelcol-contrib`;
- métricas de host por receiver compatível, `node_exporter` ou agente equivalente;
- coleta de logs do Docker;
- SDK OpenTelemetry nas aplicações.

O Collector pode agrupar, filtrar, aplicar limites e exportar dados ao ambiente externo. Seu consumo é muito inferior ao de manter OpenSearch localmente.

### OpenSearch em uma micro-VM always free

OpenSearch não é uma boa carga para VMs always free de 1 GB. O heap padrão é 1 GB e a recomendação oficial é reservar aproximadamente metade da memória do host para o heap, deixando o restante para sistema operacional, cache de páginas e memória nativa. OpenSearch Dashboards e Salt Master também precisam de memória adicional. Swap degrada estabilidade e desempenho.

Fonte: [OpenSearch — instalação e memória](https://docs.opensearch.org/latest/install-and-configure/install-opensearch/index/).

Consequências:

- GCP `e2-micro` de 1 GB: inviável para OpenSearch;
- OCI AMD Micro de 1 GB, quando disponível: inviável para OpenSearch;
- AWS/Azure com créditos: funcionam temporariamente, mas não são always free;
- Salt Master sozinho pode caber em micro-VM, mas não deve dividir 1 GB com OpenSearch e Dashboards.

### Cenário J — duas VMs Ampere OCI sem K3s

Uma combinação tecnicamente interessante é dividir a franquia A1:

```text
VM de aplicação — 1 OCPU / 6 GB
├── Salt Minion
├── Docker Compose
│   ├── reverse proxy
│   ├── TanStack Start
│   ├── NestJS/Fastify
│   └── workers
└── OpenTelemetry Collector

VM de operações — 1 OCPU / 6 GB
├── Salt Master
├── OpenSearch single-node
├── OpenSearch Dashboards
└── recepção OpenTelemetry

Serviços externos
├── Aiven PostgreSQL
├── R2 para Anexos
└── OCI Object Storage para recuperação
```

Com 6 GB, OpenSearch single-node de baixa ingestão pode ser experimentado com heap limitado, retenção curta, poucos shards e limites explícitos. A configuração ainda exige benchmark de ingestão, consulta e pressão de memória. Um OCPU pode causar atraso durante indexação ou merge, mas não torna o cenário automaticamente inviável para o volume inicial.

Essa divisão não deve hospedar também PostgreSQL autogerenciado na VM da aplicação sem novo ensaio, pois 1 OCPU passaria a atender frontend, API, exports e banco.

### Alternativa leve ao OpenSearch

Se OpenSearch não se mantiver estável em 1 OCPU/6 GB, a infraestrutura de operações pode preservar OpenTelemetry e substituir o backend por componentes mais leves:

```text
OpenTelemetry Collector
├── VictoriaMetrics single-node: métricas
├── VictoriaLogs ou Loki: logs
├── Tempo: traces, se necessário
└── Grafana: consulta, dashboards e alertas
```

VictoriaMetrics single-node é distribuído como executável único, permite limites explícitos de memória e ingestão e foi projetado para uso reduzido de recursos. A seleção final precisa ser feita pelo projeto privado de observabilidade, não pela arquitetura interna do Burgoweb. O contrato do Burgoweb deve permanecer OpenTelemetry e formatos padronizados.

Fonte: [VictoriaMetrics single-node](https://docs.victoriametrics.com/victoriametrics/single-server-victoriametrics/).

## Comparação direta: K3s ou Docker + Salt

| Critério | K3s em uma VM 2/12 | Docker + Salt em uma VM 2/12 | Docker + Salt em duas VMs 1/6 |
|---|---|---|---|
| Recursos para workloads | menores | maiores | divididos por função |
| Isolamento da observabilidade | externo obrigatório | externo obrigatório | bom, em VM separada |
| Alta disponibilidade | não | não | não; apenas domínios de processo separados |
| Restart de container | sim | sim | sim |
| Reconciliação declarativa | forte | implementada por Salt/Compose | implementada por Salt/Compose |
| Rolling update | nativo | precisa ser automatizado | precisa ser automatizado |
| Expansão futura para cluster | direta | exige migração | exige migração |
| Diagnóstico do host | mais camadas | mais direto | mais direto |
| Valor Kubernetes no portfólio | alto | nenhum | nenhum |
| Valor Salt/automação | médio | alto | muito alto |
| Valor observabilidade | depende do serviço externo | depende do serviço externo | muito alto |
| Adequação ao número real de nós | aceitável | excelente | excelente |

## Conclusão provisória

Há ganho real ao remover K3s. Para um único nó, Docker Compose governado pelo SaltStack entrega o ciclo necessário com menor consumo e menos componentes concorrendo por CPU, RAM e I/O. Isso não empobrece obrigatoriamente o portfólio: troca a demonstração de Kubernetes por uma demonstração mais profunda de configuração idempotente, deploy automatizado, rollback, observabilidade e recuperação.

As duas opções mais fortes passam a ser:

1. **Docker + Salt na VM 2/12, Aiven, R2 para Anexos e OCI Object Storage para recuperação**, usando observabilidade externa já existente ou gerenciada;
2. **duas VMs OCI 1/6**, uma para aplicação e outra para Salt Master + observabilidade, mantendo Aiven como banco.

Não foi identificada outra oferta always free permanente e confirmada com memória suficiente para hospedar de forma confiável Salt Master + OpenSearch + Dashboards. Portanto, essa parte não deve ser baseada na expectativa de encontrar uma micro-VM gratuita externa de 1 GB.

Se a VM de operações usar OpenSearch, o cenário de duas VMs OCI é experimental até passar por benchmark. Se a prioridade for confiabilidade dentro da franquia, a solução de observabilidade mais leve é preferível, mantendo OpenTelemetry como contrato para que OpenSearch possa ser introduzido posteriormente sem alteração da aplicação.

---

## Prometheus e Grafana como alternativa ao OpenSearch — 24/07/2026

### O que é realmente substituído

Prometheus e Grafana não são substitutos integrais de OpenSearch e OpenTelemetry porque cada componente ocupa uma função diferente:

| Componente | Função principal |
|---|---|
| Prometheus | coleta, armazenamento e consulta de métricas |
| Grafana | dashboards, exploração e alertas |
| OpenSearch | indexação e consulta de logs e documentos |
| OpenTelemetry | padrão e pipeline para métricas, logs e traces; não é necessariamente o armazenamento |

Prometheus + Grafana substituem muito bem a parte de **métricas, dashboards e alertas operacionais**. Eles não entregam, sozinhos, pesquisa centralizada de logs nem armazenamento de traces.

Para o Burgoweb inicial, isso pode ser suficiente se o baseline observável for explicitamente limitado a:

- métricas do host, Docker, frontend server, API, workers e banco acessível;
- healthchecks e disponibilidade externa;
- alertas de capacidade, erros, latência, fila e backup;
- logs estruturados com `correlation_id`, mantidos localmente por retenção curta e protegidos por rotação;
- eventos de auditoria funcional preservados no PostgreSQL, separados de logs técnicos;
- diagnóstico de traces adiado até existir necessidade demonstrada.

Se pesquisa centralizada de logs for requisito de lançamento, Prometheus + Grafana não bastam. Seria necessário acrescentar Loki/VictoriaLogs ou manter OpenSearch. Se traces distribuídos forem necessários, seria preciso Tempo ou outro backend compatível com OTLP.

### Consumo comparativo

OpenSearch utiliza JVM, heap, memória nativa e cache de páginas. A recomendação oficial é destinar aproximadamente metade da memória disponível ao heap e evitar swap. OpenSearch Dashboards acrescenta outro processo relevante.

Prometheus é um único processo Go e seu consumo depende principalmente de:

- quantidade de séries ativas;
- cardinalidade de labels;
- frequência de scrape;
- duração e tamanho da retenção;
- quantidade e complexidade das consultas.

Grafana utiliza banco SQLite no cenário pequeno e pode executar com consumo moderado quando não há plugins ou consultas pesadas. Para o volume de um único host Burgoweb, Prometheus + Grafana são substancialmente mais leves que OpenSearch + Dashboards.

Prometheus permite limitar retenção por tempo e tamanho. A documentação recomenda manter a retenção em no máximo 80–85% do espaço reservado, preservando margem para WAL e compactação.

Fonte: [Prometheus — Storage](https://prometheus.io/docs/prometheus/latest/storage/).

### Topologia de coleta recomendada

Não é necessário expor o endpoint Prometheus da aplicação diretamente na internet. O modelo preferível é push controlado a partir da VM monitorada:

```text
VM OCI da aplicação
├── Salt Minion
├── aplicações instrumentadas
├── métricas de host e containers
└── Grafana Alloy ou Prometheus Agent
        │
        │ HTTPS + remote_write
        ▼
VM externa de operações
├── Salt Master
├── Prometheus receiver/server
├── Grafana
└── Alertmanager ou alertas do Grafana
```

Grafana Alloy empacota componentes do OpenTelemetry Collector e exporters Prometheus. Ele pode coletar métricas do host, Docker e aplicações, receber OTLP e enviar `remote_write`. Isso permite um único agente leve na VM além do Salt Minion e mantém a possibilidade de adicionar logs e traces posteriormente.

Fontes: [Grafana Alloy — Application Observability](https://grafana.com/docs/opentelemetry/collector/grafana-alloy/) e [Alloy como agregador](https://grafana.com/docs/alloy/latest/configure/proxy/).

### Tráfego e egress

O tráfego tende a ser pequeno porque:

- métricas são amostras numéricas compactadas;
- o envio pode ocorrer em lotes por `remote_write`;
- a VM externa recebe ingress, normalmente gratuito;
- Prometheus e Grafana comunicam-se localmente na VM operacional;
- Salt transmite estados, comandos e resultados pequenos;
- alertas geram poucas chamadas externas;
- o acesso humano ao Grafana é ocasional.

No Google Cloud Free Tier, a `e2-micro` inclui 1 GB mensal de saída, 30 GB de Persistent Disk e execução mensal gratuita em regiões específicas dos Estados Unidos. O fluxo proposto consome principalmente **ingress** na GCP. O egress será composto por páginas e consultas do Grafana, alertas e respostas Salt.

Fonte: [Google Cloud Free Tier](https://docs.cloud.google.com/free/docs/free-cloud-features).

Assim, é razoável esperar que métricas e Salt permaneçam abaixo de 1 GB mensal de saída, mas isso precisa ser medido. Logs consultados ou exportados em massa podem alterar esse resultado e devem possuir retenção, compressão e limites próprios.

### Capacidade de uma VM always free externa

Uma GCP `e2-micro` possui aproximadamente 1 GB de RAM. Nela, a combinação abaixo é tecnicamente possível como experimento muito pequeno:

- Salt Master com poucos workers;
- Prometheus com baixa cardinalidade;
- scrape entre 30 e 60 segundos;
- retenção de 3 a 7 dias e limite por tamanho;
- Grafana sem plugins e com poucos dashboards;
- Alertmanager ou alertas simples do Grafana.

Entretanto, 1 GB deixa pouca margem para sistema operacional, compactação do Prometheus, consultas do Grafana e processos do Salt. Picos podem provocar OOM ou pressão de I/O. Portanto, essa configuração não deve ser declarada confiável antes de um soak test que cubra:

- ingestão contínua por pelo menos sete dias;
- compactação da TSDB;
- abertura simultânea dos dashboards principais;
- execução de highstate Salt;
- disparo de alertas;
- reinicialização e recuperação do WAL;
- consumo de disco e tráfego mensal projetado.

**Veredito:** egress favorável, memória limítrofe.

### Alternativas de implantação

#### Opção P1 — GCP `e2-micro` com Salt + Prometheus + Grafana

```text
OCI 2 OCPU / 12 GB
└── Docker + aplicações + Alloy + Salt Minion

GCP e2-micro / 1 GB
└── Salt Master + Prometheus + Grafana
```

Vantagens:

- multicloud real;
- plano operacional permanece acessível quando a OCI falha;
- egress provavelmente baixo;
- 30 GB de disco permitem retenção curta confortável;
- forte valor de portfólio.

Riscos:

- RAM sem margem;
- CPU compartilhada e suscetível a throttling;
- consultas e compactação podem concorrer com Salt;
- não inclui logs centralizados nem traces.

Status: **condicionada a benchmark; não inviável, mas limítrofe**.

#### Opção P2 — GCP `e2-micro` somente para Salt Master

```text
GCP e2-micro
└── Salt Master

Observabilidade
└── serviço gerenciado gratuito ou projeto privado existente
```

Essa opção é mais segura para o Salt Master, mas deixa de demonstrar a pilha Prometheus/Grafana autogerenciada na mesma VM.

Status: **viável e estável**, sujeito aos limites normais da oferta gratuita.

#### Opção P3 — duas VMs OCI A1 de 1 OCPU/6 GB

```text
VM de aplicação 1/6
└── Docker + aplicações + Alloy + Salt Minion

VM operacional 1/6
└── Salt Master + Prometheus + Grafana
```

Prometheus e Grafana possuem margem muito maior em 6 GB que OpenSearch. A VM operacional pode manter retenção mais longa e consultas mais confortáveis. A VM de aplicação também deixa de pagar o custo de aproximadamente 1,6 GB do K3s.

Status: **melhor opção totalmente autogerenciada dentro da franquia OCI**, embora não seja multicloud.

#### Opção P4 — backend de métricas ainda mais leve

```text
VM externa de 1 GB
├── Salt Master
├── VictoriaMetrics single-node
└── Grafana
```

Grafana Alloy continua coletando métricas no host e usa `remote_write`. VictoriaMetrics implementa a API Prometheus e tende a consumir menos memória para a mesma carga. Essa opção preserva dashboards, PromQL/MetricsQL e alertas, com maior chance de estabilidade em 1 GB.

Status: **melhor candidata para uma micro-VM multicloud de 1 GB**, a confirmar por benchmark.

### Segurança da comunicação intercloud

O ambiente deve adotar:

- WireGuard ou outra malha privada entre as VMs;
- portas Salt 4505/4506 acessíveis apenas pela malha privada;
- Grafana não exposto publicamente ou protegido por autenticação forte, TLS e allowlist/VPN;
- `remote_write` autenticado e cifrado;
- Prometheus sem endpoint administrativo público;
- credenciais separadas para Salt, métricas e alertas;
- retenção sem dados pessoais nos labels;
- proibição de CPF, e-mail, nome, token ou identificador sensível como label Prometheus;
- backups das configurações, regras e dashboards; métricas históricas podem ser descartáveis conforme política operacional.

### Conclusão desta alternativa

Prometheus + Grafana atendem melhor ao tamanho do Burgoweb que OpenSearch quando o objetivo inicial é operação, capacidade, alertas e diagnóstico de disponibilidade. A redução de recursos é substancial.

A decisão correta não é remover obrigatoriamente OpenTelemetry, mas manter um coletor portátil como Grafana Alloy na aplicação. Alloy conserva compatibilidade com Prometheus e OTLP e permite acrescentar Loki, Tempo, OpenSearch ou outro backend no futuro sem reinstrumentar o código.

A recomendação passa a ser:

1. Docker Compose + SaltStack no lugar de K3s;
2. Grafana Alloy na VM da aplicação;
3. Prometheus + Grafana como baseline de observabilidade;
4. logs estruturados locais com retenção curta inicialmente;
5. Loki/VictoriaLogs somente quando a centralização de logs demonstrar valor;
6. traces mantidos como capacidade futura, não como requisito de lançamento;
7. experimentar GCP `e2-micro`, mas aprová-la somente após soak test;
8. usar VictoriaMetrics + Grafana se Prometheus + Grafana + Salt excederem a memória disponível.

---

## Aplicação e PostgreSQL em containers na OCI, operação na GCP — 24/07/2026

### Desenho avaliado

```text
Usuário
  │
  ▼
OCI Load Balancer
  │
  ▼
VM OCI Ampere A1 — 2 OCPUs / 12 GB
├── Salt Minion
├── Grafana Alloy
└── Docker Compose
    ├── reverse-proxy
    ├── web: TanStack Start
    ├── api: NestJS + Fastify
    ├── postgres: PostgreSQL 18
    └── jobs efêmeros: migrations, backup e restore-check

GCP e2-micro
├── Salt Master
├── Prometheus ou VictoriaMetrics
└── Grafana + alertas

Storage externo
├── Cloudflare R2: Anexos
└── OCI Object Storage: backups e exportações
```

Frontend, backend e PostgreSQL são os três workloads permanentes principais, mas um proxy reverso pequeno continua necessário para roteamento e mesma origem. Migrações, backups e verificações devem executar como containers efêmeros, não como daemons permanentes.

### Comparação com o baseline OCI + K3s + Aiven

| Dimensão | K3s + Aiven | Docker + PostgreSQL local |
|---|---|---|
| RAM do plano de controle | aproximadamente 1,6 GB para K3s | não existe |
| Banco disponível | 1 GB | limitado pelo Block Volume reservado |
| Conexões | 20 no serviço Aiven Free | configurável e limitado pela capacidade real |
| Latência API–banco | internet intercloud | rede Docker local |
| Região do banco | não selecionável | mesma região e host da aplicação |
| Operação PostgreSQL | Aiven | responsabilidade do Burgoweb |
| Domínio de falha | banco separado da VM | aplicação e banco caem com a VM |
| Recuperação | backup Aiven + cópia independente | backup, WAL e restore totalmente governados pelo projeto |
| Portfólio | K3s + banco gerenciado | Docker, Salt, PostgreSQL, backup e DR |
| Risco de custo | muito baixo | muito baixo |

O novo cenário remove dois gargalos importantes — Aiven Free e K3s — e os substitui por responsabilidade operacional explícita. Isso é uma troca arquitetural válida, não uma simplificação fictícia.

### Orçamento inicial de memória

Uma distribuição inicial para teste, não um compromisso definitivo, é:

| Componente | Reserva de planejamento | Limite inicial sugerido |
|---|---:|---:|
| Sistema operacional, Docker, Salt Minion e Alloy | 1–1,5 GB | controlado no host |
| PostgreSQL | 2,5–3 GB | 4 GB |
| API NestJS/Fastify | 1–1,5 GB | 2 GB |
| TanStack Start | 0,5–1 GB | 1,5 GB |
| Proxy reverso | 64–128 MB | 256 MB |
| Jobs transitórios | 0,5–1 GB | execução serializada |
| Margem para cache e picos | aproximadamente 3 GB | não comprometida |

O PostgreSQL utiliza também o cache de páginas do sistema operacional. A documentação recomenda começar `shared_buffers` em aproximadamente 25% da memória disponível para um servidor dedicado e alerta que valores acima de 40% raramente são melhores. Como o host é compartilhado, o ponto de partida deve ser mais conservador, por exemplo 768 MB ou 1 GB, medido sob carga.

Fonte: [PostgreSQL 18 — Resource Consumption](https://www.postgresql.org/docs/current/runtime-config-resource.html).

O número de conexões deve ser mantido pequeno por um único pool `pg` compartilhado pela API. Separar schemas por tenant não cria pools separados. `work_mem`, workers paralelos e manutenção também precisam de limites, pois são multiplicados por operação ou conexão.

### CPU: o recurso mais restrito

Os 12 GB oferecem margem confortável para o MVP; os dois OCPUs são o recurso mais suscetível a contenção. Os picos concorrentes relevantes são:

- SSR do TanStack Start;
- autenticação e regras de negócio na API;
- consultas, checkpoint, autovacuum e criação de índices no PostgreSQL;
- exportações institucionais;
- compressão de backups;
- pull e descompressão de imagens durante deploy.

Medidas necessárias:

- não reservar um OCPU inteiro permanentemente para cada container;
- usar limites e pesos para impedir que web ou jobs sufoquem o banco;
- serializar migrations, backups pesados e exportações grandes;
- fazer upload e download de Anexos diretamente por URLs assinadas, evitando retransmissão binária pela API;
- executar criação de índices e migrations pesadas em janela operacional;
- medir p95/p99, throttling de CPU, load average, atraso de event loop e latência do banco.

Para a carga esperada de lançamento, o cenário é plausível. Sua aprovação permanece condicionada a benchmark com concorrência entre web, API, banco, backup e exportação.

### Persistência correta do PostgreSQL containerizado

O container PostgreSQL é descartável; seus dados não são. O diretório de dados deve residir em Block Volume OCI dedicado e montado explicitamente no host.

No PostgreSQL 18, a imagem oficial alterou `PGDATA` para um caminho versionado e recomenda montar o volume pai em `/var/lib/postgresql`. Um volume anônimo pode não ser reutilizado após recriação e não deve ser aceito.

Fonte: [imagem oficial PostgreSQL](https://hub.docker.com/_/postgres).

Regras obrigatórias:

- imagem oficial PostgreSQL 18 compatível com `arm64`;
- versão e digest fixados; nunca `latest`;
- Block Volume montado em caminho explícito do host;
- volume Compose externo, sem remoção automática;
- `fsync`, `full_page_writes` e durabilidade preservados;
- database port não publicado no host nem na internet;
- acesso somente pela rede Docker privada da API;
- segredo lido de arquivo protegido, não gravado no Compose ou imagem;
- healthcheck com prontidão real do banco;
- shutdown gracioso antes de manutenção do host;
- teste de reinício, recriação do container e remontagem do volume.

Containerizar não torna upgrade major automático. PostgreSQL 18→19 exigirá `pg_upgrade` ou exportação/importação, espaço temporário, backup anterior, verificação e rollback ensaiado.

### Redes Docker e fronteiras

Devem existir redes distintas:

```text
edge_network
├── reverse-proxy
├── web
└── api

data_network — internal
├── api
└── postgres
```

- PostgreSQL participa somente de `data_network`.
- Web não acessa o banco.
- Proxy não acessa o banco.
- API é o único caminho de negócio até o PostgreSQL.
- Somente o proxy publica porta no host, salvo healthchecks locais explicitamente protegidos.
- Containers executam sem privilégios, com capabilities removidas, filesystem raiz read-only quando possível e limites de recursos.
- O socket Docker não é montado em web, API ou PostgreSQL.

O Load Balancer e o proxy mantêm web e API sob a mesma origem. Isso preserva cookies `__Host-`, simplifica CORS e mantém as proteções CSRF já decididas.

### Deploy governado pelo SaltStack

SaltStack substitui a reconciliação de K3s por um fluxo explícito:

1. validar estado atual, espaço, backup e saúde;
2. baixar imagens fixadas por digest;
3. executar migrations compatíveis em job efêmero;
4. atualizar primeiro API ou web conforme compatibilidade expand/contract;
5. executar `docker compose up` idempotente;
6. aguardar healthchecks;
7. executar smoke tests locais e externos;
8. reverter composição e digests se a validação falhar;
9. registrar versão implantada, resultado e duração.

Para evitar indisponibilidade desnecessária, web e API podem usar estratégia blue/green local temporária, desde que exista RAM suficiente durante o overlap. Isso precisa ser medido; não é requisito para o primeiro deploy.

### Backup e recuperação

PostgreSQL no mesmo host aumenta a importância da recuperação externa. O desenho mínimo deve combinar:

- backup físico/base backup e WAL quando o RPO exigir;
- dumps lógicos globais e por schema para portabilidade e restauração seletiva;
- criptografia antes ou durante o envio;
- OCI Object Storage como destino fora da VM;
- manifesto, versão PostgreSQL, hashes e resultado do backup;
- política de retenção que respeite os 20 GB;
- restore automático em container temporário;
- verificação de schema, checksums lógicos e consultas de sanidade;
- ensaio periódico de reconstrução de uma VM vazia comandado pelo Salt Master externo.

Snapshots de volume podem complementar, mas não substituem backup consistente e restauração testada.

### Falhas e disponibilidade

Aplicação e banco compartilham a VM. Uma falha da VM interrompe ambos. Docker restart policies recuperam falhas de processo, mas não falha do host.

Isso não inviabiliza o cenário porque não existe promessa de HA. O Salt Master externo oferece uma vantagem importante: continua disponível quando a OCI falha e pode comandar reprovisionamento, remontagem do volume ou restauração em nova VM.

O gate operacional deve demonstrar:

- reconstrução do host por Salt;
- restauração do PostgreSQL;
- restauração das configurações e secrets;
- religação do proxy, web e API;
- RPO e RTO medidos;
- comunicação pública das limitações reais.

### Observabilidade na GCP

O fluxo de métricas continua financeiramente favorável:

- Alloy envia `remote_write` da OCI para a GCP;
- o tráfego entra na GCP e consome a ampla franquia de saída OCI;
- Prometheus/Grafana comunicam-se localmente;
- egress GCP corresponde principalmente a dashboards, alertas e Salt;
- logs não são enviados no baseline, evitando o sinal de maior volume.

A `e2-micro` continua limitada por 1 GB de RAM. A ausência de K3s na OCI não altera essa limitação. A ordem de tentativa recomendada é:

1. Salt Master + Prometheus + Grafana, com retenção curta e limites agressivos;
2. se houver pressão de memória, Salt Master + VictoriaMetrics + Grafana;
3. se ainda não houver estabilidade, Salt Master sozinho e observabilidade no serviço privado/gerenciado.

A VM de monitoração não participa do caminho de requisição do Burgoweb. Sua indisponibilidade reduz capacidade de diagnóstico e deploy, mas não derruba o produto.

### Risco financeiro

O cenário tem baixa probabilidade de cobrança quando respeita:

- recursos OCI Always Free dentro das cotas;
- Block Volumes dentro do total gratuito;
- Object Storage com retenção e capacidade limitadas;
- R2 com cota global da aplicação inferior à franquia;
- GCP `e2-micro` em região elegível;
- alerta de tráfego GCP antes de 1 GB de saída;
- sem envio centralizado irrestrito de logs;
- nenhum autoscaling ou criação dinâmica de recursos faturáveis.

Budgets são alertas, não bloqueios absolutos. Os limites precisam existir também na aplicação, nas retenções e no provisionamento Salt.

### Veredito

O cenário **Docker Compose na OCI com web, API e PostgreSQL em containers separados, Salt/Prometheus/Grafana na GCP e storage externo** é tecnicamente viável e provavelmente o melhor candidato gratuito discutido até agora.

Ele oferece:

- mais capacidade de banco;
- menor latência;
- ausência do limite de 20 conexões;
- melhor aproveitamento dos 12 GB;
- operação e recuperação demonstráveis;
- separação clara entre produto e plano operacional;
- alto valor de portfólio sem depender de Kubernetes artificialmente.

As condições antes da adoção são:

1. benchmark dos dois OCPUs sob carga concorrente;
2. soak test da monitoração em 1 GB;
3. restauração completa testada a partir de uma VM vazia;
4. limites de storage e egress automatizados;
5. confirmação da configuração do Block Volume e do `PGDATA` do PostgreSQL 18;
6. documentação explícita de ausência de HA.

### Decisão do proprietário do produto — 24/07/2026

A abordagem foi aprovada como baseline para continuidade da arquitetura, sem aguardar a construção do ambiente de teste.

Fica adotado:

- remoção de K3s do baseline inicial;
- Docker Compose governado por SaltStack;
- uma VM OCI Ampere A1 com 2 OCPUs e 12 GB para proxy, TanStack Start, NestJS/Fastify e PostgreSQL 18 em containers separados;
- PostgreSQL persistido em Block Volume OCI, nunca no filesystem efêmero do container;
- Salt Minion e Grafana Alloy na VM OCI;
- GCP `e2-micro` como primeira tentativa para Salt Master, Prometheus e Grafana;
- VictoriaMetrics como substituição permitida do Prometheus caso o soak test demonstre pressão de memória;
- Cloudflare R2 para Anexos e OCI Object Storage para backups e exportações;
- ausência de alegação de alta disponibilidade.

Continuam como gates operacionais anteriores ao lançamento, mas não bloqueiam o desenho e a implementação:

- benchmark concorrente da VM OCI;
- soak test da VM GCP;
- definição dos limites medidos de memória, CPU, retenção e egress;
- restauração integral em ambiente vazio;
- comprovação de RPO e RTO sustentáveis;
- plano de contingência caso Prometheus + Grafana + Salt Master não sejam estáveis em 1 GB.
