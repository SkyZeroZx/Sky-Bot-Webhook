import { Module } from '@nestjs/common';
import {
  DocumentModule,
  StatusDocumentModule,
  StudentModule,
  AttachmentModule,
} from '@core/services';
import { DocumentaryProcedureService } from './documentary-procedure.service';

@Module({
  imports: [DocumentModule, StatusDocumentModule, StudentModule, AttachmentModule],
  providers: [DocumentaryProcedureService],
  exports: [DocumentaryProcedureService],
})
export class DocumentaryProcedureModule {}
