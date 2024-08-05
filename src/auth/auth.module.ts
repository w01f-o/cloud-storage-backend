import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseService } from '../database/database.service';
import { MailService } from '../mail/mail.service';
import { TokenService } from '../token/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    DatabaseService,
    MailService,
    TokenService,
    JwtService,
  ],
})
export class AuthModule {}
