import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UseAuth } from '@/auth/decorators/use-auth.decorator';
import { Controller, Get } from '@nestjs/common';
import { StorageService } from './storage.service';
import { UserStorageResponse } from './responses/user-storage.response';

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
