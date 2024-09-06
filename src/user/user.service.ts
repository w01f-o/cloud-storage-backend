import {
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
import { TokenService } from 'src/token/token.service';
import { FolderService } from 'src/folder/folder.service';
import { UpdateNameDto } from './dto/updateName.dto';
import { UpdateEmailDto } from './dto/updateEmail.dto';

@Injectable()
export class UserService {
  public constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
    private readonly fileService: FileService,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly folderService: FolderService,
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

  public async changeName(user, updateNameDto: UpdateNameDto): Promise<User> {
    const { id } = user;
    const { name } = updateNameDto;

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

  public async changeEmail(
    user,
    updateEmailDto: UpdateEmailDto,
  ): Promise<User> {
    const { id } = user;
    const { email } = updateEmailDto;
    const activationCode = this.mailService.generateActivationCode();
    const userFromDb = await this.databaseService.user.findUnique({
      where: {
        id,
      },
    });

    if (userFromDb.email === email) {
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
          email: userFromDb.email,
          editedAt: userFromDb.editedAt,
          isActivated: true,
          activationCode: userFromDb.activationCode,
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
    const { avatar: oldAvatar } = await this.databaseService.user.findUnique({
      where: {
        id,
      },
      select: {
        avatar: true,
      },
    });

    const filename = await this.fileService.saveFileOnServer(
      avatar,
      `${user.id}.${avatar.originalname.split('.').pop()}`,
      id,
      {
        isPublic: true,
      },
    );

    if (oldAvatar !== 'no-avatar.svg') {
      try {
        this.fileService.deleteFileFromServer(oldAvatar, { isPublic: true });
      } catch (e) {
        console.error(e);
      }
    }

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

  public async delete(user) {
    const { id, refreshToken } = user;
    const userFromDb = await this.databaseService.user.findUnique({
      where: {
        id,
      },
      select: {
        folders: {
          select: {
            id: true,
          },
        },
        id: true,
      },
    });

    await this.tokenService.removeToken(refreshToken);

    userFromDb.folders.forEach(async (folder) => {
      await this.folderService.remove(user, folder.id);
    });

    return this.databaseService.user.delete({
      where: {
        id: userFromDb.id,
      },
    });
  }
}
