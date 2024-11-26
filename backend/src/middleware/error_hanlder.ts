import {NextFunction, Request, Response} from "express";
import {AppError, EXPIRED_TOKEN, INVALID_TOKEN, TOKEN_NOT_FOUND} from "../utils/error";

export function handleError (err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.message)
  if (err instanceof AppError) {
    if ([TOKEN_NOT_FOUND, INVALID_TOKEN, EXPIRED_TOKEN].includes(err)) {
      return res.status(401).send({
        success: false,
        message: err.message
      });
    }
    return res.status(400).send({
      success: false,
      message: err.message
    });
  }

  return res.status(400).send({
    success: false,
    message: "Unknown Error"
  })
}