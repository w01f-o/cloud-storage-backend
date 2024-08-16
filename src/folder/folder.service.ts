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

  public async getAll(user: User): Promise<Folder[]> {
    const { id } = user;

    const folders = await this.databaseService.folder.findMany({
      where: {
        userId: id,
      },
    });

    return folders;
  }

  public async getOne(user: User, folderId: string): Promise<Folder> {
    const { id } = user;
    const folder = await this.databaseService.folder.findUnique({
      where: {
        id: folderId,
        userId: id,
      },
    });

    return folder;
  }

  public async create(user, createFolderDto: CreateFolderDto): Promise<Folder> {
    const { color, name } = createFolderDto;
    const { id } = user;

    return await this.databaseService.folder.create({
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

    return this.databaseService.folder.delete({
      where: {
        id,
        userId,
      },
    });
  }

  public async changeColor(user, id: string, color: string): Promise<Folder> {
    const { id: userId } = user;

    return await this.databaseService.folder.update({
      where: {
        id,
        userId,
      },
      data: {
        color,
        editedAt: new Date(),
      },
    });
  }
}
