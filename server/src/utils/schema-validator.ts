import { ZodError, ZodSchema, z } from 'zod';

import { BadInputError } from '../errors/bad-input.error';

export const createSchemaValidator = <T extends ZodSchema>(schema: T) => {
    return async (data: unknown): Promise<z.infer<T>> => {
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
