import { InversifyExpressApplication } from '../inversifyExpressApplication';

export type AfterUp =
  | ((app: InversifyExpressApplication) => Promise<void>)
  | ((app: InversifyExpressApplication) => void);
