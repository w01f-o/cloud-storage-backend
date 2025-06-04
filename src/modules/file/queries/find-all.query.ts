import { MAX_FILE_NAME_LENGTH } from '@/shared/constants/validation-constants';
import { PaginationQuery } from '@/shared/paginator/pagination.query';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class FindAllFilesQuery extends PaginationQuery {
  @IsString()
  @IsOptional()
  @MaxLength(MAX_FILE_NAME_LENGTH)
  search?: string;
}
