export class UnauthenticatedError extends Error {
  status = 401;
  constructor(message = 'Unauthenticated') {
    super(message);
    this.name = 'UnauthenticatedError';
  }
}
