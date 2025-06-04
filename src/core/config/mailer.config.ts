import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const getMailerConfig = (
  configService: ConfigService
): MailerOptions => {
  const host = configService.get('SMTP_HOST');
  const port = configService.get('SMTP_PORT');
  const user = configService.get('SMTP_USER');
  const password = configService.get('SMTP_PASSWORD');

  const appName = configService.get('APP_NAME');

  return {
    transport: {
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass: password,
      },
    },
    defaults: {
      from: `"${appName}" <${user}>`,
    },
    template: {
      dir: join(__dirname, '..', '..', '..', 'templates'),
      adapter: new HandlebarsAdapter(undefined, {
        inlineCssEnabled: true,
        inlineCssOptions: { keepLinkTags: true },
      }),
      options: { strict: true },
    },
  };
};
