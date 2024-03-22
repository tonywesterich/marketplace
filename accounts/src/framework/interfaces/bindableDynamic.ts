import { interfaces } from 'inversify';

export interface BindableDynamic {
  identifier: interfaces.ServiceIdentifier<{}>;
  target: (context: interfaces.Context) => {} | interfaces.Newable<{}>;
  singleton?: boolean;
  requestScope?: boolean;
};
