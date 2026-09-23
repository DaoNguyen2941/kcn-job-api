import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength } from 'class-validator';
import { RequirementType } from '../../../common/enums/requirement-type.enum';

export class CreateLaborOrderRequirementDto {
  @ApiProperty()
  @IsNumberString()
  laborOrderId: string;

  @ApiProperty({ enum: RequirementType })
  @IsEnum(RequirementType)
  requirementType: RequirementType;

  @ApiProperty({ example: 'Biết sử dụng máy hàn' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  requirementValue: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
