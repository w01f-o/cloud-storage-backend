import { Injectable } from '@nestjs/common';
import { SharedFile } from '@prisma/client';
import * as path from 'node:path';
import { DatabaseService } from 'src/database/database.service';
import * as uuid from 'uuid';

@Injectable()
export class SharedFileService {
  public constructor(private readonly databaseService: DatabaseService) {}

  private generateLink(): string {
    return uuid.v4();
  }

  public async getFile(id: string): Promise<string> {
    const sharedFile = await this.databaseService.sharedFile.findUnique({
      where: {
        id,
      },
    });

    return path.resolve('static', sharedFile.localName);
  }

  public async shareFile(user, id: string): Promise<SharedFile> {
    const { id: userId } = user;
    const { name, localName } = await this.databaseService.file.findUnique({
      where: {
        id,
      },
    });

    const sharedFile = await this.databaseService.sharedFile.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        localName,
        name,
        link: this.generateLink(),
      },
    });

    return sharedFile;
  }
}
