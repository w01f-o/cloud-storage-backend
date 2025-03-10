import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UploadFileDto } from './dto/upload.dto';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { File, Folder, User } from '@prisma/client';
import { UpdateFileDto } from './dto/update.dto';
import * as mime from 'mime-types';
import { fileTypes } from 'src/types/fileTypes.type';
import { AuthDto } from '../auth/dto/auth.dto';

@Injectable()
export class FileService {
  public constructor(private readonly databaseService: DatabaseService) {}

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

  public deleteFileFromServer(
    fileName: string,
    { isPublic }: { isPublic: boolean },
  ): void {
    const filePath = isPublic
      ? path.resolve('static', 'public', fileName)
      : path.resolve('static', fileName);

    fs.unlink(filePath, (err) => {
      if (err) {
        throw new ForbiddenException(err);
      }
    });
  }

  private async updateUserSpace(userId: string, size: number): Promise<User> {
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

  private async updateFolderSize(
    folderId: string,
    size: number,
  ): Promise<Folder> {
    return this.databaseService.folder.update({
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

  public async getAll(user: AuthDto, folderId: string): Promise<File[]> {
    const { id: userId } = user;

    return this.databaseService.file.findMany({
      where: {
        folderId,
        userId,
      },
    });
  }

  public async getLastUploaded(user: AuthDto): Promise<File[]> {
    const { id: userId } = user;

    return this.databaseService.file.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        addedAt: 'desc',
      },
      take: 5,
    });
  }

  public async download(user: AuthDto, id: string) {
    const { id: userId } = user;

    return this.databaseService.file.findUnique({
      where: {
        id,
        userId,
      },
    });
  }

  public async upload(
    user: AuthDto,
    uploadFileDto: UploadFileDto,
    file: Express.Multer.File,
  ): Promise<File> {
    const { name, folderId } = uploadFileDto;
    const { id: userId } = user;
    const { size } = file;

    const localFileName = await this.saveFileOnServer(file, name, userId, {
      isPublic: false,
    });

    await this.updateUserSpace(userId, size);
    await this.updateFolderSize(folderId, size);

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

  public async delete(user: AuthDto, id: string): Promise<File> {
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

    this.deleteFileFromServer(file.localName, { isPublic: false });

    return file;
  }

  public async update(
    user: AuthDto,
    updateFileDto: UpdateFileDto,
    id: string,
  ): Promise<File> {
    const { id: userId } = user;

    return this.databaseService.file.update({
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
