import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  public constructor(private readonly mailerService: MailerService) {}

  public async sendActivationLink(email: string, link: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Activate your account',
      template: 'activation',
      html: `<a href="${link}">Activate your account: ${link}</a>`,
    });
  }
}
