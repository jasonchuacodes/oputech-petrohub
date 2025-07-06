export class ConflictError extends Error {
  constructor(message = 'Conflict occurred') {
    super(message);
    this.name = 'ConflictError';
  }
}
