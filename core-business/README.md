# Core business

Este projeto é um monólito modular e contempla todas as APIs que fazem parte do _core business_ do Marketplace.

O padrão arquitetural de monólito modular, proporciona uma separação clara das responsabilidades e impede que o _codebase_ cresça descontroladamente em uma única área. Assim, é possível evitar o acoplamento de código, além de manter a modularidade e a facilidade de manutenção.

Apesar das semelhanças no nome, deve-se tomar cuidado para não confundir a **arquitetura monolítica modular** com a **arquitetura monolítica**. A arquitetura monolítica modular, assim como na arquitetura monolítica, compartilha o mesmo _codebase_ entre todos os módulos, porém, por ser modular, os módulos podem ser _deploiados_ individualmente, exatamente como na arquitetura de microsserviços. Já, a arquitetura monolítica - que não é modular - roda em um único processo, todos os módulos juntos, formando um grande executável, inviabilizando o _deploy_ individual de módulos e possuindo forte acoplamento.

## Módulos

Este monólito modular contempla os seguintes módulos:
- [ ] Accounts: API responsável pelo cadastramento de novos usuários, validação do login e integração com o sistema legado de cadastro de usuários
- [ ] Cart: API responsável pelas funcionalidadess do carrinho de compras
- [ ] Catalog: API responsável por agrupar o catálogo de produtos de todos os vendedores e responder às consultas feitas pelos consumidores
- [x] Customer: API responsável pelo cadastramento de clientes
- [ ] Order: API responsável pelas funcionalidades das ordens de compra
- [ ] Seller: API responsável pelo cadastro de vendedores, seus produtos, o estoque dos produtos e suas ordens de compra

## Arquitetura Hexagonal (_ports and adapters_)

Por serem desacoplados, cada módulo poderia adotar seu próprio estilo arquitetural, porém, para manter integridade conceitual entre todos os módulos, foi adotada a arquitetura hexagonal como padrão arquitetural em todos os módulos do monólito.

A Arquitetura Hexagonal isola as regras de negócio (domínio) dos detalhes técnicos da infraestrutura (camadas externas do software), como interfaces de usuário e bancos de dados. Essa abordagem permite uma maior flexibilidade, tornando os sistemas menos suscetíveis a mudanças em tecnologias externas e facilitando a manutenção e os testes.

Hexagonal sugere inversão de dependência para tudo que está fora do core da aplicação, o que permite isolar completamente o core, pois as coisas internas vão depender sempre de abstrações.


## Estrutura de pastas (_screaming architecture_)

Seguindo o conceito de [_screaming architecture_](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html) do Uncle Bob, segue abaixo a estrutura de pastas de nível superior que refletem os _bounded contexts_ contemplados neste monólito a partir da pasta `src\`.

```
├── src
│   accounts
│   cart
│   catalog
│   customer
│   order
│   seller
```

Dentro de cada módulo as pastas estão organizadas da seguinte maneira:
```
customer
│   domain
│   ├── dto
│   ├── entity
│   ├── interfaces
│   └── service
│   └── value-object
│   http
│   └── graphql
│       └── type
│   persistence
│   └── repository

