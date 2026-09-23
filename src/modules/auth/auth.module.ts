import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AdminUsersModule } from '../admin-users/admin-users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAdminStrategy } from './strategies/jwtAdmin.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [AdminUsersModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAdminStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
