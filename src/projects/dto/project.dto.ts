import { IsString, IsNumber, IsArray, IsOptional, IsEnum } from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
  @IsString()
  country: string;

  @IsArray()
  @IsString({ each: true })
  services_needed: string[];

  @IsNumber()
  budget: number;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services_needed?: string[];

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}

export class ProjectResponseDto {
  id: number;
  client_id: number;
  country: string;
  services_needed: string[];
  budget: number;
  status: ProjectStatus;
  created_at: Date;
  updated_at: Date;
  client?: {
    id: number;
    company_name: string;
    email: string;
  };
}
