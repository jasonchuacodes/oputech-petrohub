import { Module } from '@nestjs/common'
import { ObjectIdScalar } from './object-id.scalar'
import { DecimalScalar } from './decimal.scalar'

@Module({
  providers: [ObjectIdScalar, DecimalScalar],
  exports: [ObjectIdScalar, DecimalScalar],
})
export class CommonGraphqlModule {}
