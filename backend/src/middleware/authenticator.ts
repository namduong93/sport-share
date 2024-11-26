import type {NextFunction, Request, Response} from 'express';
import { EXPIRED_TOKEN, INVALID_TOKEN, TOKEN_NOT_FOUND } from '../controllers/controller_util/httpErrorHandler.js';
import { sessionExpirationTime } from '../models/session/session.js';
import { SessionRepository } from '../repository/SessionRepository.js';

const ignoredRoutes = new Map();
ignoredRoutes.set('/student/register', 'POST');
ignoredRoutes.set('/staff/register', 'POST');
ignoredRoutes.set('/user/login', 'POST');
ignoredRoutes.set('/universities/list', 'GET');
ignoredRoutes.set('/images/football_landing.png', 'GET');
ignoredRoutes.set('/user/logout', 'POST');

export class Authenticator {
  /**
   * Middleware to authenticate incoming requests based on session cookies.
   * 
   * This middleware checks if the request URL and method match any of the ignored routes.
   * If a match is found, the request is passed to the next middleware without authentication.
   * 
   * If the request is not ignored, it attempts to retrieve the session ID from the request cookies.
   * If the session ID is not found, an error is thrown.
   * 
   * The middleware then attempts to find the session in the session repository.
   * If the session is not found or has expired, an error is thrown.
   * 
   * If the session is valid, the user ID from the session is attached to the request query
   * and the request is passed to the next middleware.
   * 
   * @param {SessionRepository} sessionRepository The repository to find sessions.
   * @returns {Function} The middleware function to handle authentication.
   * 
   * @throws {Error} TOKEN_NOT_FOUND - If the session ID is not found in the request cookies.
   * @throws {Error} INVALID_TOKEN - If the session is not found in the session repository.
   * @throws {Error} EXPIRED_TOKEN - If the session has expired.
   */
  authenticationMiddleware(sessionRepository: SessionRepository) {
    return async function(req: Request, res: Response, next: NextFunction) {
      try {
        // Checking if the route is in the ignored list
        for (const [route, method] of ignoredRoutes.entries()) {
          const pathRegex = new RegExp(`^${route}(\\?.*)?$`); 
          if (pathRegex.test(req.url) && method === req.method) {
            next();
            return;
          }
        }
        
        const reqSessionId = req.cookies.sessionId;
        if (!reqSessionId) {
          throw TOKEN_NOT_FOUND;
        }

        // Find the session in the database
        let session = await sessionRepository.find(reqSessionId);
        if (!session) {
          throw INVALID_TOKEN;
        }

        let expiresAt = session.createdAt + sessionExpirationTime;
        if (expiresAt < Math.floor(Date.now() / 1000)) {
          throw EXPIRED_TOKEN;
        }

        // Passing uuid to the next middleware
        req.query.userId = `${session.userId}`;
        next();

      } catch (err: any) {
        next(err);
      }
    };
  }
}
