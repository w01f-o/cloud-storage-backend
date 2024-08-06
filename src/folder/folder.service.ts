import { Injectable } from '@nestjs/common';
import { Folder, User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateFolderDto } from './dto/create.dto';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class FolderService {
  public constructor(
    private readonly databaseService: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}

  private async checkPermission(
    user: User,
    folders: Folder | Folder[],
    refreshToken: string,
  ): Promise<void> {
    const { id: userId } = user;
    const { refreshToken: token } =
      await this.tokenService.getTokenByUser(userId);

    if (!token || token !== refreshToken) {
      throw new Error('Permission denied');
    }

    if (
      Array.isArray(folders) &&
      folders.some((folder) => folder.userId === user.id)
    ) {
      throw new Error('Permission denied');
    }

    if (!Array.isArray(folders) && folders.userId !== user.id) {
      throw new Error('Permission denied');
    }
  }

  public async getAll(userId: string): Promise<Folder[]> {
    const folders = await this.databaseService.folder.findMany({
      where: {
        userId,
      },
    });

    return folders;
  }

  public async getOne(userId: string, folderId: string): Promise<Folder> {
    const folder = await this.databaseService.folder.findUnique({
      where: {
        id: folderId,
      },
    });

    return folder;
  }

  public async create(createFolderDto: CreateFolderDto): Promise<Folder> {
    const { color, name, userId } = createFolderDto;

    return await this.databaseService.folder.create({
      data: {
        color,
        name,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  public remove(id: string): Promise<Folder> {
    return this.databaseService.folder.delete({
      where: {
        id,
      },
    });
  }

  public async changeColor(id: string, color: string): Promise<Folder> {
    return await this.databaseService.folder.update({
      where: {
        id,
      },
      data: {
        color,
      },
    });
  }
}
