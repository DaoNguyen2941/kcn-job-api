import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateRecruitmentPostDto } from './create-recruitment-post.dto';

export class UpdateRecruitmentPostDto extends PartialType(
  OmitType(CreateRecruitmentPostDto, ['laborOrderId'] as const),
) {}
