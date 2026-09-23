import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { EmploymentType } from '../../../common/enums/employment-type.enum';
import { WorkShift } from '../../../common/enums/work-shift.enum';
import { Gender } from '../../../common/enums/gender.enum';

export class QueryPublicJobDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Search in title/description' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  job_category_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  industrial_zone_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  salary_min?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  salary_max?: number;

  @ApiPropertyOptional({ enum: EmploymentType })
  @IsOptional()
  @IsEnum(EmploymentType)
  employment_type?: EmploymentType;

  @ApiPropertyOptional({ enum: WorkShift })
  @IsOptional()
  @IsEnum(WorkShift)
  work_shift?: WorkShift;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
