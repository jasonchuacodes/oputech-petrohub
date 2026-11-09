import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import {
  Membership,
  MembershipDocument,
  MembershipRole,
  MembershipStatus,
} from './schemas/membership.schema'

@Injectable()
export class MembershipsService {
  constructor(@InjectModel(Membership.name) private readonly memberships: Model<Membership>) {}

  create(input: {
    tenantId: Types.ObjectId
    userId: Types.ObjectId
    employeeCode: string
    role: MembershipRole
  }): Promise<MembershipDocument> {
    return this.memberships.create(input)
  }

  findActiveForUser(userId: Types.ObjectId): Promise<MembershipDocument[]> {
    return this.memberships
      .find({ userId, status: MembershipStatus.Active })
      .sort({ createdAt: 1 })
      .exec()
  }

  findActive(tenantId: Types.ObjectId, userId: Types.ObjectId): Promise<MembershipDocument | null> {
    return this.memberships
      .findOne({ tenantId, userId, status: MembershipStatus.Active })
      .exec()
  }
}
