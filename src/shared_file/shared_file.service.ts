import { Injectable } from '@nestjs/common';
import { SharedFile } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as uuid from 'uuid';

@Injectable()
export class Shared_fileService {
  public constructor(private readonly databaseService: DatabaseService) {}

  private generateLink(): string {
    return uuid.v4();
  }

  public async getFileById(fileId: string) {
    return this.databaseService.sharedFile.findFirst({
      where: {
        fileId,
      },
    });
  }

  public async getSharedFiles(user) {
    const { id } = user;

    const sharedFiles = await this.databaseService.sharedFile.findMany({
      where: {
        userId: id,
      },
    });

    return this.databaseService.file.findMany({
      where: {
        id: {
          in: sharedFiles.map((sharedFile) => sharedFile.fileId),
        },
      },
    });
  }

  public async getFile(link: string) {
    const sharedFile = await this.databaseService.sharedFile.findFirst({
      where: {
        link,
      },
    });

    return this.databaseService.file.findUnique({
      where: {
        id: sharedFile.fileId,
      },
    });
  }

  public async shareFile(user, id: string): Promise<SharedFile> {
    const { id: userId } = user;

    await this.databaseService.file.update({
      where: {
        id,
      },
      data: {
        isShared: true,
      },
    });

    return this.databaseService.sharedFile.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        link: this.generateLink(),
        fileId: id,
      },
    });
  }

  public async deleteSharedFile(id: string) {
    await this.databaseService.file.update({
      where: {
        id,
      },
      data: {
        isShared: false,
      },
    });

    return this.databaseService.sharedFile.deleteMany({
      where: {
        fileId: id,
      },
    });
  }
}
