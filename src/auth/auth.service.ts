import { Injectable } from '@nestjs/common';
import { RegistrationDto } from './dto/registrationDto';
import { LoginDto } from './dto/loginDto';
import { DatabaseService } from '../database/database.service';
import bcrypt from 'bcrypt';
import uuid from 'uuid';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  public constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
  ) {}

  public async registration(registrationDto: RegistrationDto) {
    const candidate = this.databaseService.user.findUnique({
      where: { email: registrationDto.email },
    });

    if (candidate) {
      throw new Error('User with such email already exists');
    }

    const { email, password, name } = registrationDto;
    const hashPassword = await bcrypt.hash(password, 7);
    const activationLink = uuid.v4();
    const user = this.databaseService.user.create({
      data: {
        password: hashPassword,
        email,
        name,
        avatar: 'no-avatar.svg',
        capacity: 1024 * 1024 * 1024 * 5,
        freeSpace: 1024 * 1024 * 1024 * 5,
        activationLink,
      },
    });
    await this.mailService.sendActivationLink(email, activationLink);

    return 'registration';
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
