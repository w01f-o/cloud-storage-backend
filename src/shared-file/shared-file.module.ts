import { Module } from '@nestjs/common';
import { SharedFileService } from './shared-file.service';
import { SharedFileController } from './shared-file.controller';

@Module({
  controllers: [SharedFileController],
  providers: [SharedFileService],
})
export class SharedFileModule {}
