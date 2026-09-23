import { PartialType } from '@nestjs/swagger';
import { CreateIndustrialZoneDto } from './create-industrial-zone.dto';

export class UpdateIndustrialZoneDto extends PartialType(CreateIndustrialZoneDto) {}
