import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, ProjectResponseDto } from './dto/project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/client.entity';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.create(createProjectDto, req.user.id);
  }

  @Get()
  async findAll(@Request() req): Promise<ProjectResponseDto[]> {
    return this.projectsService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.findOne(+id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.update(+id, updateProjectDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  async remove(
    @Param('id') id: string,
    @Request() req,
  ): Promise<void> {
    return this.projectsService.remove(+id, req.user.id, req.user.role);
  }
}
