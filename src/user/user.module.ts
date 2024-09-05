import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseService } from 'src/database/database.service';
import { TokenService } from 'src/token/token.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { FileService } from 'src/file/file.service';
import { AuthService } from 'src/auth/auth.service';
import { FolderService } from 'src/folder/folder.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    DatabaseService,
    TokenService,
    JwtService,
    MailService,
    FileService,
    AuthService,
    FolderService,
  ],
})
export class UserModule {}
