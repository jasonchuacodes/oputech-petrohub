export class BadInputError extends Error {
    status = 400;
    constructor(public fieldErrors: any) {
        super('Invalid input');
        this.name = 'BadInputError';
    }
}
