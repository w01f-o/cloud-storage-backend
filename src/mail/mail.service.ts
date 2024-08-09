import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  public constructor(private readonly mailerService: MailerService) {}

  public generateActivationCode(): number {
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  }

  public async sendActivationCode(email: string, activationCode: number) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Activate your account',
      template: 'activation',
      html: `<div>Activate your account: ${activationCode}</div>`,
    });
  }
}
