import { CustomScalar, Scalar } from '@nestjs/graphql'
import { GraphQLError, Kind, ValueNode } from 'graphql'

const decimalPattern = /^-?(?:0|[1-9]\d*)(?:\.\d+)?$/

@Scalar('Decimal')
export class DecimalScalar implements CustomScalar<string, string> {
  description = 'An exact decimal serialized as a string.'

  parseValue(value: unknown): string {
    return parseDecimal(value)
  }

  serialize(value: unknown): string {
    if (typeof value === 'string') return parseDecimal(value)
    if (typeof value === 'object' && value !== null && 'toString' in value) {
      return parseDecimal(String(value))
    }
    throw new GraphQLError('Decimal values must serialize as strings.')
  }

  parseLiteral(node: ValueNode): string {
    if (node.kind !== Kind.STRING) throw new GraphQLError('Decimal values must be strings.')
    return parseDecimal(node.value)
  }
}

function parseDecimal(value: unknown): string {
  if (typeof value !== 'string' || !decimalPattern.test(value)) {
    throw new GraphQLError('Use a decimal string without separators or exponents.')
  }
  return value
}
