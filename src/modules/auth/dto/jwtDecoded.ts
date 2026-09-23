import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { JWTPayload } from "./jwtPayload";

export class JWTDecoded extends JWTPayload {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  iat!: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  exp!: number;
}