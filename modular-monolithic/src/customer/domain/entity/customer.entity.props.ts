import { Email } from '@app/customer/domain/value-object/email.value-object';
import { BaseEntityProps } from '@app/shared/core/entity/base.entity.props';

export interface CustomerEntityProps<T extends string | Email = Email>
  extends BaseEntityProps {
  name: string;
  email: T;
  cpfCnpj: string;
  cellPhone: string;
  birthdate: Date;
  zipCode: string;
  street: string;
  number: string;
  complement?: string | null;
  district?: string | null;
  city: string;
  state: string;
}
