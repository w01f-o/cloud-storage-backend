import { IsStrongPasswordOptions } from 'class-validator';

export const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024;

export const MIN_USER_NAME_LENGTH = 4;
export const MAX_USER_NAME_LENGTH = 24;

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 64;
export const STRONG_PASSWORD_OPTIONS: IsStrongPasswordOptions = {
  minLength: MIN_PASSWORD_LENGTH,
  minLowercase: 0,
  minUppercase: 0,
  minNumbers: 0,
  minSymbols: 0,
};

export const MIN_EMAIL_LENGTH = 1;
export const MAX_EMAIL_LENGTH = 256;

export const MIN_FOLDER_NAME_LENGTH = 1;
export const MAX_FOLDER_NAME_LENGTH = 24;

export const MIN_FILE_NAME_LENGTH = 1;
export const MAX_FILE_NAME_LENGTH = 256;