```

## Tecnologias

Os módulos deste monólito foram desenvolvidos com as tecnologias:
- [NodeJS](https://nodejs.org)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/) (ORM para acesso aos dados)
- [GraphQL](https://graphql.org/) e [Appolo](https://www.apollographql.com/)
- [Redis Queues](https://redis.io/glossary/redis-queue/) (filas)
- [BullMQ](https://bullmq.io/) (biblioteca para processamento das filas Redis)
- [PostgreSQL](https://www.postgresql.org/) (banco de dados relacional)
- [MongoDB](https://www.mongodb.com/) (banco de dados de documentos)
- [Winston](https://www.npmjs.com/package/winston) e [winston-syslog](https://www.npmjs.com/package/winston-syslog) (logger)
- [Bcrypt](https://www.npmjs.com/package/bcrypt) (hash das senhas)
- [Jest](https://jestjs.io/) (testes)

## GraphQL x REST

Uma das premissas deste projeto é que somente o front-end terá acesso as APIs do aplicativo Marketplace. Sistemas externos não terão acesso para consumo das funcionalidades das APIs.

Dada essa premissa, o uso de GraphQL é suficiente para atender todas as necessidades de interação com o front-end.

Avaliar o uso do padrão REST somente faria sentido se as APIs ficassem expostas na internet, disponíveis para sistemas externos, o que não é o caso. Portanto, não será implementado o padrão REST.

## Ambiente de desenvolvimento

Observações:

1) Lembre-se que este projeto faz parte de um monorepo, portanto, antes de executar qualquer comando, certifique-se de ter entrado na pasta do projeto;
2) As variáveis de ambiente para o ambiente de desenvolvimento estão no `.env.default`. Para configurar o ambiente, basta copiar o arquivo para `.env`;
3) Caso você não tenha o Docker instalado, será necessário [instalá-lo](https://docs.docker.com/get-docker/) antes de executar os passos abaixo.

Para rodar o projeto, execute os comandos abaixo:

```bash
cd core-business
cp .env.default .env
docker-compose build
docker-compose up -d
npm run start:dev
```

## Ambiente de Testes

A suíte de testes cobre:
- Testes de tipagem;
- Testes Unitários;
- Testes de Integração; e
- Testes end-to-end (e2e).

Para rodar os testes de tipagem, execute:
```bash
npm run test:type
```

Para rodar os testes unitários, execute:
```bash
npm run test:unit
```

Para rodar os testes de integração, execute:
```bash
npm run test:integration
```

Para rodar os testes end-to-end (e2e), execute:
```bash
npm run test:e2e
```

Para rodar todos os testes, execute:
```bash
npm run test
```

## Exemplos de curl

Todos os módulos do monólito modular implementam apenas GraphQL para troca de dados entre os serviços.

GraphQL é uma especificação, uma linguagem de consulta de API e um conjunto de ferramentas. GraphQL opera em um único endpoint usando HTTP, exemplo: `http://localhost:3000/graphql/`.

Segue abaixo alguns exemplos de `curl` que poderão ser utilizados para acessar as funcionalidades das APIs do monólito modular:

- Consultar o Custumer pelo seu ID (`getCustomerById`)
```bash
curl --request POST \
  --url http://localhost:3000/graphql/ \
  --header 'Content-Type: application/json' \
  --data '{
	"query": "query { getCustomerById(input: { id: \"4ba0dd0d-ea07-48f5-8ced-684d9af110be\" }) { id, name, email, cpfCnpj, cellPhone, birthdate, zipCode, street, number, complement, district, city, state } }"
}'
```

- Criar um Customer (`createCustomer`)
```bash
curl --request POST \
  --url http://localhost:3000/graphql/ \
  --header 'Content-Type: application/json' \
  --data '{
	"query": "mutation { createCustomer(input: { name: \"Cliente de Teste\", email: \"test@example.com\", cpfCnpj: \"12345678901\", cellPhone: \"47999999999\", birthdate: \"2024-01-01\", zipCode: \"89123456\", street: \"Rua da Paz\", number: \"123\", complement: null, district: "Bairro Feliz", city: \"Cidade da Alegria\", state: \"XX\" }) { id, name, email, cpfCnpj, cellPhone, birthdate, zipCode, street, number, complement, district, city, state } }"
}'
```

## Deploy

A depender da necessidade, o _deploy_ poderá ser feito de cada módulo individualmente ou do monólito como um todo. Os critérios para essa escolha são excencialmente técnicos. Por exemplo, percebe-se que em produção algum dos módulos está consumindo praticamente todo o poder de processamento (CPU) da instância. Nesse caso, pode-se optar por separar o _deploy_ em duas instâncias, uma para o módulo com grande consumo de CPU e outro para os demais módulos, porém com recurso de CPU reduzidos.
