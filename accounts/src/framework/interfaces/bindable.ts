import { interfaces } from 'inversify';

export interface Bindable {
  identifier: interfaces.ServiceIdentifier<{}>;
  target?: interfaces.Newable<{}>;
  factory?: interfaces.FactoryCreator<{}>;
  singleton?: boolean;
  requestScope?: boolean;
};
