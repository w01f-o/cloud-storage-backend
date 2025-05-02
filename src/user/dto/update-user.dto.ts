import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
} from 'class-validator';
import {
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_LENGTH,
  MAX_USER_NAME_LENGTH,
  MIN_EMAIL_LENGTH,
  MIN_USER_NAME_LENGTH,
  STRONG_PASSWORD_OPTIONS,
} from 'src/_shared/constants/validation-constants';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @Length(MIN_EMAIL_LENGTH, MAX_EMAIL_LENGTH)
  email: string;

  @IsOptional()
  @IsString()
  @Length(MIN_USER_NAME_LENGTH, MAX_USER_NAME_LENGTH)
  name: string;

  @IsOptional()
  @IsStrongPassword(STRONG_PASSWORD_OPTIONS)
  @MaxLength(MAX_PASSWORD_LENGTH)
  password: string;

  @IsOptional()
  avatar: string;
}
