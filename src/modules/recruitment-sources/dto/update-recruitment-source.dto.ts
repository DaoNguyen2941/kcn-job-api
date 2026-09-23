import { PartialType } from '@nestjs/swagger';
import { CreateRecruitmentSourceDto } from './create-recruitment-source.dto';

export class UpdateRecruitmentSourceDto extends PartialType(CreateRecruitmentSourceDto) {}
