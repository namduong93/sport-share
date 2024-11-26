import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { DbError } from '../../errors/DbError.js';
import { ServiceError } from '../../errors/ServiceError.js';


export type HTTPFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;
export function httpErrorHandler(httpFunction: HTTPFunction) {
  return async function(req: Request, res: Response, next: NextFunction) {
    // Call given function and pass on any error status code/messages
    try {
      await httpFunction(req, res, next);
    } catch (err: unknown) {
      // dev: 
      console.log(err);
      
      if (createHttpError.isHttpError(err)) {
        // err is auto cast to a HttpError here.
        res.status(err.statusCode).json(err);
        return;
      }

      if (err instanceof DbError) {
        if (err.getErrorType() === DbError.Auth) {
          res.status(403).send(err.message);
          return;
        }
        if (err.getErrorType() === DbError.Query) {
          res.status(400).send(err.message);
          return;
        }
        if (err.getErrorType() === DbError.Insert) {
          res.status(400).send(err.message);
          return;
        }
      }

      if (err instanceof ServiceError) {
        if (err.getErrorType() === ServiceError.Auth) {
          res.status(403).send(err.message);
          return;
        }
      }

      next(err);
    }
  };
}

export const TOKEN_NOT_FOUND = createHttpError(403, 'Token not found');
export const INVALID_TOKEN = createHttpError(403, 'Invalid token');
export const EXPIRED_TOKEN = createHttpError(403, 'Expired token');
export const BAD_REQUEST = createHttpError(400, 'Bad request');
export const USER_NOT_FOUND = createHttpError(400, 'User is not existed');

// competition error
export const COMPETITION_NOT_FOUND = createHttpError(400, 'Competition not found');
export const SITE_NAMES_MUST_BE_UNIQUE = createHttpError(400, 'Site names must be unique');
export const COMPETITION_ADMIN_REQUIRED = createHttpError(400, 'User is not an admin');
export const COMPETITION_COACH_REQUIRED = createHttpError(400, 'User is not a coach');
export const COMPETITION_STUDENT_REQUIRED = createHttpError(400, 'User is not a student');

export const COMPETITION_USER_REGISTERED = createHttpError(400, 'User already registered in competition');
