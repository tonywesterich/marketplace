import { framework } from '../src/framework';
import { middleware } from '../src/config/middleware';
import { ContainerBinds } from '../src/framework/interfaces/containerBinds';

export const frameworkToTest = (containerToBind: ContainerBinds) => {
  const { app, container } = framework
    .bind(containerToBind.bind)
    .bindConstant(containerToBind.bindConstant)
    .bindDynamic(containerToBind.bindDynamic)
    .middlewareError(middleware.error)
    .build();

  return {
    app,
    container
  }
}
