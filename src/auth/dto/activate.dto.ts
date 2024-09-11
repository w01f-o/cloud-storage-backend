import { IsNotEmpty } from 'class-validator';

export class ActivateDto {
  @IsNotEmpty()
  code: number;
}
