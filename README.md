# Marketplace

> ⚠️ **Atenção** ⚠️
>
> Este projeto está em desenvolvimento

O aplicativo Marketplace é um exemplo de abordagem arquitetônica em microsserviços que simula algumas funcionadades empresariais de um _marketplace_.

O objetivo do projeto é servir como referência técnica em arquitetura e programação, assim como, possibilitar a aplicação de técnicas de orquestração de conteiners (Docker ou Kubernetes) ou experimentar ferramentas para _service mesh_, _tracer_, _bulkhead_ e _circuit breaker_, visto que o aplicativo é independente da infra.

Todos os microsserviços foram desenvolvidos em Node.js, com Typescript, utilizando diversas técnicas, padrões arquiteturais e frameworks disponíveis no riquíssimo universo do Node.js. O _core business_ do aplicativo Marketplace está num monólito modular desenvolvido em NestJS, que contempla os diversos módulos (ou microsserviços) essenciais ao aplicativo. Já, os microsserviços que emulam sistemas externos estão individualizados em seus respectivos subprojetos.

## Diagrama de contexto

A empresa que contratou o desenvolvimento do aplicativo Marketplace já possui alguns serviços rodando, que atendem outros aplicativos. O uso desses serviços será compartilhado entre o Marketplace e os outros aplicativos.

Os lojistas estabelecidos no mundo real (sellers) usam o sistema para fazer seu próprio cadastramento, cadastrar seu catálogo de produtos, informar o estoque disponível para cada produto e consultar as vendas realizadas no aplicativo.

Os clientes que navegam na internet (customers) usam o sistema para consultar produtos, adicionar ou remover produtos ao carrinho de compras, efetivar pedidos de compras e acompanhar os pedidos.

O administrador do sistema (admin) usa o sistema para acompanhar o faturamento.

O sistema Marketplace usa o sistema legado de cadastro de usuários (account legacy) para validar o login e cadastrar novos usuários. Da mesma forma, usa outros dois sistemas legados para as operações de pagamento (payment legacy) e transporte (shipping legacy), os quais, por sua vez, se comunicam com os sistemas dos parceiros que estão em outra infraestrutura.

O diagrama abaixo dá uma visão geral de como o Marketplace se encaixa no mundo em termos das pessoas que o utilizam e dos outros sistemas de software com os quais ele interage.

![alt text](<docs/context-diagram.png>)

## Diagrama de containers (não é Docker)

No [modelo C4](https://c4model.com/), os diagramas de containers tem um significado diferente do Docker, é algo no qual um código possa ser executado ou algum dado ser armazenado.

O diagrama abaixo amplia a visão sobre o sistema Marketplace, mostrando os containers (microsserviços, filas e armazenamentos de dados) e a interação entre eles.

![alt text](<docs/container-diagram.png>)

## Subprojetos

O repositório deste projeto é um monorepo que contempla diversos subprojetos, todos eles pertencentes ao Marketplace, conforme abaixo:
- [x] [Accounts legacy](accounts/README.md): API legada de Gerenciamento de Usuários
- [ ] [Core business](core-business/README.md): Monólito modular contendo todas as APIs do _core business_ do marketplace
  - [ ] Accounts: API responsável pelo cadastramento de novos usuários, validação do login e integração com o sistema legado de cadastro de usuários
  - [ ] Cart: API responsável pelas funcionalidadess do carrinho de compras
  - [ ] Catalog: API responsável por agrupar o catálogo de produtos de todos os vendedores e responder às consultas feitas pelos consumidores
  - [x] Customer: API responsável pelo cadastramento de clientes
  - [ ] Order: API responsável pelas funcionalidades das ordens de compra
  - [ ] Seller: API responsável pelo cadastro de vendedores, seus produtos, o estoque dos produtos e suas ordens de compra
- [ ] Front-end: Fornece todas as funcionalidades do marketplace aos clientes, vendedores e administrador do sistema através do browser, baseado no perfil (role) do usuário
- [ ] Payment: API legada responsável pela integração com o sistema de pagamento do terceirizado
- [ ] Shipping: API legada responsável pela integração com o sistema de transporte do terceirizado

## Limites técnicos

Nenhum dos microsserviços tem tratamento - em seu código fonte - para problemas inerentes a arquitetura de microsserviços, como por exemplo _circuit breaker_. Caso seja necessário esse tipo de tratamento, o mesmo deverá ser feito externamente, possivelmente através de _service mesh_. Com essa abordagem, o código da aplicação fica desacoplado das questões relacionadas à infraestrutura, deixando o código mais "limpo".

## Logger

Os logs de todos os serviços são enviados para o console padrão (`stdout`) e para o Syslog, caso esteja configurado na infraestrutura.

Todos os microsserviços adotaram o padrão Syslog ([RFC 3164](http://www.ietf.org/rfc/rfc3164.txt) e [RFC 5424](http://tools.ietf.org/html/rfc5424)) para geração das mensagens de log.

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

Caso a infraestrutura contemple um servidor Syslog, pode-se configurar em cada microsserviço o destino das mensagens de log por ele geradas. Os valores abaixo são os valores padrão da configuração. Somente será necessário setá-los se o servidor tiver alguma configuração diferenciada, caso contrário, as variáveis de ambiente nem precisarão ser definidas:
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

TODO

## CI/CD
Este projeto não tem intenção de fazer deploy em nenhum _cloud provider_, portanto, não implementa _continous deployment (CD)_ ou _entrega continua_. Por outro lado, implementa _continous integration (CI)_ ou _integração contínua_, que é validação contínua de todo e qualquer código adicionado ao projeto.
