import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { RecruitmentPostStatus } from '../../common/enums/recruitment-post-status.enum';
import { LaborOrder } from '../labor-orders/labor-order.entity';
import { RecruitmentSource } from '../recruitment-sources/recruitment-source.entity';

@Entity('recruitment_posts')
@Index(['laborOrderId'])
@Index(['sourceId'])
@Index(['status'])
@Index(['slug'], { unique: true })
export class RecruitmentPost extends BaseEntity {
  @Column({ name: 'labor_order_id', type: 'bigint', unsigned: true })
  laborOrderId: string;

  @ManyToOne(() => LaborOrder, (order) => order.recruitmentPosts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'labor_order_id' })
  laborOrder: LaborOrder;

  @Column({ name: 'source_id', type: 'bigint', unsigned: true })
  sourceId: string;

  @ManyToOne(() => RecruitmentSource, (source) => source.posts, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'source_id' })
  source: RecruitmentSource;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @Column({ type: 'enum', enum: RecruitmentPostStatus, default: RecruitmentPostStatus.DRAFT })
  status: RecruitmentPostStatus;

  @Column({ name: 'published_at', type: 'datetime', nullable: true })
  publishedAt: Date | null;

  @Column({ name: 'expired_at', type: 'datetime', nullable: true })
  expiredAt: Date | null;
}
