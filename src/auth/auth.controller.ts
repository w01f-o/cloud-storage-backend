import { Body, Controller, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { ActivateDto } from './dto/activate.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InvalidRefreshTokenException } from './exceptions/InvalidRefreshToken.exception';
import { AuthResponse } from './responses/auth.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) reply: FastifyReply
  ): Promise<AuthResponse> {
    const { user, refreshToken, accessToken } =
      await this.authService.login(dto);

    this.authService.addTokensToCookie(reply, { accessToken, refreshToken });

    return new AuthResponse({ user, accessToken });
  }

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) reply: FastifyReply
  ): Promise<AuthResponse> {
    const { user, refreshToken, accessToken } =
      await this.authService.register(dto);

    this.authService.addTokensToCookie(reply, { accessToken, refreshToken });

    return new AuthResponse({ user, accessToken });
  }

  @Post('refresh')
  async refresh(
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply
  ): Promise<AuthResponse> {
    const refreshTokenFromCookie: string | null =
      request.cookies[this.authService.REFRESH_TOKEN_NAME];

    if (!refreshTokenFromCookie) {
      throw new InvalidRefreshTokenException();
    }

    const { user, refreshToken, accessToken } = await this.authService.refresh(
      refreshTokenFromCookie
    );

    this.authService.addTokensToCookie(reply, { accessToken, refreshToken });

    return new AuthResponse({ user: user, accessToken: accessToken });
  }

  @Patch('/activate/:userId')
  async activate(
    @Param('userId') userId: string,
    @Body() { code }: ActivateDto
  ): Promise<boolean> {
    await this.authService.activate(userId, code);

    return true;
  }

  @Post('logout')
  async logout(
    @Res({ passthrough: true }) reply: FastifyReply
  ): Promise<boolean> {
    await this.authService.logout(reply);

    return true;
  }
}
