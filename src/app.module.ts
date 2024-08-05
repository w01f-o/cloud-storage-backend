import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { FolderModule } from './folder/folder.module';
import { FileModule } from './file/file.module';
import { SharedFileModule } from './shared-file/shared-file.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailModule } from './mail/mail.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    FolderModule,
    FileModule,
    SharedFileModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    MailModule,
    TokenModule,
  ],
})
export class AppModule {}
