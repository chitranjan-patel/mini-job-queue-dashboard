import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { JobStatus } from './job-status.enum';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const job = this.jobsRepository.create({
      ...createJobDto,
      status: JobStatus.PENDING,
    });
    return this.jobsRepository.save(job);
  }

  async findAll(): Promise<Job[]> {
    return this.jobsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async updateStatus(id: string, newStatus: JobStatus): Promise<void> {
    const job = await this.jobsRepository.findOne({ where: { id } });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    // Terminal state validation
    if (job.status === JobStatus.COMPLETED || job.status === JobStatus.FAILED) {
      throw new ConflictException(`Job status cannot be changed once it is ${job.status}`);
    }

    // Transition validation
    let expectedOldStatus: JobStatus;
    if (newStatus === JobStatus.RUNNING) {
      if (job.status !== JobStatus.PENDING) {
        throw new ConflictException(`Invalid status transition from ${job.status} to running`);
      }
      expectedOldStatus = JobStatus.PENDING;
    } else if (newStatus === JobStatus.COMPLETED || newStatus === JobStatus.FAILED) {
      if (job.status !== JobStatus.RUNNING) {
        throw new ConflictException(`Invalid status transition from ${job.status} to ${newStatus}`);
      }
      expectedOldStatus = JobStatus.RUNNING;
    } else {
       throw new ConflictException(`Invalid status transition to ${newStatus}`);
    }

    // Atomic update to handle concurrency
    const updateResult = await this.jobsRepository
      .createQueryBuilder()
      .update(Job)
      .set({ status: newStatus })
      .where('id = :id', { id })
      .andWhere('status = :expectedOldStatus', { expectedOldStatus })
      .execute();

    if (updateResult.affected === 0) {
      throw new ConflictException('Job status has changed. Please refresh and try again.');
    }
  }

  async remove(id: string): Promise<void> {
    const deleteResult = await this.jobsRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
  }
}
