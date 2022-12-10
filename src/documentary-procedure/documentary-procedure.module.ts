import { Module } from '@nestjs/common';
import { AttachmentModule } from '@common/services/attachment/attachment.module';
import { DocumentModule } from '@common/services/document/document.module';
import { StatusDocumentModule } from '@common/services/status-document/status-document.module';
import { StudentModule } from '@common/services/student/student.module';
import { DocumentaryProcedureService } from './documentary-procedure.service';

@Module({
  imports: [DocumentModule, StatusDocumentModule, StudentModule, AttachmentModule],
  providers: [DocumentaryProcedureService],
  exports: [DocumentaryProcedureService],
})
export class DocumentaryProcedureModule {}
