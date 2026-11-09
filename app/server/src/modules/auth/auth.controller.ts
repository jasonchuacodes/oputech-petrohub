import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { ZodValidationPipe } from '../../common/validation/zod-validation.pipe'
import { CurrentActor } from './decorators/current-actor.decorator'
import { AuthenticatedActor } from './auth.types'
import { AuthService } from './auth.service'
import {
  ChangePasswordInput,
  changePasswordSchema,
  LoginInput,
  loginSchema,
} from './auth.schemas'
import { CsrfGuard } from './guards/csrf.guard'
import { OriginGuard } from './guards/origin.guard'
import { SessionGuard } from './guards/session.guard'

@Controller('api/auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @UseGuards(OriginGuard)
  login(
    @Body(new ZodValidationPipe(loginSchema)) input: LoginInput,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.auth.login(input, response)
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(OriginGuard, SessionGuard, CsrfGuard)
  logout(
    @CurrentActor() actor: AuthenticatedActor,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.auth.logout(actor, response)
  }

  @Get('me')
  @UseGuards(SessionGuard)
  me(@CurrentActor() actor: AuthenticatedActor) {
    return this.auth.me(actor)
  }

  @Get('csrf')
  @UseGuards(SessionGuard)
  async csrf(@CurrentActor() actor: AuthenticatedActor) {
    return { csrfToken: await this.auth.rotateCsrf(actor) }
  }

  @Post('change-password')
  @HttpCode(200)
  @UseGuards(OriginGuard, SessionGuard, CsrfGuard)
  changePassword(
    @CurrentActor() actor: AuthenticatedActor,
    @Body(new ZodValidationPipe(changePasswordSchema)) input: ChangePasswordInput,
  ) {
    return this.auth.changePassword(actor, input)
  }
}
