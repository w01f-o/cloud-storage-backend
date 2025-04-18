import { IsStrongPasswordOptions } from 'class-validator';

export const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024;

export const MAX_USER_NAME_LENGTH = 24;
export const MAX_PASSWORD_LENGTH = 64;
export const MIN_PASSWORD_LENGTH = 8;
export const STRONG_PASSWORD_OPTIONS: IsStrongPasswordOptions = {
  minLength: MIN_PASSWORD_LENGTH,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};
export const MAX_EMAIL_LENGTH = 256;

export const MAX_FOLDER_NAME_LENGTH = 24;
export const MAX_FILE_NAME_LENGTH = 256;
