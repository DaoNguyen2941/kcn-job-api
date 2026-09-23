import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyContact } from './company-contact.entity';
import { CreateCompanyContactDto } from './dto/create-company-contact.dto';
import { UpdateCompanyContactDto } from './dto/update-company-contact.dto';
import { QueryCompanyContactDto } from './dto/query-company-contact.dto';
import { PaginatedResult } from '../../common/dto/paginated-result.dto';

@Injectable()
export class CompanyContactsService {
  constructor(
    @InjectRepository(CompanyContact)
    private readonly repo: Repository<CompanyContact>,
  ) {}

  async create(dto: CreateCompanyContactDto): Promise<CompanyContact> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(query: QueryCompanyContactDto): Promise<PaginatedResult<CompanyContact>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const qb = this.repo.createQueryBuilder('contact');

    if (query.companyId) {
      qb.andWhere('contact.companyId = :companyId', { companyId: query.companyId });
    }

    qb.orderBy(`contact.${query.sortBy || 'createdAt'}`, query.sortOrder || 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: string): Promise<CompanyContact> {
    const contact = await this.repo.findOne({ where: { id } });
    if (!contact) throw new NotFoundException('Company contact not found');
    return contact;
  }

  async update(id: string, dto: UpdateCompanyContactDto): Promise<CompanyContact> {
    const contact = await this.findOne(id);
    Object.assign(contact, dto);
    return this.repo.save(contact);
  }

  async remove(id: string): Promise<void> {
    const contact = await this.findOne(id);
    await this.repo.remove(contact);
  }
}
