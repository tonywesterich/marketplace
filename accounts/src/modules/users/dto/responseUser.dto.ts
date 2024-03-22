import { UserRole } from '../entities/user';

export class ResponseUserDto {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
