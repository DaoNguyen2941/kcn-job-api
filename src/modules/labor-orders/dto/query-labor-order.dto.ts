import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBooleanString,
  IsEnum,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { LaborOrderStatus } from '../../../common/enums/labor-order-status.enum';
import { EmploymentType } from '../../../common/enums/employment-type.enum';
import { WorkShift } from '../../../common/enums/work-shift.enum';
import { Gender } from '../../../common/enums/gender.enum';

export class QueryLaborOrderDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  companyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  industrialZoneId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  jobCategoryId?: string;

  @ApiPropertyOptional({ enum: LaborOrderStatus })
  @IsOptional()
  @IsEnum(LaborOrderStatus)
  status?: LaborOrderStatus;

  @ApiPropertyOptional({ enum: EmploymentType })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @ApiPropertyOptional({ enum: WorkShift })
  @IsOptional()
  @IsEnum(WorkShift)
  workShift?: WorkShift;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  salaryMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  salaryMax?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBooleanString()
  isPublic?: string;
}
