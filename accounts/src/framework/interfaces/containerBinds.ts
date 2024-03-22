import { Bindable, BindableConstant, BindableDynamic } from '.';

export interface ContainerBinds {
  bind: Bindable[];
  bindConstant: BindableConstant[];
  bindDynamic: BindableDynamic[];
};
