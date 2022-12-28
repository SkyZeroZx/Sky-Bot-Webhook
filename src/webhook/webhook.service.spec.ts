import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { DEFAULT_RESPONSE, FB_EVENT, FB_SOURCE } from '@core/constants/config';
import { DialogflowServiceMock } from '../dialogflow/dialogflow.mock.spec';
import { DialogflowService } from '../dialogflow/dialogflow.service';
import { DocumentaryProcedureService } from '../documentary-procedure/documentary-procedure.service';
import { SessionsServiceMock } from '@core/config/sessions/sessions.mock.spec';
import { SessionsService } from '@core/config';
import { WebhookServiceMock } from './webhook.mock.spec';
import { WebhookService } from './webhook.service';

describe('WebhookService', () => {
  let webhookService: WebhookService;
  let httpService: HttpService;
  let documentaryProcedureService: DocumentaryProcedureService;
  let sessionsService: SessionsService;
  let dialogflowService: DialogflowService;
  let mockService = new WebhookServiceMock();
  const senderId = WebhookServiceMock.messagingEventWithText.sender.id;
  const session = SessionsServiceMock.session;
  const defaultWelcomeIntent = DialogflowServiceMock.defaultWelcomeIntent;
  const resultWithMessages = DialogflowServiceMock.resultWithMessages;
  const undefinedIntent = DialogflowServiceMock.undefinedIntent;
  // Is a Mock data object
  const messageData = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebhookService,
        {
          provide: DialogflowService,
          useValue: mockService,
        },
        {
          provide: HttpService,
          useValue: mockService,
        },
        {
          provide: DocumentaryProcedureService,
          useValue: mockService,
        },
        {
          provide: SessionsService,
          useValue: mockService,
        },
      ],
    }).compile();

    webhookService = module.get<WebhookService>(WebhookService);
    httpService = module.get<HttpService>(HttpService);
    documentaryProcedureService = module.get<DocumentaryProcedureService>(
      DocumentaryProcedureService,
    );
    sessionsService = module.get<SessionsService>(SessionsService);
    dialogflowService = module.get<DialogflowService>(DialogflowService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(webhookService).toBeDefined();
  });

  it('should receivedMessage call sendToDialogFlow with correct parameters', async () => {
    const message = WebhookServiceMock.messagingEventWithText.message;
    const spySendToDialogFlow = jest
      .spyOn(webhookService, 'sendToDialogFlow')
      .mockResolvedValueOnce(null);
    await webhookService.receivedMessage(WebhookServiceMock.messagingEventWithText);
    expect(spySendToDialogFlow).toBeCalledWith(senderId, message);
  });

  it('sendToDialogFlow in case of text message', async () => {
    const message = WebhookServiceMock.messagingEventWithText.message;
    const spySetSessionAndUser = jest
      .spyOn(sessionsService, 'setSessionAndUser')
      .mockResolvedValueOnce(session);

    const spySendToDialogFlow = jest
      .spyOn(dialogflowService, 'sendToDialogFlow')
      .mockResolvedValueOnce(defaultWelcomeIntent);
    const spyIsDocumentaryProcedure = jest.spyOn(
      documentaryProcedureService,
      'isDocumentaryProcedure',
    );
    const spyHandleDialogFlowResponse = jest
      .spyOn(webhookService, 'handleDialogFlowResponse')
      .mockResolvedValueOnce(null);

    await webhookService.sendToDialogFlow(senderId, message);

    expect(spySetSessionAndUser).toBeCalledWith(senderId);
    expect(spySendToDialogFlow).toBeCalledWith({
      message: message.text,
      session: session,
      source: FB_SOURCE,
    });
    expect(spyIsDocumentaryProcedure).toBeCalledWith({
      responseDialogflow: defaultWelcomeIntent,
      attachments: [],
      source: FB_SOURCE,
    });
    expect(spyHandleDialogFlowResponse).toBeCalled();
    expect(spySendToDialogFlow).not.toBeCalledTimes(2);
  });

  it('sendToDialogFlow in case of attachments', async () => {
    const message = WebhookServiceMock.messagingEventWithAttachments.message;
    const attachments = message.attachments.map(({ payload: { url } }) => url);
    const spySetSessionAndUser = jest
      .spyOn(sessionsService, 'setSessionAndUser')
      .mockResolvedValueOnce(session);

    const spySendToDialogFlow = jest
      .spyOn(dialogflowService, 'sendToDialogFlow')
      .mockResolvedValueOnce(defaultWelcomeIntent);
    const spyIsDocumentaryProcedure = jest.spyOn(
      documentaryProcedureService,
      'isDocumentaryProcedure',
    );
    const spyHandleDialogFlowResponse = jest
      .spyOn(webhookService, 'handleDialogFlowResponse')
      .mockResolvedValueOnce(null);

    await webhookService.sendToDialogFlow(senderId, message);

    expect(spySetSessionAndUser).toBeCalledWith(senderId);
    expect(spySendToDialogFlow).toBeCalledWith({
      session: session,
      source: FB_SOURCE,
      event: FB_EVENT,
    });
    expect(spyIsDocumentaryProcedure).toBeCalledWith({
      responseDialogflow: defaultWelcomeIntent,
      attachments: attachments,
      source: FB_SOURCE,
    });
    expect(spyHandleDialogFlowResponse).toBeCalled();
    expect(spySendToDialogFlow).not.toBeCalledTimes(2);
  });

  it('sendToDialogFlow in case of error', async () => {
    const message = WebhookServiceMock.messagingEventWithText.message;
    jest
      .spyOn(sessionsService, 'setSessionAndUser')
      .mockRejectedValueOnce(new Error('Error RedisModule'));

    await expect(webhookService.sendToDialogFlow(senderId, message)).rejects.toThrowError(
      new Error('WebHook: sendToDialogflow ERROR'),
    );
  });

  it('sendTextMessage return a valid interface', async () => {
    const facebookSendMessageText = webhookService.sendTextMessage(senderId, 'mock text');
    expect(facebookSendMessageText).toBeDefined();
    expect(facebookSendMessageText).toEqual({
      recipient: {
        id: expect.any(String),
      },
      message: {
        text: expect.any(String),
      },
    });
  });

  it('handleDialogFlowResponse with messages is defined', async () => {
    const spyHandleMessages = jest
      .spyOn(webhookService, 'handleMessages')
      .mockResolvedValueOnce(null);
    const spySendMessageAPI = jest.spyOn(webhookService, 'sendMessageAPI');
    const spySendTextMessage = jest.spyOn(webhookService, 'sendTextMessage');
    await webhookService.handleDialogFlowResponse(senderId, resultWithMessages);
    expect(spyHandleMessages).toBeCalled();
    expect(spyHandleMessages).not.toBeCalledTimes(2);
    expect(spySendMessageAPI).not.toBeCalled();
    expect(spySendTextMessage).not.toBeCalled();
  });

  it('handleDialogFlowResponse with messages is null or string void', async () => {
    const spyHandleMessages = jest.spyOn(webhookService, 'handleMessages');
    const spySendMessageAPI = jest
      .spyOn(webhookService, 'sendMessageAPI')
      .mockResolvedValueOnce(null);
    const spySendTextMessage = jest.spyOn(webhookService, 'sendTextMessage');
    await webhookService.handleDialogFlowResponse(senderId, undefinedIntent);

    expect(spyHandleMessages).not.toBeCalled();
    expect(spySendTextMessage).toBeCalledWith(senderId, DEFAULT_RESPONSE);
    expect(spySendTextMessage).not.toBeCalledTimes(2);
    expect(spySendMessageAPI).toBeCalled();
    expect(spySendTextMessage).not.toBeCalledTimes(2);
  });

  it('handleDialogFlowResponse with fulfillmentText is defined', async () => {
    const spyHandleMessages = jest.spyOn(webhookService, 'handleMessages');
    const spySendMessageAPI = jest
      .spyOn(webhookService, 'sendMessageAPI')
      .mockResolvedValueOnce(null);
    const spySendTextMessage = jest.spyOn(webhookService, 'sendTextMessage');

    await webhookService.handleDialogFlowResponse(senderId, defaultWelcomeIntent);
    expect(spyHandleMessages).not.toBeCalled();
    expect(spySendMessageAPI).not.toBeCalledTimes(2);
    expect(spySendTextMessage).not.toBeCalledTimes(2);

    expect(spySendMessageAPI).toBeCalled();
    expect(spySendTextMessage).toBeCalledWith(senderId, defaultWelcomeIntent.fulfillmentText);
  });

  it('handleMessages with payload dialogflow response', async () => {
    const spyHandleCardMessages = jest.spyOn(webhookService, 'handleCardMessages');
    const spySendMessageAPI = jest.spyOn(webhookService, 'sendMessageAPI').mockResolvedValue(null);
    await webhookService.handleMessages(
      DialogflowServiceMock.dialogflowMessagesWithMultiCase,
      senderId,
      webhookService.sendMessageAPI.bind(this),
    );
    expect(spySendMessageAPI).toBeCalled();
    expect(spyHandleCardMessages).toBeCalled();
  });

  it('handleMessages with unknow case and throw error', async () => {
    await expect(
      webhookService.handleMessages(
        DialogflowServiceMock.dialogflowMessagesWithUnknownCase,
        senderId,
        webhookService.sendMessageAPI.bind(this),
      ),
    ).rejects.toThrowError(new Error('Error handleMessages'));
  });

  it('handleMessage throw error in case of unknown type message', async () => {
    try {
      webhookService.handleMessage(DialogflowServiceMock.messageUnknow, senderId);
    } catch (error) {
      expect(error).toEqual(new Error('Unknown message received'));
    }
  });

  it('receivedPostback to be called sendToDialogFlow', async () => {
    const spySendToDialogFlow = jest
      .spyOn(webhookService, 'sendToDialogFlow')
      .mockResolvedValueOnce(null);
    await webhookService.receivedPostback(WebhookServiceMock.eventPostback);
    expect(spySendToDialogFlow).toBeCalledTimes(1);
  });

  it('sendMessageAPI to be called Facebook API OK', async () => {
    const spyAxiosServicePost = jest
      .spyOn(httpService.axiosRef, 'post')
      .mockResolvedValueOnce({ data: null });
    await webhookService.sendMessageAPI(messageData);
    expect(spyAxiosServicePost).toBeCalled();
  });

  it('sendMessageAPI rejects in Facebook API', async () => {
    const spyAxiosServicePost = jest
      .spyOn(httpService.axiosRef, 'post')
      .mockRejectedValueOnce(new Error('Error Invalid Token'));

    await expect(webhookService.sendMessageAPI(messageData)).rejects.toThrowError(
      Error('Error send message from Facebook'),
    );
    expect(spyAxiosServicePost).toBeCalled();
  });
});
