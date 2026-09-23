import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { RequirementType } from '../../common/enums/requirement-type.enum';
import { LaborOrder } from '../labor-orders/labor-order.entity';

@Entity('labor_order_requirements')
@Index(['laborOrderId'])
export class LaborOrderRequirement extends BaseEntity {
  @Column({ name: 'labor_order_id', type: 'bigint', unsigned: true })
  laborOrderId: string;

  @ManyToOne(() => LaborOrder, (order) => order.requirements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'labor_order_id' })
  laborOrder: LaborOrder;

  @Column({
    name: 'requirement_type',
    type: 'enum',
    enum: RequirementType,
    default: RequirementType.OTHER,
  })
  requirementType: RequirementType;

  @Column({ name: 'requirement_value', type: 'varchar', length: 255 })
  requirementValue: string;

  @Column({ name: 'is_required', type: 'tinyint', width: 1, default: 1 })
  isRequired: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;
}
