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
import {
  defaultUser,
  defaultNewUser,
  defaultId,
  defaultUserWithoutOcultedValues,
  changeUserInfo,
  changedUserWithoutPassword,
} from '../../../mocks/userMock';

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

describe('Routes Users', () => {
  describe('Route POST /user', () => {
    it('should create a user and return it', async () => {
      await userRepository.delete({ id: defaultUser.id });

      const { body, status } = await supertest(app).post('/user').send(defaultNewUser);

      expect(status).toStrictEqual(201);

      const { id, ...user } = body;
      expect(id).toBeTruthy();

      const { id: ignoredIdFromMock, ...expectedResponse } = defaultUserWithoutOcultedValues;
      expect(user).toStrictEqual(expectedResponse);
    });

    it('should return a error when payload is invalid', async () => {
      const { body, status } = await supertest(app).post('/user').send({});

      expect(status).toStrictEqual(422);
      expect(body).toStrictEqual({
        statusCode: 422,
        messages: [
          '\"email\" is required',
          '\"password\" is required',
          '\"name\" is required',
          '\"role\" is required',
        ],
      });
    })

    it('should return status 409 when User already exists', async () => {
      const { status } = await supertest(app).post('/user').send(defaultNewUser);
      expect(status).toStrictEqual(409);
    });
  });

  describe('Route GET /user', () => {
    it('should return a list of users', async () => {
      const { body, status } = await supertest(app).get('/user');

      expect(status).toStrictEqual(200);
      expect(body).toHaveLength(1);

      const { id, ...user } = body[0];
      expect(id).toBeTruthy();

      const { id: ignoredIdFromMock, ...expectedResponse } = defaultUserWithoutOcultedValues;
      expect(user).toStrictEqual(expectedResponse);
    });
  });

  describe('Route GET /user/:id', () => {
    it('should return a user by ID', async () => {
      const { body, status} = await supertest(app).get(`/user/${defaultId}`);
      expect(status).toStrictEqual(200);
      expect(body).toStrictEqual(defaultUserWithoutOcultedValues);
    });

    it('should return a error when params is in invalid format', async () => {
      const { body, status } = await supertest(app).get('/user/1');

      expect(status).toStrictEqual(422);
      expect(body).toStrictEqual({
        statusCode: 422,
        messages: [
          '\"id\" must be a valid GUID',
        ],
      });
    })

    it('should return a error when User not found', async () => {
      await userRepository.delete({ id: defaultUser.id });
      const { body, status } = await supertest(app).get(`/user/${defaultId}`);

      expect(status).toStrictEqual(404);
      expect(body).toStrictEqual({
        statusCode: 404,
        messages: [
          'User not found',
        ],
      });
    })
  });

  describe('Route PATCH /user/:id', () => {
    it('should changes info an existing user and return it', async () => {
      const { body, status } = await supertest(app).patch(`/user/${defaultId}`).send(changeUserInfo);
      expect(status).toStrictEqual(200);
      expect(body).toStrictEqual(changedUserWithoutPassword);
    });

    it('should return a error when params is in invalid format', async () => {
      const { body, status } = await supertest(app).patch('/user/1').send(changeUserInfo);

      expect(status).toStrictEqual(422);
      expect(body).toStrictEqual({
        statusCode: 422,
        messages: [
          '\"id\" must be a valid GUID',
        ],
      });
    })

    it('should return a error when payload is invalid', async () => {
      const { body, status } = await supertest(app).patch(`/user/${defaultId}`).send({ name: 'x'});

      expect(status).toStrictEqual(422);
      expect(body).toStrictEqual({
        statusCode: 422,
        messages: [
          '\"name\" length must be at least 3 characters long',
        ],
      });
    })

    it('should return a error when User not found', async () => {
      await userRepository.delete({ id: defaultUser.id });
      const { body, status } = await supertest(app).patch(`/user/${defaultId}`).send(changeUserInfo);

      expect(status).toStrictEqual(404);
      expect(body).toStrictEqual({
        statusCode: 404,
        messages: [
          'User not found',
        ],
      });
    })
  });

  describe('Route POST /user/:id/change-password', () => {
    it('should change the password of a user', async () => {
      const { body, status } = await supertest(app)
        .post(`/user/${defaultId}/change-password`)
        .send({ password: defaultUser.password.split('').reverse().join('') });

      expect(status).toStrictEqual(204);
      expect(body).toStrictEqual({});
    });

    it('should return a error when params is in invalid format', async () => {
      const { body, status } = await supertest(app)
        .post('/user/1/change-password')
        .send({ password: defaultUser.password.split('').reverse().join('') });

      expect(status).toStrictEqual(422);
      expect(body).toStrictEqual({
        statusCode: 422,
        messages: [
          '\"id\" must be a valid GUID',
        ],
      });
    })

    it('should return a error when payload is invalid', async () => {
      const { body, status } = await supertest(app)
        .post(`/user/${defaultId}/change-password`)
        .send({});

      expect(status).toStrictEqual(422);
      expect(body).toStrictEqual({
        statusCode: 422,
        messages: [
          '\"password\" is required',
        ],
      });
    })

    it('should return a error when User not found', async () => {
      await userRepository.delete({ id: defaultUser.id });
      const { body, status } = await supertest(app)
        .post(`/user/${defaultId}/change-password`)
        .send({ password: defaultUser.password.split('').reverse().join('') });

      expect(status).toStrictEqual(404);
      expect(body).toStrictEqual({
        statusCode: 404,
        messages: [
          'User not found',
        ],
      });
    })
  });
});
