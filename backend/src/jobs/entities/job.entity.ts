import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { JobStatus } from '../job-status.enum';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column({
    type: 'varchar',
    default: JobStatus.PENDING,
  })
  status: JobStatus;

  @CreateDateColumn()
  createdAt: Date;
}
