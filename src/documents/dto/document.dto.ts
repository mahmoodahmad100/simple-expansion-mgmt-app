import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  projectId: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  documentType?: string;
}

export class SearchDocumentsDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsNumber()
  projectId?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  documentType?: string;
}

export class DocumentResponseDto {
  _id: string;
  title: string;
  content: string;
  projectId: number;
  tags: string[];
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  documentType: string;
  createdAt: Date;
  updatedAt: Date;
}

export class DocumentSearchResultDto {
  documents: DocumentResponseDto[];
  total: number;
  page: number;
  limit: number;
}
