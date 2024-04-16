export interface CreateCustomerDto {
  name: string;
  email: string;
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
