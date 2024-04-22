import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class GetCustomerByIdInput {
  @IsNotEmpty()
  @IsUUID()
  @Field()
  readonly id: string;
}
