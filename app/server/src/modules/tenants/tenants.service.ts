import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Tenant, TenantDocument, TenantStatus } from './schemas/tenant.schema'

@Injectable()
export class TenantsService {
  constructor(@InjectModel(Tenant.name) private readonly tenants: Model<Tenant>) {}

  create(input: Pick<Tenant, 'name' | 'key' | 'timezone' | 'currency'>): Promise<TenantDocument> {
    return this.tenants.create({ ...input, key: input.key.trim().toLowerCase() })
  }

  findActiveById(tenantId: Types.ObjectId | string): Promise<TenantDocument | null> {
    return this.tenants.findOne({ _id: tenantId, status: TenantStatus.Active }).exec()
  }

  findByKey(key: string): Promise<TenantDocument | null> {
    return this.tenants.findOne({ key: key.trim().toLowerCase() }).exec()
  }
}
