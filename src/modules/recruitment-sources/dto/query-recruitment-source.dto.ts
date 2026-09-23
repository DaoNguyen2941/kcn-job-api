import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CommonStatus } from '../../../common/enums/common-status.enum';

export class QueryRecruitmentSourceDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: CommonStatus })
  @IsOptional()
  @IsEnum(CommonStatus)
  status?: CommonStatus;
}
