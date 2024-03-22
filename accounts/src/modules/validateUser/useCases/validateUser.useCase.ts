import { inject, injectable } from 'inversify';
import { ValidateUserDto } from '../dto';
import { IUserRepository, IUserRepositoryName } from '../../users/repositories';
import {
  ICryptService,
  ICryptServiceName
} from '../../../services/cryptService/crypt.service.interface';
import { ILoggedUser } from '../../users/entities/user';
import { UnauthorizedError } from '../../../framework/exceptions';

@injectable()
export class ValidateUserUseCase {
  @inject(IUserRepositoryName)
  private readonly repository: IUserRepository;

  @inject(ICryptServiceName)
  private readonly crypt: ICryptService;

  public async execute(input: ValidateUserDto): Promise<ILoggedUser> {
    const user = await this.repository
      .findOneByEmailWithPasswordOrFail(input.email);

    if (user && await this.crypt.compare(input.password, user.password)) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }

    const obfuscatedEmail = input.email.replace(
      /(\w{1,5})(.{0,5})(@)(\w{1,5})(.+?)(.\w{3})(.\w+$)/,
      '$1*****$3$4*****$6$7'
    );

    throw new UnauthorizedError(
      'Email or password is incorrect',
      { email: obfuscatedEmail }
    );
  }
}
