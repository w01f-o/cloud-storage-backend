import { IsEmail, IsNotEmpty } from 'class-validator';

export class ActivateDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  code: number;
}
