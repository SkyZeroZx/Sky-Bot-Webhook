import { Test, TestingModule } from '@nestjs/testing';
import { WebhookController } from './webhook.controller';
import { WebhookServiceMock } from './webhook.mock.spec';
import { WebhookService } from './webhook.service';

describe('WebhookController', () => {
  let webhookController: WebhookController;
  let webhookService: WebhookService;
  const webhookServiceMock: WebhookServiceMock = new WebhookServiceMock();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookController],
      providers: [{ provide: WebhookService, useValue: webhookServiceMock }],
    }).compile();

    webhookController = module.get<WebhookController>(WebhookController);
    webhookService = module.get<WebhookService>(WebhookService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(webhookController).toBeDefined();
  });

  it('verified registerChangelle return challenge', async () => {
    const challenge = webhookController.registerChangelle(WebhookServiceMock.requestFacebook);
    expect(challenge).toBeDefined();
    expect(challenge).toEqual(WebhookServiceMock.requestFacebook.query.hub.challenge);
  });

  it('verified getData when send message', async () => {
    const spyReceivedMessage = jest.spyOn(webhookService, 'receivedMessage');
    const spyReceivedPostback = jest.spyOn(webhookService, 'receivedPostback');
    await webhookController.getData(WebhookServiceMock.facebookEntryWithMessage);
    expect(spyReceivedMessage).toBeCalled();
    expect(spyReceivedPostback).not.toBeCalled();
  });

  it('verified getData when send Postback', async () => {
    const spyReceivedMessage = jest.spyOn(webhookService, 'receivedMessage');
    const spyReceivedPostback = jest.spyOn(webhookService, 'receivedPostback');
    await webhookController.getData(WebhookServiceMock.facebookEntryWithPostBack);
    expect(spyReceivedMessage).not.toBeCalled();
    expect(spyReceivedPostback).toBeCalled();
  });

  it('verified getData when send unknow message event', async () => {
    const spyReceivedMessage = jest.spyOn(webhookService, 'receivedMessage');
    const spyReceivedPostback = jest.spyOn(webhookService, 'receivedPostback');
    await webhookController.getData(WebhookServiceMock.facebookEntryUnkown);
    expect(spyReceivedMessage).not.toBeCalled();
    expect(spyReceivedPostback).not.toBeCalled();
  });
});
