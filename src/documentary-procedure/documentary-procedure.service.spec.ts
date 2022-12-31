import { Test, TestingModule } from '@nestjs/testing';
import { DocumentaryProcedureService } from './documentary-procedure.service';
import { DocumentaryProcedureServiceMock } from './documentary-procedure.mock.spec';
import {
  AttachmentService,
  DocumentService,
  StatusDocumentService,
  StudentService,
} from '@core/services';
import {
  DEFAULT_REPONSE_ERROR,
  DEFAULT_REGISTER_STATUS,
  DEFAULT_REGISTER_OBSERVATION,
} from '@core/constants';
import { DocumentServiceMock } from '@core/services/document/document.mock.spec';
import { StudentServiceMock } from '@core/services/student/student.mock.spec';

describe('DocumentaryProcedureService', () => {
  let documentaryProcedureService: DocumentaryProcedureService;
  let documentService: DocumentService;
  let studentService: StudentService;
  let statusDocumentService: StatusDocumentService;
  let attachmentService: AttachmentService;
  let mockService = new DocumentaryProcedureServiceMock();
  const notMatchDocumentaryProcedure = DocumentaryProcedureServiceMock.notMatchDocumentaryProcedure;
  const requiredDialogflowVariables = DocumentaryProcedureServiceMock.requiredDialogflowVariables;
  const dialogflowResponseWithFields = DocumentaryProcedureServiceMock.dialogflowResponseWithFields;
  const fields = dialogflowResponseWithFields.responseDialogflow.parameters.fields;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentaryProcedureService,
        {
          provide: AttachmentService,
          useValue: mockService,
        },
        {
          provide: StudentService,
          useValue: mockService,
        },
        {
          provide: DocumentService,
          useValue: mockService,
        },
        {
          provide: StatusDocumentService,
          useValue: mockService,
        },
      ],
    }).compile();

    documentaryProcedureService = module.get<DocumentaryProcedureService>(
      DocumentaryProcedureService,
    );
    documentService = module.get<DocumentService>(DocumentService);
    studentService = module.get<StudentService>(StudentService);
    statusDocumentService = module.get<StatusDocumentService>(StatusDocumentService);
    attachmentService = module.get<AttachmentService>(AttachmentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(documentaryProcedureService).toBeDefined();
  });

  it('isDocumentaryProcedure should be return dialogflowResponse if not match documentary procedure', async () => {
    const dialogflowResponse = await documentaryProcedureService.isDocumentaryProcedure(
      notMatchDocumentaryProcedure,
    );
    expect(dialogflowResponse).toBeDefined();
    expect(dialogflowResponse).toEqual(notMatchDocumentaryProcedure.responseDialogflow);
  });

  it(`isDocumentaryProcedure should be return dialogflowResponse 
    if messageText is defined because its required variables of dialogflowIntent`, async () => {
    const dialogflowResponse = await documentaryProcedureService.isDocumentaryProcedure(
      requiredDialogflowVariables,
    );
    expect(dialogflowResponse).toBeDefined();
    expect(dialogflowResponse).toEqual(requiredDialogflowVariables.responseDialogflow);
  });

  it('isDocumentaryProcedure should return default error message if case of error', async () => {
    const stepCurrent = DocumentaryProcedureServiceMock.generateDocumentaryProcedureSteps(1);
    jest
      .spyOn(documentaryProcedureService, 'documentaryProcedureStep1')
      .mockRejectedValueOnce(new Error());
    const { fulfillmentText } = await documentaryProcedureService.isDocumentaryProcedure(
      stepCurrent,
    );
    expect(fulfillmentText).toEqual(DEFAULT_REPONSE_ERROR);
  });

  it('isDocumentaryProcedure should be call step correct if variables is defined', async () => {
    for (let i = 1; i <= 5; i++) {
      const nameStepCurrent: any = `documentaryProcedureStep${i}`;
      const stepCurrent = DocumentaryProcedureServiceMock.generateDocumentaryProcedureSteps(i);
      const spyDocumentaryProcedureStep = jest
        .spyOn(documentaryProcedureService, nameStepCurrent)
        .mockResolvedValueOnce(null);
      await documentaryProcedureService.isDocumentaryProcedure(stepCurrent);
      expect(spyDocumentaryProcedureStep).toHaveBeenNthCalledWith(1, stepCurrent);
    }
  });

  it('isDocumentaryProcedure should be call statusDocumentary if is defined', async () => {
    const statusDocumentaryProcedure = DocumentaryProcedureServiceMock.statusDocumentaryProcedure;
    const spyGetStatusDocumentaryProcedure = jest
      .spyOn(documentaryProcedureService, 'getStatusDocumentaryProcedure')
      .mockResolvedValueOnce(null);

    await documentaryProcedureService.isDocumentaryProcedure(statusDocumentaryProcedure);

    expect(spyGetStatusDocumentaryProcedure).toBeCalledWith(statusDocumentaryProcedure);
  });

  it('getStatusDocumentaryProcedure should return statusDocumentary', async () => {
    const idStatusDocument = fields.idStatusDocument.stringValue;
    const spyGetStatusDocument = jest
      .spyOn(statusDocumentService, 'getStatusDocument')
      .mockResolvedValueOnce(DocumentaryProcedureServiceMock.getStatusMock);
    const { fulfillmentText } = await documentaryProcedureService.getStatusDocumentaryProcedure(
      dialogflowResponseWithFields,
    );
    expect(spyGetStatusDocument).toBeCalledWith(idStatusDocument);
    expect(fulfillmentText).toBeDefined();
    expect(fulfillmentText).toEqual(DocumentaryProcedureServiceMock.getStatusMock);
  });

  it('documentaryProcedureStep1 should return correct fulfillmentText if request is correct', async () => {
    const documentaryProcedureName = fields.documentaryProcedureName.stringValue;
    const spyDocument = jest
      .spyOn(documentService, 'getDocumentByName')
      .mockResolvedValueOnce(DocumentServiceMock.document);
    const { fulfillmentText } = await documentaryProcedureService.documentaryProcedureStep1(
      dialogflowResponseWithFields,
    );
    expect(spyDocument).toBeCalledWith(documentaryProcedureName);
    expect(fulfillmentText).toBeDefined();
    expect(fulfillmentText).not.toEqual(DEFAULT_REPONSE_ERROR);
  });

  it('documentaryProcedureStep2 should return correct fulfillmentText if request is correct', async () => {
    const studentCode = fields.studentCode.stringValue;
    const spyGetStudentById = jest
      .spyOn(studentService, 'getStudentById')
      .mockResolvedValueOnce(StudentServiceMock.student);

    const { fulfillmentText } = await documentaryProcedureService.documentaryProcedureStep2(
      dialogflowResponseWithFields,
    );

    expect(spyGetStudentById).toBeCalledWith(studentCode);
    expect(fulfillmentText).toBeDefined();
    expect(fulfillmentText).not.toEqual(DEFAULT_REPONSE_ERROR);
  });

  it('documentaryProcedureStep3 should return correct message in case of success', async () => {
    const spyGetStudentByIdAndDni = jest
      .spyOn(studentService, 'getStudentByIdAndDni')
      .mockResolvedValueOnce(StudentServiceMock.student);

    const { fulfillmentText } = await documentaryProcedureService.documentaryProcedureStep3(
      dialogflowResponseWithFields,
    );

    expect(fulfillmentText).toBeDefined();
    expect(fulfillmentText).not.toEqual(DEFAULT_REPONSE_ERROR);

    expect(spyGetStudentByIdAndDni).toBeCalled();
  });

  it('documentaryProcedureStep4 caracter validation not equals and return message of warnning', async () => {
    const dni = fields.dni.numberValue;
    const studentCode = fields.studentCode.stringValue;
    const caracterValidation = fields.caracterValidation.numberValue;
    const spyGetStudentByIdAndDni = jest
      .spyOn(studentService, 'getStudentByIdAndDni')
      .mockResolvedValueOnce(StudentServiceMock.student);
    const { fulfillmentText } = await documentaryProcedureService.documentaryProcedureStep4(
      dialogflowResponseWithFields,
    );
    expect(spyGetStudentByIdAndDni).toBeCalledWith(studentCode, dni);
    expect(fulfillmentText).toBeDefined();
    expect(fulfillmentText).not.toEqual(DEFAULT_REPONSE_ERROR);
    expect(parseInt(StudentServiceMock.student.caracterValidation)).not.toEqual(caracterValidation);
  });

  it('documentaryProcedureStep4 should correct message in case of success', async () => {
    const dni = fields.dni.numberValue;
    const studentCode = fields.studentCode.stringValue;
    const caracterValidation = fields.caracterValidation.numberValue;
    const document = DocumentServiceMock.document;
    const documentaryProcedureName = fields.documentaryProcedureName.stringValue;
    const idStatusDocument = document.idDocument + studentCode + dni;
    const spyGetStudentByIdAndDni = jest
      .spyOn(studentService, 'getStudentByIdAndDni')
      .mockResolvedValueOnce(StudentServiceMock.studentMatchCaracterValidation);
    const spyGetDocumentByName = jest
      .spyOn(documentService, 'getDocumentByName')
      .mockResolvedValueOnce(document);
    const spyRegisterStatusDocument = jest
      .spyOn(statusDocumentService, 'registerStatusDocument')
      .mockResolvedValueOnce(null);

    const { fulfillmentText } = await documentaryProcedureService.documentaryProcedureStep4(
      dialogflowResponseWithFields,
    );

    expect(spyGetStudentByIdAndDni).toBeCalledWith(studentCode, dni);
    expect(fulfillmentText).toBeDefined();
    expect(fulfillmentText).not.toEqual(DEFAULT_REPONSE_ERROR);
    expect(parseInt(StudentServiceMock.student.caracterValidation)).not.toEqual(caracterValidation);
    expect(spyGetDocumentByName).toBeCalledWith(documentaryProcedureName);
    expect(spyRegisterStatusDocument).toBeCalledWith({
      idStatusDocument,
      idStudent: studentCode,
      idDocument: document.idDocument,
    });
  });

  it('documentaryProcedureStep5  should correct message in case of success', async () => {
    const document = DocumentServiceMock.document;
    const spyUploadAttachment = jest
      .spyOn(attachmentService, 'uploadAttachment')
      .mockResolvedValueOnce(null);
    const listUrl = dialogflowResponseWithFields.attachments;
    const fields = dialogflowResponseWithFields.responseDialogflow.parameters.fields;
    const dni = fields.dni.numberValue;
    const studentCode = fields.studentCode.stringValue;
    const idStatusDocument = document.idDocument + studentCode + dni;
    const spyGetDocumentByName = jest
      .spyOn(documentService, 'getDocumentByName')
      .mockResolvedValueOnce(document);

    const { fulfillmentText } = await documentaryProcedureService.documentaryProcedureStep5(
      dialogflowResponseWithFields,
    );

    expect(spyGetDocumentByName).toBeCalled();
    expect(fulfillmentText).toBeDefined();
    expect(fulfillmentText).not.toEqual(DEFAULT_REPONSE_ERROR);
    expect(spyUploadAttachment).toBeCalledWith({
      idStatusDocument: idStatusDocument,
      listUrl: listUrl,
    });
  });
});
