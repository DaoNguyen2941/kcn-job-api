import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { EmploymentType } from '../../../common/enums/employment-type.enum';
import { WorkShift } from '../../../common/enums/work-shift.enum';
import { Gender } from '../../../common/enums/gender.enum';

export class CreateLaborOrderDto {
  @ApiProperty()
  @IsNumberString()
  companyId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  industrialZoneId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  jobCategoryId?: string;

  @ApiPropertyOptional({ description: 'Auto-generated if omitted' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantityRequired: number;

  @ApiPropertyOptional({ enum: EmploymentType })
  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMax?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  salaryDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  workLocation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  genderRequirement?: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(70)
  ageMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(70)
  ageMax?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  experienceRequirement?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  educationRequirement?: string;

  @ApiPropertyOptional({ enum: WorkShift })
  @IsOptional()
  @IsEnum(WorkShift)
  workShift?: WorkShift;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  accommodation?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  mealSupport?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  transportSupport?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  requirementsDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}
