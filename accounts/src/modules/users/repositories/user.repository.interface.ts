import { User } from '../entities/user';

export const IUserRepositoryName = 'IUserRepository';
export interface IUserRepository {
  save(user: User): Promise<User>;
  findOneByIdOrFail(id: string): Promise<User>;
  findOneByEmailWithPasswordOrFail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}
