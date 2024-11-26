export class AppError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const TOKEN_NOT_FOUND = new AppError("Token not found");
export const INVALID_TOKEN = new AppError("Invalid token");
export const EXPIRED_TOKEN = new AppError("Expired token");

export const BAD_REQUEST = new AppError("Bad request");

export const USER_NOT_FOUND = new AppError("User is not existed");