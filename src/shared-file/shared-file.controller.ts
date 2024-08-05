import { Controller } from '@nestjs/common';
import { SharedFileService } from './shared-file.service';

@Controller('shared-file')
export class SharedFileController {
  constructor(private readonly sharedFileService: SharedFileService) {}
}
