import { InversifyExpressApplication } from './framework/inversifyExpressApplication';
import { middleware } from './config/middleware';
import { StartupService } from './services/startupService';
import { ILoggerService, ILoggerServiceName } from './framework/interfaces';
import * as warmupMiddleware from './framework/middlewares/warmupMiddleware';

import { PORT } from './config/environment';

import './modules/helthCheck/helthCheck.controller';
import './modules/users/users.controller';
import './modules/validateUser/validateUser.controller';

const framework = new InversifyExpressApplication()
  .port(PORT)
  .middleware(middleware.default)
  .afterUp(async (app) => {
    await app.container.get(StartupService).start(app);
  })
  .onShutdown(() => {
    const logger = framework.container.get<ILoggerService>(ILoggerServiceName);
    logger?.info('Blocking the receipt of new requests');
    warmupMiddleware.rejectConnections();
  });

export { framework };
