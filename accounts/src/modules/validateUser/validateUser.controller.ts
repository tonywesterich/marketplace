import { controller, httpPost, request, response } from 'inversify-express-utils';
import { validation } from '../../helpers/validation';
import { ValidateUserDto } from './dto';
import { validateUserSchema } from './schemas';
import { ValidateUserUseCase } from './useCases';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { ILoggerService, ILoggerServiceName } from '../../framework/interfaces';

@controller('/validate-user')
export class ValidateUserController {
  @inject(ValidateUserUseCase)
  private readonly validateUserUseCase: ValidateUserUseCase;

  @inject(ILoggerServiceName)
  private readonly logger: ILoggerService;

  @httpPost('/')
  public async validateUser(@request() req: Request, @response() res: Response) {
    const body = validation<ValidateUserDto>(req.body, validateUserSchema);

    this.logger.info(`Validating password`);
    const user = await this.validateUserUseCase.execute(body);

    this.logger.info(`Successfully validated password of user ${user.id}`, { id: user.id });

    return !res.writableEnded ? res.json(user) : null;
  }
}
