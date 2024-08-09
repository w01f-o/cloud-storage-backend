import { Module } from '@nestjs/common';
import { SharedFileService } from './shared-file.service';
import { SharedFileController } from './shared-file.controller';
import { DatabaseService } from 'src/database/database.service';
import { TokenService } from 'src/token/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [SharedFileController],
  providers: [SharedFileService, DatabaseService, TokenService, JwtService],
})
export class SharedFileModule {}
