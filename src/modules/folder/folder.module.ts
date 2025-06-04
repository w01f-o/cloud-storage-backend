import { FileModule } from '@/modules/file/file.module';
import { forwardRef, Module } from '@nestjs/common';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';

@Module({
  imports: [forwardRef(() => FileModule)],
  controllers: [FolderController],
  providers: [FolderService],
  exports: [FolderService],
})
export class FolderModule {}
