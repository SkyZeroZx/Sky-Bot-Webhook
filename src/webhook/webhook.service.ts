import { google } from '@google-cloud/dialogflow/build/protos/protos';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { FB_EVENT, FB_SOURCE } from '@common/constants/config';
import { structProtoToJson, isDefined } from '@common/helpers';
import {
  IDialogflowMessage,
  FacebookButtonElement,
  FacebookCardElement,
  FacebookSendMessageCards,
  FacebookSendMessageText,
  Message,
  Messaging,
} from '@common/interface';
import { DialogflowService } from '../dialogflow/dialogflow.service';
import { DocumentaryProcedureService } from '../documentary-procedure/documentary-procedure.service';
import { SessionsService } from '../sessions/sessions.service';

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
    const recipientID = messagingEvent.recipient.id;
    const timeOfMessage = messagingEvent.timestamp;
    const message = messagingEvent.message;
    this.logger.log({
      message: 'Received message for user and page at with message:',
      senderId,
      recipientID,
      timeOfMessage,
    });

    // You may get a text or attachment but not both
    this.logger.log({ message: 'receivedMessage ', messagingEvent });

    await this.sendToDialogFlow(senderId, message);
  }

  async sendToDialogFlow(senderId: string, { text, attachments }: Message) {
    try {
      let responseDialogflow: google.cloud.dialogflow.v2.IQueryResult;
      let listAttachments: string[] = [];

      await this.sessionsService.setSessionAndUser(senderId);
      const session = await this.sessionsService.getSession(senderId);
      this.logger.log({ message: 'SessionsService', session });
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

        this.logger.log({ message: 'message attachments', listAttachments });

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

      this.logger.log({ message: 'response from documentary procedure', response });

      await this.handleDialogFlowResponse(senderId, response);
    } catch (error) {
      console.error(error);
      this.logger.error('salio mal en sendToDialogflow...');
      this.logger.error(error);
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
    this.logger.log({ message: 'sendTextMessage', messageData });
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
      contexts,
      parameters,
      action,
      messages,
    });

    if (isDefined(messages)) {
      await this.handleMessages(messages, senderId, this.sendMessageAPI.bind(this));
    } else if (responseText == '' && !isDefined(action)) {
      //dialogflow could not evaluate input.
      const notEvaluateInput = this.sendTextMessage(
        senderId,
        'No entiendo lo que trataste de decir ...',
      );
      await this.sendMessageAPI(notEvaluateInput);
    } else if (isDefined(responseText)) {
      const formatedText = this.sendTextMessage(senderId, responseText);
      await this.sendMessageAPI(formatedText);
    }
  }

  async handleMessages(messages: IDialogflowMessage[], sender: string, sendMessage: Function) {
    try {
      let tempCards: IDialogflowMessage[] = [];
      let listCards: FacebookSendMessageCards[] = [];

      for (const message of messages) {
        switch (message.message) {
          case 'card':
            tempCards.push(message);
            listCards.push(this.handleCardMessages(tempCards, sender));
            tempCards = [];
            break;
          case 'text':
          case 'image':
          case 'quickReplies':
          case 'payload':
            await sendMessage(this.handleMessage(message, sender));
            break;
          default:
            throw new Error('No recognized type messageData');
        }
      }

      for (const card of listCards) {
        await sendMessage(card);
      }
    } catch (error: any) {
      this.logger.error('Error handleMessages');
      this.logger.error(error.message);
      throw new Error('Error handleMessages');
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

      let element = {
        title: message.card.title,
        image_url: message.card.imageUri,
        subtitle: message.card.subtitle,
        buttons,
      };
      elements.push(element);
    });
    return this.sendGenericMessage(senderId, elements);
  }

  sendGenericMessage(senderId: string, elements: FacebookCardElement[]): FacebookSendMessageCards {
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

  handleMessage(message: IDialogflowMessage, senderId: string) {
    this.logger.log({ message: 'handleMessage', senderId: senderId, dialogflowMessage: message });
    switch (message.message) {
      case 'text':
        const formatedMessageText = this.sendTextMessage(senderId, message.text.text[0]);
        return formatedMessageText;
      case 'payload':
        const desestructPayload = structProtoToJson(message.payload);
        const messageData = {
          recipient: {
            id: senderId,
          },
          message: desestructPayload.facebook,
        };
        this.logger.log({
          message: 'desestructPayloadFacebook',
          desestructPayloadFacebook: desestructPayload.facebook,
        });
        return messageData;
      default:
        this.logger.error({ message: 'Unknown message received', error: message });
        throw new Error('Unknown message received');
    }
  }

  async sendMessageAPI(messageData: any) {
    this.logger.log({ message: 'sendMessageAPI to Facebook', messageData });
    try {
      return await this.httpService.axiosRef.post('/me/messages', messageData);
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
      senderId,
      recipientID,
      payload,
      timeOfPostback,
    });

    await this.sendToDialogFlow(senderId, message);
  }
}
