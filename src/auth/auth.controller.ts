import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { ActivateDto } from './dto/activate.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  public async registration(
    @Res({ passthrough: true }) res: Response,
    @Body() registrationDto: RegistrationDto,
  ) {
    const userData = await this.authService.registration(registrationDto);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return userData;
  }

  @Post('login')
  public async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ) {
    const userData = await this.authService.login(loginDto);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return userData;
  }

  @Post('logout')
  public logout() {
    return this.authService.logout();
  }

  @Post('activate')
  public async activate(@Body() activateDto: ActivateDto) {
    await this.authService.activate(activateDto);

    return {
      message: 'Account activated',
    };
  }

  @Get('refresh')
  public refresh() {
    return this.authService.refresh();
  }
}
