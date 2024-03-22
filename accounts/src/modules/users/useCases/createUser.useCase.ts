import { inject, injectable } from 'inversify';
import { User } from '../entities/user';
import { IUserRepository, IUserRepositoryName } from '../repositories';
import { CreateUserDto, ResponseUserDto } from '../dto';

@injectable()
export class CreateUserUseCase {
  @inject(IUserRepositoryName)
  private readonly repository: IUserRepository;

  /**
   * Creates a user and returns it
   *
   * @param input
   * @returns
   */
  public async execute(input: CreateUserDto): Promise<ResponseUserDto> {
    const newUser = new User(input);

    await this.repository.save(newUser);

    const user = await this.repository.findOneByIdOrFail(newUser.id);

    const { createdAt, updatedAt, password, ...responseUserDto } = user;

    return responseUserDto;
  }
}
