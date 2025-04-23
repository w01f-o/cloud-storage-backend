import {
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_EMAIL_LENGTH,
  STRONG_PASSWORD_OPTIONS,
} from '@/_shared/constants/validation-constants';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @Length(MIN_EMAIL_LENGTH, MAX_EMAIL_LENGTH)
  email: string;

  @IsString()
  @IsStrongPassword(STRONG_PASSWORD_OPTIONS)
  @MaxLength(MAX_PASSWORD_LENGTH)
  password: string;
}
