import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registrationDto';
import { LoginDto } from './dto/loginDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  public registration(@Body() registrationDto: RegistrationDto) {
    return this.authService.registration(registrationDto);
  }

  @Post('login')
  public login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  public logout() {
    return this.authService.logout();
  }

  @Get('activate/:link')
  public activate(@Param('link') link: string) {
    return this.authService.activate(link);
  }

  @Get('refresh')
  public refresh() {
    return this.authService.refresh();
  }
}
