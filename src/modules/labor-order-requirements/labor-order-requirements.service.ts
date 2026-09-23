import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LaborOrderRequirement } from './labor-order-requirement.entity';
import { CreateLaborOrderRequirementDto } from './dto/create-labor-order-requirement.dto';
import { UpdateLaborOrderRequirementDto } from './dto/update-labor-order-requirement.dto';
import { QueryLaborOrderRequirementDto } from './dto/query-labor-order-requirement.dto';
import { PaginatedResult } from '../../common/dto/paginated-result.dto';

@Injectable()
export class LaborOrderRequirementsService {
  constructor(
    @InjectRepository(LaborOrderRequirement)
    private readonly repo: Repository<LaborOrderRequirement>,
  ) {}

  async create(dto: CreateLaborOrderRequirementDto): Promise<LaborOrderRequirement> {
    return this.repo.save(this.repo.create(dto));
  }

  async findAll(
    query: QueryLaborOrderRequirementDto,
  ): Promise<PaginatedResult<LaborOrderRequirement>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const qb = this.repo.createQueryBuilder('req');
    if (query.laborOrderId) {
      qb.andWhere('req.laborOrderId = :id', { id: query.laborOrderId });
    }
    qb.orderBy(`req.${query.sortBy || 'sortOrder'}`, query.sortOrder || 'ASC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: string): Promise<LaborOrderRequirement> {
    const req = await this.repo.findOne({ where: { id } });
    if (!req) throw new NotFoundException('Labor order requirement not found');
    return req;
  }

  async update(id: string, dto: UpdateLaborOrderRequirementDto): Promise<LaborOrderRequirement> {
    const req = await this.findOne(id);
    Object.assign(req, dto);
    return this.repo.save(req);
  }

  async remove(id: string): Promise<void> {
    const req = await this.findOne(id);
    await this.repo.remove(req);
  }
}
