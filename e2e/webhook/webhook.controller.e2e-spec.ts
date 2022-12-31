import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import superTest, { SuperTest } from 'supertest';
import { WebhookModule } from '../../src/webhook/webhook.module';
import { AppModule } from '../../src/app.module';
import { DocumentaryProcedureService } from '../../src/documentary-procedure/documentary-procedure.service';
import { DialogflowService } from '../../src/dialogflow/dialogflow.service';
import { SessionsService } from '../../src/core/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { WebhookMockE2E } from './webhook.mock.spec';
import { SessionsMockE2E } from '../mocks/sessions.mock.spec';
import { WebhookService } from '../../src/webhook/webhook.service';
import { DialogflowModule } from '../../src/dialogflow/dialogflow.module';
import { DocumentaryProcedureModule } from '../../src/documentary-procedure/documentary-procedure.module';
import { IDialogflowMessage, Messaging } from '../../src/core/interface';
import { v4 as uuidv4 } from 'uuid';
import {
  DOCUMENTARY_PROCEDURE_BY_STEP,
  FACEBOOK_ATTACHMENT_ERROR,
  FACEBOOK_ATTACHMENT_OK,
} from './documentary-procedure.mock.spec';
import { StatusDocumentService } from '../../src/core/services';
import { e2e_config } from '../e2e-config.spec';
import * as helper from '@core/helpers';
import { DocumentaryProcedureServiceMock } from '../../src/documentary-procedure/documentary-procedure.mock.spec';
import { DialogflowServiceMock } from '../../src/dialogflow/dialogflow.mock.spec';
import { google } from '@google-cloud/dialogflow/build/protos/protos';

