import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { CandidateStatus } from '../../common/enums/candidate-status.enum';
import { Gender } from '../../common/enums/gender.enum';
import { LaborOrderWorker } from '../labor-order-workers/labor-order-worker.entity';

/**
 * A candidate is only created once KCN JOB actually collects a worker's
 * information for the purpose of supplying them to a company. It is NOT a
 * lead / applicant record - simply viewing a job post or messaging on
 * Facebook/Zalo never creates a candidate.
 */
@Entity('candidates')
@Index(['phone'])
@Index(['status'])
export class Candidate extends BaseEntity {
  @Column({ name: 'full_name', type: 'varchar', length: 150 })
  fullName: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string | null;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: string | null;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  province: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  district: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  experience: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  education: string | null;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @Column({ type: 'enum', enum: CandidateStatus, default: CandidateStatus.ACTIVE })
  status: CandidateStatus;

  @OneToMany(() => LaborOrderWorker, (worker) => worker.candidate)
  laborOrderWorkers: LaborOrderWorker[];
}
