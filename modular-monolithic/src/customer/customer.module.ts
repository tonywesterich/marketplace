import { CustomerRepository } from '@app/customer/domain/interfaces/customer.repository.interface';
import { CustomerService } from '@app/customer/domain/service/customer.service';
import { ConfigModule } from '@app/shared/module/config/config.module';
import { PersistenceModule } from '@app/shared/module/persistence/persistence.module';
import { Module } from '@nestjs/common';
import { CustomerResolver } from './http/graphql/customer.resolver';
import { CustomerPrismaRepository } from './persistence/repository/customer.repository';

@Module({
  imports: [
    PersistenceModule,
    ConfigModule.forRoot(),
  ],
  providers: [
    CustomerService,
    CustomerResolver,
    CustomerPrismaRepository,
    {
      provide: CustomerRepository,
      useExisting: CustomerPrismaRepository,
    },
  ],
  controllers: [],
})
export class CustomerModule {}
