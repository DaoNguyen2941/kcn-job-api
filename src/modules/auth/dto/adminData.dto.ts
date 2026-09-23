import { OmitType } from '@nestjs/mapped-types'
import { BasicAdminDataDto } from "./baseAdminData.dto";

export class AdminDataDto extends OmitType(BasicAdminDataDto,['passwordHash','email'] as const) {}