export type OnShutdown =
  | (() => Promise<void>)
  | (() => void);
