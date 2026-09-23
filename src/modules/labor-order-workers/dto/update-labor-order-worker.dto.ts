import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { LaborOrderWorkerStatus } from '../../../common/enums/labor-order-worker-status.enum';

export class UpdateLaborOrderWorkerDto {
  @ApiPropertyOptional({ enum: LaborOrderWorkerStatus })
  @IsOptional()
  @IsEnum(LaborOrderWorkerStatus)
  status?: LaborOrderWorkerStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  suppliedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}
