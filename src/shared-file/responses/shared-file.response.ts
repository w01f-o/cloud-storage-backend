import { File, SharedFile } from '@prisma/client';
import { FileResponse } from 'src/file/responses/file.response';

export class SharedFileResponse implements Partial<SharedFile> {
  public readonly id: string;
  public readonly link: string;
  public readonly file: FileResponse;

  constructor(sharedFile: SharedFile & { file: File }) {
    this.id = sharedFile.id;
    this.file = new FileResponse(sharedFile.file);
  }
}
