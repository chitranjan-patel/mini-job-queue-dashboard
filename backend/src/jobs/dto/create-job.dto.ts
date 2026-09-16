import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @MaxLength(50)
  type: string;
}
