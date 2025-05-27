import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { getMailerConfig } from './config/mailer.config';
import { configSchema } from './config/schema.config';
import { DatabaseModule } from './database/database.module';
import { FileModule } from './file/file.module';
import { FolderModule } from './folder/folder.module';
import { MailerModule } from './mailer/mailer.module';
import { PaymentModule } from './payment/payment.module';
import { SharedFileModule } from './shared-file/shared-file.module';
import { StorageModule } from './storage/storage.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: config => {
        const result = configSchema.safeParse(config);
        if (!result.success) {
          throw new Error(
            `Config validation error: ${JSON.stringify(result.error.format(), null, 2)}`
          );
        }

        return result.data;
      },
    }),
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMailerConfig,
    }),
    DatabaseModule,
    UserModule,
    FolderModule,
    FileModule,
    SharedFileModule,
    AuthModule,
    MailerModule,
    StorageModule,
    PaymentModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
