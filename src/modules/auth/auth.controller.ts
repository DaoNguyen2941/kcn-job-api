import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Get, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { CurrentAdmin, CurrentAdminData } from '../../common/decorators/current-admin.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SkipAuth } from '@common/decorators/skipAuth';
import { CustomAdminInRequest } from './dto/customAdminInRequest.dto';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';

@ApiTags('Admin Auth')
@Controller('admin/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) { }

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(@Request() request: CustomAdminInRequest)
  // : Promise<AuthResponseDto>
  {
    const admin = request.user;
    const { accessTokenCookie, token } = this.authService.createAuthCookie(admin);
    const { refreshTokenCookie, refreshToken } = this.authService.createRefreshCookie(admin);
    //     await this.cacheService.setCache(
    //     `admin-refresh-token-${admin.id}`,
    //     hashedRefreshToken,
    //     refreshExpirationTime,
    // );
    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return {
      message: 'login successfully',
      admin: {
        id: admin.id,
        username: admin.username,
      },
      // accessToken: token,
      // refreshToken: refreshToken
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async logout(
    @CurrentAdmin() admin: CurrentAdminData,
    @Body() dto: Partial<RefreshTokenDto>,
  ): Promise<{ loggedOut: boolean }> {
    await this.authService.logout(admin.id, dto?.refreshToken);
    return { loggedOut: true };
  }

  @Get('me')
  @ApiBearerAuth()
  async me(@CurrentAdmin() admin: CurrentAdminData) {
    return this.authService.getProfile(admin.id);
  }
}
