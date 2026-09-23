import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { CommonStatus } from '../../common/enums/common-status.enum';
import { Company } from '../companies/company.entity';

@Entity('company_contacts')
@Index(['companyId'])
export class CompanyContact extends BaseEntity {
  @Column({ name: 'company_id', type: 'bigint', unsigned: true })
  companyId: string;

  @ManyToOne(() => Company, (company) => company.contacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'full_name', type: 'varchar', length: 150 })
  fullName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  position: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string | null;

  @Column({ name: 'is_primary', type: 'tinyint', width: 1, default: 0 })
  isPrimary: boolean;

  @Column({ type: 'enum', enum: CommonStatus, default: CommonStatus.ACTIVE })
  status: CommonStatus;

  @Column({ type: 'text', nullable: true })
  note: string | null;
}
