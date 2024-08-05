import { Injectable } from '@nestjs/common';
import { RegistrationDto } from './dto/registrationDto';
import { LoginDto } from './dto/loginDto';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { MailService } from '../mail/mail.service';
import { TokenService } from '../token/token.service';
import { UserDto } from './dto/userDto';

@Injectable()
export class AuthService {
  public constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
  ) {}

  public async registration(registrationDto: RegistrationDto) {
    const candidate = await this.databaseService.user.findUnique({
      where: { email: registrationDto.email },
    });

    if (candidate) {
      throw new Error('User with such email already exists');
    }

    const { email, password, name } = registrationDto;
    const hashPassword = bcrypt.hashSync(password, 7);
    const activationLink = uuid.v4();

    const user = await this.databaseService.user.create({
      data: {
        password: hashPassword,
        email,
        name,
        activationLink,
      },
    });

    const userDto = new UserDto(user.id, user.email, user.isActivated);

    await this.mailService.sendActivationLink(
      email,
      `${process.env.API_URL}/auth/activate/${activationLink}`,
    );

    const tokens = await this.tokenService.generateTokens({ ...userDto });
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { user: userDto, ...tokens };
  }

  public login(loginDto: LoginDto) {
    return 'login';
  }

  public logout() {
    return 'logout';
  }

  public activate(link: string) {
    return link;
  }

  public refresh() {
    return 'refresh';
  }
}
