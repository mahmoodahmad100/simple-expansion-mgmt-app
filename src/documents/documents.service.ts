import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResearchDocument, ResearchDocumentDocument } from './schemas/document.schema';
import { UploadDocumentDto, SearchDocumentsDto, DocumentResponseDto, DocumentSearchResultDto } from './dto/document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(ResearchDocument.name)
    private documentModel: Model<ResearchDocumentDocument>,
  ) {}

  async uploadDocument(uploadDocumentDto: UploadDocumentDto, userId: string): Promise<DocumentResponseDto> {
    const document = new this.documentModel({
      ...uploadDocumentDto,
      uploadedBy: userId,
      fileName: `${uploadDocumentDto.title.replace(/\s+/g, '_')}_${Date.now()}.txt`,
      mimeType: 'text/plain',
      fileSize: Buffer.byteLength(uploadDocumentDto.content, 'utf8'),
    });

    const savedDocument = await document.save();
    return this.transformToResponseDto(savedDocument);
  }

  async findAll(projectId?: number, page: number = 1, limit: number = 10): Promise<DocumentSearchResultDto> {
    const query: any = {};
    if (projectId) {
      query.projectId = projectId;
    }

    const skip = (page - 1) * limit;
    const [documents, total] = await Promise.all([
      this.documentModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.documentModel.countDocuments(query).exec(),
    ]);

    return {
      documents: documents.map((doc) => this.transformToResponseDto(doc)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<DocumentResponseDto> {
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return this.transformToResponseDto(document);
  }

  async searchDocuments(searchDto: SearchDocumentsDto, page: number = 1, limit: number = 10): Promise<DocumentSearchResultDto> {
    const query: any = {};

    // Text search
    if (searchDto.query) {
      query.$text = { $search: searchDto.query };
    }

    // Project filter
    if (searchDto.projectId) {
      query.projectId = searchDto.projectId;
    }

    // Tags filter
    if (searchDto.tags && searchDto.tags.length > 0) {
      query.tags = { $in: searchDto.tags };
    }

    // Document type filter
    if (searchDto.documentType) {
      query.documentType = searchDto.documentType;
    }

    const skip = (page - 1) * limit;
    const [documents, total] = await Promise.all([
      this.documentModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.documentModel.countDocuments(query).exec(),
    ]);

    return {
      documents: documents.map((doc) => this.transformToResponseDto(doc)),
      total,
      page,
      limit,
    };
  }

  async updateDocument(id: string, updateData: Partial<UploadDocumentDto>): Promise<DocumentResponseDto> {
    const document = await this.documentModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true },
    ).exec();

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return this.transformToResponseDto(document);
  }

  async deleteDocument(id: string): Promise<void> {
    const result = await this.documentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Document not found');
    }
  }

  async getDocumentsByProject(projectId: number): Promise<DocumentResponseDto[]> {
    const documents = await this.documentModel.find({ projectId }).sort({ createdAt: -1 }).exec();
    return documents.map((doc) => this.transformToResponseDto(doc));
  }

  async getDocumentsByTags(tags: string[]): Promise<DocumentResponseDto[]> {
    const documents = await this.documentModel.find({ tags: { $in: tags } }).sort({ createdAt: -1 }).exec();
    return documents.map((doc) => this.transformToResponseDto(doc));
  }

  async getDocumentCountByProject(projectId: number): Promise<number> {
    return this.documentModel.countDocuments({ projectId }).exec();
  }

  private transformToResponseDto(document: ResearchDocumentDocument): DocumentResponseDto {
    return {
      _id: (document._id as any).toString(),
      title: document.title,
      content: document.content,
      projectId: document.projectId,
      tags: document.tags,
      fileName: document.fileName,
      fileSize: document.fileSize,
      mimeType: document.mimeType,
      documentType: document.documentType,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
