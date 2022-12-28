import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DialogflowService } from './dialogflow.service';
import { DialogflowServiceMock } from './dialogflow.mock.spec';

// instanceof dialogflow method of required mock for unit testing
const mockInstance = {
  projectAgentSessionPath: jest.fn().mockReturnThis(),
  detectIntent: jest.fn().mockReturnThis(),
};

// Mock the dialogflow library
jest.mock('@google-cloud/dialogflow', () => {
  return { SessionsClient: jest.fn(() => mockInstance) };
});

describe('DialogflowService', () => {
  let dialogflowService: DialogflowService;
  const dialogflowMessage = DialogflowServiceMock.dialogflowMessage;
  const dialogflowMessageWithEvent = DialogflowServiceMock.dialogflowMessageWithEvent;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.template',
        }),
      ],
      providers: [DialogflowService],
    }).compile();

    dialogflowService = module.get<DialogflowService>(DialogflowService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(dialogflowService).toBeDefined();
  });

  it('sendToDialogFlow should set message text if text exist', async () => {
    mockInstance.projectAgentSessionPath.mockImplementationOnce(() => {
      return null;
    });
    mockInstance.detectIntent.mockImplementationOnce(() => {
      return DialogflowServiceMock.messageReponseOfDialogflow;
    });

    const result = await dialogflowService.sendToDialogFlow(dialogflowMessage);
    expect(result).toBeDefined();
  });

  it('sendToDialogFlow should set event in request if exist', async () => {
    mockInstance.projectAgentSessionPath.mockImplementationOnce(() => {
      return null;
    });

    mockInstance.detectIntent.mockImplementationOnce(() => {
      return DialogflowServiceMock.messageReponseOfDialogflowWithPlataform;
    });
    const result = await dialogflowService.sendToDialogFlow(dialogflowMessageWithEvent);

    expect(result).toBeDefined();
  });

  it('sendToDialogFlow in case of error dialogflow should throw error', async () => {
    mockInstance.projectAgentSessionPath.mockImplementationOnce(() => {
      throw new Error();
    });
    await expect(dialogflowService.sendToDialogFlow(dialogflowMessage)).rejects.toThrowError(
      new Error('DialogflowService Error'),
    );
  });
});
