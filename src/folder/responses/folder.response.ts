import { Folder } from '@prisma/client';

export class FolderResponse implements Partial<Folder> {
  public readonly id: string;
  public readonly name: string;
  public readonly color: string;
  public readonly size: bigint;
  public readonly createdAt: Date;
  public readonly parentId: string | null;
  public readonly updatedAt: Date;
  public readonly children?: FolderResponse[];

  constructor(folder: Folder & { children?: Folder[] }) {
    this.id = folder.id;
    this.name = folder.name;
    this.color = folder.color;
    this.size = folder.size;
    this.createdAt = folder.createdAt;
    this.updatedAt = folder.updatedAt;
    this.parentId = folder.parentId;
    this.children =
      folder.children?.map(child => new FolderResponse(child)) ?? [];
  }
}
