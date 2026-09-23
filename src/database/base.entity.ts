import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Shared base for all business entities.
 * PK: BIGINT UNSIGNED AUTO_INCREMENT
 * Timestamps: created_at / updated_at
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
