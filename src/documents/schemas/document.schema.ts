import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResearchDocumentDocument = ResearchDocument & Document;

@Schema({ timestamps: true })
export class ResearchDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  projectId: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  fileName: string;

  @Prop()
  fileSize: number;

  @Prop()
  mimeType: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  uploadedBy: Types.ObjectId;

  @Prop({ default: 'research' })
  documentType: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const ResearchDocumentSchema = SchemaFactory.createForClass(ResearchDocument);

// Create text index for search functionality
ResearchDocumentSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Create index for projectId for faster queries
ResearchDocumentSchema.index({ projectId: 1 });

// Create index for tags for faster tag-based queries
ResearchDocumentSchema.index({ tags: 1 });
