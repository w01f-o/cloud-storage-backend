import { AuthModule } from '@/modules/auth/auth.module';
import { FileModule } from '@/modules/file/file.module';
import { FolderModule } from '@/modules/folder/folder.module';
import { SharedFileModule } from '@/modules/shared-file/shared-file.module';
import { StorageModule } from '@/modules/storage/storage.module';
import { UserModule } from '@/modules/user/user.module';
import {
  MailerModule,
  MailerModule as NestMailerModule,
} from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envConfigSchema } from './config/env-schema.config';
import { getMailerConfig } from './config/mailer.config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: config => {
        const result = envConfigSchema.safeParse(config);
        if (!result.success) {
          throw new Error(
            `Config validation error: ${JSON.stringify(result.error.format(), null, 2)}`
          );
        }

        return result.data;
      },
      isGlobal: true,
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
  ],
})
export class CoreModule {}
