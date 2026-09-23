import { AdminDataDto } from "./adminData.dto";
import { Response } from 'express';
import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class CustomAdminInRequest extends Request {
    @Expose()
    @IsNotEmpty()
    user!: AdminDataDto;

    @Expose()
    res!: Response;
}