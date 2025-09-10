import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto, UpdateVendorDto, VendorResponseDto } from './dto/vendor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/client.entity';

@Controller('vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() createVendorDto: CreateVendorDto): Promise<VendorResponseDto> {
    return this.vendorsService.create(createVendorDto);
  }

  @Get()
  async findAll(): Promise<VendorResponseDto[]> {
    return this.vendorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<VendorResponseDto> {
    return this.vendorsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ): Promise<VendorResponseDto> {
    return this.vendorsService.update(+id, updateVendorDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string): Promise<void> {
    return this.vendorsService.remove(+id);
  }
}
