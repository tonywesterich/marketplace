import { inject, injectable } from 'inversify';
import { User } from '../entities/user';
import { EntityNotFoundError, Repository } from 'typeorm';
import { AlreadyExistsError, NotFoundError } from '../../../framework/exceptions';
import { IUserRepository } from '.';

@injectable()
export class UserRepositoryTypeOrm implements IUserRepository {
  @inject(Repository<User>)
  private readonly repository: Repository<User>;

  async save(user: User): Promise<User> {
    try {
      return await this.repository.save(user);
    } catch (error: any) {
      if ((error.message as string).match(/unique/i)) {
        throw new AlreadyExistsError('User already exists');
      }
      throw error;
    }
  }

  async findOneByIdOrFail(id: string): Promise<User> {
    try {
      return await this.repository.findOneByOrFail({ id });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundError('User not found');
      }
      throw error;
    }
  }

  async findOneByEmailWithPasswordOrFail(email: string): Promise<User | null> {
    try {
      return await this.repository
        .createQueryBuilder()
        .select(['User.id', 'User.email', 'User.name', 'User.role'])
        .addSelect('User.password')
        .where('email = :email', { email })
        .getOne();

    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundError('User not found');
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }
}
