import { Response } from 'express';
import {
  BaseHttpController,
  controller,
  httpGet,
  response
} from 'inversify-express-utils';

@controller('/')
export class HelthCheckController extends BaseHttpController {
  @httpGet('/')
  public helthCheck(@response() res: Response) {
    return res.json({
      name: 'User Account Management API',
      date: new Date(),
    });
  }
}
