import { Module } from '@nestjs/common';
import { StatusDocumentService } from './status-document.service';
import { GlobalHttpModule } from '@core/config';

@Module({
  imports: [GlobalHttpModule],
  providers: [StatusDocumentService],
  exports: [StatusDocumentService],
})
export class StatusDocumentModule {}
