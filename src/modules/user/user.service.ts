import { DatabaseService } from '@/core/database/database.service';
import { RegisterDto } from '@/modules/auth/dto/register.dto';
import { InvalidCredentialsException } from '@/modules/auth/exceptions/InvalidCredentials.exception';
import { UserAlreadyExistsException } from '@/modules/auth/exceptions/UserAlreadyExists.exception';
import { StorageService } from '@/modules/storage/storage.service';
import { File } from '@nest-lab/fastify-multer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash, verify } from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserNotFoundException } from './exceptions/UserNotFound.exception';
import { UserResponse } from './responses/user.response';

@Injectable()
export class UserService {
  public constructor(
    private readonly database: DatabaseService,
    private readonly storageService: StorageService
  ) {}

  public async create(dto: RegisterDto): Promise<User> {
    const hashedPassword = await hash(dto.password);

    return this.database.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });
  }

  public async update(
    id: string,
    dto: UpdateUserDto,
    avatarFile: File
  ): Promise<UserResponse> {
    const user = await this.database.user.findUnique({
      where: { id },
    });

    if (!user) throw new UserNotFoundException();

    if (avatarFile) {
      dto.avatar = await this.storageService.saveFile(avatarFile, {
        isPublic: true,
      });
    }

    if (dto.password) {
      const passwordIsValid = await verify(user.password, dto.oldPassword);

      if (!passwordIsValid) throw new InvalidCredentialsException();

      dto.password = await hash(dto.password);
      dto.oldPassword = undefined;
    }

    if (dto.email) {
      const userFromDb = await this.database.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (userFromDb) throw new UserAlreadyExistsException();
    }

    return this.database.user.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });
  }

  public async delete(id: string): Promise<UserResponse> {
    const user = await this.database.user.findUnique({
      where: { id },
      include: {
        files: true,
      },
    });

    if (!user) throw new UserNotFoundException();

    if (user.avatar) {
      await this.storageService.deletePublicFile(user.avatar);
    }

    for (const file of user.files) {
      Promise.all([
        this.database.file.delete({
          where: { id: file.id },
        }),
        this.storageService.deleteUserFile(file.name),
      ]);
    }

    return this.database.user.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });
  }
}
