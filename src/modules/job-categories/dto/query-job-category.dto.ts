import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CommonStatus } from '../../../common/enums/common-status.enum';

export class QueryJobCategoryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ enum: CommonStatus })
  @IsOptional()
  @IsEnum(CommonStatus)
  status?: CommonStatus;
}
