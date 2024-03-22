import { describe, it, expect } from '@jest/globals';
import { frameworkToTest } from '../../../frameworkToTest';
import { datasourceTest, getContainerToBind } from '../../../../src/config';
import { responseHelthCheckSchema } from './schemas';
import supertest from 'supertest';

const containerToBind = getContainerToBind(datasourceTest);
const { app } = frameworkToTest(containerToBind);

describe('Contract tests for route / (helth check)', () => {
  describe('Route GET /', () => {
    it('should return the content-type header as \"application/json; charset=utf-8\" to success response', async () => {
      const { headers } = await supertest(app).get('/').send();
      expect(headers['content-type']).toStrictEqual('application/json; charset=utf-8');
    });

    it('should return helth check data according to the schema', async () => {
      const { body } = await supertest(app).get('/').send();
      await responseHelthCheckSchema.validateAsync(body, { abortEarly: false });
    });
  });
});
