import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { frameworkToTest } from '../../../frameworkToTest';
import { datasourceTest, getContainerToBind } from '../../../../src/config';
import { User } from '../../../../src/modules/users/entities/user';
import { DataSource, EntityNotFoundError, Repository } from 'typeorm';
import { mock } from 'jest-mock-extended';
import { defaultId, defaultUser, defaultUserToValidate, defaultValidatedUser } from '../../../mocks/userMock';
import { ValidateUserUseCase } from '../../../../src/modules/validateUser/useCases';
import bcrypt from 'bcrypt';
import { NotFoundError, UnauthorizedError } from '../../../../src/framework/exceptions';

let bcryptSpied: any;
let getRepositorySpied: any;
let repositoryMock: any;

const containerToBind = getContainerToBind(datasourceTest);
const { container } = frameworkToTest(containerToBind);

describe('Use cases: Validate user', () => {
  describe('Validate user use case', () => {
    beforeEach(() => {
      bcryptSpied = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(
          (data: string | Buffer, encrypted: string) => {
            return Promise.resolve(data === encrypted)
          }
        );

      repositoryMock = mock<Repository<User>>();

      getRepositorySpied = jest
        .spyOn(DataSource.prototype, 'getRepository')
        .mockImplementation((): Repository<User> => repositoryMock);
    });

    afterEach(() => {
      bcryptSpied.mockReset();
      repositoryMock.mockReset();
      getRepositorySpied.mockReset();
    });

    it('should validate email and password of user', async () => {
      repositoryMock
        .createQueryBuilder = jest.fn().mockImplementation(() => ({
          select: jest.fn().mockImplementation(() => ({
            addSelect: jest.fn().mockImplementation(() => ({
              where: jest.fn().mockImplementation(() => ({
                getOne: jest.fn().mockImplementation(
                  () => Promise.resolve(defaultUser as User)
                ),
              })),
            })),
          })),
        }));

      const validateUserUseCase = container.get(ValidateUserUseCase);
      const user = await validateUserUseCase.execute(defaultUserToValidate);

      expect(user).toStrictEqual(defaultValidatedUser);
    });

    it('should return a "User not found" error', async () => {
      repositoryMock
        .createQueryBuilder = jest.fn().mockImplementation(() => ({
          select: jest.fn().mockImplementation(() => ({
            addSelect: jest.fn().mockImplementation(() => ({
              where: jest.fn().mockImplementation(() => ({
                getOne: jest.fn().mockImplementation(
                  () => Promise.reject(
                    new EntityNotFoundError(User, { id: defaultId })
                  )
                ),
              })),
            }))
          })),
        }));

      const validateUserUseCase = container.get(ValidateUserUseCase);
      expect(validateUserUseCase.execute(defaultUserToValidate))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return a "Unauthorized" error', async () => {
      repositoryMock
        .createQueryBuilder = jest.fn().mockImplementation(() => ({
          select: jest.fn().mockImplementation(() => ({
            addSelect: jest.fn().mockImplementation(() => ({
              where: jest.fn().mockImplementation(() => ({
                getOne: jest.fn().mockImplementation(
                  () => Promise.resolve(defaultUser as User)
                ),
              })),
            })),
          })),
        }));

      const validateUserUseCase = container.get(ValidateUserUseCase);
      const userToValidateWithIncorrectPassword = {
        ...defaultUserToValidate,
        password: 'incorrect'
      };
      expect(validateUserUseCase.execute(userToValidateWithIncorrectPassword))
        .rejects
        .toThrowError(UnauthorizedError);
    });
  });
});
