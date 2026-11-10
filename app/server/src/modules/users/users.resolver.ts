import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { ZodValidationPipe } from '../../common/validation/zod-validation.pipe'
import { AuthenticatedActor, AuthorizedTenant } from '../auth/auth.types'
import { CurrentActor } from '../auth/decorators/current-actor.decorator'
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator'
import { RequireRoles, RolesGuard } from '../auth/guards/roles.guard'
import { TenantAccessGuard } from '../auth/guards/tenant-access.guard'
import { AccessTokenGuard } from '../auth/session/guards/access-token.guard'
import { UserRole } from './schemas/user.schema'
import {
  createUserInputSchema,
  CreateUserInput,
  deleteUserInputSchema,
  DeleteUserInput,
  updateUserInputSchema,
  UpdateUserInput,
  updateMyProfileInputSchema,
  UpdateMyProfileInput,
  usersInputSchema,
  UsersInput,
} from './users.schemas'
import { UserRecord, UsersService } from './users.service'

const userManagementGuards = [AccessTokenGuard, TenantAccessGuard, RolesGuard]

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('users')
  @UseGuards(...userManagementGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  users(
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(usersInputSchema)) input: UsersInput,
  ): Promise<{ items: UserRecord[]; totalCount: number }> {
    return this.usersService.listUsers(this.toScope(tenant), input)
  }

  @Mutation('createUser')
  @UseGuards(...userManagementGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  createUser(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(createUserInputSchema)) input: CreateUserInput,
  ) {
    return this.usersService.provisionUser(this.toActor(actor), this.toScope(tenant), input)
  }

  @Mutation('updateUser')
  @UseGuards(...userManagementGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  updateUser(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(updateUserInputSchema)) input: UpdateUserInput,
  ) {
    return this.usersService.updateUser(this.toActor(actor), this.toScope(tenant), input)
  }

  @Mutation('updateMyProfile')
  @UseGuards(AccessTokenGuard)
  updateMyProfile(
    @CurrentActor() actor: AuthenticatedActor,
    @Args('input', new ZodValidationPipe(updateMyProfileInputSchema)) input: UpdateMyProfileInput,
  ) {
    return this.usersService.updateMyProfile(actor.userId, input)
  }

  @Mutation('deleteUser')
  @UseGuards(...userManagementGuards)
  @RequireRoles(UserRole.SUPERADMIN, UserRole.ADMIN)
  deleteUser(
    @CurrentActor() actor: AuthenticatedActor,
    @CurrentTenant() tenant: AuthorizedTenant,
    @Args('input', new ZodValidationPipe(deleteUserInputSchema)) input: DeleteUserInput,
  ): Promise<boolean> {
    return this.usersService.deleteUser(this.toActor(actor), this.toScope(tenant), input)
  }

  @ResolveField('id')
  id(@Parent() user: UserRecord) {
    return user._id
  }

  @ResolveField('fullName')
  fullName(@Parent() user: UserRecord): string {
    return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username
  }

  private toScope(tenant: AuthorizedTenant) {
    return {
      accountHolderId: tenant.tenant.accountHolderId,
      tenantId: tenant.tenantId,
    }
  }

  private toActor(actor: AuthenticatedActor) {
    return { userId: actor.userId, role: actor.user.role }
  }
}
