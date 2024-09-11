import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { TokenService } from '../token/token.service';
import { UserDto } from './dto/user.dto';
import { ActivateDto } from './dto/activate.dto';
import { User } from '@prisma/client';
import { ErrorsEnum } from '../types/errors.type';
import { AuthResponse } from 'src/types/authResponse';

@Injectable()
export class AuthService {
  public constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
  ) {}

  public generateHashPassword(password: string, salt: number): string {
    return bcrypt.hashSync(password, salt);
  }

  public compareHashPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  private async generateAndSaveToken(user: User): Promise<AuthResponse> {
    const { id, email, isActivated, name, avatar } = user;
    const userDto = new UserDto(id, email, name, avatar, isActivated);

    const tokens = await this.tokenService.generateTokens({ ...userDto });
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      user: userDto,
      tokens: {
        access: tokens.accessToken,
        refresh: tokens.refreshToken,
        accessExpiresIn: Date.now() + 1000 * 60 * 60,
        refreshExpiresIn: Date.now() + 1000 * 60 * 60 * 24 * 30,
      },
    };
  }

  public async registration(registrationDto: RegistrationDto) {
    const { email, password, name } = registrationDto;

    const candidate = await this.databaseService.user.findUnique({
      where: { email },
    });

    if (candidate) {
      throw new ConflictException({
        message: 'User with such email already exists',
        type: ErrorsEnum.USER_WITH_SUCH_EMAIL_ALREADY_EXISTS,
      });
    }

    const hashPassword = this.generateHashPassword(password, 7);
    const activationCode = this.mailService.generateActivationCode();

    const user = await this.databaseService.user.create({
      data: {
        password: hashPassword,
        email,
        name,
        activationCode,
      },
    });

    const response = await this.generateAndSaveToken(user);

    try {
      await this.mailService.sendActivationCode(email, activationCode);
    } catch (e) {
      await this.databaseService.user.delete({ where: { id: user.id } });
      await this.tokenService.removeToken(response.tokens.refresh);

      throw new InternalServerErrorException({
        message: e.message,
        type: ErrorsEnum.MAILER_ERROR,
      });
    }

    return response;
  }

  public async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.databaseService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: 'Wrong email or password',
        type: ErrorsEnum.WRONG_EMAIL_OR_PASSWORD,
      });
    }

    const isPassEquals = this.compareHashPassword(password, user.password);

    if (!isPassEquals) {
      throw new UnauthorizedException({
        message: 'Wrong email or password',
        type: ErrorsEnum.WRONG_EMAIL_OR_PASSWORD,
      });
    }

    return await this.generateAndSaveToken(user);
  }

  public async logout(refreshToken: string) {
    return await this.tokenService.removeToken(refreshToken);
  }

  public async activate(user, activateDto: ActivateDto): Promise<void> {
    const { code } = activateDto;
    const { id: userId } = user;

    const userFromDb = await this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userFromDb) {
      throw new UnauthorizedException({
        message: 'User with such email not found',
        type: ErrorsEnum.USER_WITH_SUCH_EMAIL_NOT_FOUND,
      });
    }

    if (userFromDb.activationCode !== code) {
      throw new UnauthorizedException({
        message: 'Wrong activation code',
        type: ErrorsEnum.WRONG_ACTIVATION_CODE,
      });
    }

    await this.databaseService.user.update({
      where: {
        id: userId,
      },
      data: { isActivated: true },
    });
  }

  public async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException({
        message: 'No refresh token',
        type: ErrorsEnum.NO_REFRESH_TOKEN,
      });
    }

    const userData = await this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw new UnauthorizedException({
        message: 'Wrong refresh token',
        type: ErrorsEnum.WRONG_REFRESH_TOKEN,
      });
    }

    const user = await this.databaseService.user.findUnique({
      where: { id: userData.id },
    });

    return await this.generateAndSaveToken(user);
  }
}
