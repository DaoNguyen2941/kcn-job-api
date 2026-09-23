import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryCompanyContactDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  companyId?: string;
}
