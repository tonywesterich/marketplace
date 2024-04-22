# User Account Management API

A API de Gerenciamento de Usuários é um microserviço REST que faz parte do projeto Marketplace. Ela simula um serviço legado para cadastramento de usuários e validação de senha, somente. A autenticação e controle de acesso está fora do escopo do projeto e deverão ser implementados por outro serviço.

Este microserviço foi desenvolvido com as tecnologias:
- [NodeJS](https://nodejs.org)
- [Express](https://expressjs.com/) (_framework_ web)
- [InversifyJS](https://inversify.io/) (injeção de dependências)
- [TypeORM](https://typeorm.io/) (ORM para acesso aos dados)
- [PostgreSQL](https://www.postgresql.org/) (banco de dados de produção)
- [SQLite](https://www.sqlite.org/) (banco de dados de desenvolvimento e testes)
- [Winston](https://www.npmjs.com/package/winston) e [winston-syslog](https://www.npmjs.com/package/winston-syslog) (logger)
- [Bcrypt](https://www.npmjs.com/package/bcrypt) (hash das senhas)
- [Jest](https://jestjs.io/) (testes)

## Framework (InversifyExpressApplication)

Para este projeto, foi criado um _framework_ (`InversifyExpressApplication`), que é um pequeno _wrapper_ em torno do Express e do Inversify para simplificar a inversão de controle (_inversion of control_ - IoC). Ele também inclui alguns recursos básicos, como _logger_, rastreador de sinais de _shutdown_ (`SIGTERM`) para lidar com _graceful shutdown_, exceções personalizadas e _middlewares_ para lidar com erros e _warmup_ do aplicativo.

O código do _framework_ está na pasta `src\framework`.

## Ambiente de produção

Como este projeto é um subprojeto do Marketplace, não faz sentido executá-lo individualmente, portanto, não existe ambiente conteinerizado individual para ele.

A maneira de executar este subprojeto é a partir do projeto principal, em conjunto com todos os outros subprojetos.

### Configuração do banco de dados

Apesar de que a execução deste projeto se dá a partir do projeto principal, a configuração das variáveis de ambiente é feita neste projeto.

A configuração do banco de dados, poderá ser feita no `.env.prod`, conforme abaixo.

```
DATABASE_CONNECTION=postgres://accounts:secret@accounts_db:5432/accounts
DATABASE_MAX_CONNECTION_PER_INSTANCE=40
```

Observação: somente será necessário alterar essa configuração se o serviço do banco de dados for alterado, caso contrário mantenha como está.

## Ambiente de desenvolvimento

Lembre-se que este projeto faz parte de um monorepo, portanto, antes de executar qualquer comando, certifique-se de ter entrado na pasta do projeto:
```bash
cd .\accounts\
```

As variáveis de ambiente para o ambiente de desenvolvimento estão no `.env.dev`. Para configurar o ambiente, basta copiar o arquivo para `.env`.
```bash
cp .\.env.dev .\.env
```

Para rodar o projeto, execute o comando abaixo:
```bash
npm run start:dev
```

## Ambiente de Testes

A suíte de testes cobre:
- Testes Unitários;
- Testes de Integração; e
- Testes de Contrato.

Para rodar os testes unitários, execute:
```bash
npm run test:unit
```

Para rodar os testes de integração, execute:
```bash
npm run test:integration
```

Para rodar os testes de contrato, execute:
```bash
npm run test:contract
```

Para rodar todos os testes, execute:
```bash
npm run test
```

## Exemplos de curl

- Criação de um usuário
```bash
curl --request POST \
  --url http://localhost:3000/user \
  --header 'Content-Type: application/json' \
  --data '{
  "email": "user@example.com",
  "password": "Abcdef@",
  "name": "user 1",
  "role": "customer"
}'
```

- Consulta usuário pelo ID
```bash
curl --request GET \
  --url http://localhost:3000/user/76c19af6-c172-4803-93a1-6ca1466bd52c
```

- Consulta todos os usuários
```bash
curl --request GET \
  --url http://localhost:3000/user
```

- Alteração das informações de um usuário (somente o nome poderá ser alterado)
```bash
curl --request PATCH \
  --url http://localhost:3000/user/76c19af6-c172-4803-93a1-6ca1466bd52c \
  --header 'Content-Type: application/json' \
  --data '{
  "name": "user 1 changed"
}'
```

- Alteração da senha do usuário
```bash
curl --request POST \
  --url http://localhost:3000/user/76c19af6-c172-4803-93a1-6ca1466bd52c/change-password \
  --header 'Content-Type: application/json' \
  --data '{
  "password": "@fedcbA"
}'
```

- Validação do usuário
```bash
curl --request POST \
  --url http://localhost:3000/validate-user \
  --header 'Content-Type: application/json' \
  --data '{
	"email": "user@example.com",
  "password": "@fedcbA"
}'
```
