import { ResolvedFileTypes } from '../enums/resolved-file-types.enum';

export const resolvedFileTypesByMimetype: Record<string, ResolvedFileTypes> = {
  'image/jpeg': ResolvedFileTypes.IMAGE,
  'image/png': ResolvedFileTypes.IMAGE,
  'image/gif': ResolvedFileTypes.IMAGE,
  'image/webp': ResolvedFileTypes.IMAGE,
  'image/svg+xml': ResolvedFileTypes.IMAGE,
  'image/bmp': ResolvedFileTypes.IMAGE,
  'image/tiff': ResolvedFileTypes.IMAGE,
  'image/x-icon': ResolvedFileTypes.IMAGE,

  'video/mp4': ResolvedFileTypes.VIDEO,
  'video/webm': ResolvedFileTypes.VIDEO,
  'video/ogg': ResolvedFileTypes.VIDEO,
  'video/x-msvideo': ResolvedFileTypes.VIDEO,
  'video/quicktime': ResolvedFileTypes.VIDEO,

  'audio/mpeg': ResolvedFileTypes.AUDIO,
  'audio/ogg': ResolvedFileTypes.AUDIO,
  'audio/wav': ResolvedFileTypes.AUDIO,
  'audio/webm': ResolvedFileTypes.AUDIO,
  'audio/mp4': ResolvedFileTypes.AUDIO,
  'audio/x-ms-wma': ResolvedFileTypes.AUDIO,
  'audio/flac': ResolvedFileTypes.AUDIO,

  'application/pdf': ResolvedFileTypes.DOCUMENT,
  'application/msword': ResolvedFileTypes.DOCUMENT,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    ResolvedFileTypes.DOCUMENT,
  'application/vnd.ms-excel': ResolvedFileTypes.DOCUMENT,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    ResolvedFileTypes.DOCUMENT,
  'application/vnd.ms-powerpoint': ResolvedFileTypes.DOCUMENT,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    ResolvedFileTypes.DOCUMENT,

  'text/plain': ResolvedFileTypes.TEXT,
  'text/markdown': ResolvedFileTypes.TEXT,
  'text/html': ResolvedFileTypes.TEXT,
  'text/csv': ResolvedFileTypes.TEXT,
  'text/x-log': ResolvedFileTypes.TEXT,

  'application/zip': ResolvedFileTypes.ARCHIVE,
  'application/x-rar-compressed': ResolvedFileTypes.ARCHIVE,
  'application/x-7z-compressed': ResolvedFileTypes.ARCHIVE,
  'application/x-tar': ResolvedFileTypes.ARCHIVE,
  'application/gzip': ResolvedFileTypes.ARCHIVE,
  'application/x-bzip2': ResolvedFileTypes.ARCHIVE,

  'application/x-msdos-program': ResolvedFileTypes.EXE,
  'application/x-msdownload': ResolvedFileTypes.EXE,
  'application/octet-stream': ResolvedFileTypes.EXE,
  'application/vnd.microsoft.portable-executable': ResolvedFileTypes.EXE,

  'application/javascript': ResolvedFileTypes.CODE,
  'application/json': ResolvedFileTypes.CODE,
  'application/java-archive': ResolvedFileTypes.CODE,
  'text/css': ResolvedFileTypes.CODE,
  'text/x-python': ResolvedFileTypes.CODE,
  'text/x-c++src': ResolvedFileTypes.CODE,
  'text/x-csrc': ResolvedFileTypes.CODE,
  'application/x-sh': ResolvedFileTypes.CODE,
  'application/x-httpd-php': ResolvedFileTypes.CODE,
  'text/x-java-source': ResolvedFileTypes.CODE,
  'application/x-typescript': ResolvedFileTypes.CODE,
  'text/x-go': ResolvedFileTypes.CODE,

  'model/stl': ResolvedFileTypes.MODEL,
  'model/obj': ResolvedFileTypes.MODEL,
  'model/gltf+json': ResolvedFileTypes.MODEL,

  'font/ttf': ResolvedFileTypes.FONT,
  'font/otf': ResolvedFileTypes.FONT,
  'application/font-woff': ResolvedFileTypes.FONT,
  'application/font-woff2': ResolvedFileTypes.FONT,

  [ResolvedFileTypes.OTHER]: ResolvedFileTypes.OTHER,
} as const;
