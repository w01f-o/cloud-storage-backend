import { User } from '@prisma/client';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import {
  MAX_EMAIL_LENGTH,
  MAX_USER_NAME_LENGTH,
  STRONG_PASSWORD_OPTIONS,
} from 'src/_shared/constants/validation-constants';

export class UpdateUserDto implements Partial<User> {
  @IsOptional()
  @IsEmail()
  @MaxLength(MAX_EMAIL_LENGTH)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(MAX_USER_NAME_LENGTH)
  name: string;

  @IsOptional()
  @IsStrongPassword(STRONG_PASSWORD_OPTIONS)
  password: string;
}
