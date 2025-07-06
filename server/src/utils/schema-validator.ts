import { ZodError, ZodSchema } from 'zod';

import { BadInputError } from '../errors/bad-input.error';

export const createSchemaValidator = (schema: ZodSchema) => {
    return async <T extends Record<string, any>>(data: T): Promise<T> => {
        try {
            return schema.parse(data);
        } catch (err) {
            if (err instanceof ZodError) {
                throw new BadInputError(err.flatten().fieldErrors);
            }

            throw err;
        }
    };
};
