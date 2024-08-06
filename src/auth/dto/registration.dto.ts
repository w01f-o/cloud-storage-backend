import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegistrationDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8, 16)
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
