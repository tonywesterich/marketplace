# Marketplace

> ⚠️ **Atenção** ⚠️
>
> Este projeto está em desenvolvimento

O Marketplace é um exemplo de aplicação em microserviços que simula algumas funcionadades empresariais de um _marketplace_. Ele poderá ser utilizado para testar e aprender técnicas de orquestração de conteiners (Docker ou Kubernetes), assim como, experimentar ferramentas para _service mesh_, _tracer_, _bulkhead_, _circuit breaker_, entre outras.

Nenhum dos serviços tem tratamento - em seu código fonte - para problemas inerentes a arquitetura de microserviços, como por exemplo _circuit breaker_. Caso seja necessário esse tipo de tratamento, o mesmo deverá ser feito externamente, possivelmente através de _service mesh_. Com essa abordagem, o código da aplicação fica desacoplado das questões relacionadas à infraestrutura, deixando o código mais "limpo".

Todos os microserviços foram desenvolvidos em Node.js, com Typescript, utilizando diversas técnicas, arquiteturas e frameworks disponíveis no riquíssimo universo do Node.js.

## Diagrama de contexto

![alt text](<docs/context-diagram.png>)

## Diagrama de containers (não é Docker)

No [modelo C4](https://c4model.com/), os diagramas de containers tem um significado diferente do Docker, é algo no qual um código possa ser executado ou algum dado ser armazenado.

![alt text](<docs/container-diagram.png>)

## Subprojetos:

Este monorepo contempla todos os subprojetos do Marketplace:
- [x] Accounts legacy: API legada de Gerenciamento de Usuários
- [ ] Core business: Monolito modular contendo todas as APIs do _core business_ do marketplace
  - [ ] Accounts: API responsável pela validação do usuário e integração com o sistema legado de cadastro de usuários
  - [x] Customer: API responsável pelo cadastramento de clientes (_customers_)
  - [ ] Seller: API responsável pelo cadastro de vendedores, seus produtos e suas ordens de compra (_partners_)
  - [ ] Catalog: API responsável por agrupar o catálogo de produtos de todos os vendedores e responder às consultas feitas pelos consumidores
  - [ ] Order: API responsável pelas funcionalidades das ordens de compra
  - [ ] Cart: API responsável pelas funcionalidadess do carrinho de compras
- [ ] Payment: API legada responsável pela integração com o sistema de pagamento do terceirizado
- [ ] Shipping: API legada responsável pela integração com o sistema de transporte do terceirizado

## Logger

Os logs de todos os serviços são enviados para o console padrão (`stdout`) e para o Syslog, caso esteja configurado na infraestrutura.

Todos os microserviços adotaram o padrão Syslog ([RFC 3164](http://www.ietf.org/rfc/rfc3164.txt) e [RFC 5424](http://tools.ietf.org/html/rfc5424)) para geração das mensagens de log.

Os níveis de gravidade do protocolo Syslog, são:
- debug
- info
- notice
- warning
- err
- crit
- alert

A configuração do nível mínimo de log poderá ser definido na variável de ambiente `LOG_LEVEL`. Essa configuração é independente da existência de servidor de Syslog, pois ela é válida para o _desktop_ também.

Para o ambiente de produção, recomenda-se:
```
LOG_LEVEL=info
```

Para o ambiente de desenvolvimento, recomenda-se:
```
LOG_LEVEL=debug
```

Caso a infraestrutura contemple um servidor Syslog, pode-se configurar em cada microserviço o destino das mensagens de log por ele geradas. Os valores abaixo são os valores padrão da configuração. Somente será necessário setá-los se o servidor tiver alguma configuração diferenciada, caso contrário, as variáveis de ambiente nem precisarão ser definidas:
```
SYSLOG_HOST=localhost
SYSLOG_PORT=514
SYSLOG_PROTOCOL=udp4
SYSLOG_FACILITY=local0
SYSLOG_TYPE=RFC5424
```

## Clonando este projeto para um repositório local

Para utilizar este projeto, você deverá baixá-lo para o seu ambiente local. Para isso, você poderá fazer o download diretamente na página do GitHub ou clonar o repositório utilizando o Git na linha de comando.

```bash
git clone https://github.com/tonywesterich/marketplace.git
```

## Docker Compose

Caso você não tenha o Docker instalado, será necessário [instalá-lo](https://docs.docker.com/get-docker/) antes de executar os passos abaixo.

Se a sua intenção for rodar o ambiente todo, basta seguir os passos abaixo:

```bash
cd marketplace
docker-compose build
docker-compose up -d
```

Agora, se a sua intenção for rodar individualmente cada subprojeto, siga as orientações que estão no README.md de cada subprojeto.

## Kubernetes

TODO

## Acessando o Marketplace

Consulte a sessão [Exemplos de curl](./accounts/README.md#exemplos-de-curl) do User Account Management API.

## CI/CD
Este projeto não tem intenção de fazer deploy em nenhum _cloud provider_, portanto, não implementa _continous deployment (CD)_ ou _entrega continua_. Por outro lado, implementa _continous integration (CI)_ ou _integração contínua_, que é validação contínua de todo e qualquer código adicionado ao projeto.
