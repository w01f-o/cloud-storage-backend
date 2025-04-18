import { File } from '@nest-lab/fastify-multer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'argon2';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { DatabaseService } from 'src/database/database.service';
import { StorageService } from 'src/storage/storage.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserNotFoundException } from './exceptions/UserNotFound.exception';
import { UserResponse } from './responses/user.response';

@Injectable()
export class UserService {
  public constructor(
    private readonly database: DatabaseService,
    private readonly storageService: StorageService
  ) {}

  private generateActivationCode(): number {
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  }

  public async create(dto: RegisterDto): Promise<User> {
    const hashedPassword = await hash(dto.password);
    const activationCode = this.generateActivationCode();

    return this.database.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        activationCode,
      },
    });
  }

  // public async getStorage(userId: string) {
  //   const storageFromDb = await this.database.user.findUnique({
  //     where: {
  //       id: userId,
  //     },
  //     select: {
  //       usedSpace: true,
  //       freeSpace: true,
  //       capacity: true,
  //       files: {
  //         select: {
  //           type: true,
  //           size: true,
  //         },
  //       },
  //     },
  //   });

  //   const typeSizeMap = new Map<string, number>();

  //   for (const file of storageFromDb.files) {
  //     typeSizeMap.set(file.type, (typeSizeMap.get(file.type) ?? 0) + file.size);
  //   }

  //   const storage = Array.from(typeSizeMap.entries()).map(([type, size]) => ({
  //     type,
  //     size,
  //   }));

  //   return {
  //     category: storage,
  //     space: {
  //       used: storageFromDb.usedSpace,
  //       free: storageFromDb.freeSpace,
  //       total: storageFromDb.capacity,
  //     },
  //   };
  // }

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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      dto.avatar = await this.storageService.saveFile(avatarFile, {
        isPublic: true,
      });
    }

    if (dto.password) {
      dto.password = await hash(dto.password);
    }

    return this.database.user.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
      select: { id: true, name: true, email: true, avatar: true },
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

    await this.storageService.deletePublicFile(user.avatar);

    for (const file of user.files) {
      await Promise.all([
        this.database.file.delete({
          where: { id: file.id },
        }),
        this.storageService.deleteUserFile(file.name),
      ]);
    }

    return this.database.user.delete({
      where: { id },
      select: { id: true, name: true, email: true, avatar: true },
    });
  }
}
