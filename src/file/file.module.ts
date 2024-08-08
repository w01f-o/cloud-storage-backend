import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { DatabaseService } from 'src/database/database.service';
import { TokenService } from 'src/token/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [FileController],
  providers: [FileService, DatabaseService, TokenService, JwtService],
})
export class FileModule {}
