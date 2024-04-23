# Core business

Este projeto é um monólito modular e contempla todas as APIs que fazem parte do _core business_ do Marketplace.

O padrão arquitetural de monólito modular, proporciona uma separação clara das responsabilidades e impede que o _codebase_ cresça descontroladamente em uma única área. Assim, é possível evitar o acoplamento de código, além de manter a modularidade e a facilidade de manutenção.

Apesar das semelhanças no nome, deve-se tomar cuidado para não confundir a **arquitetura monolítica modular** com a **arquitetura monolítica**. A arquitetura monolítica modular, assim como na arquitetura monolítica, compartilha o mesmo _codebase_ entre todos os módulos, porém, por ser modular, os módulos podem ser _deploiados_ individualmente, exatamente como na arquitetura de microsserviços. Já, a arquitetura monolítica - que não é modular - roda em um único processo, todos os módulos juntos, formando um grande executável, inviabilizando o _deploy_ individual de módulos e possuindo forte acoplamento.

## Módulos

Este monólito modular contempla os seguintes módulos:
- [ ] Accounts: API responsável pela validação do usuário e integração com o sistema legado de cadastro de usuários
- [x] Customer: API responsável pelo cadastramento de clientes (_customers_)
- [ ] Seller: API responsável pelo cadastro de vendedores, seus produtos e suas ordens de compra (_partners_)
- [ ] Catalog: API responsável por agrupar o catálogo de produtos de todos os vendedores e responder às consultas feitas pelos consumidores
- [ ] Order: API responsável pelas funcionalidades das ordens de compra
- [ ] Cart: API responsável pelas funcionalidadess do carrinho de compras

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
- [PostgreSQL](https://www.postgresql.org/) (banco de dados relacional)
- [MongoDB](https://www.mongodb.com/) (banco de dados de documentos)
- [Redis Queues](https://redis.io/glossary/redis-queue/) (filas)
- [Winston](https://www.npmjs.com/package/winston) e [winston-syslog](https://www.npmjs.com/package/winston-syslog) (logger)
- [Bcrypt](https://www.npmjs.com/package/bcrypt) (hash das senhas)
- [Jest](https://jestjs.io/) (testes)

## Ambiente de desenvolvimento

Observações:

1) Lembre-se que este projeto faz parte de um monorepo, portanto, antes de executar qualquer comando, certifique-se de ter entrado na pasta do projeto;
2) As variáveis de ambiente para o ambiente de desenvolvimento estão no `.env.default`. Para configurar o ambiente, basta copiar o arquivo para `.env`;
3) Caso você não tenha o Docker instalado, será necessário [instalá-lo](https://docs.docker.com/get-docker/) antes de executar os passos abaixo.

```bash
cd core-business
cp .env.default .env
docker-compose build
docker-compose up -d
npm run start:dev
```

## Deploy

A depender da necessidade, o _deploy_ poderá ser feito de cada módulo individualmente ou do monólito como um todo. Os critérios para essa escolha são excencialmente técnicos. Por exemplo, percebe-se que em produção algum dos módulos está consumindo praticamente todo o poder de processamento (CPU) da instância. Nesse caso, pode-se optar por separar o _deploy_ em duas instâncias, uma para o módulo com grande consumo de CPU e outro para os demais módulos, porém com recurso de CPU reduzidos.
