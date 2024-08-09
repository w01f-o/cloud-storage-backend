import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UploadFileDto } from './dto/upload.dto';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { File, User } from '@prisma/client';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class FileService {
  public constructor(
    private readonly databaseService: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}

  private generateFileName(name: string, userId: string): string {
    const nameArray = name.split('.');
    const fileName = nameArray[0];
    const fileExtension = nameArray[1];

    return `${fileName}-${Date.now()}-${userId}.${fileExtension}`;
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

  private async updateUserSpace(userId: string, size: number): Promise<User> {
    return await this.databaseService.user.update({
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

  public async download(id: string) {
    const file = await this.databaseService.file.findUnique({
      where: {
        id,
      },
    });

    return path.resolve('static', file.localName);
  }

  public async upload(
    user,
    uploadFileDto: UploadFileDto,
    file: Express.Multer.File,
  ): Promise<File> {
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

  public async delete(user, id: string): Promise<File> {
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

  public async rename(user, name: string, id: string): Promise<File> {
    const { id: userId } = user;

    return await this.databaseService.file.update({
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
