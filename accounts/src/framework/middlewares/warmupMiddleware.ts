import { Request, Response, NextFunction } from 'express';
import { errorMiddleware } from './errorMiddlewares/errorMiddleware';
import { ServiceUnavailableError } from '../exceptions';

enum Statuses {
  ACCEPT = 'accept',
  REJECT = 'reject',
  STANDBY = 'standby',
}

let processingStatus: Statuses = Statuses.ACCEPT;

/**
 * Sets status of requests control to `accept`
 *
 * Releases the processing of all requests, including those that were on standby
 */
export const releaseProcessing = () => processingStatus = Statuses.ACCEPT;

/**
 * Sets status of requests control to `reject`
 *
 * Starts rejecting new requests and all requests that are in a waiting state, if any
 */
export const rejectConnections = () => processingStatus = Statuses.REJECT;

/**
 * Sets status of requests control to `standby`
 *
 * Places all new requests on standby state until processing is released
 */
export const standbyProcessing = () => processingStatus = Statuses.STANDBY;

/**
 * Indicates whether request control is in the `reject` state
 */
export const isRejecting = () => processingStatus === Statuses.REJECT;

/**
 * Places the request in a waiting state until processing is released
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
const waitUntilStopStandby = async (req: Request, res: Response, next: NextFunction) => {
  const DELAY = 50;
  while (processingStatus === Statuses.STANDBY) {
    await new Promise((resolve) => setTimeout(resolve, DELAY));
  }
  if (processingStatus === Statuses.REJECT) {
    return errorMiddleware()(new ServiceUnavailableError(), req, res, next);
  }
  next();
}

/**
 * Middleware that implements methods that help control the flow of
 * requests during application warm-up.
 *
 * The `listen` method starts a UNIX socket and starts listening for
 * connections on the given path. However, although the application
 * is ready to receive connections, it may not be ready to process
 * them.
 *
 * This scenario can happen during application startup, specifically
 * while the database connection is being made or until other startup
 * tasks are completed.
 *
 * For these cases, you can adopt one of the approaches below (or
 * others, if you prefer):
 *
 * 1) Configure the load balancer to wait for "X" time after the
 * application initialization and, only then, start distributing
 * requests to the application; or
 *
 * 2) Allow the load balancer to distribute requests to the
 * application - without waiting time - and keep all of them on
 * standby until the warm-up ends.
 *
 * This middleware implements methods that help control the flow of
 * requests during application warm-up. Useful for scenarios in which
 * the load balancer will distribute requests to the application
 * immediately after it is started, that is, without any initial
 * waiting time.
 *
 * @param error
 * @param request
 * @param response
 */
export const warmupMiddleware =
  () => async (req: Request, res: Response, next: NextFunction) => {
    switch (processingStatus) {
      case Statuses.REJECT:
        return errorMiddleware()(new ServiceUnavailableError(), req, res, next);
      case Statuses.STANDBY:
        return await waitUntilStopStandby(req, res, next);
      default:
        return next();
    }
  };