describe('WebHookController (e2e)', () => {
  let app: INestApplication;
  let documentaryProcedureService: DocumentaryProcedureService;
  let webhookService: WebhookService;
  let dialogflowService: DialogflowService;
  let sessionsService: SessionsMockE2E = new SessionsMockE2E();
  let httpService: HttpService;
  let statusDocumentService: StatusDocumentService;
  let request: SuperTest<any>;
  let sessionMock: jest.SpyInstance<any, any>;
  const {
    env: {
      tracking: { idStatusDocument },
      student: { dni, idStudent, verificationCode },
      document: { name },
    },
  } = e2e_config;

  const uuidMock = uuidv4();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WebhookModule, AppModule, DialogflowModule, DocumentaryProcedureModule],
      providers: [
        { provide: HttpService, useValue: httpService },
        {
          provide: SessionsService,
          useValue: sessionsService,
        },
        {
          provide: DialogflowService,
          useValue: dialogflowService,
        },
        {
          provide: DocumentaryProcedureService,
          useValue: documentaryProcedureService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    documentaryProcedureService = moduleFixture.get<DocumentaryProcedureService>(
      DocumentaryProcedureService,
    );
    webhookService = moduleFixture.get<WebhookService>(WebhookService);
    httpService = moduleFixture.get<HttpService>(HttpService);
    dialogflowService = moduleFixture.get<DialogflowService>(DialogflowService);
    statusDocumentService = moduleFixture.get<StatusDocumentService>(StatusDocumentService);

    request = superTest.agent(app.getHttpServer());
  });

  afterAll(() => {
    sessionMock = jest.spyOn(sessionsService, 'setSessionAndUser').mockImplementation(() => {
      return uuidMock;
    });
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/Webhook (GET) OK ', async () => {
    const hub = {
      mode: 'webhook',
      verify_token: 'token',
      challenge: 'challenge',
    };
    const { text } = await request.get('/webhook').query({ hub });
    expect(text).toEqual(hub.challenge);
  });

  it('/Webhook (POST) OK NOT CALL WebhookService ', async () => {
    const data = await request.post('/webhook').send(WebhookMockE2E.facebookEntryVoid);
    //   console.log(data);
  });

  it('When Webhook recivied "hola" how message', async () => {
    const spyReciedMessage = jest.spyOn(webhookService, 'receivedMessage');
    const spyReciedPostback = jest.spyOn(webhookService, 'receivedPostback');

    const { entry } = WebhookMockE2E.facebookEntryMessageCardWithPayload;
    const messaging: Messaging = entry[0].messaging[0];
    await request.post('/webhook').send(WebhookMockE2E.facebookEntryMessageCardWithPayload);
    expect(spyReciedMessage).toBeCalledWith(messaging);
    //    expect(spySession).toBeCalled();
    expect(spyReciedPostback).not.toBeCalled();
    //facebookEntryMessageCardWithPayload
  });

  it('When Webhook recivied Message how text call sendMessage', async () => {
    const spyReciedMessage = jest.spyOn(webhookService, 'receivedMessage');
    const spyReciedPostback = jest.spyOn(webhookService, 'receivedPostback');

    const { entry } = WebhookMockE2E.facebookEntryWithMessage;
    const messaging: Messaging = entry[0].messaging[0];
    await request.post('/webhook').send(WebhookMockE2E.facebookEntryWithMessage);
    expect(spyReciedMessage).toBeCalledWith(messaging);
    //    expect(spySession).toBeCalled();
    expect(spyReciedPostback).not.toBeCalled();
  });

  it('When webhook recivied Message how postback call postback', async () => {
    const spyReciedMessage = jest.spyOn(webhookService, 'receivedMessage');
    const spyReciedPostback = jest.spyOn(webhookService, 'receivedPostback');

    const { entry } = WebhookMockE2E.facebookEntryWithPostback;
    const messaging: Messaging = entry[0].messaging[0];
    await request.post('/webhook').send(WebhookMockE2E.facebookEntryWithPostback);
    expect(spyReciedMessage).not.toBeCalled();
    expect(spyReciedPostback).toBeCalledWith(messaging);
  });

  describe('When user realized the workflow of documentary procedure', () => {
    let spyDocumentaryProcedureStep1: jest.SpyInstance<any>;
    let spyDocumentaryProcedureStep2: jest.SpyInstance<any>;
    let spyDocumentaryProcedureStep3: jest.SpyInstance<any>;
    let spyDocumentaryProcedureStep4: jest.SpyInstance<any>;
    let spyDocumentaryProcedureStep5: jest.SpyInstance<any>;

    beforeEach(() => {
      spyDocumentaryProcedureStep1 = jest.spyOn(
        documentaryProcedureService,
        'documentaryProcedureStep1',
      );
      spyDocumentaryProcedureStep2 = jest.spyOn(
        documentaryProcedureService,
        'documentaryProcedureStep2',
      );

      spyDocumentaryProcedureStep3 = jest.spyOn(
        documentaryProcedureService,
        'documentaryProcedureStep3',
      );

      spyDocumentaryProcedureStep4 = jest.spyOn(
        documentaryProcedureService,
        'documentaryProcedureStep4',
      );

      spyDocumentaryProcedureStep5 = jest.spyOn(
        documentaryProcedureService,
        'documentaryProcedureStep5',
      );
    });

    it('When user init with step 1 request type of document', async () => {
      const documentaryProcedureStep1 = DOCUMENTARY_PROCEDURE_BY_STEP(`Deseo tramite ${name}`);
      await request.post('/webhook').send(documentaryProcedureStep1).expect(201);
      expect(spyDocumentaryProcedureStep1).toBeCalledTimes(1);
    });

    it('When user send your student code for identify', async () => {
      const documentaryProcedureStep2 = DOCUMENTARY_PROCEDURE_BY_STEP(`mi codigo es ${idStudent}`);
      await request.post('/webhook').send(documentaryProcedureStep2).expect(201);
      expect(spyDocumentaryProcedureStep2).toBeCalledTimes(1);
    });

    it('When user send your dni for identify', async () => {
      const documentaryProcedureStep3 = DOCUMENTARY_PROCEDURE_BY_STEP(`mi dni es ${dni}`);
      await request.post('/webhook').send(documentaryProcedureStep3).expect(201);
      expect(spyDocumentaryProcedureStep3).toBeCalledTimes(1);
    });

    it('When user send  your verification code for dni with error', async () => {
      jest.spyOn(statusDocumentService, 'registerStatusDocument').mockResolvedValueOnce(null);
      const documentaryProcedureStep4 = DOCUMENTARY_PROCEDURE_BY_STEP(
        `es ${parseInt(verificationCode) + 1}`,
      );
      await request.post('/webhook').send(documentaryProcedureStep4).expect(201);

      expect(spyDocumentaryProcedureStep4).toBeCalledTimes(1);
    });

    it('When user send  your verification code for dni identify', async () => {
      const spyRegisterStatusDocument = jest
        .spyOn(statusDocumentService, 'registerStatusDocument')
        .mockResolvedValueOnce(null);
      const documentaryProcedureStep4 = DOCUMENTARY_PROCEDURE_BY_STEP(`es ${verificationCode}`);
      await request.post('/webhook').send(documentaryProcedureStep4).expect(201);
      expect(spyRegisterStatusDocument).toBeCalledTimes(1);
      expect(spyDocumentaryProcedureStep4).toBeCalledTimes(1);
    });

    it('When user send attachments invalid for facebook', async () => {
      // In case of previous error and re intent upload files ok
      const uploadFileError = FACEBOOK_ATTACHMENT_ERROR;
      await request.post('/webhook').send(uploadFileError).expect(201);
      expect(spyDocumentaryProcedureStep5).toBeCalledTimes(1);
      const uploadFileOK = FACEBOOK_ATTACHMENT_OK;
      await request.post('/webhook').send(uploadFileOK).expect(201);
      expect(spyDocumentaryProcedureStep5).toBeCalledTimes(2);
    });
  });

  it('When user question for status of document procedure ok', async () => {
    const spyGetStatusDocumentService = jest.spyOn(statusDocumentService, 'getStatusDocument');
    const spyGetStatusDocumentaryProcedure = jest.spyOn(
      documentaryProcedureService,
      'getStatusDocumentaryProcedure',
    );
    const statusForDialogflow = DOCUMENTARY_PROCEDURE_BY_STEP(
      `cual es el estado de mi tramite ${idStatusDocument}`,
    );
    await request.post('/webhook').send(statusForDialogflow).expect(201);
    expect(spyGetStatusDocumentaryProcedure).toBeCalledTimes(1);
    expect(spyGetStatusDocumentService).toHaveBeenNthCalledWith(1, idStatusDocument);
  });

  it('When exist error in services for consulting status document', async () => {
    const spyGetStatusDocumentService = jest
      .spyOn(statusDocumentService, 'getStatusDocument')
      .mockRejectedValueOnce(new Error('Internal Server Error'));
    const spyGetStatusDocumentaryProcedure = jest.spyOn(
      documentaryProcedureService,
      'getStatusDocumentaryProcedure',
    );

    const statusForDialogflow = DOCUMENTARY_PROCEDURE_BY_STEP(
      `cual es el estado de mi tramite ${idStatusDocument}`,
    );
    await request.post('/webhook').send(statusForDialogflow).expect(201);
    expect(spyGetStatusDocumentaryProcedure).toBeCalledTimes(1);
    expect(spyGetStatusDocumentService).toBeCalledTimes(1);
  });

  it('When in case user not send required variabled for workflow', async () => {
    const { responseDialogflow } = DocumentaryProcedureServiceMock.requiredDialogflowVariables;
    const spyDialogflowService = jest
      .spyOn(dialogflowService, 'sendToDialogFlow')
      .mockResolvedValueOnce(responseDialogflow);
    await request.post('/webhook').send(WebhookMockE2E.facebookEntryWithMessage);
    expect(spyDialogflowService).toBeCalled();
  });

  it('When undefined message in handleDialogflow', async () => {
    const spySendMessageAPI = jest
      .spyOn(webhookService, 'sendMessageAPI')
      .mockResolvedValueOnce(null);
    const spyIsDocumentaryProcedure = jest
      .spyOn(documentaryProcedureService, 'isDocumentaryProcedure')
      .mockResolvedValueOnce(DialogflowServiceMock.undefinedIntent);
    const spyHelper = jest.spyOn(helper, 'isDefined').mockReturnValueOnce(false);
    await request.post('/webhook').send(WebhookMockE2E.facebookEntryWithMessage);
    expect(spySendMessageAPI).toBeCalled();
    expect(spyIsDocumentaryProcedure).toBeCalled();
    expect(spyHelper).toBeCalled();
  });

  it('When dialogflow return multicase for user ', async () => {
    jest
      .spyOn(documentaryProcedureService, 'isDocumentaryProcedure')
      .mockImplementationOnce(async () => {
        return {
          fulfillmentMessages: DialogflowServiceMock.dialogflowMessagesWithMultiCase,
        };
      });

    await request.post('/webhook').send(WebhookMockE2E.facebookEntryWithMessage);
  });


  it('When unknown case of handleMessage', async () => {
    const spyIsDocumentaryProcedure = jest
      .spyOn(documentaryProcedureService, 'isDocumentaryProcedure')
      .mockResolvedValueOnce({
        fulfillmentMessages: DialogflowServiceMock.dialogflowMessagesWithMultiCase,
      });
    const spyHelper = jest.spyOn(helper, 'isDefined').mockReturnValueOnce(true);
    await request.post('/webhook').send(WebhookMockE2E.facebookEntryWithMessage);
  });

  it('When unknown case of handleMessage', async () => {
    const spyIsDocumentaryProcedure = jest
      .spyOn(documentaryProcedureService, 'isDocumentaryProcedure')
      .mockResolvedValueOnce({
        fulfillmentMessages: DialogflowServiceMock.dialogflowMessagesWithUnknownCase,
      });
    //const spyHelper = jest.spyOn(helper, 'isDefined').mockReturnValueOnce(true);
    await request.post('/webhook').send(WebhookMockE2E.facebookEntryWithMessage);
  });

  it('When error in send API Facebook', async () => {
    const spyHttpService = jest.spyOn(httpService.axiosRef, 'post').mockImplementationOnce(() => {
      throw new Error();
    });

    await request.post('/webhook').send(WebhookMockE2E.facebookEntryWithMessage);
    expect(spyHttpService).toBeCalled();
  });

  it('When error in type of message recivied of dialogflow/facebook', async () => {
    const response: any = DialogflowServiceMock.dialogflowMessagesWithUnknownCase;
    const spyDialogflowService = jest
      .spyOn(documentaryProcedureService, 'isDocumentaryProcedure')
      .mockRejectedValueOnce(DialogflowServiceMock.dialogflowMessagesWithUnknownCase);
  });


});
