import { google } from '@google-cloud/dialogflow/build/protos/protos';
import { Injectable, Logger } from '@nestjs/common';
import { isDefined } from '@core/helpers';
import { DocumentaryProcedure } from '@core/interface';
import { isDocumentaryProcedureIntent } from '@core/utils';
import {
  DEFAULT_REGISTER_OBSERVATION,
  DEFAULT_REGISTER_STATUS,
  DEFAULT_REPONSE_ERROR,
} from '@core/constants';
import {
  AttachmentService,
  DocumentService,
  StatusDocumentService,
  StudentService,
} from '@core/services';

@Injectable()
export class DocumentaryProcedureService {
  private readonly logger = new Logger(DocumentaryProcedureService.name);
  constructor(
    private readonly documentService: DocumentService,
    private readonly studentService: StudentService,
    private readonly statusDocumentService: StatusDocumentService,
    private readonly attachmentService: AttachmentService,
  ) {}

  async isDocumentaryProcedure(
    documentaryProcedure: DocumentaryProcedure,
  ): Promise<google.cloud.dialogflow.v2.IQueryResult> {
    const intentName = documentaryProcedure.responseDialogflow.intent.displayName;
    const responseText = documentaryProcedure.responseDialogflow.fulfillmentText;
    this.logger.log({ message: 'documentaryProcedure ', documentaryProcedure });

    // Validate in case is documentary procedure
    if (!isDocumentaryProcedureIntent(intentName)) {
      return documentaryProcedure.responseDialogflow;
    }

    // Return reponse in case is required variables of dialogflow for documentary procedure
    if (isDocumentaryProcedureIntent(intentName) && isDefined(responseText)) {
      return documentaryProcedure.responseDialogflow;
    }

    // Detect Workflow for documentary procedure by steps
    switch (intentName) {
      case 'register_documentary_procedure_step_1':
        return this.documentaryProcedureStep1(documentaryProcedure);

      case 'register_documentary_procedure_step_2':
        return this.documentaryProcedureStep2(documentaryProcedure);

      case 'register_documentary_procedure_step_3':
        return this.documentaryProcedureStep3(documentaryProcedure);

      case 'register_documentary_procedure_step_4':
        return this.documentaryProcedureStep4(documentaryProcedure);

      case 'register_documentary_procedure_step_5':
        return this.documentaryProcedureStep5(documentaryProcedure);

      case 'status_documentary_procedure':
        return this.getStatusDocumentaryProcedure(documentaryProcedure);
    }
  }

  async getStatusDocumentaryProcedure(
    documentaryProcedure: DocumentaryProcedure,
  ): Promise<google.cloud.dialogflow.v2.IQueryResult> {
    try {
      const fields = documentaryProcedure.responseDialogflow.parameters.fields;
      const idStatusDocument = fields.idStatusDocument.stringValue;
      const status = await this.statusDocumentService.getStatusDocument(idStatusDocument);

      return {
        fulfillmentText: status,
      };
    } catch (error) {
      this.logger.error({ message: 'Error getStatusDocumentaryProcedure', error: error });
      return { fulfillmentText: DEFAULT_REPONSE_ERROR };
    }
  }

  async documentaryProcedureStep1(
    documentaryProcedure: DocumentaryProcedure,
  ): Promise<google.cloud.dialogflow.v2.IQueryResult> {
    try {
      const fields = documentaryProcedure.responseDialogflow.parameters.fields;
      const documentaryProcedureName = fields.documentaryProcedureName.stringValue;
      const documentData = await this.documentService.getDocumentByName(documentaryProcedureName);

      return {
        fulfillmentText: `Step 1  : ${documentData.name} tiene requisitos ${documentData.requirements} 
        Para continuar envie su codigo estudiante`,
      };
    } catch (error) {
      this.logger.error({ message: 'Error documtaryProcedureStep1', error: error });
      return { fulfillmentText: DEFAULT_REPONSE_ERROR };
    }
  }

