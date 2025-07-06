export class BadInputError extends Error {
    constructor(public fieldErrors: any) {
        super('Invalid input');
        this.name = 'BadInputError';
    }
}
