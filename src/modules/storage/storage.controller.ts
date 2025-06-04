import { CurrentUser } from '@/modules/auth/decorators/current-user.decorator';
import { UseAuth } from '@/modules/auth/decorators/use-auth.decorator';
import { Controller, Get } from '@nestjs/common';
import { UserStorageResponse } from './responses/user-storage.response';
import { StorageService } from './storage.service';

@UseAuth()
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  async getUserStorage(
    @CurrentUser('id') userId: string
  ): Promise<UserStorageResponse> {
    return this.storageService.getUserStorage(userId);
  }
}
