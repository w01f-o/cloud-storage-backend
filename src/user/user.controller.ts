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
import { ChangePasswordDto } from './dto/changePassword.dto';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async getUser(@Req() req: CustomRequest) {
    const { user } = req;

    return await this.userService.getUser(user);
  }

  @Get('/code')
  public async sendtActivationCode(@Req() req: CustomRequest) {
    const { user } = req;
    await this.userService.sendActivationCode(user);

    return {
      success: true,
    };
  }

  @Get('/storage')
  public async getStorage(@Req() req: CustomRequest) {
    const { user } = req;

    return await this.userService.getStorage(user);
  }

  @Patch('/email')
  public async changeEmail(
    @Req() req: CustomRequest,
    @Body('email') email: string,
  ) {
    const { user } = req;

    return await this.userService.changeEmail(user, email);
  }

  @Patch('/name')
  public async changeName(@Req() req: CustomRequest, @Body() name: string) {
    const { user } = req;

    return await this.userService.changeName(user, name);
  }

  @UseInterceptors(FileInterceptor('avatar'))
  @Patch('/avatar')
  public async changeAvatar(
    @Req() req: CustomRequest,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const { user } = req;
    console.log(user);
    return await this.userService.changeAvatar(user, avatar);
  }

  @Patch('/password')
  public async changePassword(
    @Req() req: CustomRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const { user } = req;

    return await this.userService.changePassword(user, changePasswordDto);
  }
}
