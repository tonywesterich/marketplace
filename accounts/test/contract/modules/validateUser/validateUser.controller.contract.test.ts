import { beforeAll, afterAll, beforeEach, describe, it, expect } from '@jest/globals';
import { frameworkToTest } from '../../../frameworkToTest';
import { datasourceTest, getContainerToBind } from '../../../../src/config';
import {
  IDataSourceService,
  IDataSourceServiceName
} from '../../../../src/services/datasourceService/datasource.service.interface';
import { Repository } from 'typeorm';
import { User } from '../../../../src/modules/users/entities/user';
import { defaultUser, defaultUserToValidate } from '../../../mocks/userMock';
import { responseErrorSchema } from '../schemas';
import { responseValidatedUserSchema } from './schemas';
import supertest, { Response } from 'supertest';

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

const itContentTypeWhenError = (request: () => Promise<Response>) => {
  it('should return the content-type header as \"application/json; charset=utf-8\" when occur error', async () => {
    await datasource.disconnect();
    try {
      const { headers } = await request();
      expect(headers['content-type']).toStrictEqual('application/json; charset=utf-8');
    } finally {
      await datasource.initialize();
    }
  })
}

const itSchemaWhenError = (request: () => Promise<Response>) => {
  it('should return the error according to the schema when occur error', async () => {
    await datasource.disconnect();
    try {
      const { body } = await request();
      await responseErrorSchema.validateAsync(body, { abortEarly: false })
    } finally {
      await datasource.initialize();
    }
  })
}

describe('Contract tests for route /validate-user', () => {
  describe('Route POST /validate-user', () => {
    it('should return the content-type header as \"application/json; charset=utf-8\" to success response', async () => {
      const { headers } = await supertest(app).post('/validate-user').send(defaultUserToValidate);
      expect(headers['content-type']).toStrictEqual('application/json; charset=utf-8');
    });

    it('should validate password of user and return it according to the schema', async () => {
      const { body } = await supertest(app).post('/validate-user').send(defaultUserToValidate);
      await responseValidatedUserSchema.validateAsync(body, { abortEarly: false });
    });

    itContentTypeWhenError(async () => {
      return await supertest(app).post('/validate-user').send(defaultUserToValidate);
    })

    itSchemaWhenError(async () => {
      return await supertest(app).post('/validate-user').send(defaultUserToValidate);
    })
  });
});
