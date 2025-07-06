export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';

    Error.captureStackTrace?.(this, NotFoundError);
  }
}