import { CustomerEntity } from '@app/customer/domain/entity/customer.entity';
import { CustomerRepository } from '@app/customer/domain/interfaces/customer.repository.interface';
import { CustomerService } from '@app/customer/domain/service/customer.service';
import { CustomerPrismaRepository } from '@app/customer/persistence/repository/customer.repository';
import { NotFoundException } from '@app/shared/core/exeption/not-found.exception';
import { ConfigModule } from '@app/shared/module/config/config.module';
import { PrismaService } from '@app/shared/module/persistence/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { randomUUID } from 'crypto';

const customerInput = {
  name: 'teste',
  email: 'teste@example.com',
  cpfCnpj: '12345678901',
  cellPhone: '47999999999',
  birthdate: new Date('2024-01-01'),
  zipCode: '89000000',
  street: 'Rua da Paz',
  number: '123',
  complement: 'Apto 456',
  district: 'Bairro Legal',
  city: 'Cidade teste',
  state: 'XX',
};

describe('CustomerService', () => {
  let service: CustomerService;
  let customerRepository: CustomerRepository;
  let module: TestingModule;
  let prismaService: PrismaService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        PrismaService,
        CustomerService,
        CustomerPrismaRepository,
        {
          provide: CustomerRepository,
          useExisting: CustomerPrismaRepository,
        },
      ],
    }).compile();

    customerRepository = module.get<CustomerRepository>(CustomerRepository);
    prismaService = module.get<PrismaService>(PrismaService);
    service = module.get<CustomerService>(CustomerService);
  });

  afterAll(async () => {
    module.close();
  });

  describe('create', () => {
    it('creates a new customer', async () => {
      const customerEntity = CustomerEntity.createNew(customerInput);

      jest
        .spyOn(customerRepository, 'save')
        .mockResolvedValueOnce(customerEntity);

      const createdCustomer = await service.create(customerInput);
      const {
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
        state,
        createdAt,
        updatedAt,
      } = createdCustomer.serialize();

      expect(id).toBeDefined();
      expect(name).toStrictEqual(customerInput.name);
      expect(email).toStrictEqual(customerInput.email);
      expect(cpfCnpj).toStrictEqual(customerInput.cpfCnpj);
      expect(cellPhone).toStrictEqual(customerInput.cellPhone);
      expect(birthdate).toStrictEqual(customerInput.birthdate);
      expect(zipCode).toStrictEqual(customerInput.zipCode);
      expect(street).toStrictEqual(customerInput.street);
      expect(number).toStrictEqual(customerInput.number);
      expect(complement).toStrictEqual(customerInput.complement);
      expect(district).toStrictEqual(customerInput.district);
      expect(city).toStrictEqual(customerInput.city);
      expect(state).toStrictEqual(customerInput.state);
      expect(createdAt).toBeDefined();
      expect(updatedAt).toBeDefined();
    });
  });

  describe('getCustomerById', () => {
    it('returns a CustomerEntity if a customer is found', async () => {
      const customerEntity = CustomerEntity.createNew(customerInput);

      jest
        .spyOn(customerRepository, 'findOneByIdOrFail')
        .mockResolvedValueOnce(customerEntity);

      const {
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
        state,
        createdAt,
        updatedAt,
      } = customerEntity.serialize();

      const createdCustomer = await service.getCustomerById(id);

      expect(createdCustomer).toBeInstanceOf(CustomerEntity);

      const serializedCustomer = createdCustomer.serialize();

      expect(serializedCustomer.id).toStrictEqual(id);
      expect(serializedCustomer.name).toStrictEqual(name);
      expect(serializedCustomer.email).toStrictEqual(email);
      expect(serializedCustomer.cpfCnpj).toStrictEqual(cpfCnpj);
      expect(serializedCustomer.cellPhone).toStrictEqual(cellPhone);
      expect(serializedCustomer.birthdate).toStrictEqual(birthdate);
      expect(serializedCustomer.zipCode).toStrictEqual(zipCode);
      expect(serializedCustomer.street).toStrictEqual(street);
      expect(serializedCustomer.number).toStrictEqual(number);
      expect(serializedCustomer.complement).toStrictEqual(complement);
      expect(serializedCustomer.district).toStrictEqual(district);
      expect(serializedCustomer.city).toStrictEqual(city);
      expect(serializedCustomer.state).toStrictEqual(state);
      expect(serializedCustomer.createdAt).toStrictEqual(createdAt);
      expect(serializedCustomer.updatedAt).toStrictEqual(updatedAt);
    });

    it('throw an NotFoundException error if no customer is found', async () => {
      jest
        .spyOn(prismaService['customer'], 'findUniqueOrThrow')
        .mockRejectedValueOnce(
          new PrismaClientKnownRequestError('Not found', {
            code: 'P2025',
            clientVersion: '',
          }),
        );

      const id = randomUUID();
      const promise = service.getCustomerById(id);

      await expect(promise).rejects.toThrow(NotFoundException);
    });
  });
});
