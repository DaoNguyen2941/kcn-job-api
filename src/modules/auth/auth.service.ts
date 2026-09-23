import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { AdminUsersService } from '../admin-users/admin-users.service';
import { RedisService } from '../../redis/redis.service';
import { CommonStatus } from '../../common/enums/common-status.enum';
import { parseExpiryToSeconds } from '../../common/utils/time.util';
import { JwtAccessPayload, JwtRefreshPayload } from './interfaces/jwt-payload.interface';
import { createCookie } from '@common/utils/cookie';
import { AdminDataDto } from './dto/adminData.dto';
import { JWTPayload } from './dto/jwtPayload';
import { BasicAdminDataDto } from './dto/baseAdminData.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminUsersService: AdminUsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) { }

  public createRefreshCookie(admin: AdminDataDto) {
    const payload: JWTPayload = {
      sub: admin.id,
      username: admin.username,
    };

    const refreshExpirationTime = this.configService.getOrThrow<number>(
      'jwt.refreshExpiresIn',
    );

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: refreshExpirationTime, // number (giây), bỏ ${...}s
      secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
    });

    const refreshTokenCookie = createCookie(
      'Refresh',
      refreshToken,
      '/api/admin/auth/refresh',
      refreshExpirationTime,
    );

    return {
      refreshTokenCookie,
      refreshToken,
    };
  }

public createAuthCookie(adminData: AdminDataDto) {
  const payload: JWTPayload = {
    sub: adminData.id,
    username: adminData.username,
  };

  const accessExpirationTime =
    this.configService.getOrThrow<number>('jwt.accessExpiresIn');

  console.log('expiresIn:', accessExpirationTime);
  console.log('type:', typeof accessExpirationTime);

  const token = this.jwtService.sign(payload, {
    secret: this.configService.getOrThrow<string>('jwt.accessSecret'),
    expiresIn: accessExpirationTime,
  });

  console.log('token:', token);
  console.log('decoded:', this.jwtService.decode(token));

  const cookie = createCookie(
    'Authentication',
    token,
    '/',
    accessExpirationTime,
  );

  return {
    accessTokenCookie: cookie,
    token,
  };
}

  private refreshSessionKey(adminId: string, tokenId: string): string {
    return `auth:refresh:${adminId}:${tokenId}`;
  }

  private async signAccessToken(adminId: string, username: string): Promise<string> {
    const payload: JwtAccessPayload = { sub: adminId, username };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: this.configService.get<number>('jwt.accessExpiresIn'),
    });
  }

  private async issueRefreshToken(adminId: string): Promise<string> {
    const tokenId = uuidv4();
    const payload: JwtRefreshPayload = { sub: adminId, tokenId };
    const refreshExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d';
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: refreshExpiresIn,
    });

    // Store only a hash of the refresh token in Redis - never plaintext.
    const rounds = this.configService.get<number>('bcryptRounds') ?? 10;
    const tokenHash = await bcrypt.hash(refreshToken, rounds);
    const ttlSeconds = parseExpiryToSeconds(refreshExpiresIn);
    await this.redisService.set(
      this.refreshSessionKey(adminId, tokenId),
      tokenHash,
      ttlSeconds,
    );

    return refreshToken;
  }

  async validateAdmin(username: string, pass: string): Promise<AdminDataDto | null> {
    const adminData: BasicAdminDataDto = await this.adminUsersService.getAdminByUserName(username)
    if (!adminData) { return null; }
    const isPasswordMatching = await bcrypt.compare(
      pass, adminData.passwordHash
    );
    if (adminData && isPasswordMatching) {
      return plainToInstance(AdminDataDto, adminData, {
        excludeExtraneousValues: true,
      })
    }
    return null;
  }

  async refresh(refreshToken: string) {
    let payload: JwtRefreshPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtRefreshPayload>(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const sessionKey = this.refreshSessionKey(payload.sub, payload.tokenId);
    const storedHash = await this.redisService.get(sessionKey);
    if (!storedHash) {
      // Token unknown/revoked/expired in Redis -> reject (possible reuse attack).
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    const matches = await bcrypt.compare(refreshToken, storedHash);
    if (!matches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const admin = await this.adminUsersService.findById(payload.sub);
    if (!admin || admin.status !== CommonStatus.ACTIVE) {
      throw new UnauthorizedException('Admin account is not active');
    }

    // Rotation: revoke the old session before issuing new tokens.
    await this.redisService.del(sessionKey);

    const accessToken = await this.signAccessToken(admin.id, admin.username);
    const newRefreshToken = await this.issueRefreshToken(admin.id);

    return { accessToken, refreshToken: newRefreshToken };
  }

  /**
   * Revokes a specific refresh session (if refreshToken given & decodable),
   * otherwise revokes every session belonging to the admin.
   */
  async logout(adminId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      try {
        const payload = await this.jwtService.verifyAsync<JwtRefreshPayload>(refreshToken, {
          secret: this.configService.get<string>('jwt.refreshSecret'),
          ignoreExpiration: true,
        });
        if (payload.sub === adminId) {
          await this.redisService.del(this.refreshSessionKey(adminId, payload.tokenId));
          return;
        }
      } catch {
        // fall through to revoke-all below
      }
    }
    await this.redisService.delByPattern(`auth:refresh:${adminId}:*`);
  }

  async getProfile(adminId: string) {
    const admin = await this.adminUsersService.findById(adminId);
    if (!admin) {
      throw new UnauthorizedException();
    }
    return {
      id: admin.id,
      username: admin.username,
      fullName: admin.fullName,
      email: admin.email,
      phone: admin.phone,
      status: admin.status,
      lastLoginAt: admin.lastLoginAt,
    };
  }
}
