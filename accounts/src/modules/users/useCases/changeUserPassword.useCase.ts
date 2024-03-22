import { inject, injectable } from 'inversify';
import { ChangeUserPasswordDto } from '../dto';
import { IUserRepository, IUserRepositoryName } from '../repositories';

@injectable()
export class ChangeUserPasswordUseCase {
  @inject(IUserRepositoryName)
  private readonly repository: IUserRepository;

  public async execute(id: string, input: ChangeUserPasswordDto): Promise<void> {
    const user = await this.repository.findOneByIdOrFail(id);

    user.password = input.password;

    await this.repository.save(user);
  }
}
