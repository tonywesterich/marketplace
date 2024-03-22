import { Container as InversifyContainer, interfaces } from 'inversify';
import { Bindable, BindableConstant, BindableDynamic } from './interfaces';

export class Container extends InversifyContainer {
  /**
   * Bind or rebind the service identifier. If the service
   * identifier is registered, rebind, otherwise bind
   *
   * @param identifier
   * @returns
   */
  private binding(
    identifier: interfaces.ServiceIdentifier<{}>,
  ): interfaces.BindingToSyntax<{}> {
    return this.isBound(identifier)
      ? this.rebind(identifier)
      : this.bind(identifier);
  }

  /**
   * Changes scope of the injected service to configured scope
   * in the bindable
   *
   * @param injected
   * @param bindabled
   */
  private changeScope(
    injected: interfaces.BindingInWhenOnSyntax<{}>,
    bindabled: Bindable | BindableDynamic,
  ): void {
    if (bindabled.singleton) {
      if (bindabled.requestScope) {
        injected.inRequestScope();
      } else {
        injected.inSingletonScope();
      }
    }
  }

  /**
   * Binds all services of list
   *
   * @param bindableList
   */
  public bindList(bindableList: Bindable[]): void {
    bindableList.forEach((bindable: Bindable) => {
      if (bindable.factory) {
        this.binding(bindable.identifier).toFactory(bindable.factory);
        return;
      }

      const injected = bindable.target
        ? this.binding(bindable.identifier).to(bindable.target)
        : this.binding(bindable.identifier).toSelf();

      this.changeScope(injected, bindable);
    });
  }

  /**
   * Binds all services of list to dynamic value
   *
   * @param bindableDynamicList
   */
  public bindDynamicList(bindableDynamicList: BindableDynamic[]): void {
    bindableDynamicList.forEach((bindable: BindableDynamic) => {
      const injected = this.binding(bindable.identifier)
        .toDynamicValue(bindable.target);

      this.changeScope(injected, bindable);
    });
  }

  /**
   * Binds all services of list to constant values
   *
   * @param bindableList
   */
  public bindConstantList(bindableList: BindableConstant[]): void {
    bindableList.forEach((bindable: BindableConstant) => {
      this.binding(bindable.identifier).toConstantValue(bindable.target);
    });
  }
}
