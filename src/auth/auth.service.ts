import { DatabaseService } from '@/database/database.service';
import { MailerService } from '@/mailer/mailer.service';
import { UserNotFoundException } from '@/user/exceptions/UserNotFound.exception';
import { UserService } from '@/user/user.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { verify } from 'argon2';
import { CookieOptions, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { InvalidActivationCodeException } from './exceptions/InvalidActivationCode.exception';
import { InvalidCredentialsException } from './exceptions/InvalidCredentials.exception';
import { InvalidRefreshTokenException } from './exceptions/InvalidRefreshToken.exception';
import { UserAlreadyExistsException } from './exceptions/UserAlreadyExists.exception';
import { RawAuthData } from './types/raw-auth.type';
import { JwtPayload, JwtTokens } from './types/tokens.type';

@Injectable()
export class AuthService {
  private readonly EXPIRE_MINUTES_ACCESS_TOKEN = '30m';
  private readonly EXPIRE_DAY_REFRESH_TOKEN = '30d';

  private readonly _REFRESH_TOKEN_NAME = 'refreshToken';
  private readonly _ACCESS_TOKEN_NAME = 'accessToken';

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly database: DatabaseService,
    private readonly mailerService: MailerService,
    private readonly userService: UserService
  ) {}

  get ACCESS_TOKEN_NAME(): string {
    return this._ACCESS_TOKEN_NAME;
  }

  get REFRESH_TOKEN_NAME(): string {
    return this._REFRESH_TOKEN_NAME;
  }

  private async validateUser(dto: RegisterDto | LoginDto): Promise<User> {
    const user = await this.database.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isValid = await verify(user.password, dto.password);

    if (!isValid) throw new InvalidCredentialsException();

    return user;
  }

  private generateTokens(payload: JwtPayload): JwtTokens {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.EXPIRE_MINUTES_ACCESS_TOKEN,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.EXPIRE_DAY_REFRESH_TOKEN,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public async activate(userId: string, code: number): Promise<void> {
    const user = await this.database.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new UserNotFoundException();

    if (user.activationCode !== code)
      throw new InvalidActivationCodeException();

    await this.database.user.update({
      where: {
        id: userId,
      },
      data: {
        isActivated: true,
      },
    });
  }

  public async login(dto: LoginDto): Promise<RawAuthData> {
    const user = await this.validateUser(dto);

    const tokens = this.generateTokens({
      id: user.id,
    });

    return {
      user,
      ...tokens,
    };
  }

  public async register(dto: RegisterDto): Promise<RawAuthData> {
    const userFromDb = await this.database.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (userFromDb) throw new UserAlreadyExistsException();

    const user = await this.userService.create(dto);
    const tokens = this.generateTokens({
      id: user.id,
    });

    this.mailerService.sendActivationCode(user.email, user.activationCode);

    return {
      user,
      ...tokens,
    };
  }

  public async refresh(refreshToken: string): Promise<RawAuthData> {
    let decodedTokenPayload: JwtPayload;

    try {
      decodedTokenPayload =
        await this.jwtService.verifyAsync<JwtPayload>(refreshToken);
    } catch {
      throw new InvalidRefreshTokenException();
    }

    const user = await this.database.user.findUnique({
      where: { id: decodedTokenPayload.id },
    });

    const tokens = this.generateTokens({
      id: user.id,
    });

    return {
      user,
      ...tokens,
    };
  }

  public async logout(res: Response): Promise<void> {
    this.removeTokensFromCookie(res);
  }

  public addTokensToCookie(res: Response, tokens: JwtTokens): void {
    const refreshExpiresIn = new Date();
    refreshExpiresIn.setDate(
      refreshExpiresIn.getDate() + parseInt(this.EXPIRE_DAY_REFRESH_TOKEN)
    );

    const accessTokenExpiresIn = new Date();
    accessTokenExpiresIn.setMinutes(
      accessTokenExpiresIn.getMinutes() +
        parseInt(this.EXPIRE_MINUTES_ACCESS_TOKEN)
    );

    const options: CookieOptions = {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      sameSite: 'lax',
      secure: this.configService.get('NODE_ENV') === 'production',
    };

    res.cookie(this.REFRESH_TOKEN_NAME, tokens.refreshToken, {
      ...options,
      expires: refreshExpiresIn,
    });
    res.cookie(this.ACCESS_TOKEN_NAME, tokens.accessToken, {
      ...options,
      expires: accessTokenExpiresIn,
    });
  }

  public removeTokensFromCookie(res: Response): void {
    const options: CookieOptions = {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      sameSite: 'lax',
      secure: this.configService.get('NODE_ENV') === 'production',
    };

    res.clearCookie(this.REFRESH_TOKEN_NAME, options);
    res.clearCookie(this.ACCESS_TOKEN_NAME, options);
  }
}
