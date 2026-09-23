import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { LaborOrderWorkerStatus } from '../../common/enums/labor-order-worker-status.enum';
import { LaborOrder } from '../labor-orders/labor-order.entity';
import { Candidate } from '../candidates/candidate.entity';

/**
 * Links a candidate to a labor order once the company has accepted them.
 * `labor_orders.quantity_required` progress (supplied/started/remaining) is
 * always computed from rows here - never stored as a counter on labor_orders.
 */
@Entity('labor_order_workers')
@Index(['laborOrderId'])
@Index(['candidateId'])
@Index(['status'])
@Index(['laborOrderId', 'candidateId'], { unique: true })
export class LaborOrderWorker extends BaseEntity {
  @Column({ name: 'labor_order_id', type: 'bigint', unsigned: true })
  laborOrderId: string;

  @ManyToOne(() => LaborOrder, (order) => order.workers, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'labor_order_id' })
  laborOrder: LaborOrder;

  @Column({ name: 'candidate_id', type: 'bigint', unsigned: true })
  candidateId: string;

  @ManyToOne(() => Candidate, (candidate) => candidate.laborOrderWorkers, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'candidate_id' })
  candidate: Candidate;

  @Column({
    type: 'enum',
    enum: LaborOrderWorkerStatus,
    default: LaborOrderWorkerStatus.SUPPLIED,
  })
  status: LaborOrderWorkerStatus;

  @Column({ name: 'supplied_at', type: 'datetime', nullable: true })
  suppliedAt: Date | null;

  @Column({ name: 'started_at', type: 'datetime', nullable: true })
  startedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  note: string | null;
}
