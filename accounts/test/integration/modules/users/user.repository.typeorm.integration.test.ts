import { describe, beforeAll, afterAll, beforeEach, it, expect } from '@jest/globals';
import { datasourceTest, getContainerToBind } from '../../../../src/config';
import { frameworkToTest } from '../../../frameworkToTest';
import {
  IDataSourceService,
  IDataSourceServiceName
} from '../../../../src/services/datasourceService/datasource.service.interface';
import { Repository } from 'typeorm';
import { User } from '../../../../src/modules/users/entities/user';
import { UserRepositoryTypeOrm } from '../../../../src/modules/users/repositories';
import {
  defaultId,
  defaultPassword,
  defaultUser,
  defaultUserWithoutOcultedValues
} from '../../../mocks/userMock';
import bcrypt from 'bcrypt';

const containerToBind = getContainerToBind(datasourceTest);
const { container } = frameworkToTest(containerToBind);

const datasource = container.get<IDataSourceService>(IDataSourceServiceName);
const userRepository = container.get<Repository<User>>(Repository<User>);
const userRepositoryTypeOrm = container.get(UserRepositoryTypeOrm);

beforeAll(async () => {
  await datasource.initialize();
});

afterAll(async () => {
  await datasource.disconnect();
});

beforeEach(async () => {
  await userRepository.clear();
});

describe('Repository Users - encrypted password', () => {
  describe('Create a new User', () => {
    it('should save a User on database with encrypted password', async () => {
      await userRepositoryTypeOrm.save({ ...defaultUser });

      const userFromDB: User | null = await userRepository
        .createQueryBuilder()
        .addSelect('User.password')
        .where('id = :id', { id: defaultId })
        .getOne();

      expect(userFromDB).toBeTruthy();

      if (userFromDB) {
        const comparison = await bcrypt.compare(defaultPassword, userFromDB.password);
        expect(comparison).toBe(true);

        expect(userFromDB.createdAt).toBeDefined();
        expect(userFromDB.updatedAt).toBeDefined();

        const { password, createdAt, updatedAt, ...userFromDBWithoutOcultedValues } = userFromDB;
        expect(userFromDBWithoutOcultedValues).toStrictEqual(defaultUserWithoutOcultedValues);
      }
    })
  });

  describe('Change password of a existing User', () => {
    const changedPassword = defaultUser.password.split('').reverse().join('');

    const saveNewUserAndChangePassword = async () => {
      await userRepository.save({ ...defaultUser });
      const user = await userRepositoryTypeOrm.findOneByIdOrFail(defaultId);
      user.password = changedPassword;
      await userRepositoryTypeOrm.save({ ...user });
    }

    it('should save the changed password encrypted in the database', async () => {
      await saveNewUserAndChangePassword();

      const userFromDB: User | null = await userRepository
        .createQueryBuilder()
        .addSelect('User.password')
        .where('id = :id', { id: defaultId })
        .getOne();

      expect(userFromDB).toBeTruthy();

      if (userFromDB) {
        const comparison = await bcrypt.compare(changedPassword, userFromDB.password);
        expect(comparison).toBe(true);

        expect(userFromDB.createdAt).toBeDefined();
        expect(userFromDB.updatedAt).toBeDefined();

        const { password, createdAt, updatedAt, ...userFromDBWithoutOcultedValues } = userFromDB;
        expect(userFromDBWithoutOcultedValues).toStrictEqual(defaultUserWithoutOcultedValues);
      }
    })
  });
});
