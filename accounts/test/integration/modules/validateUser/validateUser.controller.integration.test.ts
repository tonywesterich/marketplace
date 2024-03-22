import { beforeAll, afterAll, beforeEach, describe, it, expect } from '@jest/globals';
import { frameworkToTest } from '../../../frameworkToTest';
import { datasourceTest, getContainerToBind } from '../../../../src/config';
import {
  IDataSourceService,
  IDataSourceServiceName
} from '../../../../src/services/datasourceService/datasource.service.interface';
import { Repository } from 'typeorm';
import { User } from '../../../../src/modules/users/entities/user';
import supertest from 'supertest';
import { defaultUser, defaultUserToValidate, defaultValidatedUser } from '../../../mocks/userMock';

const containerToBind = getContainerToBind(datasourceTest);
const { app, container } = frameworkToTest(containerToBind);

const datasource = container.get<IDataSourceService>(IDataSourceServiceName);
const userRepository = container.get<Repository<User>>(Repository<User>);

beforeAll(async () => {
  await datasource.initialize();
});

afterAll(async () => {
  await datasource.disconnect();
});

beforeEach(async () => {
  await userRepository.clear();
  await userRepository.save({ ...defaultUser });
});

describe('Routes validate user', () => {
  describe('Route POST /validate-user', () => {
    it('should validate password of a user', async () => {
      const { body, status } = await supertest(app).post('/validate-user').send(defaultUserToValidate);

      expect(status).toStrictEqual(200);
      expect(body).toEqual(defaultValidatedUser);
    });

    it('should return a error when payload is invalid', async () => {
      const { body, status } = await supertest(app).post('/validate-user').send({});

      expect(status).toStrictEqual(422);
      expect(body).toStrictEqual({
        statusCode: 422,
        messages: [
          '\"email\" is required',
          '\"password\" is required',
        ],
      });
    })

    it('should return a error when email or password is incorrect', async () => {
      await userRepository.delete({ id: defaultUser.id });
      const { body, status } = await supertest(app).post('/validate-user').send(defaultUserToValidate);

      expect(status).toStrictEqual(401);
      expect(body).toStrictEqual({
        statusCode: 401,
        messages: [
          'Email or password is incorrect',
        ],
      });
    })
  });
});
