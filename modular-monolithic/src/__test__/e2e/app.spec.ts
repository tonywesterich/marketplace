import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@app/app.module';
import request from 'supertest';

describe('AppResolver (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    module.close();
  });

  describe('sayHello query', () => {
    it('returns "Hello World!"', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            query {
              sayHello
            }
          `,
        })
        .expect(200);

      expect(response.body.data.sayHello).toStrictEqual('Hello World!');
    });
  });
});
