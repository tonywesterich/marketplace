import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPatch,
  httpPost,
  request,
  response
} from 'inversify-express-utils';
import { Request, Response } from 'express';
import { validation } from '../../helpers/validation';
import { ILoggerService, ILoggerServiceName } from '../../framework/interfaces';
import { StatusCodes } from 'http-status-codes';
import {
  ChangeUserInformationUseCase,
  ChangeUserPasswordUseCase,
  CreateUserUseCase,
  FindAllUsersUseCase,
  FindUserByIdUseCase,
} from './useCases';
import {
  changeUserInformationSchema,
  changeUserPasswordSchema,
  createUserSchema,
  userIdSchema,
} from './schemas';
import {
  ChangeUserInformationDto,
  ChangeUserPasswordDto,
  CreateUserDto
} from './dto';

@controller('/user')
export class UsersController extends BaseHttpController {
  @inject(CreateUserUseCase)
  private readonly createUserUseCase: CreateUserUseCase;

  @inject(FindAllUsersUseCase)
  private readonly findAllUsersUseCase: FindAllUsersUseCase;

  @inject(FindUserByIdUseCase)
  private readonly findUserByIdUseCase: FindUserByIdUseCase;

  @inject(ChangeUserInformationUseCase)
  private readonly changeUserInformationUseCase: ChangeUserInformationUseCase;

  @inject(ChangeUserPasswordUseCase)
  private readonly changeUserPasswordUseCase: ChangeUserPasswordUseCase;

  @inject(ILoggerServiceName)
  private readonly logger: ILoggerService;

  @httpPost('/')
  public async create(@request() req: Request, @response() res: Response) {
    const body = validation<CreateUserDto>(req.body, createUserSchema);

    this.logger.info('Creating user');
    const result = await this.createUserUseCase.execute(body);
    this.logger.info(`Successfully created user ${result.id}`, { id: result.id });

    return !res.writableEnded ? res.status(StatusCodes.CREATED).json(result) : null;
  }

  @httpGet('/')
  public async findAll(@request() req: Request, @response() res: Response) {
    this.logger?.info('Searching all users');
    const result = await this.findAllUsersUseCase.execute();
    this.logger?.info(`Found ${result.length} users`);

    return !res.writableEnded ? res.status(StatusCodes.OK).json(result) : null;
  }

  @httpGet('/:id')
  public async findById(@request() req: Request, @response() res: Response) {
    const id = validation<string>(req.params.id, userIdSchema);

    this.logger.info(`Searching user ${id}`, { id });
    const result = await this.findUserByIdUseCase.execute(id);
    this.logger.info(`Successfully located user ${id}`, { id });

    return !res.writableEnded ? res.status(StatusCodes.OK).json(result) : null;
  }

  @httpPatch('/:id')
  public async changeUserInformation(@request() req: Request, @response() res: Response) {
    const id = validation<string>(req.params.id, userIdSchema);
    const body = validation<ChangeUserInformationDto>(req.body, changeUserInformationSchema);

    this.logger.info(`Updating user ${id}`, { id });
    const result = await this.changeUserInformationUseCase.execute(id, body);
    this.logger.info(`Successfully updated user ${id}`, { id });

    return !res.writableEnded ? res.status(StatusCodes.OK).json(result) : null;
  }

  @httpPost('/:id/change-password')
  public async changePassord(@request() req: Request, @response() res: Response) {
    const id = validation<string>(req.params.id, userIdSchema);
    const body = validation<ChangeUserPasswordDto>(req.body, changeUserPasswordSchema);

    this.logger.info(`Changing password of user ${id}`, { id });
    await this.changeUserPasswordUseCase.execute(id, body);
    this.logger.info(`Successfully changed password of user ${id}`, { id });

    return !res.writableEnded ? res.status(StatusCodes.NO_CONTENT).send('') : null;
  }
}
