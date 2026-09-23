import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IndustrialZone } from './industrial-zone.entity';
import { CreateIndustrialZoneDto } from './dto/create-industrial-zone.dto';
import { UpdateIndustrialZoneDto } from './dto/update-industrial-zone.dto';
import { QueryIndustrialZoneDto } from './dto/query-industrial-zone.dto';
import { PaginatedResult } from '../../common/dto/paginated-result.dto';
import { CacheHelperService } from '../../common/cache/cache-helper.service';

@Injectable()
export class IndustrialZonesService {
  constructor(
    @InjectRepository(IndustrialZone)
    private readonly repo: Repository<IndustrialZone>,
    private readonly cacheHelper: CacheHelperService,
  ) {}

  async create(dto: CreateIndustrialZoneDto): Promise<IndustrialZone> {
    const existed = await this.repo.findOne({ where: { code: dto.code } });
    if (existed) throw new ConflictException('Industrial zone code already exists');
    const entity = this.repo.create(dto);
    const saved = await this.repo.save(entity);
    await this.cacheHelper.invalidateIndustrialZonesList();
    return saved;
  }

  async findAll(query: QueryIndustrialZoneDto): Promise<PaginatedResult<IndustrialZone>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const qb = this.repo.createQueryBuilder('zone');

    if (query.keyword) {
      qb.andWhere('(zone.name LIKE :kw OR zone.code LIKE :kw)', { kw: `%${query.keyword}%` });
    }
    if (query.status) {
      qb.andWhere('zone.status = :status', { status: query.status });
    }

    qb.orderBy(`zone.${query.sortBy || 'createdAt'}`, query.sortOrder || 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: string): Promise<IndustrialZone> {
    const zone = await this.repo.findOne({ where: { id } });
    if (!zone) throw new NotFoundException('Industrial zone not found');
    return zone;
  }

  async update(id: string, dto: UpdateIndustrialZoneDto): Promise<IndustrialZone> {
    const zone = await this.findOne(id);
    if (dto.code && dto.code !== zone.code) {
      const existed = await this.repo.findOne({ where: { code: dto.code } });
      if (existed) throw new ConflictException('Industrial zone code already exists');
    }
    Object.assign(zone, dto);
    const saved = await this.repo.save(zone);
    await this.cacheHelper.invalidateIndustrialZonesList();
    return saved;
  }

  async remove(id: string): Promise<void> {
    const zone = await this.findOne(id);
    const companiesCount = await this.repo.manager
      .getRepository('Company')
      .count({ where: { industrialZoneId: id } });
    if (companiesCount > 0) {
      throw new BadRequestException(
        'Cannot delete industrial zone that already has companies assigned',
      );
    }
    await this.repo.remove(zone);
    await this.cacheHelper.invalidateIndustrialZonesList();
  }
}
