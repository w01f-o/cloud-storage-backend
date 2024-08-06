import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  public constructor(private readonly mailerService: MailerService) {}

  public async sendActivationCode(email: string, code: number) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Activate your account',
      template: 'activation',
      html: `<div>Activate your account: ${code}</div>`,
    });
  }
}
