import { PartialType } from '@nestjs/swagger';
import { CreateLaborOrderDto } from './create-labor-order.dto';

export class UpdateLaborOrderDto extends PartialType(CreateLaborOrderDto) {}
