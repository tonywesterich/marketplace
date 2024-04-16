import { CustomerEntity } from '@app/customer/domain/entity/customer.entity';

export interface CustomerRepository {
  save(customer: CustomerEntity): Promise<CustomerEntity>;
  findOneByIdOrFail(id: string): Promise<CustomerEntity>;
}

export const CustomerRepository = Symbol('CustomerRepository');
