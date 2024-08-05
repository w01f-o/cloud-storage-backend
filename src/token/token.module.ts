import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';

@Module({
  providers: [TokenService, JwtService, DatabaseService],
})
export class TokenModule {}
