import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { LaborOrderStatus } from '../../common/enums/labor-order-status.enum';
import { EmploymentType } from '../../common/enums/employment-type.enum';
import { WorkShift } from '../../common/enums/work-shift.enum';
import { Gender } from '../../common/enums/gender.enum';
import { Company } from '../companies/company.entity';
import { IndustrialZone } from '../industrial-zones/industrial-zone.entity';
import { JobCategory } from '../job-categories/job-category.entity';
import { LaborOrderRequirement } from '../labor-order-requirements/labor-order-requirement.entity';
import { RecruitmentPost } from '../recruitment-posts/recruitment-post.entity';
import { LaborOrderWorker } from '../labor-order-workers/labor-order-worker.entity';

/**
 * Central table of System 1: a company's request for labor supply.
 * Fulfilment counters (supplied / started) are NOT stored here - they are
 * derived at read-time from `labor_order_workers` (see LaborOrdersService.getProgress).
 */
@Entity('labor_orders')
@Index(['companyId'])
@Index(['industrialZoneId'])
@Index(['jobCategoryId'])
@Index(['status'])
@Index(['isPublic'])
@Index(['employmentType'])
@Index(['startDate'])
@Index(['deadline'])
@Index(['salaryMin'])
@Index(['salaryMax'])
@Index(['code'], { unique: true })
export class LaborOrder extends BaseEntity {
  @Column({ name: 'company_id', type: 'bigint', unsigned: true })
  companyId: string;

  @ManyToOne(() => Company, (company) => company.laborOrders, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'industrial_zone_id', type: 'bigint', unsigned: true, nullable: true })
  industrialZoneId: string | null;

  @ManyToOne(() => IndustrialZone, (zone) => zone.laborOrders, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'industrial_zone_id' })
  industrialZone: IndustrialZone | null;

  @Column({ name: 'job_category_id', type: 'bigint', unsigned: true, nullable: true })
  jobCategoryId: string | null;

  @ManyToOne(() => JobCategory, (category) => category.laborOrders, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'job_category_id' })
  jobCategory: JobCategory | null;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'slug', type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ name: 'quantity_required', type: 'int', unsigned: true })
  quantityRequired: number;

  @Column({
    name: 'employment_type',
    type: 'enum',
    enum: EmploymentType,
    default: EmploymentType.FULL_TIME,
  })
  employmentType: EmploymentType;

  @Column({ name: 'salary_min', type: 'decimal', precision: 12, scale: 2, nullable: true })
  salaryMin: string | null;

  @Column({ name: 'salary_max', type: 'decimal', precision: 12, scale: 2, nullable: true })
  salaryMax: string | null;

  @Column({ name: 'salary_description', type: 'varchar', length: 255, nullable: true })
  salaryDescription: string | null;

  @Column({ name: 'work_location', type: 'varchar', length: 255, nullable: true })
  workLocation: string | null;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: string | null;

  @Column({ type: 'date', nullable: true })
  deadline: string | null;

  @Column({
    name: 'gender_requirement',
    type: 'enum',
    enum: Gender,
    default: Gender.ANY,
  })
  genderRequirement: Gender;

  @Column({ name: 'age_min', type: 'smallint', unsigned: true, nullable: true })
  ageMin: number | null;

  @Column({ name: 'age_max', type: 'smallint', unsigned: true, nullable: true })
  ageMax: number | null;

  @Column({ name: 'experience_requirement', type: 'varchar', length: 255, nullable: true })
  experienceRequirement: string | null;

  @Column({ name: 'education_requirement', type: 'varchar', length: 255, nullable: true })
  educationRequirement: string | null;

  @Column({ name: 'work_shift', type: 'enum', enum: WorkShift, default: WorkShift.DAY })
  workShift: WorkShift;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  accommodation: boolean;

  @Column({ name: 'meal_support', type: 'tinyint', width: 1, default: 0 })
  mealSupport: boolean;

  @Column({ name: 'transport_support', type: 'tinyint', width: 1, default: 0 })
  transportSupport: boolean;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'requirements_description', type: 'text', nullable: true })
  requirementsDescription: string | null;

  @Column({ name: 'is_public', type: 'tinyint', width: 1, default: 0 })
  isPublic: boolean;

  @Column({ type: 'enum', enum: LaborOrderStatus, default: LaborOrderStatus.DRAFT })
  status: LaborOrderStatus;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @Column({ name: 'closed_at', type: 'datetime', nullable: true })
  closedAt: Date | null;

  @OneToMany(() => LaborOrderRequirement, (req) => req.laborOrder)
  requirements: LaborOrderRequirement[];

  @OneToMany(() => RecruitmentPost, (post) => post.laborOrder)
  recruitmentPosts: RecruitmentPost[];

  @OneToMany(() => LaborOrderWorker, (worker) => worker.laborOrder)
  workers: LaborOrderWorker[];
}
