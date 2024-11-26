import { ErrorInterface } from './ErrorInterface';

export enum ServiceErrorType {
  Auth = 'Auth',
  NotFound = 'NotFound',
}

/**
 * Represents an error that occurred during a service operation.
 */
export class ServiceError extends Error implements ErrorInterface {
  
  private errorType: ServiceErrorType | string;

  constructor(errorType: ServiceErrorType | string, message: string) {
    super(message);
    this.errorType = errorType;
    this.name = 'DbError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
  
  static Auth = ServiceErrorType.Auth;
  static NotFound = ServiceErrorType.NotFound;

  getErrorType() {
    return this.errorType;
  }
}