  async documentaryProcedureStep2(
    documentaryProcedure: DocumentaryProcedure,
  ): Promise<google.cloud.dialogflow.v2.IQueryResult> {
    try {
      const fields = documentaryProcedure.responseDialogflow.parameters.fields;
      const studentCode = fields.studentCode.stringValue;
      const student = await this.studentService.getStudentById(studentCode);
      this.logger.log({ message: 'documentaryProcedureStep2 ', studentCode, student });

      return {
        fulfillmentText: `Step 2 : Estimado estudiante ${student.name} ${student.lastName} debe enviar su DNI`,
      };
    } catch (error) {
      this.logger.error({ message: 'Error documtaryProcedureStep2', error: error });
      return { fulfillmentText: DEFAULT_REPONSE_ERROR };
    }
  }

  async documentaryProcedureStep3(
    documentaryProcedure: DocumentaryProcedure,
  ): Promise<google.cloud.dialogflow.v2.IQueryResult> {
    try {
      const fields = documentaryProcedure.responseDialogflow.parameters.fields;
      const dni = fields.dni.numberValue;
      const studentCode = fields.studentCode.stringValue;
      const student = await this.studentService.getStudentByIdAndDni(studentCode, dni);

      this.logger.log({ message: 'documentaryProcedureStep3 ', dni, studentCode, student });

      return {
        fulfillmentText: `Step 3 : Estimado estudiante ${student.name} 
         ${student.lastName} debe enviar su caracter verificacion DNI para continuar `,
      };
    } catch (error) {
      this.logger.error({ message: 'Error documtaryProcedureStep3', error: error });
      return { fulfillmentText: DEFAULT_REPONSE_ERROR };
    }
  }

  async documentaryProcedureStep4(
    documentaryProcedure: DocumentaryProcedure,
  ): Promise<google.cloud.dialogflow.v2.IQueryResult> {
    try {
      const fields = documentaryProcedure.responseDialogflow.parameters.fields;
      const dni = fields.dni.numberValue;
      const studentCode = fields.studentCode.stringValue;
      const caracterValidation = fields.caracterValidation.numberValue;
      const documentaryProcedureName = fields.documentaryProcedureName.stringValue;

      this.logger.log({ message: 'documentaryProcedureStep4 fields', fields });

      const student = await this.studentService.getStudentByIdAndDni(studentCode, dni);

      if (parseInt(student.caracterValidation) !== caracterValidation) {
        return {
          fulfillmentText: `Step4 : Sus datos no coinciden vuelva intentarlo  ${student.name} ${student.lastName}`,
        };
      }

      const { idDocument } = await this.documentService.getDocumentByName(documentaryProcedureName);
      const idStatusDocument = idDocument + studentCode + dni;

      this.logger.log({ message: 'documentaryProcedureStep4 idStatusDocument', idStatusDocument });

      await this.statusDocumentService.registerStatusDocument({
        idStatusDocument,
        idStudent: studentCode,
        idDocument,
      });

      await this.statusDocumentService.registerStatus({
        idStatusDocument,
        status: DEFAULT_REGISTER_STATUS,
        observations: DEFAULT_REGISTER_OBSERVATION,
      });

      return {
        fulfillmentText: `Step 4 : Fue validado todos sus datos puede proceder a enviar sus adjuntos`,
      };
    } catch (error) {
      this.logger.error({ message: 'Error documtaryProcedureStep4', error: error });
      return { fulfillmentText: DEFAULT_REPONSE_ERROR };
    }
  }

  async documentaryProcedureStep5(
    documentaryProcedure: DocumentaryProcedure,
  ): Promise<google.cloud.dialogflow.v2.IQueryResult> {
    try {
      const listUrl = documentaryProcedure.attachments;
      const fields = documentaryProcedure.responseDialogflow.parameters.fields;
      const documentaryProcedureName = fields.documentaryProcedureName.stringValue;
      const dni = fields.dni.numberValue;
      const studentCode = fields.studentCode.stringValue;

      this.logger.log({ message: 'documentaryProcedureStep5 ', fields, listUrl });

      const { idDocument } = await this.documentService.getDocumentByName(documentaryProcedureName);
      const idStatusDocument = idDocument + studentCode + dni;

      this.logger.log({ message: 'documentaryProcedureStep5 idStatusDocument', idStatusDocument });

      await this.attachmentService.uploadAttachment({
        idStatusDocument: idStatusDocument,
        listUrl: listUrl,
      });

      return {
        fulfillmentText: 'Attachment registered successfully',
      };
    } catch (error) {
      this.logger.error({ message: 'Error documtaryProcedureStep5', error: error });
      return { fulfillmentText: DEFAULT_REPONSE_ERROR };
    }
  }
}
