import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LaborOrderStatusActionDto {
  @ApiPropertyOptional({ description: 'Optional note explaining the status change' })
  @IsOptional()
  @IsString()
  note?: string;
}
