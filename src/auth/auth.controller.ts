import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { ActivateDto } from './dto/activate.dto';

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
    this.setRefreshToken(res, userData.refreshToken);

    return userData;
  }

  @Post('login')
  public async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ) {
    const userData = await this.authService.login(loginDto);
    this.setRefreshToken(res, userData.refreshToken);

    return userData;
  }

  @Post('logout')
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken } = req.cookies;
    const token = await this.authService.logout(refreshToken);
    res.clearCookie('refreshToken');

    return token;
  }

  @Post('activate')
  public async activate(@Body() activateDto: ActivateDto) {
    await this.authService.activate(activateDto);

    return {
      message: 'Account activated',
    };
  }

  @Get('refresh')
  public async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken } = req.cookies;
    const userData = await this.authService.refresh(refreshToken);
    this.setRefreshToken(res, userData.refreshToken);

    return userData;
  }
}
