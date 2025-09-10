import { Controller, Post, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/client.entity';
import { MatchGenerationResultDto } from './dto/match.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post(':id/matches/rebuild')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  async rebuildMatches(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MatchGenerationResultDto> {
    return this.matchesService.rebuildMatches(id);
  }
}
