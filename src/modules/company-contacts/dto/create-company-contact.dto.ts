import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CommonStatus } from '../../../common/enums/common-status.enum';

export class CreateCompanyContactDto {
  @ApiProperty()
  @IsNumberString()
  companyId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  fullName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  position?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({ enum: CommonStatus })
  @IsOptional()
  @IsEnum(CommonStatus)
  status?: CommonStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}
