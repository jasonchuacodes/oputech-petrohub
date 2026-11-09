import { Module } from '@nestjs/common'
import { ObjectIdScalar } from './object-id.scalar'

@Module({
  providers: [ObjectIdScalar],
  exports: [ObjectIdScalar],
})
export class CommonGraphqlModule {}
