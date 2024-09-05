import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { FileService } from 'src/file/file.service';
import { MailService } from 'src/mail/mail.service';
import { ErrorsEnum } from 'src/types/errors.type';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  public constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
    private readonly fileService: FileService,
    private readonly authService: AuthService,
  ) {}

  public async getUser(user) {
    const { id: userId } = user;
    const { avatar, name, email, id, isActivated } =
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
      isActivated,
    };
  }

  public async sendActivationCode(user) {
    const { id: userId } = user;

    const { activationCode, email } =
      await this.databaseService.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          activationCode: true,
          email: true,
        },
      });

    try {
      await this.mailService.sendActivationCode(email, activationCode);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  public async changeName(user, name: string): Promise<User> {
    const { id } = user;

    return this.databaseService.user.update({
      where: {
        id,
      },
      data: {
        name,
        editedAt: new Date(),
      },
    });
  }

  public async getStorage(user) {
    const { id: userId } = user;
    const storageFromDb = await this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        usedSpace: true,
        freeSpace: true,
        capacity: true,
        files: {
          select: {
            type: true,
            size: true,
          },
        },
      },
    });

    const storage = Array.from(
      new Set(storageFromDb.files.map((file) => file.type)),
    ).map((type) => ({
      type,
      size: storageFromDb.files.reduce((acc, file) => {
        if (file.type === type) {
          return acc + file.size;
        }

        return acc;
      }, 0),
    }));

    return {
      category: storage,
      space: {
        used: storageFromDb.usedSpace,
        free: storageFromDb.freeSpace,
        total: storageFromDb.capacity,
      },
    };
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

  public async changePassword(
    user,
    changePasswordDto: ChangePasswordDto,
  ): Promise<User> {
    const { id } = user;
    const { newPassword, oldPassword } = changePasswordDto;
    const oldUser = await this.databaseService.user.findUnique({
      where: {
        id,
      },
    });

    if (!this.authService.compareHashPassword(oldPassword, oldUser.password)) {
      throw new UnauthorizedException({
        message: 'Wrong old password',
        type: ErrorsEnum.WRONG_OLD_PASSWORD,
      });
    }

    const hashedPassword = this.authService.generateHashPassword(
      newPassword,
      7,
    );

    return this.databaseService.user.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
        editedAt: new Date(),
      },
    });
  }

  public async changeAvatar(user, avatar: Express.Multer.File): Promise<User> {
    const { id } = user;
    const filename = await this.fileService.saveFileOnServer(
      avatar,
      user.id,
      id,
      {
        isPublic: true,
      },
    );

    return this.databaseService.user.update({
      where: {
        id,
      },
      data: {
        avatar: filename,
        editedAt: new Date(),
      },
    });
  }
}
