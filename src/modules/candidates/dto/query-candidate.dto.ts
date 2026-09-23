import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CandidateStatus } from '../../../common/enums/candidate-status.enum';

export class QueryCandidateDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: CandidateStatus })
  @IsOptional()
  @IsEnum(CandidateStatus)
  status?: CandidateStatus;
}
