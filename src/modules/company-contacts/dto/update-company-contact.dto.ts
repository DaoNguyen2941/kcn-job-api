import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCompanyContactDto } from './create-company-contact.dto';

export class UpdateCompanyContactDto extends PartialType(
  OmitType(CreateCompanyContactDto, ['companyId'] as const),
) {}
