import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { CommonStatus } from '../../common/enums/common-status.enum';
import { RecruitmentPost } from '../recruitment-posts/recruitment-post.entity';

@Entity('recruitment_sources')
@Index(['code'], { unique: true })
export class RecruitmentSource extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'enum', enum: CommonStatus, default: CommonStatus.ACTIVE })
  status: CommonStatus;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @OneToMany(() => RecruitmentPost, (post) => post.source)
  posts: RecruitmentPost[];
}
