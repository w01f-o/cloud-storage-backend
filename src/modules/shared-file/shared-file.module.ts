import { FileModule } from '@/modules/file/file.module';
import { StorageModule } from '@/modules/storage/storage.module';
import { Module } from '@nestjs/common';
import { SharedFileController } from './shared-file.controller';
import { SharedFileService } from './shared-file.service';

@Module({
  imports: [FileModule, StorageModule],
  controllers: [SharedFileController],
  providers: [SharedFileService],
  exports: [SharedFileService],
})
export class SharedFileModule {}
