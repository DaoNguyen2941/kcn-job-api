import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { CommonStatus } from '../../common/enums/common-status.enum';
import { Company } from '../companies/company.entity';
import { LaborOrder } from '../labor-orders/labor-order.entity';

@Entity('industrial_zones')
@Index(['code'], { unique: true })
@Index(['status'])
export class IndustrialZone extends BaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  province: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  district: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string | null;

  @Column({ type: 'enum', enum: CommonStatus, default: CommonStatus.ACTIVE })
  status: CommonStatus;

  @OneToMany(() => Company, (company) => company.industrialZone)
  companies: Company[];

  @OneToMany(() => LaborOrder, (order) => order.industrialZone)
  laborOrders: LaborOrder[];
}
