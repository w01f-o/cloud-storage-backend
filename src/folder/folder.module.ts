import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { DatabaseService } from 'src/database/database.service';
import { TokenService } from 'src/token/token.service';

@Module({
  controllers: [FolderController],
  providers: [FolderService, DatabaseService, TokenService],
})
export class FolderModule {}
