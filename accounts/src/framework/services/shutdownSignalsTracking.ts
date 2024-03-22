import { inject, injectable } from 'inversify';
import { AppListenerService } from './appListenerService';
import { ILoggerService, ILoggerServiceName } from '../interfaces';
import { OnShutdown } from '../interfaces/onShutdown';

const TERMINATION_SIGNALS: NodeJS.Signals[] = [
  'SIGTERM',
  'SIGINT',
  'SIGHUP',
  'SIGBREAK',
  'SIGQUIT',
]

@injectable()
export class ShutdownSignalsTracking {
  @inject(AppListenerService)
  private readonly appListener: AppListenerService;

  @inject(ILoggerServiceName)
  private readonly logger: ILoggerService;

  private shutdowning: boolean = false;

  private onShutdownEvent?: OnShutdown;

  private isShutdowning(): boolean {
    return this.shutdowning;
  }

  private setShutdowning(value: boolean): void {
    this.shutdowning = value;
  }

  public onShutdown(event: OnShutdown): void {
    this.onShutdownEvent = event;
  }

  private async performOnShutdown(): Promise<void> {
    if (this.onShutdownEvent) {
      await this.onShutdownEvent();
    }
  }

  private async startGracefulShutdown(): Promise<void> {
    this.logger.info('Starting graceful shutdown');
    if (this.isShutdowning()) {
      return;
    }
    this.setShutdowning(true);

    await this.performOnShutdown();

    try {
      await this.appListener.emit('exit');
    } catch (error) {
      this.logger.error('Unable to emit EXIT event:', { error });
    }
  }

  private removesAllListenersThatRunExitProcess(signal: NodeJS.Signals): void {
    const listeners = process.listeners(signal);

    process.removeAllListeners(signal);

    listeners.forEach((listener) => {
      if (!listener.toString().includes('process.exit(')) {
        process.on(signal, listener);
      }
    });
  }

  private addSignalListener(signal: NodeJS.Signals): void {
    process.on(signal, async () => {
      this.logger.info('Received fast shutdown request');
      await this.startGracefulShutdown();
      process.exit(0);
    });
  }

  private startSignalsListener(): void {
    TERMINATION_SIGNALS.forEach(signal => {
      this.removesAllListenersThatRunExitProcess(signal);
      this.addSignalListener(signal)
    });
  }

  public start(): void {
    this.startSignalsListener();
  }

  public async forceShutdown(): Promise<void> {
    await this.startGracefulShutdown();
  }
}
