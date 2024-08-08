import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UploadFileDto } from './dto/upload.dto';
import * as path from 'node:path';
import * as fs from 'node:fs';

@Injectable()
export class FileService {
  public constructor(private readonly databaseService: DatabaseService) {}

  private generateFileName(name: string, userId: string): string {
    const nameArray = name.split('.');
    const fileName = nameArray[0];
    const fileExtension = nameArray[1];

    return `${fileName}-${Date.now()}-${userId}-.${fileExtension}`;
  }

  private async saveFileOnServer(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    const fileName = this.generateFileName(file.originalname, userId);
    const filePath = path.resolve('static', fileName);
    const { freeSpace } = await this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (freeSpace < file.size) {
      throw new ForbiddenException('Not enough space');
    }

    fs.writeFile(filePath, file.buffer, (err) => {
      if (err) {
        throw new ForbiddenException(err);
      }
    });

    return fileName;
  }

  private deleteFileFromServer(fileName: string): void {
    const filePath = path.resolve('static', fileName);
    fs.unlink(filePath, (err) => {
      if (err) {
        throw new ForbiddenException(err);
      }
    });
  }

  private updateUserSpace(userId: string, size: number) {
    return this.databaseService.user.update({
      where: { id: userId },
      data: {
        usedSpace: {
          increment: size,
        },
        freeSpace: {
          decrement: size,
        },
      },
    });
  }

  public async upload(
    user,
    uploadFileDto: UploadFileDto,
    file: Express.Multer.File,
  ) {
    const { name, folderId } = uploadFileDto;
    const { id: userId } = user;
    const localFileName = await this.saveFileOnServer(file, userId);
    this.updateUserSpace(userId, file.size);

    return this.databaseService.file.create({
      data: {
        name,
        localName: localFileName,
        size: file.size,
        user: {
          connect: {
            id: userId,
          },
        },
        folder: {
          connect: {
            id: folderId,
          },
        },
      },
    });
  }

  public async delete(user, id: string) {
    const { id: userId } = user;
    const file = await this.databaseService.file.delete({
      where: {
        userId,
        id,
      },
    });

    this.deleteFileFromServer(file.localName);

    return file;
  }

  public rename(user, name: string, id: string) {
    const { id: userId } = user;

    return this.databaseService.file.update({
      where: {
        userId,
        id,
      },
      data: {
        name,
      },
    });
  }
}
