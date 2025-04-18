import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UseAuth } from 'src/auth/decorators/use-auth.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidateAvatarFilePipe } from './pipes/validate-avatar-file.pipe';
import { UserResponse } from './responses/user.response';
import { UserService } from './user.service';

@UseAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findMe(@CurrentUser() user: User): Promise<UserResponse> {
    return new UserResponse(user);
  }

  @UseInterceptors(FileInterceptor('avatar'))
  @Patch()
  async update(
    @CurrentUser('id') id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile(ValidateAvatarFilePipe())
    avatarFile: Express.Multer.File
  ): Promise<UserResponse> {
    return this.userService.update(id, dto, avatarFile);
  }

  @Delete()
  async delete(@CurrentUser('id') id: string): Promise<UserResponse> {
    return this.userService.delete(id);
  }
}
