export class ConflictError extends Error {
  status = 409;
  constructor(message = 'Conflict occurred') {
    super(message);
    this.name = 'ConflictError';
  }
}
