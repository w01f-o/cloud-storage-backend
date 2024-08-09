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

@Injectable()
export class AuthService {
  public constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
  ) {}

  private generateHashPassword(password: string, salt: number): string {
    return bcrypt.hashSync(password, salt);
  }

  private compareHashPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  private async generateAndSaveToken(user: User): Promise<{
    user: typeof userDto;
    refreshToken: string;
    accessToken: string;
  }> {
    const { id, email, isActivated } = user;
    const userDto = new UserDto(id, email, isActivated);

    const tokens = await this.tokenService.generateTokens({ ...userDto });
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { user: userDto, ...tokens };
  }

  public async registration(registrationDto: RegistrationDto) {
    const { email, password, name } = registrationDto;

    const candidate = await this.databaseService.user.findUnique({
      where: { email },
    });

    if (candidate) {
      throw new ConflictException('User with such email already exists');
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
      await this.tokenService.removeToken(response.refreshToken);
      throw new InternalServerErrorException(e.message);
    }

    return response;
  }

  public async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.databaseService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User with such email does not exist');
    }

    const isPassEquals = this.compareHashPassword(password, user.password);

    if (!isPassEquals) {
      throw new UnauthorizedException('Wrong password');
    }

    return await this.generateAndSaveToken(user);
  }

  public async logout(refreshToken: string) {
    const token = await this.tokenService.removeToken(refreshToken);
    return token;
  }

  public async activate(activateDto: ActivateDto): Promise<void> {
    const { code, email } = activateDto;
    const user = await this.databaseService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User with such email does not exist');
    }

    if (user.activationCode !== code) {
      throw new UnauthorizedException('Wrong code');
    }

    await this.databaseService.user.update({
      where: { email },
      data: { isActivated: true },
    });
  }

  public async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('No refresh token');
    }

    const userData = await this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw new UnauthorizedException('Wrong refresh token');
    }

    const user = await this.databaseService.user.findUnique({
      where: { id: userData.id },
    });

    return await this.generateAndSaveToken(user);
  }
}
