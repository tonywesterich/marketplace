import { inject, injectable } from 'inversify';
import { IUserRepository, IUserRepositoryName } from '../repositories';
import { ChangeUserInformationDto, ResponseUserDto } from '../dto';

@injectable()
export class ChangeUserInformationUseCase {
  @inject(IUserRepositoryName)
  private readonly repository: IUserRepository;

  public async execute(
    id: string,
    updateUserDto: ChangeUserInformationDto,
  ): Promise<ResponseUserDto> {
    const user = await this.repository.findOneByIdOrFail(id);

    updateUserDto.name && (user.name = updateUserDto.name);

    const result = await this.repository.save(user);

    const { createdAt, updatedAt, password, ...responseUserDto } = result;

    return responseUserDto;
  }
}
