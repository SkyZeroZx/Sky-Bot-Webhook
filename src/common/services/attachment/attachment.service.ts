import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Response } from '@common/interface';
import { UploadAttachment } from './dto/upload-attachment.dto';

@Injectable()
export class AttachmentService {
  private readonly logger = new Logger(AttachmentService.name);
  constructor(private readonly httpService: HttpService) {}

  async uploadAttachment(uploadAttachment: UploadAttachment): Promise<Response> {
    try {
      const { data } = await this.httpService.axiosRef.post<Response>(
        '/attachment',
        uploadAttachment,
      );
      return data;
    } catch (error: any) {
      this.logger.error({ message: 'Error uploading attachment', error: error.message });
      throw new Error('Attachment Upload Error');
    }
  }
}
