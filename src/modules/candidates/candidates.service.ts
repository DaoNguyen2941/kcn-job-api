import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './candidate.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { QueryCandidateDto } from './dto/query-candidate.dto';
import { PaginatedResult } from '../../common/dto/paginated-result.dto';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private readonly repo: Repository<Candidate>,
  ) {}

  async create(dto: CreateCandidateDto): Promise<Candidate> {
    return this.repo.save(this.repo.create(dto));
  }

  async findAll(query: QueryCandidateDto): Promise<PaginatedResult<Candidate>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const qb = this.repo.createQueryBuilder('candidate');

    if (query.keyword) {
      qb.andWhere('(candidate.fullName LIKE :kw OR candidate.phone LIKE :kw)', {
        kw: `%${query.keyword}%`,
      });
    }
    if (query.phone) qb.andWhere('candidate.phone = :phone', { phone: query.phone });
    if (query.status) qb.andWhere('candidate.status = :status', { status: query.status });

    qb.orderBy(`candidate.${query.sortBy || 'createdAt'}`, query.sortOrder || 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: string): Promise<Candidate> {
    const candidate = await this.repo.findOne({ where: { id } });
    if (!candidate) throw new NotFoundException('Candidate not found');
    return candidate;
  }

  async update(id: string, dto: UpdateCandidateDto): Promise<Candidate> {
    const candidate = await this.findOne(id);
    Object.assign(candidate, dto);
    return this.repo.save(candidate);
  }

  async remove(id: string): Promise<void> {
    const candidate = await this.findOne(id);
    const workerRecordsCount = await this.repo.manager
      .getRepository('LaborOrderWorker')
      .count({ where: { candidateId: id } });
    if (workerRecordsCount > 0) {
      throw new BadRequestException(
        'Cannot delete candidate that is already linked to a labor order',
      );
    }
    await this.repo.remove(candidate);
  }
}
