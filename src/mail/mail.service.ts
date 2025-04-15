import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  public constructor(private readonly mailer: MailerService) {}

  public generateActivationCode(): number {
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  }

  public async sendActivationCode(email: string, activationCode: number) {
    await this.mailer.sendMail({
      to: email,
      subject: 'Activate your account',
      template: 'activation',
      context: {
        code: activationCode,
      },
    });
  }
}
