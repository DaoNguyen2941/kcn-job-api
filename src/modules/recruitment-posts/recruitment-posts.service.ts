import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecruitmentPost } from './recruitment-post.entity';
import { CreateRecruitmentPostDto } from './dto/create-recruitment-post.dto';
import { UpdateRecruitmentPostDto } from './dto/update-recruitment-post.dto';
import { QueryRecruitmentPostDto } from './dto/query-recruitment-post.dto';
import { PaginatedResult } from '../../common/dto/paginated-result.dto';
import { buildSlug } from '../../common/utils/slug.util';
import { CacheHelperService } from '../../common/cache/cache-helper.service';

@Injectable()
export class RecruitmentPostsService {
  constructor(
    @InjectRepository(RecruitmentPost)
    private readonly repo: Repository<RecruitmentPost>,
    private readonly cacheHelper: CacheHelperService,
  ) {}

  async create(dto: CreateRecruitmentPostDto): Promise<RecruitmentPost> {
    const slug = dto.slug || buildSlug(dto.title);
    const existed = await this.repo.findOne({ where: { slug } });
    if (existed) throw new ConflictException('Recruitment post slug already exists');
    const entity = this.repo.create({ ...dto, slug });
    const saved = await this.repo.save(entity);
    await this.cacheHelper.invalidateJobsList();
    return saved;
  }

  async findAll(query: QueryRecruitmentPostDto): Promise<PaginatedResult<RecruitmentPost>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const qb = this.repo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.laborOrder', 'order')
      .leftJoinAndSelect('post.source', 'source');

    if (query.laborOrderId) qb.andWhere('post.laborOrderId = :id', { id: query.laborOrderId });
    if (query.sourceId) qb.andWhere('post.sourceId = :sourceId', { sourceId: query.sourceId });
    if (query.status) qb.andWhere('post.status = :status', { status: query.status });

    qb.orderBy(`post.${query.sortBy || 'createdAt'}`, query.sortOrder || 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: string): Promise<RecruitmentPost> {
    const post = await this.repo.findOne({
      where: { id },
      relations: ['laborOrder', 'source'],
    });
    if (!post) throw new NotFoundException('Recruitment post not found');
    return post;
  }

  async update(id: string, dto: UpdateRecruitmentPostDto): Promise<RecruitmentPost> {
    const post = await this.findOne(id);
    if (dto.slug && dto.slug !== post.slug) {
      const existed = await this.repo.findOne({ where: { slug: dto.slug } });
      if (existed) throw new ConflictException('Recruitment post slug already exists');
    }
    Object.assign(post, dto);
    const saved = await this.repo.save(post);
    await this.cacheHelper.invalidateJobsList();
    return saved;
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.repo.remove(post);
    await this.cacheHelper.invalidateJobsList();
  }
}
