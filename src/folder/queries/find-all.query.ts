import { MAX_FILE_NAME_LENGTH } from '@/_shared/constants/validation-constants';
import { PaginationQuery } from '@/_shared/paginator/pagination.query';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class FindAllFoldersQuery extends PaginationQuery {
  @IsString()
  @IsOptional()
  @MaxLength(MAX_FILE_NAME_LENGTH)
  search?: string;
}
