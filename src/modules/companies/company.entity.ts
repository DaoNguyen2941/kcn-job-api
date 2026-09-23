import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { CommonStatus } from '../../common/enums/common-status.enum';
import { IndustrialZone } from '../industrial-zones/industrial-zone.entity';
import { CompanyContact } from '../company-contacts/company-contact.entity';
import { LaborOrder } from '../labor-orders/labor-order.entity';

@Entity('companies')
@Index(['industrialZoneId'])
@Index(['status'])
@Index(['taxCode'], { unique: true })
export class Company extends BaseEntity {
  @Column({ name: 'industrial_zone_id', type: 'bigint', unsigned: true, nullable: true })
  industrialZoneId: string | null;

  @ManyToOne(() => IndustrialZone, (zone) => zone.companies, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'industrial_zone_id' })
  industrialZone: IndustrialZone | null;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'short_name', type: 'varchar', length: 150, nullable: true })
  shortName: string | null;

  @Column({ name: 'tax_code', type: 'varchar', length: 50, nullable: true })
  taxCode: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string | null;

  @Column({ type: 'enum', enum: CommonStatus, default: CommonStatus.ACTIVE })
  status: CommonStatus;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @OneToMany(() => CompanyContact, (contact) => contact.company)
  contacts: CompanyContact[];

  @OneToMany(() => LaborOrder, (order) => order.company)
  laborOrders: LaborOrder[];
}
