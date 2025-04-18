import { DatabaseModule } from '@/database/database.module';
import { FolderModule } from '@/folder/folder.module';
import { StorageModule } from '@/storage/storage.module';
import { forwardRef, Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [forwardRef(() => FolderModule), StorageModule, DatabaseModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
