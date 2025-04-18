import { MailerService as NestMailerModule } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerService {
  public constructor(private readonly mailer: NestMailerModule) {}

  public generateActivationCode(): number {
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  }

  public async sendActivationCode(email: string, code: number): Promise<void> {
    try {
      await this.mailer.sendMail({
        to: email,
        subject: 'Подтверждение аккаунта',
        template: 'activation',
        context: {
          code,
        },
      });
    } catch {
      /* empty */
    }
  }
}
