import { Injectable, PipeTransform } from '@nestjs/common'
import { z } from 'zod'
import { InvalidInputException } from '../exceptions'

@Injectable()
export class ZodValidationPipe<T extends z.ZodType> implements PipeTransform<unknown, z.output<T>> {
  constructor(private readonly schema: T) {}

  transform(value: unknown): z.output<T> {
    const result = this.schema.safeParse(value)
    if (result.success) return result.data

    throw new InvalidInputException('Please correct the invalid input fields.', {
      details: z.flattenError(result.error).fieldErrors,
    })
  }
}
