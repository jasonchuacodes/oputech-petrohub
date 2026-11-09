import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { hash } from 'argon2'
import { AppModule } from '../src/app.module'
import { MembershipRole } from '../src/modules/memberships/schemas/membership.schema'
import { MembershipsService } from '../src/modules/memberships/memberships.service'
import { TenantsService } from '../src/modules/tenants/tenants.service'
import { UsersService } from '../src/modules/users/users.service'

function required(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`${name} is required`)
  return value
}

async function bootstrap(): Promise<void> {
  const application = await NestFactory.createApplicationContext(AppModule)

  try {
    const users = application.get(UsersService)
    const tenants = application.get(TenantsService)
    const memberships = application.get(MembershipsService)
    const username = required('BOOTSTRAP_USERNAME').toLowerCase()
    const tenantKey = required('BOOTSTRAP_TENANT_KEY').toLowerCase()

    let user = await users.findForAuthentication(username)
    if (!user) {
      user = await users.create({
        displayName: required('BOOTSTRAP_DISPLAY_NAME'),
        username,
        passwordHash: await hash(required('BOOTSTRAP_PASSWORD')),
        shouldChangePassword: true,
      })
    }

    let tenant = await tenants.findByKey(tenantKey)
    if (!tenant) {
      tenant = await tenants.create({
        name: required('BOOTSTRAP_TENANT_NAME'),
        key: tenantKey,
        timezone: process.env.BOOTSTRAP_TIMEZONE?.trim() || 'Asia/Manila',
        currency: process.env.BOOTSTRAP_CURRENCY?.trim() || 'PHP',
      })
    }

    const existingMembership = await memberships.findActive(tenant._id, user._id)
    if (!existingMembership) {
      await memberships.create({
        tenantId: tenant._id,
        userId: user._id,
        employeeCode: process.env.BOOTSTRAP_EMPLOYEE_CODE?.trim() || '0001',
        role: MembershipRole.Admin,
      })
    }

    console.log(`Bootstrap administrator ready: ${username} (${tenant.name})`)
  } finally {
    await application.close()
  }
}

void bootstrap()
