import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { FolderModule } from './folder/folder.module';
import { FileModule } from './file/file.module';
import { Shared_fileModule } from './shared_file/shared_file.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailModule } from './mail/mail.module';
import { TokenModule } from './token/token.module';
import { MailerModule } from '@nestjs-modules/mailer';
import * as process from 'node:process';
import { ConfigModule } from '@nestjs/config';
import { FileAccessMiddleware } from './file/file.middleware';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    FolderModule,
    FileModule,
    Shared_fileModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static', 'public'),
      serveRoot: '/cloud-api'
    }),
    MailModule,
    TokenModule,
    MailerModule.forRoot({
      transport: `smtps://${process.env.SMTP_USER}:${process.env.SMTP_PASSWORD}@${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`,
      defaults: {
        from: `"Cloud storage" <${process.env.SMTP_USER}>`,
      },
      template: {
        dir: join(__dirname, '..', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FileAccessMiddleware).forRoutes('*');
  }
}
