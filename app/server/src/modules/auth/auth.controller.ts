import { Body, Controller, Headers, HttpCode, Post, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ForbiddenException } from '../../common/exceptions'
import { ZodValidationPipe } from '../../common/validation/zod-validation.pipe'
import { Environment } from '../../config/environment'
import { CurrentActor } from './decorators/current-actor.decorator'
import { AuthenticatedActor } from './auth.types'
import { AuthService } from './auth.service'
import {
  ChangePasswordInput,
  changePasswordSchema,
  RegisterInput,
  registerSchema,
} from './auth.schemas'
import { OriginGuard } from './guards/origin.guard'
import { AccessTokenGuard } from './session/guards/access-token.guard'

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService<Environment, true>,
  ) {}

  @Post('register')
  register(
    @Body(new ZodValidationPipe(registerSchema)) input: RegisterInput,
    @Headers('x-superadmin-script-secret') secret?: string,
  ) {
    const configuredSecret = this.config.get('SUPERADMIN_SCRIPT_SECRET', { infer: true })
    if (!configuredSecret || !secret || secret !== configuredSecret) {
      throw new ForbiddenException('The super admin registration secret is invalid or missing.')
    }

    return this.auth.register(input)
  }

  @Post('change-password')
  @HttpCode(200)
  @UseGuards(OriginGuard, AccessTokenGuard)
  changePassword(
    @CurrentActor() actor: AuthenticatedActor,
    @Body(new ZodValidationPipe(changePasswordSchema)) input: ChangePasswordInput,
  ) {
    return this.auth.changePassword(actor, input)
  }
}
