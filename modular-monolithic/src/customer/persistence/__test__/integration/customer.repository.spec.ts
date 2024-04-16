import { CustomerEntity } from '@app/customer/domain/entity/customer.entity';
import { CustomerRepository } from '@app/customer/domain/interfaces/customer.repository.interface';
import { CustomerPrismaRepository } from '@app/customer/persistence/repository/customer.repository';
import { AlreadyExistsException } from '@app/shared/core/exeption/already-exists.exception';
import { NotFoundException } from '@app/shared/core/exeption/not-found.exception';
import { ConfigModule } from '@app/shared/module/config/config.module';
import { ConfigService } from '@app/shared/module/config/config.service';
import { PrismaService } from '@app/shared/module/persistence/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';

const defaultCustomer = {
  id: randomUUID(),
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
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CustomerRepository', () => {
  let customerRepository: CustomerRepository;
  let module: TestingModule;
  let prismaService: PrismaService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        PrismaService,
        ConfigService,
        CustomerPrismaRepository,
        {
          provide: CustomerRepository,
          useExisting: CustomerPrismaRepository,
        },
      ],
    }).compile();

    customerRepository = module.get<CustomerRepository>(CustomerRepository);
    prismaService = module.get<PrismaService>(PrismaService);

    await prismaService.customer.deleteMany();
  });

  afterAll(async () => {
    await prismaService.customer.deleteMany();

    module.close();
  });

  describe('findOneByIdOrFail', () => {
    it('returns a CustomerEntity if a customer is found', async () => {
      const customer = await prismaService.customer.create({
        data: defaultCustomer,
      });
      const { id } = customer;

      const result = await customerRepository.findOneByIdOrFail(id);

      expect(result).toBeInstanceOf(CustomerEntity);
      expect(result?.serialize().id).toBe(id);
    });

    it('throw an NotFoundException error if no customer is found', async () => {
      const id = randomUUID();

      const promise = customerRepository.findOneByIdOrFail(id);

      await expect(promise).rejects.toThrow(NotFoundException);
    });

    it('throws an error if an error occurs', async () => {
      const fields = { some: 'invalid' } as any;

      const promise = customerRepository.findOneByIdOrFail(fields);

      await expect(promise).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('save customer to database and returns it as a CustomerEntity', async () => {
      const customer = CustomerEntity.createFrom(defaultCustomer);

      const result = await customerRepository.save(customer);

      expect(result).toBeInstanceOf(CustomerEntity);
      expect(result?.serialize().id).toBe(customer.serialize().id);
    });

    it('throws an AlreadyExistsException error if customer id already exists', async () => {
      const customer = await prismaService.customer.create({
        data: defaultCustomer,
      });

      const customerToSave = CustomerEntity.createFrom({
        ...customer,
        email: 'teste2@example.com',
        cpfCnpj: '12345678902',
      });

      const promise = customerRepository.save(customerToSave);

      await expect(promise).rejects.toThrow(AlreadyExistsException);
    });

    it('throws an AlreadyExistsException error if customer email already exists', async () => {
      const customer = await prismaService.customer.create({
        data: defaultCustomer,
      });

      const customerToSave = CustomerEntity.createFrom({
        ...customer,
        id: randomUUID(),
        cpfCnpj: '12345678902',
      });

      const promise = customerRepository.save(customerToSave);

      await expect(promise).rejects.toThrow(AlreadyExistsException);
    });

    it('throws an AlreadyExistsException error if customer cpfCnpj already exists', async () => {
      const customer = await prismaService.customer.create({
        data: defaultCustomer,
      });

      const customerToSave = CustomerEntity.createFrom({
        ...customer,
        id: randomUUID(),
        email: 'teste2@example.com',
      });

      const promise = customerRepository.save(customerToSave);

      await expect(promise).rejects.toThrow(AlreadyExistsException);
    });

    it('throws an error if an error occurs', async () => {
      const fields = { some: 'invalid' } as any;

      const promise = customerRepository.save(fields);

      await expect(promise).rejects.toThrow();
    });
  });
});
