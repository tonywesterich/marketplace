import { CustomerEntity } from '@app/customer/domain/entity/customer.entity';
import { CustomerRepository } from '@app/customer/domain/interfaces/customer.repository.interface';
import { DefaultPrismaRepository } from '@app/shared/module/persistence/default.prisma.repository';
import { PrismaService } from '@app/shared/module/persistence/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerPrismaRepository
  extends DefaultPrismaRepository
  implements CustomerRepository
{
  private readonly model: PrismaService['customer'];

  constructor(prismaService: PrismaService) {
    super();
    this.model = prismaService.customer;
  }

  async save(customer: CustomerEntity): Promise<CustomerEntity> {
    try {
      await this.model.create({
        data: customer.serialize(),
      });
      return customer;
    } catch (error) {
      this.handleAndThrowError(error);
    }
  }

  async findOneByIdOrFail(id: string): Promise<CustomerEntity> {
    try {
      const customer = await this.model.findUniqueOrThrow({
        where: { id },
      });

      return CustomerEntity.createFrom(customer);
    } catch (error) {
      this.handleAndThrowError(error);
    }
  }
}
