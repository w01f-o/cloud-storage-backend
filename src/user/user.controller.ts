import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CustomRequest } from 'src/types/request.type';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async getUser(@Req() req: CustomRequest) {
    const { user } = req;
    const foundedUser = await this.userService.getUser(user);

    return foundedUser;
  }

  @Get('/storage')
  public async getStorage(@Req() req: CustomRequest) {
    const { user } = req;
    const storage = await this.userService.getStorage(user);

    return storage;
  }

  @Patch('/email')
  public async changeEmail(
    @Req() req: CustomRequest,
    @Body('email') email: string,
  ) {
    const { user } = req;
    const editedUser = await this.userService.changeEmail(user, email);

    return editedUser;
  }

  @Patch('/name')
  public async changeName(@Req() req: CustomRequest, @Body() name: string) {
    const { user } = req;
    const editedUser = await this.userService.changeName(user, name);

    return editedUser;
  }

  @UseInterceptors(FileInterceptor('avatar'))
  @Patch('/avatar')
  public async changeAvatar(
    @Req() req: CustomRequest,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const { user } = req;
    const editedUser = await this.userService.changeAvatar(user, avatar);

    return editedUser;
  }

  @Patch('/password')
  public async changePassword(
    @Req() req: CustomRequest,
    @Body('password') password: string,
  ) {
    const { user } = req;
    const editedUser = await this.userService.changePassword(user, password);

    return editedUser;
  }
}
