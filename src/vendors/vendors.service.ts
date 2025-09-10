import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { CreateVendorDto, UpdateVendorDto, VendorResponseDto } from './dto/vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
  ) {}

  async create(createVendorDto: CreateVendorDto): Promise<VendorResponseDto> {
    const vendor = this.vendorRepository.create(createVendorDto);
    const savedVendor = await this.vendorRepository.save(vendor);
    return this.transformToResponseDto(savedVendor);
  }

  async findAll(): Promise<VendorResponseDto[]> {
    const vendors = await this.vendorRepository.find();
    return vendors.map((vendor) => this.transformToResponseDto(vendor));
  }

  async findOne(id: number): Promise<VendorResponseDto> {
    const vendor = await this.vendorRepository.findOne({ where: { id } });
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    return this.transformToResponseDto(vendor);
  }

  async update(id: number, updateVendorDto: UpdateVendorDto): Promise<VendorResponseDto> {
    const vendor = await this.findOne(id);
    await this.vendorRepository.update(id, updateVendorDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const vendor = await this.findOne(id);
    await this.vendorRepository.delete(id);
  }

  async findVendorsForProject(country: string, services: string[]): Promise<Vendor[]> {
    return this.vendorRepository
      .createQueryBuilder('vendor')
      .where('vendor.countries_supported LIKE :country', { country: `%${country}%` })
      .andWhere('vendor.services_offered && :services', { services })
      .getMany();
  }

  async findVendorsWithExpiredSLA(): Promise<Vendor[]> {
    // Find vendors with SLA > 48 hours (considered expired for urgent requests)
    return this.vendorRepository
      .createQueryBuilder('vendor')
      .where('vendor.response_sla_hours > :slaThreshold', { slaThreshold: 48 })
      .getMany();
  }

  private transformToResponseDto(vendor: Vendor): VendorResponseDto {
    return {
      id: vendor.id,
      name: vendor.name,
      countries_supported: vendor.countries_supported,
      services_offered: vendor.services_offered,
      rating: vendor.rating,
      response_sla_hours: vendor.response_sla_hours,
      created_at: vendor.created_at,
      updated_at: vendor.updated_at,
    };
  }
}
