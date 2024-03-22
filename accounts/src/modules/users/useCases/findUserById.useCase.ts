import { inject, injectable } from 'inversify';
import { IUserRepository, IUserRepositoryName } from '../repositories';
import { ResponseUserDto } from '../dto';

@injectable()
export class FindUserByIdUseCase {
  @inject(IUserRepositoryName)
  private readonly repository: IUserRepository;

  public async execute(id: string): Promise<ResponseUserDto> {
    const user = await this.repository.findOneByIdOrFail(id);
    const { createdAt, updatedAt, password, ...responseUserDto } = user;
    return responseUserDto;
  }
}
