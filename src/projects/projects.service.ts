import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from './entities/project.entity';
import { CreateProjectDto, UpdateProjectDto, ProjectResponseDto } from './dto/project.dto';
import { UserRole } from '../auth/entities/client.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    clientId: number,
  ): Promise<ProjectResponseDto> {
    const projectData: any = {
      ...createProjectDto,
      client_id: clientId,
    };

    const project = this.projectRepository.create(projectData);
    const savedProject = await this.projectRepository.save(project);
    // Handle the case where save returns an array
    const projectToReturn = Array.isArray(savedProject) ? savedProject[0] : savedProject;
    return this.transformToResponseDto(projectToReturn);
  }

  async findAll(userId: number, userRole: UserRole): Promise<ProjectResponseDto[]> {
    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.client', 'client')
      .select([
        'project',
        'client.id',
        'client.company_name',
        'client.email',
      ]);

    if (userRole === UserRole.CLIENT) {
      queryBuilder.where('project.client_id = :clientId', { clientId: userId });
    }

    const projects = await queryBuilder.getMany();
    return projects.map((project) => this.transformToResponseDto(project));
  }

  async findOne(
    id: number,
    userId: number,
    userRole: UserRole,
  ): Promise<ProjectResponseDto> {
    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.client', 'client')
      .select([
        'project',
        'client.id',
        'client.company_name',
        'client.email',
      ])
      .where('project.id = :id', { id });

    if (userRole === UserRole.CLIENT) {
      queryBuilder.andWhere('project.client_id = :clientId', { clientId: userId });
    }

    const project = await queryBuilder.getOne();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.transformToResponseDto(project);
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    userId: number,
    userRole: UserRole,
  ): Promise<ProjectResponseDto> {
    const project = await this.findOne(id, userId, userRole);

    if (userRole === UserRole.CLIENT && project.client_id !== userId) {
      throw new ForbiddenException('You can only update your own projects');
    }

    const updateData: any = { ...updateProjectDto };

    await this.projectRepository.update(id, updateData);
    return this.findOne(id, userId, userRole);
  }

  async remove(
    id: number,
    userId: number,
    userRole: UserRole,
  ): Promise<void> {
    const project = await this.findOne(id, userId, userRole);

    if (userRole === UserRole.CLIENT && project.client_id !== userId) {
      throw new ForbiddenException('You can only delete your own projects');
    }

    await this.projectRepository.delete(id);
  }

  async findActiveProjects(): Promise<Project[]> {
    return this.projectRepository.find({
      where: { status: ProjectStatus.ACTIVE },
    });
  }

  private transformToResponseDto(project: Project): ProjectResponseDto {
    return {
      id: project.id,
      client_id: project.client_id,
      country: project.country,
      services_needed: project.services_needed,
      budget: project.budget,
      status: project.status,
      created_at: project.created_at,
      updated_at: project.updated_at,
      client: project.client
        ? {
            id: project.client.id,
            company_name: project.client.company_name,
            email: project.client.email,
          }
        : undefined,
    };
  }
}
