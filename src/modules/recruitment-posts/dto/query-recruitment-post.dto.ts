import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { RecruitmentPostStatus } from '../../../common/enums/recruitment-post-status.enum';

export class QueryRecruitmentPostDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  laborOrderId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  sourceId?: string;

  @ApiPropertyOptional({ enum: RecruitmentPostStatus })
  @IsOptional()
  @IsEnum(RecruitmentPostStatus)
  status?: RecruitmentPostStatus;
}
