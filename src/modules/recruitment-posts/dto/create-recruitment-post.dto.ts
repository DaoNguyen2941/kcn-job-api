import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { RecruitmentPostStatus } from '../../../common/enums/recruitment-post-status.enum';

export class CreateRecruitmentPostDto {
  @ApiProperty()
  @IsNumberString()
  laborOrderId: string;

  @ApiProperty()
  @IsNumberString()
  sourceId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'Auto-generated from title if omitted' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @ApiPropertyOptional({ enum: RecruitmentPostStatus })
  @IsOptional()
  @IsEnum(RecruitmentPostStatus)
  status?: RecruitmentPostStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expiredAt?: string;
}
