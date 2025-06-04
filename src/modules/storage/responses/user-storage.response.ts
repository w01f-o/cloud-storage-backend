import { File, User } from '@prisma/client';

type StorageFile = Pick<File, 'mimeType' | 'resolvedType' | 'size'>;
type UserSpace = {
  used: User['usedSpace'];
  free: User['freeSpace'];
  total: User['capacity'];
};

export class UserStorageResponse {
  public readonly files: StorageFile[];
  public readonly space: UserSpace;

  constructor(files: StorageFile[], space: UserSpace) {
    this.files = files;
    this.space = space;
  }
}
