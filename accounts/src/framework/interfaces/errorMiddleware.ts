import { NextFunction, Request, Response } from 'express';

export type ErrorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => void;
