import { inject, injectable } from 'inversify';
import { IUserRepository, IUserRepositoryName } from '../repositories';
import { ResponseUserDto } from '../dto';

@injectable()
export class FindAllUsersUseCase {
  @inject(IUserRepositoryName)
  private readonly repository: IUserRepository;

  public async execute(): Promise<ResponseUserDto[]> {
    return (await this.repository.findAll()).map(
      ({ createdAt, updatedAt, password, ...responseUserDto }) => responseUserDto
    );
  }
}
