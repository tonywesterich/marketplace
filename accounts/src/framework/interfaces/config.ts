import { AppListenerService } from '../services/appListenerService';

export const config = {
  middleware: [],
  errorMiddleware: [],
  bind: [
    { identifier: AppListenerService, singleton: true },
  ],
  bindConstant: [],
};
