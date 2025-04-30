import { Folder } from '@prisma/client';

export class FolderResponse implements Partial<Folder> {
  public readonly id: string;
  public readonly name: string;
  public readonly color: string;
  public readonly size: bigint;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(folder: Folder) {
    this.id = folder.id;
    this.name = folder.name;
    this.color = folder.color;
    this.size = folder.size;
    this.createdAt = folder.createdAt;
    this.updatedAt = folder.updatedAt;
  }
}
