import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { LaborOrderWorkerStatus } from '../../../common/enums/labor-order-worker-status.enum';

export class CreateLaborOrderWorkerDto {
  @ApiProperty()
  @IsNumberString()
  laborOrderId: string;

  @ApiProperty()
  @IsNumberString()
  candidateId: string;

  @ApiPropertyOptional({ enum: LaborOrderWorkerStatus, default: LaborOrderWorkerStatus.SUPPLIED })
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
