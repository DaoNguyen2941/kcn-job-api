import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { LaborOrderWorkerStatus } from '../../../common/enums/labor-order-worker-status.enum';

export class QueryLaborOrderWorkerDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  laborOrderId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  candidateId?: string;

  @ApiPropertyOptional({ enum: LaborOrderWorkerStatus })
  @IsOptional()
  @IsEnum(LaborOrderWorkerStatus)
  status?: LaborOrderWorkerStatus;
}
