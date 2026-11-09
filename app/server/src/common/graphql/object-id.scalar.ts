import { Scalar, CustomScalar } from '@nestjs/graphql'
import { GraphQLError, Kind, ValueNode } from 'graphql'
import { Types } from 'mongoose'

@Scalar('ObjectId')
export class ObjectIdScalar implements CustomScalar<string, Types.ObjectId> {
  description = 'A MongoDB ObjectId serialized as a 24-character hexadecimal string.'

  parseValue(value: unknown): Types.ObjectId {
    return this.toObjectId(value)
  }

  serialize(value: unknown): string {
    return this.toObjectId(value).toHexString()
  }

  parseLiteral(ast: ValueNode): Types.ObjectId {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('ObjectId must be provided as a string.')
    }

    return this.toObjectId(ast.value)
  }

  private toObjectId(value: unknown): Types.ObjectId {
    if (value instanceof Types.ObjectId) return value
    if (typeof value === 'string' && /^[a-f\d]{24}$/i.test(value)) {
      return new Types.ObjectId(value)
    }

    throw new GraphQLError('ObjectId must be a valid 24-character hexadecimal string.')
  }
}
