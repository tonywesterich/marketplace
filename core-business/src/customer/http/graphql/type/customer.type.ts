import { Field, ObjectType } from '@nestjs/graphql';
import {
  IsDate,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
} from 'class-validator';

@ObjectType()
export class CustomerType {
  @IsNotEmpty()
  @IsUUID()
  @Field()
  readonly id: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Field()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(60)
  @Field()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(14)
  @Field()
  readonly cpfCnpj: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(11)
  @Field()
  @IsMobilePhone('pt-BR')
  readonly cellPhone: string;

  @IsNotEmpty()
  @IsDate()
  @Field()
  readonly birthdate: Date;

  @IsNotEmpty()
  @IsString()
  @MaxLength(8)
  @Field()
  readonly zipCode: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Field()
  readonly street: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Field()
  readonly number: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly complement?: string | null;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly district?: string | null;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Field()
  readonly city: string;

  @IsNotEmpty()
  @IsString()
  @Length(2)
  @Field()
  readonly state: string;
}
