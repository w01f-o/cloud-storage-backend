import { Controller } from '@nestjs/common';
import { FolderService } from './folder.service';

@Controller('folder')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}
}
