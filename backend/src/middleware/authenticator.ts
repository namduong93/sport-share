import type {NextFunction, Request, Response} from "express";
import {DynamoDBSessionRepository} from "../repository/session/dynamodb";
import * as AWS from "aws-sdk";
import {EXPIRED_TOKEN, INVALID_TOKEN, TOKEN_NOT_FOUND} from "../utils/error";

const ignoredRoutes = new Map();
ignoredRoutes.set("/users/authenticate", "POST");
ignoredRoutes.set("/users", "POST");

export class Authenticator {

  static extractTokenFromHeader(req: Request) {

    const AUTHORIZATION_HEADER: string = "Authorization";
    const AUTH_HEADER_PREFIX: string = "Bearer";
    const authorizationHeader = req.header(AUTHORIZATION_HEADER);

    if (!authorizationHeader || !authorizationHeader.startsWith(AUTH_HEADER_PREFIX)) {
      throw TOKEN_NOT_FOUND;
    }
    return authorizationHeader.substring(7, authorizationHeader.length);
  }

  async authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
      // Checking if the route is in the ignored list
      if (ignoredRoutes.has(req.url) && ignoredRoutes.get(req.url) === req.method) {
          next();
          return;
      }

      const token = req.cookies.token;
      if (!token) {
        throw TOKEN_NOT_FOUND;
      }

      // Instead, we check with our sessions table
      let sessionRepository = new DynamoDBSessionRepository(new AWS.DynamoDB());
      let session = await sessionRepository.find(token);

      // Check if session exists
      if (!session) {
        throw INVALID_TOKEN;
      }

      // Check if token is expired
      // let expiresAt = parseInt(session.expiresAt);
      // if (expiresAt < Math.floor(Date.now() / 1000)) {
      //   throw EXPIRED_TOKEN;
      // }

      // Passing uuid to the next middleware
      res.locals.uuid = session.uuid;
      next();

    } catch (err: any) {
      next(err);
    }
  }
}
