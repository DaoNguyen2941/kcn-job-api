import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { CommonStatus } from '../../common/enums/common-status.enum';
import { LaborOrder } from '../labor-orders/labor-order.entity';

@Entity('job_categories')
@Index(['code'], { unique: true })
@Index(['status'])
export class JobCategory extends BaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: CommonStatus, default: CommonStatus.ACTIVE })
  status: CommonStatus;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @OneToMany(() => LaborOrder, (order) => order.jobCategory)
  laborOrders: LaborOrder[];
}
