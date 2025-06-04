import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class ActivateDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1000)
  @Max(9999)
  code: number;
}
