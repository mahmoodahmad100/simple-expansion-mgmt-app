import { IsString, IsArray, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  countries_supported: string[];

  @IsArray()
  @IsString({ each: true })
  services_offered: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsNumber()
  response_sla_hours?: number;
}

export class UpdateVendorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  countries_supported?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services_offered?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsNumber()
  response_sla_hours?: number;
}

export class VendorResponseDto {
  id: number;
  name: string;
  countries_supported: string[];
  services_offered: string[];
  rating: number;
  response_sla_hours: number;
  created_at: Date;
  updated_at: Date;
}
