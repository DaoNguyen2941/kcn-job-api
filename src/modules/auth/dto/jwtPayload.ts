
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class JWTPayload {
    @Expose()
    @IsNotEmpty()
    @IsString()
    username!: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    sub!: string;
}