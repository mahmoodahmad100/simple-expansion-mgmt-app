import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto, SearchDocumentsDto, DocumentResponseDto, DocumentSearchResultDto } from './dto/document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/entities/client.entity';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  async uploadDocument(
    @Body() uploadDocumentDto: UploadDocumentDto,
    @Request() req,
  ): Promise<DocumentResponseDto> {
    return this.documentsService.uploadDocument(uploadDocumentDto, req.user.id.toString());
  }

  @Post('upload')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDocumentDto: UploadDocumentDto,
    @Request() req,
  ): Promise<DocumentResponseDto> {
    // Convert file content to string
    const content = file.buffer.toString('utf8');
    const enhancedDto = {
      ...uploadDocumentDto,
      content,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    };

    return this.documentsService.uploadDocument(enhancedDto, req.user.id.toString());
  }

  @Get()
  async findAll(
    @Query('projectId') projectId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<DocumentSearchResultDto> {
    return this.documentsService.findAll(
      projectId ? +projectId : undefined,
      page ? +page : 1,
      limit ? +limit : 10,
    );
  }

  @Get('search')
  async searchDocuments(
    @Query() searchDto: SearchDocumentsDto,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<DocumentSearchResultDto> {
    return this.documentsService.searchDocuments(
      searchDto,
      page ? +page : 1,
      limit ? +limit : 10,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DocumentResponseDto> {
    return this.documentsService.findOne(id);
  }

  @Get('project/:projectId')
  async getDocumentsByProject(@Param('projectId') projectId: string): Promise<DocumentResponseDto[]> {
    return this.documentsService.getDocumentsByProject(+projectId);
  }

  @Get('tags/:tags')
  async getDocumentsByTags(@Param('tags') tags: string): Promise<DocumentResponseDto[]> {
    const tagArray = tags.split(',').map(tag => tag.trim());
    return this.documentsService.getDocumentsByTags(tagArray);
  }

  @Delete(':id')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  async deleteDocument(@Param('id') id: string): Promise<void> {
    return this.documentsService.deleteDocument(id);
  }
}
