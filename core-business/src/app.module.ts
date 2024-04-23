import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppResolver } from './app.resolver';
import { CustomerModule } from './customer/customer.module';
import { ConfigModule } from './shared/module/config/config.module';

@Module({
  imports: [
    CustomerModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      driver: ApolloDriver,
    }),
    ConfigModule.forRoot(),
  ],
  providers: [AppResolver],
})
export class AppModule {}
