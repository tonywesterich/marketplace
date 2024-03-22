import 'reflect-metadata';
import { Application as ExpressApplication } from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Middleware } from './interfaces/middleware';
import { OnShutdown, config } from './interfaces';
import { Bindable, BindableConstant, BindableDynamic } from './interfaces';
import { Container } from './container';
import { ErrorMiddleware } from './interfaces';
import * as warmupMiddleware from './middlewares/warmupMiddleware';
import { ShutdownSignalsTracking } from './services/shutdownSignalsTracking';
import { ILoggerService, ILoggerServiceName } from './interfaces';
import { AfterUp } from './interfaces';

/**
 * A tiny wrapper around Express and Inversify to simplify the
 * inversion of control. It also includes some basic features
 * such as logger, shutdown signals tracker for handle graceful
 * shutdown, customized exceptions and middlewares for handle
 * error and application warmup
 */
export class InversifyExpressApplication {
  public container: Container;

  public server: InversifyExpressServer;

  public app: ExpressApplication;

  private shutdownSignalsTracker: ShutdownSignalsTracking;

  private logger: ILoggerService;

  private serverConfig: {
    middleware: Middleware[];
    errorMiddleware: ErrorMiddleware[];
    port?: number;
    afterUp?: AfterUp;
    onShutdownEvent?: OnShutdown;
  } = {
    middleware: [
      warmupMiddleware.warmupMiddleware(),
    ],
    errorMiddleware: [],
  };

  constructor() {
    this.container = new Container();
    this.setupDefaultConfig();
  }

  /**
   * Configures default values
   */
  private setupDefaultConfig() {
    this.middleware(config.middleware);
    this.middlewareError(config.errorMiddleware);
    this.bind(config.bind);
    this.bindConstant(config.bindConstant);
  }

  /**
   * Attaches all registered middleware to the express application
   *
   * @param app
   */
  private registerMiddlewares(app: ExpressApplication): void {
    this.serverConfig.middleware.forEach((middleware: Middleware) => {
      app.use(middleware);
    });
  }

  /**
   * Attaches all registered error middleware to the express application
   *
   * @param app
   */
  private registerErrorMiddlewares(app: ExpressApplication): void {
    this.serverConfig.errorMiddleware.forEach((middleware: ErrorMiddleware) => {
      app.use(middleware);
    });
  }

  /**
   * Disables the `X-Powered-By` response header, as recommended by
   * Production Best Practices: Security
   * (https://expressjs.com/en/advanced/best-practice-security.html)
   */
  private reduceFingerprinting(): void {
    this.app.disable('x-powered-by');
  }

  /**
   * Set the application settings to configure the behavior of the server
   */
  private setApplicationSettings(): void {
    this.app.set('port', this.serverConfig.port || process.env.PORT || 3000);
    this.app.set('env', process.env.NODE_ENV || 'production');
    this.reduceFingerprinting();
  }

  /**
   * Performs the shutdown event
   */
  private async performOnShutdown(): Promise<void> {
    if (this.serverConfig.onShutdownEvent) {
      await this.serverConfig.onShutdownEvent();
    }
  }

  /**
   * Injects dependencies at runtime. This is necessary because
   * this class (`InversifyExpressApplication`) is what creates
   * the container, therefore, container manipulation must be
   * done programmatically
   */
  private injectBasicDependencies(): void {
    this.logger = this.container.get(ILoggerServiceName);
    this.shutdownSignalsTracker = this.container
      .get(ShutdownSignalsTracking);
    this.shutdownSignalsTracker.onShutdown(async () => {
      await this.performOnShutdown();
    });
  }

  /**
   * Starts the forceful shutdown.
   *
   * With that forceful shutdown in place, the application attempts
   * graceful shutdown.
   */
  private async forceShutdown(): Promise<void> {
    this.logger.info('Forcing shutdown')
    try {
      await this.shutdownSignalsTracker.forceShutdown();
    } catch (error: any) {
      this.logger.error(
        `Unable to force shutdown: ${error.message}`, { error }
      );
    }
  }

