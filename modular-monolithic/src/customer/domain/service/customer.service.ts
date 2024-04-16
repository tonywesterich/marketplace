import { CreateCustomerDto } from '@app/customer/domain/dto/create-customer.dto';
import { CustomerEntity } from '@app/customer/domain/entity/customer.entity';
import { CustomerRepository } from '@app/customer/domain/interfaces/customer.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CustomerService {
  @Inject(CustomerRepository)
  private readonly customerRepository: CustomerRepository;

  async create(customer: CreateCustomerDto): Promise<CustomerEntity> {
    const newCustomer = CustomerEntity.createNew(customer);
    await this.customerRepository.save(newCustomer);
    return newCustomer;
  }

  async getCustomerById(id: string): Promise<CustomerEntity> {
    return this.customerRepository.findOneByIdOrFail(id);
  }
}
