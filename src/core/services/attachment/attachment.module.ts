import { Module } from '@nestjs/common';
import { GlobalHttpModule } from '@core/config';
import { AttachmentService } from './attachment.service';

@Module({
  imports: [GlobalHttpModule],
  providers: [AttachmentService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
