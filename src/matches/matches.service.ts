import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { Project } from '../projects/entities/project.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { MatchGenerationResultDto } from './dto/match.dto';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
  ) {}

  async rebuildMatches(projectId: number): Promise<MatchGenerationResultDto> {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Find vendors that match the project criteria
    const matchingVendors = await this.vendorRepository
      .createQueryBuilder('vendor')
      .where('vendor.countries_supported LIKE :country', { country: `%${project.country}%` })
      .andWhere('vendor.services_offered && :services', { services: project.services_needed })
      .getMany();

    let matchesCreated = 0;
    let matchesUpdated = 0;

    for (const vendor of matchingVendors) {
      // Calculate match score
      const servicesOverlap = project.services_needed.filter(service =>
        vendor.services_offered.includes(service)
      ).length;
      
      const score = servicesOverlap * 2 + vendor.rating + (24 / vendor.response_sla_hours);

      // Check if match already exists
      const existingMatch = await this.matchRepository.findOne({
        where: { project_id: projectId, vendor_id: vendor.id }
      });

      if (existingMatch) {
        // Update existing match
        await this.matchRepository.update(existingMatch.id, { score });
        matchesUpdated++;
      } else {
        // Create new match
        await this.matchRepository.save({
          project_id: projectId,
          vendor_id: vendor.id,
          score
        });
        matchesCreated++;
      }
    }

    return {
      project_id: projectId,
      matches_created: matchesCreated,
      matches_updated: matchesUpdated,
      total_matches: matchesCreated + matchesUpdated
    };
  }
}
