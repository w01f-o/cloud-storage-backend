import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { ActivateDto } from './dto/activate.dto';
import { CustomRequest } from 'src/types/request.type';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setRefreshToken(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      maxAge: +process.env.JWT_COOKIE_MAX_AGE,
      httpOnly: true,
    });
  }

  @Post('registration')
  public async registration(
    @Res({ passthrough: true }) res: Response,
    @Body() registrationDto: RegistrationDto,
  ) {
    const userData = await this.authService.registration(registrationDto);
    this.setRefreshToken(res, userData.tokens.refresh);

    return userData;
  }

  @Post('login')
  public async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ) {
    const userData = await this.authService.login(loginDto);
    this.setRefreshToken(res, userData.tokens.refresh);

    return userData;
  }

  @Post('logout')
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() { token }: { token: string },
  ) {
    let { refreshToken } = req.cookies;
    if (!refreshToken) {
      refreshToken = token;
    }

    const deletedToken = await this.authService.logout(refreshToken);
    res.clearCookie('refreshToken');

    return { token: deletedToken };
  }

  @UseGuards(AuthGuard)
  @Post('activate')
  public async activate(
    @Req() req: CustomRequest,
    @Body() activateDto: ActivateDto,
  ) {
    const { user } = req;

    await this.authService.activate(user, activateDto);

    return {
      message: 'Account activated',
    };
  }

  @Post('refresh')
  public async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() { token }: { token: string },
  ) {
    let { refreshToken } = req.cookies;
    if (!refreshToken) {
      refreshToken = token;
    }

    const userData = await this.authService.refresh(refreshToken);

    this.setRefreshToken(res, userData.tokens.refresh);

    return userData;
  }
}
