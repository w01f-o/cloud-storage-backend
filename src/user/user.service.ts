import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { FileService } from 'src/file/file.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  public constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
    private readonly fileService: FileService,
  ) {}

  public async getUser(user) {
    const { id: userId } = user;
    const { avatar, name, email, id } =
      await this.databaseService.user.findUnique({
        where: {
          id: userId,
        },
      });

    return {
      avatar,
      name,
      email,
      id,
    };
  }

  public async changeName(user, name: string): Promise<User> {
    const { id } = user;
    const editedUser = await this.databaseService.user.update({
      where: {
        id,
      },
      data: {
        name,
        editedAt: new Date(),
      },
    });

    return editedUser;
  }

  public async changeEmail(user, email: string): Promise<User> {
    const { id } = user;
    const activationCode = this.mailService.generateActivationCode();
    const oldUser = await this.databaseService.user.findUnique({
      where: {
        id,
      },
    });

    if (oldUser.email === email) {
      throw new InternalServerErrorException('Email already exists');
    }

    const editedUser = await this.databaseService.user.update({
      where: {
        id,
      },
      data: {
        email: email,
        editedAt: new Date(),
        isActivated: false,
        activationCode,
      },
    });

    try {
      await this.mailService.sendActivationCode(email, activationCode);
    } catch (e) {
      await this.databaseService.user.update({
        where: {
          id,
        },
        data: {
          email: oldUser.email,
          editedAt: oldUser.editedAt,
          isActivated: true,
          activationCode: oldUser.activationCode,
        },
      });

      throw new InternalServerErrorException(e.message);
    }

    return editedUser;
  }

  public async changePassword(user, password: string): Promise<User> {
    const { id } = user;
    const editedUser = await this.databaseService.user.update({
      where: {
        id,
      },
      data: {
        password,
        editedAt: new Date(),
      },
    });

    return editedUser;
  }

  public async changeAvatar(user, avatar: Express.Multer.File): Promise<User> {
    const { id } = user;
    const filename = await this.fileService.saveFileOnServer(avatar, id, {
      isPublic: true,
    });

    const editedUser = await this.databaseService.user.update({
      where: {
        id,
      },
      data: {
        avatar: filename,
        editedAt: new Date(),
      },
    });

    return editedUser;
  }
}
