import { Module } from '@nestjs/common';
import { Shared_fileService } from './shared_file.service';
import { Shared_fileController } from './shared_file.controller';
import { DatabaseService } from 'src/database/database.service';
import { TokenService } from 'src/token/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [Shared_fileController],
  providers: [Shared_fileService, DatabaseService, TokenService, JwtService],
})
export class Shared_fileModule {}
