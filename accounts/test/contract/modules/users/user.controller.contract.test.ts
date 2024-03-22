import { beforeAll, afterAll, beforeEach, describe, it, expect } from '@jest/globals';
import { frameworkToTest } from '../../../frameworkToTest';
import { datasourceTest, getContainerToBind } from '../../../../src/config';
import {
  IDataSourceService,
  IDataSourceServiceName
} from '../../../../src/services/datasourceService/datasource.service.interface';
import { Repository } from 'typeorm';
import { User } from '../../../../src/modules/users/entities/user';
import { defaultUser, defaultNewUser, defaultId, changeUserInfo } from '../../../mocks/userMock';
import { responseUserSchema, responseUserListSchema, responseEmptySchema } from './schemas';
import { responseErrorSchema } from '../schemas';
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

describe('Contract tests for routes /user', () => {
  describe('Route POST /user', () => {
    it('should return the content-type header as \"application/json; charset=utf-8\" to success response', async () => {
      await userRepository.delete({ id: defaultUser.id });
      const { headers } = await supertest(app).post('/user').send(defaultNewUser);
      expect(headers['content-type']).toStrictEqual('application/json; charset=utf-8');
    });

    it('should create a user and return it according to the schema', async () => {
      await userRepository.delete({ id: defaultUser.id });
      const { body } = await supertest(app).post('/user').send(defaultNewUser);
      await responseUserSchema.validateAsync(body, { abortEarly: false })
    });

    itContentTypeWhenError(async () => {
      return await supertest(app).post('/user').send({});
    });

    itSchemaWhenError(async () => {
      return await supertest(app).post('/user').send({});
    })
  });

  describe('Route GET /user', () => {
    it('should return the content-type header as \"application/json; charset=utf-8\" to success response', async () => {
      const { headers } = await supertest(app).get('/user');
      expect(headers['content-type']).toStrictEqual('application/json; charset=utf-8');
    });

    it('should return a list of users according to the schema', async () => {
      const { body } = await supertest(app).get('/user');
      await responseUserListSchema.validateAsync(body, { abortEarly: false });
    });

    itContentTypeWhenError(async () => {
      return await supertest(app).get('/user');
    })

    itSchemaWhenError(async () => {
      return await supertest(app).get('/user');
    })
  });

  describe('Route GET /user/:id', () => {
    it('should return the content-type header as \"application/json; charset=utf-8\" to success response', async () => {
      const { headers } = await supertest(app).get(`/user/${defaultId}`);
      expect(headers['content-type']).toStrictEqual('application/json; charset=utf-8');
    });

    it('should return a user by ID according to the schema', async () => {
      const { body } = await supertest(app).get(`/user/${defaultId}`);
      await responseUserSchema.validateAsync(body, { abortEarly: false });
    });

    itContentTypeWhenError(async () => {
      return await supertest(app).get(`/user/${defaultId}`);
    })

    itSchemaWhenError(async () => {
      return await supertest(app).get(`/user/${defaultId}`);
    })
  });

  describe('Route PATCH /user/:id', () => {
    it('should return the content-type header as \"application/json; charset=utf-8\" to success response', async () => {
      const { headers} = await supertest(app).patch(`/user/${defaultId}`).send(changeUserInfo);
      expect(headers['content-type']).toStrictEqual('application/json; charset=utf-8');
    });

    it('should change info an existing user and return it according to the schema', async () => {
      const { body } = await supertest(app).patch(`/user/${defaultId}`).send(changeUserInfo);
      await responseUserSchema.validateAsync(body, { abortEarly: false });
    });

    itContentTypeWhenError(async () => {
      return await supertest(app).patch(`/user/${defaultId}`).send(changeUserInfo);
    })

    itSchemaWhenError(async () => {
      return await supertest(app).patch(`/user/${defaultId}`).send(changeUserInfo);
    })
  });

  describe('Route POST /user/:id/change-password', () => {
    it('should return without content-type header to success response', async () => {
      const { headers } = await supertest(app)
        .post(`/user/${defaultId}/change-password`)
        .send({ password: defaultUser.password.split('').reverse().join('') });
      expect(headers['content-type']).toBeUndefined();
    });

    it('should change the password of a user and return a empty body', async () => {
      const { body } = await supertest(app)
        .post(`/user/${defaultId}/change-password`)
        .send({ password: defaultUser.password.split('').reverse().join('') });
      await responseEmptySchema.validateAsync(body, { abortEarly: false });
    });

    itContentTypeWhenError(async () => {
      return await supertest(app)
        .post(`/user/${defaultId}/change-password`)
        .send({ password: defaultUser.password.split('').reverse().join('') });
    });

    itSchemaWhenError(async () => {
      return await supertest(app)
        .post(`/user/${defaultId}/change-password`)
        .send({ password: defaultUser.password.split('').reverse().join('') });
    })
  });
});
