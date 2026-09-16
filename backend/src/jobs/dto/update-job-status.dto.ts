import { IsEnum, IsNotEmpty } from 'class-validator';
import { JobStatus } from '../job-status.enum';

export class UpdateJobStatusDto {
  @IsEnum(JobStatus)
  @IsNotEmpty()
  status: JobStatus;
}
