import {
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_LENGTH,
  MAX_USER_NAME_LENGTH,
  MIN_EMAIL_LENGTH,
  MIN_USER_NAME_LENGTH,
  STRONG_PASSWORD_OPTIONS,
} from '@/_shared/constants/validation-constants';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @Length(MIN_EMAIL_LENGTH, MAX_EMAIL_LENGTH)
  email: string;

  @IsString()
  @Length(MIN_USER_NAME_LENGTH, MAX_USER_NAME_LENGTH)
  name: string;

  @IsStrongPassword(STRONG_PASSWORD_OPTIONS)
  @MaxLength(MAX_PASSWORD_LENGTH)
  @IsString()
  password: string;
}