  /**
   * Performs the after up event
   */
  private async performAfterUp(): Promise<void> {
    if (this.serverConfig.afterUp) {
      await this.serverConfig.afterUp(this);
    }
  }

  /**
   * Set the server port
   *
   * @param value
   * @returns InversifyExpressApplication
   */
  public port(value: number): InversifyExpressApplication {
    this.serverConfig.port = value;

    return this;
  }

  /**
   * Adds a list of middleware that will be used by the Express
   * Application. Do not include error middleware. For error
   * middleware, use `middlewareError` method
   *
   * @param middlewareList
   * @returns InversifyExpressApplication
   */
  public middleware(
    middlewareList: Middleware[]
  ): InversifyExpressApplication {
    this.serverConfig.middleware =
      this.serverConfig.middleware.concat(middlewareList);

    return this;
  }

  /**
   * Adds a list of error middleware that will be used by the Express
   * Application.
   *
   * @param errorMiddlewareList
   * @returns InversifyExpressApplication
   */
  public middlewareError(
    errorMiddlewareList: ErrorMiddleware[]
  ): InversifyExpressApplication {
    this.serverConfig.errorMiddleware =
      this.serverConfig.errorMiddleware.concat(errorMiddlewareList);

    return this;
  }

  /**
   * Adds a list of bindable services to the container
   *
   * @param bindableList
   * @returns
   */
  public bind(bindableList: Bindable[]): InversifyExpressApplication {
    this.container.bindList(bindableList);

    return this;
  }

  /**
   * Adds a list of constants bindable services to the container
   *
   * @param bindableList
   * @returns
   */
  public bindConstant(
    bindableList: BindableConstant[]
  ): InversifyExpressApplication {
    this.container.bindConstantList(bindableList);

    return this;
  }

  /**
   * Adds a list of dynamic bindable services to the container
   *
   * @param bindableDynamicList
   * @returns
   */
  public bindDynamic(
    bindableDynamicList: BindableDynamic[]
  ): InversifyExpressApplication {
    this.container.bindDynamicList(bindableDynamicList);

    return this;
  }

  /**
   * Adds a hook that will run after the server starts
   * listening for connections
   *
   * @param event
   * @returns
   */
  public afterUp(event: AfterUp): InversifyExpressApplication {
    this.serverConfig.afterUp = event;

    return this;
  }

  /**
   * Adds a hook that will run on application is shutdown
   *
   * @param event
   * @returns
   */
  public onShutdown(event: OnShutdown): InversifyExpressApplication {
    this.serverConfig.onShutdownEvent = event;

    return this;
  }

  /**
   * Create a InversifyExpressServer, attaches all registered
   * controllers and middleware to the express application and
   * set the application settings to configure the behavior of
   * the server.
   *
   * Returns the application instance.
   *
   * @returns InversifyExpressApplication
   */
  public build(): InversifyExpressApplication {
    this.server = new InversifyExpressServer(this.container);

    this.app = this.server
      .setConfig(
        (app: ExpressApplication) => this.registerMiddlewares(app)
      )
      .setErrorConfig(
        (app: ExpressApplication) => this.registerErrorMiddlewares(app)
      )
      .build();

    this.setApplicationSettings()

    this.injectBasicDependencies();

    return this;
  }

  /**
   * Listens for connections on the configured host and port,
   * starts tracker of the shutdown signals, perform warmup
   * of the application and run after up event.
   */
  public up() {
    this.app.listen(this.app.get('port'), async () => {
      this.shutdownSignalsTracker.start();

      warmupMiddleware.standbyProcessing();
      try {
        await this.performAfterUp();

        warmupMiddleware.releaseProcessing();
      } catch (error: any) {
        this.logger.error(
          `Unable to start application: ${error.message}`, { error }
        );
        await this.forceShutdown();
        throw error;
      }
    });
  }
}
