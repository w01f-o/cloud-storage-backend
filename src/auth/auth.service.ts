import { Injectable } from '@nestjs/common';
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { TokenService } from '../token/token.service';
import { UserDto } from './dto/user.dto';
import { ActivateDto } from './dto/activate.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  public constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
  ) {}

  private generateActivationCode(): number {
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  }

  public async registration(registrationDto: RegistrationDto) {
    const { email, password, name } = registrationDto;

    const candidate = await this.databaseService.user.findUnique({
      where: { email },
    });

    if (candidate) {
      throw new Error('User with such email already exists');
    }

    const hashPassword = bcrypt.hashSync(password, 7);
    const activationCode = this.generateActivationCode();

    const user = await this.databaseService.user.create({
      data: {
        password: hashPassword,
        email,
        name,
        activationCode,
      },
    });

    const userDto = new UserDto(user.id, user.email, user.isActivated);

    await this.mailService.sendActivationCode(email, activationCode);

    const tokens = await this.tokenService.generateTokens({ ...userDto });
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { user: userDto, ...tokens };
  }

  public login(loginDto: LoginDto) {
    return loginDto;
  }

  public logout() {
    return 'logout';
  }

  public async activate(activateDto: ActivateDto): Promise<void> {
    const { code, email } = activateDto;
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User with such email does not exist');
    }

    if (user.activationCode !== code) {
      throw new Error('Wrong code');
    }

    await this.databaseService.user.update({
      where: { email },
      data: { isActivated: true },
    });
  }

  public refresh() {
    return 'refresh';
  }
}
