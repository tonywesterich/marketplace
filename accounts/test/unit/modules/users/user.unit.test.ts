import { beforeAll, afterAll, beforeEach, afterEach, describe, it, expect, jest } from '@jest/globals';
import { frameworkToTest } from '../../../frameworkToTest';
import { datasourceTest, getContainerToBind } from '../../../../src/config';
import {
  changeUserInfo,
  changedUserWithoutPassword,
  defaultId,
  defaultUser,
  defaultUserWithoutOcultedValues
} from '../../../mocks/userMock';
import { DataSource, EntityNotFoundError, Repository } from 'typeorm';
import { User } from '../../../../src/modules/users/entities/user';
import { mock } from 'jest-mock-extended';
import { AlreadyExistsError, NotFoundError } from '../../../../src/framework/exceptions';
import {
  ChangeUserInformationUseCase,
  ChangeUserPasswordUseCase,
  CreateUserUseCase,
  FindAllUsersUseCase,
  FindUserByIdUseCase,
} from '../../../../src/modules/users/useCases';
import crypto from 'crypto';

let cryptoSpied: any;
let getRepositorySpied: any;
let repositoryMock: any;

const containerToBind = getContainerToBind(datasourceTest);
const { container } = frameworkToTest(containerToBind);

beforeAll(() => {
  cryptoSpied = jest
    .spyOn(crypto, 'randomUUID')
    .mockImplementation(() => defaultId);
});

afterAll(() => {
  cryptoSpied.mockReset();
});

beforeEach(() => {
  repositoryMock = mock<Repository<User>>();

  repositoryMock.save = jest.fn()
    .mockImplementation(
      <User>(entities: User): Promise<User> => Promise.resolve(entities as User)
    );

  (repositoryMock.findOneByOrFail as jest.MockedFunction<typeof repositoryMock.findOneByOrFail>)
    .mockResolvedValue(defaultUser as User);

  (repositoryMock.find as jest.MockedFunction<typeof repositoryMock.find>)
    .mockResolvedValue([defaultUser] as User[]);

  getRepositorySpied = jest
    .spyOn(DataSource.prototype, 'getRepository')
    .mockImplementation((): Repository<User> => repositoryMock);
});

afterEach(() => {
  repositoryMock.mockReset();
  getRepositorySpied.mockReset();
});

describe('Use cases: User', () => {
  describe('Create user use case', () => {
    it('should create a user and return it without oculted values', async () => {
      const createUserUseCase = container.get(CreateUserUseCase);
      const user = await createUserUseCase.execute(defaultUser);

      expect(user).toStrictEqual(defaultUserWithoutOcultedValues);
    });

    it('should return a "User already exists" error', async () => {
      repositoryMock.mockReset();
      repositoryMock.save = jest.fn()
        .mockImplementation(
          <User>(entities: User): Promise<User> => Promise.reject(new Error('unique'))
        );

      const createUserUseCase = container.get(CreateUserUseCase);
      expect(createUserUseCase.execute(defaultUser)).rejects.toThrowError(AlreadyExistsError);
    });
  });

  describe('Find all users use case', () => {
    it('should return all users without password', async () => {
      const findAllUsersUseCase = container.get(FindAllUsersUseCase);
      const result = await findAllUsersUseCase.execute();

      expect(result).toHaveLength(1);

      const user = result[0];
      expect(user).toStrictEqual(defaultUserWithoutOcultedValues);
    });
  });

  describe('Find user by ID use case', () => {
    it('should return a user by ID without password', async () => {
      const findUserByIdUseCase = container.get(FindUserByIdUseCase);
      const user = await findUserByIdUseCase.execute(defaultId);

      expect(user).toStrictEqual(defaultUserWithoutOcultedValues);
    });

    it('should return a "User not found" error', async () => {
      repositoryMock.mockReset();
      repositoryMock.findOneByOrFail = jest.fn()
        .mockImplementation(
          <User>(entities: User): Promise<User> => Promise.reject(
            new EntityNotFoundError(User, { id: defaultId })
          )
        );

      const findUserByIdUseCase = container.get(FindUserByIdUseCase);
      expect(findUserByIdUseCase.execute(defaultId)).rejects.toThrowError(NotFoundError);
    });
  });

  describe('Change user information use case', () => {
    it('should changes info an existing user and return it without password', async () => {
      const user = await container.get(ChangeUserInformationUseCase)
        .execute(defaultId, changeUserInfo);

      expect(user).toStrictEqual(changedUserWithoutPassword);
    });

    it('should return a "User not found" error', async () => {
      repositoryMock.mockReset();
      repositoryMock.findOneByOrFail = jest.fn()
        .mockImplementation(
          <User>(entities: User): Promise<User> => Promise.reject(
            new EntityNotFoundError(User, { id: defaultId })
          )
        );

      const changeUserInformationUseCase = container.get(ChangeUserInformationUseCase);
      expect(changeUserInformationUseCase.execute(defaultId, changeUserInfo))
        .rejects
        .toThrowError(NotFoundError);
    })
  });

  describe('Change user password use case', () => {
    it('should changes the password of a user', async () => {
      const password = defaultUser.password.split('').reverse().join('');

      await container.get(ChangeUserPasswordUseCase).execute(defaultId, { password });

      expect(repositoryMock.save).toHaveBeenNthCalledWith(1, { ...defaultUser, password })
    });

    it('should return a "User not found" error', async () => {
      repositoryMock.mockReset();
      repositoryMock.findOneByOrFail = jest.fn()
        .mockImplementation(
          <User>(entities: User): Promise<User> => Promise.reject(
            new EntityNotFoundError(User, { id: defaultId })
          )
        );

      const changeUserPasswordUseCase = container.get(ChangeUserPasswordUseCase);
      expect(changeUserPasswordUseCase.execute(defaultId, { password: 'password' }))
        .rejects
        .toThrowError(NotFoundError);
    })
  });
});
