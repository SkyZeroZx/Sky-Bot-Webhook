import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import superTest, { SuperTest } from 'supertest';
import { WebhookModule } from '../../src/webhook/webhook.module';
import { AppModule } from '../../src/app.module';
import { DocumentaryProcedureService } from '../../src/documentary-procedure/documentary-procedure.service';
import { DialogflowService } from '../../src/dialogflow/dialogflow.service';
import { SessionsService } from '../../src/core/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { SessionsMockE2E } from '../mocks/sessions.mock.spec';
import { WebhookService } from '../../src/webhook/webhook.service';
import { DialogflowModule } from '../../src/dialogflow/dialogflow.module';
import { DocumentaryProcedureModule } from '../../src/documentary-procedure/documentary-procedure.module';
import { v4 as uuidv4 } from 'uuid';
import { StatusDocumentService } from '../../src/core/services';
import { WebhookMockE2E } from '../webhook/webhook.mock.spec';
const mockInstance = {
  projectAgentSessionPath: jest.fn().mockReturnThis(),
  detectIntent: jest.fn().mockReturnThis(),
};

// Mock the dialogflow library
jest.mock('@google-cloud/dialogflow', () => {
  return { SessionsClient: jest.fn(() => mockInstance) };
});

describe('Dialogflow (e2e)', () => {
  let app: INestApplication;
  let documentaryProcedureService: DocumentaryProcedureService;
  let webhookService: WebhookService;
  let dialogflowService: DialogflowService;
  let sessionsService: SessionsMockE2E = new SessionsMockE2E();
  let httpService: HttpService;
  let statusDocumentService: StatusDocumentService;
  let request: SuperTest<any>;
  let sessionMock: jest.SpyInstance<any, any>;

  const uuidMock = uuidv4();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WebhookModule, AppModule, DialogflowModule, DocumentaryProcedureModule, HttpModule],
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

  it('When exist error in dialogFlowService ', async () => {
    jest.spyOn(mockInstance, 'detectIntent').mockRejectedValueOnce(new Error());
    await request.post('/webhook').send(WebhookMockE2E.facebookEntryWithMessage).expect(201);
  });
});
