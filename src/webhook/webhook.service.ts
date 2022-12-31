import { google } from '@google-cloud/dialogflow/build/protos/protos';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { DEFAULT_RESPONSE, FB_EVENT, FB_SOURCE } from '@core/constants';
import { structProtoToJson, isDefined } from '@core/helpers';
import {
  IDialogflowMessage,
  FacebookButtonElement,
  FacebookCardElement,
  FacebookSendMessageCards,
  FacebookSendMessageText,
  Message,
  Messaging,
} from '@core/interface';
import { DialogflowService } from '../dialogflow/dialogflow.service';
import { DocumentaryProcedureService } from '../documentary-procedure/documentary-procedure.service';
import { SessionsService } from '@core/config';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  constructor(
    private readonly dialogflowService: DialogflowService,
    private readonly httpService: HttpService,
    private readonly documentaryProcedureService: DocumentaryProcedureService,
    private readonly sessionsService: SessionsService,
  ) {}

  async receivedMessage(messagingEvent: Messaging) {
    const senderId = messagingEvent.sender.id;
    const recipientId = messagingEvent.recipient.id;
    const timeOfMessage = messagingEvent.timestamp;
    const message = messagingEvent.message;
    this.logger.log({
      message: 'Received message for user and page at with message:',
      info: { senderId, recipientId, timeOfMessage },
    });

    // You may get a text or attachment but not both
    this.logger.log({ message: 'receivedMessage ', info: messagingEvent });

    await this.sendToDialogFlow(senderId, message);
  }

  async sendToDialogFlow(senderId: string, { text, attachments }: Message) {
    try {
      let responseDialogflow: google.cloud.dialogflow.v2.IQueryResult;
      let listAttachments: string[] = [];

      const session = await this.sessionsService.setSessionAndUser(senderId);

      if (text) {
        this.logger.log({ message: 'message text', text });
        responseDialogflow = await this.dialogflowService.sendToDialogFlow({
          message: text,
          session: session,
          source: FB_SOURCE,
        });
      }

      if (attachments) {
        listAttachments = attachments.map((attachment) => attachment.payload.url);
        this.logger.log({ message: 'message attachments', info: listAttachments });
        responseDialogflow = await this.dialogflowService.sendToDialogFlow({
          session: session,
          source: FB_SOURCE,
          event: FB_EVENT,
        });
      }

      this.logger.log({ message: 'Response from dialogflow', responseDialogflow });
      const response = await this.documentaryProcedureService.isDocumentaryProcedure({
        responseDialogflow,
        attachments: listAttachments,
        source: FB_SOURCE,
      });

      this.logger.log({ message: 'response from documentary procedure', info: response });
      await this.handleDialogFlowResponse(senderId, response);
    } catch (error) {
      this.logger.error({ message: 'salio mal en sendToDialogflow', error });
      throw new Error('WebHook: sendToDialogflow ERROR');
    }
  }

  sendTextMessage(senderId: string, text: string): FacebookSendMessageText {
    const messageData = {
      recipient: {
        id: senderId,
      },
      message: {
        text: text,
      },
    };
    this.logger.log({ message: 'sendTextMessage', info: messageData });
    return messageData;
  }

  async handleDialogFlowResponse(
    senderId: string,
    response: google.cloud.dialogflow.v2.IQueryResult,
  ) {
    const responseText = response.fulfillmentText;
    const messages: IDialogflowMessage[] = response.fulfillmentMessages;
    const action = response.action;
    const contexts = response.outputContexts;
    const parameters = response.parameters;
    this.logger.log({
      message: 'handleDialogFlowResponse',
      info: { contexts, parameters, action, messages },
    });

    if (isDefined(messages)) {
      return await this.handleMessages(messages, senderId, this.sendMessageAPI.bind(this));
    }

    if (responseText == '' && !isDefined(action)) {
      //dialogflow could not evaluate input.
      const notEvaluateInput = this.sendTextMessage(senderId, DEFAULT_RESPONSE);
      return await this.sendMessageAPI(notEvaluateInput);
    }

    if (isDefined(responseText)) {
      const formatedText = this.sendTextMessage(senderId, responseText);
      return await this.sendMessageAPI(formatedText);
    }
  }

  async handleMessages(messages: IDialogflowMessage[], senderId: string, sendMessage: Function) {
    try {
      let tempCards: IDialogflowMessage[] = [];
      let listCards: FacebookSendMessageCards[] = [];

      for (const message of messages) {
        switch (message.message) {
          case 'card':
            tempCards.push(message);
            listCards.push(this.handleCardMessages(tempCards, senderId));
            tempCards = [];
            break;
          case 'text':
          case 'image':
          case 'quickReplies':
          case 'payload':
            await sendMessage(this.handleMessage(message, senderId));
            break;
          default:
            this.logger.error(`No recognized type ${message.message}`);
            throw new Error('No recognized type messageData');
        }
      }

      for (const card of listCards) {
        await sendMessage(card);
      }
    } catch (error: any) {
      this.logger.error({ message: 'Error handleMessages', error: error.message });
      throw new Error('Error handleMessages');
    }
  }

  handleMessage(message: IDialogflowMessage, senderId: string) {
    this.logger.log({ message: 'handleMessage', info: message });
    const typeMessage = message.message;

    if (typeMessage === 'text') {
      const formatedMessageText = this.sendTextMessage(senderId, message.text.text[0]);
      return formatedMessageText;
    }

    if (typeMessage === 'payload') {
      const desestructPayload = structProtoToJson(message.payload);
      const messageData = {
        recipient: {
          id: senderId,
        },
        message: desestructPayload.facebook,
      };

      return messageData;
    }
  }

  handleCardMessages(messages: IDialogflowMessage[], senderId: string) {
    let elements: FacebookCardElement[] = [];

    messages.forEach((message) => {
      let buttons: FacebookButtonElement[] = [];

      message.card.buttons.forEach(
        (button: google.cloud.dialogflow.v2.Intent.Message.Card.IButton) => {
          let itemButton: FacebookButtonElement;
          const isLink = button.postback.substring(0, 4) === 'http';

          if (isLink) {
            itemButton = {
              type: 'web_url',
              title: button.text,
              url: button.postback,
            };
          }

          itemButton = {
            type: 'postback',
            title: button.text,
            payload: button.postback === '' ? button.text : button.postback,
          };

          buttons.push(itemButton);
        },
      );

      const element = {
        title: message.card.title,
        image_url: message.card.imageUri,
        subtitle: message.card.subtitle,
        buttons,
      };
      elements.push(element);
    });
    return this.sendGenericMessage(elements, senderId);
  }

  sendGenericMessage(elements: FacebookCardElement[], senderId: string): FacebookSendMessageCards {
    const messageData = {
      recipient: {
        id: senderId,
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: elements,
          },
        },
      },
    };
    return messageData;
  }

  async sendMessageAPI(messageData: any) {
    this.logger.log({ message: 'sendMessageAPI to Facebook', messageData });
    try {
      const { data } = await this.httpService.axiosRef.post('/me/messages', messageData);
      this.logger.log({ message: 'Facebok Response', data });
      return;
    } catch (error: any) {
      this.logger.error({ message: 'Error message from Facebook', error: error.message });
      throw new Error('Error send message from Facebook');
    }
  }

  async receivedPostback(event: Messaging) {
    const senderId = event.sender.id;
    const recipientID = event.recipient.id;
    const timeOfPostback = event.timestamp;
    const payload = event.postback.payload;
    const message: Message = {
      mid: '',
      text: payload,
    };
    this.logger.log({
      message: 'Received postback for user',
      info: { senderId, recipientID, payload, timeOfPostback },
    });

    await this.sendToDialogFlow(senderId, message);
  }
}
