import { interfaces } from 'inversify';

export interface BindableConstant {
  identifier: interfaces.ServiceIdentifier<{}>;
  target: {};
};
