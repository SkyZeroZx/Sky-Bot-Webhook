import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { GlobalHttpModule } from '@core/config';

@Module({
  imports: [GlobalHttpModule],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
