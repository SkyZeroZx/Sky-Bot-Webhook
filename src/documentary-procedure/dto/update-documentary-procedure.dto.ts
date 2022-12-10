import { PartialType } from '@nestjs/swagger';
import { CreateDocumentaryProcedureDto } from './create-documentary-procedure.dto';

export class UpdateDocumentaryProcedureDto extends PartialType(CreateDocumentaryProcedureDto) {}
