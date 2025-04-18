import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
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
import { StorageService } from './storage/storage.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configSchema,
      validationOptions: { abortEarly: true },
    }),
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMailerConfig,
    }),
    ServeStaticModule.forRootAsync({
      imports: [StorageModule],
      inject: [StorageService],
      useFactory: (storageService: StorageService) => [
        { rootPath: storageService.getPublicFilePath() },
      ],
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
})
export class AppModule {}
