import { Expose } from 'class-transformer';
import { CommonStatus } from 'src/common/enums/common-status.enum';

export class CompanyResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() shortName: string | null;
  @Expose() taxCode: string | null;
  @Expose() phone: string | null;
  @Expose() email: string | null;
  @Expose() address: string | null;
  @Expose() industrialZoneId: string | null;
  @Expose() status: CommonStatus;
  @Expose() note: string | null;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}