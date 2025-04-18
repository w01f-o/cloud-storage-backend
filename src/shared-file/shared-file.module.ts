import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { FileModule } from 'src/file/file.module';
import { StorageModule } from 'src/storage/storage.module';
import { SharedFileController } from './shared-file.controller';
import { SharedFileService } from './shared-file.service';

@Module({
  imports: [DatabaseModule, FileModule, StorageModule],
  controllers: [SharedFileController],
  providers: [SharedFileService],
  exports: [SharedFileService],
})
export class SharedFileModule {}
