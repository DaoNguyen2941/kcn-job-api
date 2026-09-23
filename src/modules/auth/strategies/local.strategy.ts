import { Strategy } from 'passport-local';
import { PassportStrategy, } from '@nestjs/passport';
import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AdminDataDto } from '../dto/adminData.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "admin-local") {
  constructor(private authService: AuthService) {
    super({ usernameField: 'username', passwordField: 'password', })
  }

  async validate(username: string, password: string,): Promise<AdminDataDto> {
    const admin: AdminDataDto | null = await this.authService.validateAdmin(username, password);
    if (!admin) {
      throw new UnauthorizedException('Thông tin tài khoản hoạc mật khẩu không đúng!');
    }
    return admin;
  }
}