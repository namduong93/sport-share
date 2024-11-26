import { ErrorInterface } from './ErrorInterface';

enum DbErrorType {
  Auth = 'Auth',
  Query = 'Query',
  Insert = 'Insert', 
  Update = 'Update',
}

/**
 * Represents an error that occurred during a database operation.
 */
export class DbError extends Error implements ErrorInterface {
  
  private errorType: DbErrorType | string;

  constructor(errorType: DbErrorType | string, message: string) {
    super(message);
    this.errorType = errorType;
    this.name = 'DbError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
  
  static Auth = DbErrorType.Auth;
  static Query = DbErrorType.Query;
  static Insert = DbErrorType.Insert;
  static Update = DbErrorType.Update;
  

  getErrorType() {
    return this.errorType;
  }
}