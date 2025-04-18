import { File } from '@prisma/client';

export class FileResponse implements Partial<File> {
  public readonly id: string;
  public readonly name: string;
  public readonly displayName: string;
  public readonly originalName: string;
  public readonly mimeType: string;
  public readonly resolvedType: string;
  public readonly size: bigint;
  public readonly isShared: boolean;
  public readonly folderId: string;
  public readonly createdAt: Date;

  constructor(file: File) {
    this.id = file.id;
    this.name = file.name;
    this.displayName = file.displayName;
    this.originalName = file.originalName;
    this.mimeType = file.mimeType;
    this.resolvedType = file.resolvedType;
    this.size = file.size;
    this.isShared = file.isShared;
    this.folderId = file.folderId;
    this.createdAt = file.createdAt;
  }
}
