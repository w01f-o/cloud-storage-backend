import { getAuthConfig } from '@/core/config/auth.config';
import { MailerModule } from '@/core/mailer/mailer.module';
import { UserModule } from '@/modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthStrategy } from './auth.strategy';

@Module({
  imports: [
    UserModule,
    MailerModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getAuthConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthStrategy],
})
export class AuthModule {}
