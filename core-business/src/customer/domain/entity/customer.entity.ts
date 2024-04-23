import { Email } from '@app/customer/domain/value-object/email.value-object';
import { BaseEntity } from '@app/shared/core/entity/base.entity';
import { randomUUID } from 'crypto';
import { CustomerEntityProps } from './customer.entity.props';

export class CustomerEntity extends BaseEntity<
  CustomerEntityProps<string | Email>
> {
  private constructor(data: CustomerEntityProps<string | Email>) {
    super(data);
  }

  static createNew(
    data: Omit<
      CustomerEntityProps<string | Email>,
      'createdAt' | 'updatedAt' | 'id'
    >,
    id = randomUUID(),
  ): CustomerEntity {
    return new CustomerEntity({
      ...data,
      id,
      email:
        typeof data.email === 'string' ? new Email(data.email) : data.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static createFrom(data: CustomerEntityProps<string | Email>): CustomerEntity {
    return new CustomerEntity({
      ...data,
      email:
        typeof data.email === 'string' ? new Email(data.email) : data.email,
    });
  }

  serialize(): CustomerEntityProps<string> {
    return {
      id: this.props.id,
      name: this.props.name,
      email:
        typeof this.props.email === 'string'
          ? this.props.email
          : this.props.email.getValue(),
      cpfCnpj: this.props.cpfCnpj,
      cellPhone: this.props.cellPhone,
      birthdate: this.props.birthdate,
      zipCode: this.props.zipCode,
      street: this.props.street,
      number: this.props.number,
      complement: this.props.complement,
      district: this.props.district,
      city: this.props.city,
      state: this.props.state,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
