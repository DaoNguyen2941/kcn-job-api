import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from './admin-user.entity';
import { BasicAdminDataDto } from '@modules/auth/dto/baseAdminData.dto';
import { plainToInstance } from 'class-transformer';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminUserRepository: Repository<AdminUser>,
  ) { }

  async getAdminByUserName(userName: string): Promise<BasicAdminDataDto> {
    try {
      const admin = await this.adminUserRepository.findOne({
        where: { username: userName },
        select: {
          id: true,
          username: true,
          passwordHash: true,
          email: true
        }
      });
      return plainToInstance(BasicAdminDataDto, admin, {
        excludeExtraneousValues: true,
      })
    } catch (error) {
      throw new HttpException(
        'Đã xảy ra lỗi không xác định',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /** Includes password_hash (select:false by default) - only for auth checks. */
  async findByUsernameWithPassword(username: string): Promise<AdminUser | null> {
    return this.adminUserRepository
      .createQueryBuilder('admin')
      .addSelect('admin.passwordHash')
      .where('admin.username = :username', { username })
      .getOne();
  }

  async findById(id: string): Promise<AdminUser | null> {
    return this.adminUserRepository.findOne({ where: { id } });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.adminUserRepository.update(id, { lastLoginAt: new Date() });
  }
}
