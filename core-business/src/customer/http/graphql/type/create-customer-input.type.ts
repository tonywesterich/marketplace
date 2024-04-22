import { InputType, OmitType } from '@nestjs/graphql';
import { CustomerType } from './customer.type';

@InputType()
export class CreateCustomerInput extends OmitType(
  CustomerType,
  ['id'],
  InputType,
) {}
