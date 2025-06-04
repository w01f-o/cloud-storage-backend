import { FolderModule } from '@/modules/folder/folder.module';
import { StorageModule } from '@/modules/storage/storage.module';
import { forwardRef, Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [forwardRef(() => FolderModule), StorageModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
