import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateLaborOrderRequirementDto } from './create-labor-order-requirement.dto';

export class UpdateLaborOrderRequirementDto extends PartialType(
  OmitType(CreateLaborOrderRequirementDto, ['laborOrderId'] as const),
) {}
