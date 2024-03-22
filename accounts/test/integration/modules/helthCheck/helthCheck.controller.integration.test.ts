import { describe, it, expect } from '@jest/globals';
import { frameworkToTest } from '../../../frameworkToTest';
import { datasourceTest, getContainerToBind } from '../../../../src/config';
import supertest from 'supertest';

const containerToBind = getContainerToBind(datasourceTest);
const { app } = frameworkToTest(containerToBind);

describe('Routes helth check', () => {
  describe('Route GET /', () => {
    it('should return helth check data', async () => {
      const { body, status } = await supertest(app).get('/');
      expect(status).toStrictEqual(200);
      expect(body.name).toEqual('User Account Management API');
    });
  });
});
