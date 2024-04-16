import { AppModule } from '@app/app.module';
import { PrismaService } from '@app/shared/module/persistence/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import request from 'supertest';

const createCustomerInput = {
  name: 'teste',
  email: 'teste@example.com',
  cpfCnpj: '12345678901',
  cellPhone: '47999999999',
  birthdate: '2024-01-01',
  zipCode: '89000000',
  street: 'Rua da Paz',
  number: '123',
  complement: 'Apto 456',
  district: 'Bairro Legal',
  city: 'Cidade teste',
  state: 'XX',
};

const defaultCustomer = {
  ...createCustomerInput,
  id: randomUUID(),
  birthdate: new Date('2024-01-01'),
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CustomerResolver (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;
  let prismaService: PrismaService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prismaService.customer.deleteMany();
  });

  afterAll(async () => {
    await prismaService.customer.deleteMany();
    module.close();
  });

  describe('Customer - createCustomer mutation', () => {
    it('creates a new custumer', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              createCustomer(input: {
                name: "${createCustomerInput.name}",
                email: "${createCustomerInput.email}",
                cpfCnpj: "${createCustomerInput.cpfCnpj}",
                cellPhone: "${createCustomerInput.cellPhone}",
                birthdate: "${createCustomerInput.birthdate}",
                zipCode: "${createCustomerInput.zipCode}",
                street: "${createCustomerInput.street}",
                number: "${createCustomerInput.number}",
                complement: "${createCustomerInput.complement}",
                district: "${createCustomerInput.district}",
                city: "${createCustomerInput.city}",
                state: "${createCustomerInput.state}"
              }) {
                id,
                name,
                email,
                cpfCnpj,
                cellPhone,
                birthdate,
                zipCode,
                street,
                number,
                complement,
                district,
                city,
                state
              }
            }
          `,
        })
        .expect(200);

      const { createCustomer } = response.body.data;

      expect(createCustomer.id).toBeDefined();
      expect(createCustomer.name).toStrictEqual(createCustomerInput.name);
      expect(createCustomer.email).toStrictEqual(createCustomerInput.email);
      expect(createCustomer.cpfCnpj).toStrictEqual(createCustomerInput.cpfCnpj);
      expect(createCustomer.cellPhone).toStrictEqual(
        createCustomerInput.cellPhone,
      );
      expect(createCustomer.birthdate).toStrictEqual(
        `${createCustomerInput.birthdate}T00:00:00.000Z`,
      );
      expect(createCustomer.zipCode).toStrictEqual(createCustomerInput.zipCode);
      expect(createCustomer.street).toStrictEqual(createCustomerInput.street);
      expect(createCustomer.number).toStrictEqual(createCustomerInput.number);
      expect(createCustomer.complement).toStrictEqual(
        createCustomerInput.complement,
      );
      expect(createCustomer.district).toStrictEqual(
        createCustomerInput.district,
      );
      expect(createCustomer.city).toStrictEqual(createCustomerInput.city);
      expect(createCustomer.state).toStrictEqual(createCustomerInput.state);
    });

    it('throws error for invalid email validation', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              createCustomer(input: {
                name: "${createCustomerInput.name}",
                email: "invalidemail",
                cpfCnpj: "${createCustomerInput.cpfCnpj}",
                cellPhone: "${createCustomerInput.cellPhone}",
                birthdate: "${createCustomerInput.birthdate}",
                zipCode: "${createCustomerInput.zipCode}",
                street: "${createCustomerInput.street}",
                number: "${createCustomerInput.number}",
                complement: "${createCustomerInput.complement}",
                district: "${createCustomerInput.district}",
                city: "${createCustomerInput.city}",
                state: "${createCustomerInput.state}"
              }) {
                id
              }
            }
          `,
        })
        .expect(200);

      expect(response.body.errors[0].message).toBe('Invalid email address');
    });
  });

  describe('Customer - getCustomerById query', () => {
    it('returns a custumer if customer is found', async () => {
      const customer = await prismaService.customer.create({
        data: defaultCustomer,
      });

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              getCustomerById(input: {
                id: "${customer.id}"
              }) {
                id,
                name,
                email,
                cpfCnpj,
                cellPhone,
                birthdate,
                zipCode,
                street,
                number,
                complement,
                district,
                city,
                state
              }
            }
          `,
        })
        .expect(200);

      const { getCustomerById } = response.body.data;

      expect(getCustomerById.id).toStrictEqual(customer.id);
      expect(getCustomerById.name).toStrictEqual(customer.name);
      expect(getCustomerById.email).toStrictEqual(customer.email);
      expect(getCustomerById.cpfCnpj).toStrictEqual(customer.cpfCnpj);
      expect(getCustomerById.cellPhone).toStrictEqual(customer.cellPhone);
      expect(getCustomerById.birthdate).toStrictEqual(
        customer.birthdate.toISOString(),
      );
      expect(getCustomerById.zipCode).toStrictEqual(customer.zipCode);
      expect(getCustomerById.street).toStrictEqual(customer.street);
      expect(getCustomerById.number).toStrictEqual(customer.number);
      expect(getCustomerById.complement).toStrictEqual(customer.complement);
      expect(getCustomerById.district).toStrictEqual(customer.district);
      expect(getCustomerById.city).toStrictEqual(customer.city);
      expect(getCustomerById.state).toStrictEqual(customer.state);
    });

    it('throws error if no customer is found', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              getCustomerById(input: {
                id: "${id}"
              }) {
                id
              }
            }
          `,
        })
        .expect(200);

      expect(response.body.errors[0].message).toBe('Customer not found');
    });
  });
});
