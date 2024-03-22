import { injectable } from 'inversify';

type ExitListener = (() => Promise<void>) | (() => void);
type Listeners = ExitListener;

@injectable()
export class AppListenerService {
  private listeners: { [key: string]: Listeners[] } = {};

  public addListener(event: 'exit', listener: ExitListener): AppListenerService {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
    return this;
  }

  public on(event: 'exit', listener: ExitListener): AppListenerService {
    this.addListener(event, listener);
    return this;
  }

  public async emit(event: 'exit'): Promise<AppListenerService> {
    if (Object.keys(this.listeners).length > 0) {
      for (const listener of this.listeners[event]) {
        await (listener as ExitListener)();
      }
    }
    return this;
  }
}
