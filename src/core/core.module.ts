import { AuthModule } from '@/modules/auth/auth.module';
import { FileModule } from '@/modules/file/file.module';
import { FolderModule } from '@/modules/folder/folder.module';
import { SharedFileModule } from '@/modules/shared-file/shared-file.module';
import { StorageModule } from '@/modules/storage/storage.module';
import { UserModule } from '@/modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfigSchema } from './config/env-schema.config';
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
    DatabaseModule,
    UserModule,
    FolderModule,
    FileModule,
    SharedFileModule,
    AuthModule,
    StorageModule,
  ],
})
export class CoreModule {}
