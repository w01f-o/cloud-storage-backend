import { Injectable } from '@nestjs/common';
import { Folder, User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateFolderDto } from './dto/create.dto';
import { TokenService } from 'src/token/token.service';
import { UpdateFolderDto } from './dto/update.dto';
import { FileService } from 'src/file/file.service';

@Injectable()
export class FolderService {
  public constructor(
    private readonly databaseService: DatabaseService,
    private readonly tokenService: TokenService,
    private readonly fileService: FileService,
  ) {}

  public async getAll(user: User, search: string): Promise<Folder[]> {
    const { id } = user;

    return this.databaseService.folder.findMany({
      where: {
        userId: id,
        name: {
          contains: search,
        },
      },
      orderBy: {
        editedAt: 'desc',
      },
    });
  }

  public async getOne(user: User, folderId: string): Promise<Folder> {
    const { id } = user;

    return this.databaseService.folder.findUnique({
      where: {
        id: folderId,
        userId: id,
      },
    });
  }

  public async getLastUpdated(user): Promise<Folder[]> {
    const { id: userId } = user;

    return this.databaseService.folder.findMany({
      where: {
        userId,
      },
      orderBy: {
        editedAt: 'desc',
      },
      take: 5,
    });
  }

  public async create(user, createFolderDto: CreateFolderDto): Promise<Folder> {
    const { color, name } = createFolderDto;
    const { id } = user;

    return this.databaseService.folder.create({
      data: {
        color,
        name,
        user: {
          connect: {
            id,
          },
        },
      },
    });
  }

  public async remove(user, id: string): Promise<Folder> {
    const { id: userId } = user;

    const folder = await this.databaseService.folder.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        files: true,
      },
    });

    folder.files.forEach(async (file) => {
      await this.fileService.delete(user, file.id);
    });

    return await this.databaseService.folder.delete({
      where: {
        id,
      },
    });
  }

  public async changeColor(
    user,
    id: string,
    updateFolderDto: UpdateFolderDto,
  ): Promise<Folder> {
    const { id: userId } = user;
    const { color, name } = updateFolderDto;

    return this.databaseService.folder.update({
      where: {
        id,
        userId,
      },
      data: {
        color,
        name,
        editedAt: new Date(),
      },
    });
  }
}
