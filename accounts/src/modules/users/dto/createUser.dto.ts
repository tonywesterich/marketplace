import { UserRole } from '../entities/user';

export class CreateUserDto {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}
