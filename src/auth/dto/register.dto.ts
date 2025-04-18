import {
  MAX_EMAIL_LENGTH,
  MAX_USER_NAME_LENGTH,
  STRONG_PASSWORD_OPTIONS,
} from '@/_shared/constants/validation-constants';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @MaxLength(MAX_EMAIL_LENGTH)
  email: string;

  @IsString()
  @MaxLength(MAX_USER_NAME_LENGTH)
  name: string;

  @IsStrongPassword(STRONG_PASSWORD_OPTIONS)
  @IsString()
  password: string;
}
