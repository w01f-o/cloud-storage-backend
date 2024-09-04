import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UploadFileDto } from './dto/upload.dto';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { File, Folder, User } from '@prisma/client';
import { TokenService } from 'src/token/token.service';
import { UpdateFileDto } from './dto/update.dto';
import * as mime from 'mime-types';
import { fileTypes } from 'src/types/fileTypes.type';

@Injectable()
export class FileService {
  public constructor(
    private readonly databaseService: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}

  private generateFileName(name: string, userId: string): string {
    const nameArray = name.split('.');
    const fileName = nameArray.shift();
    const fileExtension = nameArray.pop();

    return `${fileName}-${Date.now()}-${userId}.${fileExtension}`;
  }

  public async saveFileOnServer(
    file: Express.Multer.File,
    originalFileName: string,
    userId: string,
    { isPublic }: { isPublic: boolean },
  ): Promise<string> {
    const fileName = this.generateFileName(originalFileName, userId);
    const filePath = isPublic
      ? path.resolve('static', 'public', fileName)
      : path.resolve('static', fileName);
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

  public deleteFileFromServer(fileName: string): void {
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

  private async updateFolderSize(
    folderId: string,
    size: number,
  ): Promise<Folder> {
    return await this.databaseService.folder.update({
      where: {
        id: folderId,
      },
      data: {
        size: {
          increment: size,
        },
      },
    });
  }

  public getFileType(type: string): string {
    return fileTypes[mime.lookup(type)] ?? 'other';
  }

  public async getAll(user, folderId: string): Promise<File[]> {
    const files = await this.databaseService.file.findMany({
      where: {
        folderId,
      },
    });

    return files;
  }

  public async getLastUploaded(user): Promise<File[]> {
    const files = await this.databaseService.file.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        addedAt: 'desc',
      },
      take: 5,
    });

    return files;
  }

  public async download(id: string) {
    const file = await this.databaseService.file.findUnique({
      where: {
        id,
      },
    });

    return file;
  }

  public async upload(
    user,
    uploadFileDto: UploadFileDto,
    file: Express.Multer.File,
  ): Promise<File> {
    const { name, folderId } = uploadFileDto;
    const { id: userId } = user;
    const { size } = file;

    const localFileName = await this.saveFileOnServer(file, name, userId, {
      isPublic: false,
    });

    this.updateUserSpace(userId, size);
    this.updateFolderSize(folderId, size);

    const createdFile = await this.databaseService.file.create({
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
        type: this.getFileType(file.originalname.split('.').pop()),
      },
    });

    await this.databaseService.folder.update({
      where: {
        id: folderId,
      },
      data: {
        editedAt: new Date(),
      },
    });

    return createdFile;
  }

  public async delete(user, id: string): Promise<File> {
    const { id: userId } = user;
    const file = await this.databaseService.file.delete({
      where: {
        userId,
        id,
      },
    });

    await this.databaseService.user.update({
      where: {
        id: userId,
      },
      data: {
        freeSpace: {
          increment: file.size,
        },
        usedSpace: {
          decrement: file.size,
        },
      },
    });

    this.deleteFileFromServer(file.localName);

    return file;
  }

  public async update(
    user,
    updateFileDto: UpdateFileDto,
    id: string,
  ): Promise<File> {
    const { id: userId } = user;

    return await this.databaseService.file.update({
      where: {
        userId,
        id,
      },
      data: {
        name: updateFileDto.name,
      },
    });
  }
}
