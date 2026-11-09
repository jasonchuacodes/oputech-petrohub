import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'
import { ZodValidationPipe } from '../../../common/validation/zod-validation.pipe'
import { Environment } from '../../../config/environment'
import { AuthenticatedActor } from '../auth.types'
import { LoginInput, loginSchema } from '../auth.schemas'
import { CurrentActor } from '../decorators/current-actor.decorator'
import { OriginGuard } from '../guards/origin.guard'
import { CurrentRefreshTokenClaims } from './current-refresh-token-claims.decorator'
import { AccessTokenGuard } from './guards/access-token.guard'
import { RefreshTokenGuard } from './guards/refresh-token.guard'
import {
  createClearCookieOptions,
  createRefreshCookieOptions,
} from './session-cookie'
import { REFRESH_TOKEN_COOKIE } from './session.constants'
import { SessionService } from './session.service'
import { RefreshTokenClaims } from './session.types'

@Controller('api/auth/session')
export class SessionController {
  constructor(
    private readonly sessions: SessionService,
    private readonly config: ConfigService<Environment, true>,
  ) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  verifySession(@CurrentActor() actor: AuthenticatedActor) {
    return { user: actor.user }
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(OriginGuard)
  async postSession(
    @Body(new ZodValidationPipe(loginSchema)) input: LoginInput,
    @Res({ passthrough: true }) response: Response,
  ) {
    const session = await this.sessions.postSession(input)
    this.setRefreshCookie(response, session.refreshToken, session.dateTimeExpiration)
    return session.response
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(OriginGuard, RefreshTokenGuard)
  async postSessionRefresh(
    @CurrentRefreshTokenClaims() claims: RefreshTokenClaims,
    @Res({ passthrough: true }) response: Response,
  ) {
    const session = await this.sessions.postSessionRefresh(claims)
    this.setRefreshCookie(response, session.refreshToken, session.dateTimeExpiration)
    return session.response
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(OriginGuard, RefreshTokenGuard)
  async deleteSession(
    @CurrentRefreshTokenClaims() claims: RefreshTokenClaims,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.sessions.deleteSession(claims)
    response.clearCookie(
      REFRESH_TOKEN_COOKIE,
      createClearCookieOptions(this.config.get('NODE_ENV', { infer: true })),
    )
  }

  private setRefreshCookie(
    response: Response,
    refreshToken: string,
    dateTimeExpiration: Date,
  ): void {
    response.cookie(
      REFRESH_TOKEN_COOKIE,
      refreshToken,
      createRefreshCookieOptions(
        this.config.get('NODE_ENV', { infer: true }),
        dateTimeExpiration,
      ),
    )
  }
}
