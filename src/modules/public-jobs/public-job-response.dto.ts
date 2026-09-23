import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Public-safe projection of a labor_order. Internal admin-only fields
 * (note, closedAt, exact code) are intentionally excluded.
 */
export class PublicJobResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() slug: string;
  @ApiProperty() title: string;
  @ApiProperty() quantityRequired: number;
  @ApiProperty() employmentType: string;
  @ApiPropertyOptional() salaryMin: string | null;
  @ApiPropertyOptional() salaryMax: string | null;
  @ApiPropertyOptional() salaryDescription: string | null;
  @ApiPropertyOptional() workLocation: string | null;
  @ApiPropertyOptional() startDate: string | null;
  @ApiPropertyOptional() deadline: string | null;
  @ApiProperty() genderRequirement: string;
  @ApiPropertyOptional() ageMin: number | null;
  @ApiPropertyOptional() ageMax: number | null;
  @ApiPropertyOptional() experienceRequirement: string | null;
  @ApiPropertyOptional() educationRequirement: string | null;
  @ApiProperty() workShift: string;
  @ApiProperty() accommodation: boolean;
  @ApiProperty() mealSupport: boolean;
  @ApiProperty() transportSupport: boolean;
  @ApiPropertyOptional() description: string | null;
  @ApiPropertyOptional() requirementsDescription: string | null;
  @ApiProperty() status: string;
  @ApiPropertyOptional() companyName: string | null;
  @ApiPropertyOptional() industrialZoneName: string | null;
  @ApiPropertyOptional() province: string | null;
  @ApiPropertyOptional() district: string | null;
  @ApiPropertyOptional() jobCategoryName: string | null;
  @ApiProperty() createdAt: Date;
}
