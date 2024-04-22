import { CustomerService } from '@app/customer/domain/service/customer.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateCustomerInput } from './type/create-customer-input.type';
import { CustomerType as Customer } from './type/customer.type';
import { GetCustomerByIdInput } from './type/get-customer-by-id-input.type';

@Resolver()
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Mutation(() => Customer)
  async createCustomer(
    @Args('input') input: CreateCustomerInput,
  ): Promise<Customer> {
    const customer = await this.customerService.create(input);
    return customer.serialize();
  }

  @Query(() => Customer)
  async getCustomerById(
    @Args('input') input: GetCustomerByIdInput,
  ): Promise<Customer> {
    const { id } = input;
    const customer = await this.customerService.getCustomerById(id);
    return customer.serialize();
  }
}
