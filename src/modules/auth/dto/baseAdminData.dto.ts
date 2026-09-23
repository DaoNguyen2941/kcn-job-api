import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class BasicAdminDataDto {
    @Expose()
    @IsString()
    id!: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    username!: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    passwordHash!: string;

    @Expose()
    @IsEmail()
    @IsNotEmpty()
    email!: string;
}