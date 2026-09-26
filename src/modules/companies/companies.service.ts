import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { QueryCompanyDto } from './dto/query-company.dto';
import { PaginatedResult } from '../../common/dto/paginated-result.dto';
import { CompanyResponseDto } from './dto/res-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly repo: Repository<Company>,
  ) { }

  async create(dto: CreateCompanyDto): Promise<CompanyResponseDto> {
    if (dto.taxCode) {
      const existed = await this.repo.findOne({ where: { taxCode: dto.taxCode } });
      if (existed) {
        throw new ConflictException('Tax code already exists');
      }
    }
    const entity = this.repo.create(dto);
    const saved = await this.repo.save(entity);
    return saved;
  }

  async findAll(query: QueryCompanyDto): Promise<PaginatedResult<Company>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const qb = this.repo
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.industrialZone', 'zone')
      .leftJoinAndSelect('company.laborOrders', 'laborOrder')

    if (query.keyword) {
      qb.andWhere('(company.name LIKE :kw OR company.shortName LIKE :kw OR company.taxCode LIKE :kw)', {
        kw: `%${query.keyword}%`,
      });
    }
    if (query.industrialZoneId) {
      qb.andWhere('company.industrialZoneId = :zoneId', { zoneId: query.industrialZoneId });
    }
    if (query.status) {
      qb.andWhere('company.status = :status', { status: query.status });
    }

    qb.orderBy(`company.${query.sortBy || 'createdAt'}`, query.sortOrder || 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.repo.findOne({
      where: { id },
      relations: ['industrialZone', 'contacts'],
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(id: string, dto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOne(id);
    if (dto.taxCode && dto.taxCode !== company.taxCode) {
      const existed = await this.repo.findOne({ where: { taxCode: dto.taxCode } });
      if (existed) throw new ConflictException('Tax code already exists');
    }
    Object.assign(company, dto);
    return this.repo.save(company);
  }

  async remove(id: string): Promise<void> {
    const company = await this.findOne(id);
    const laborOrdersCount = await this.repo.manager
      .getRepository('LaborOrder')
      .count({ where: { companyId: id } });
    if (laborOrdersCount > 0) {
      throw new BadRequestException('Cannot delete company that already has labor orders');
    }
    await this.repo.remove(company);
  }
}
