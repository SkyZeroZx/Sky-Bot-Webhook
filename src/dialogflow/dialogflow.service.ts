import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import dialogflow from '@google-cloud/dialogflow';
import { google } from '@google-cloud/dialogflow/build/protos/protos';
import {
  DF_LANGUAGE_CODE,
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_PROJECT_ID,
} from '@core/constants/config';
import { DialogFlowMessage } from '@core/interface';

@Injectable()
export class DialogflowService {
  private readonly logger = new Logger(DialogflowService.name);
  constructor(private configService: ConfigService) {}
  private readonly credentials = {
    client_email: this.configService.get<string>(GOOGLE_CLIENT_EMAIL),
    private_key: this.configService.get<string>(GOOGLE_PRIVATE_KEY),
  };

  private readonly sessionClient = new dialogflow.SessionsClient({
    projectId: this.configService.get<string>(GOOGLE_PROJECT_ID),
    credentials: this.credentials,
  });

  async sendToDialogFlow(
    diaglogFlowMessage: DialogFlowMessage,
  ): Promise<google.cloud.dialogflow.v2.IQueryResult> {
    const textToDialogFlow = diaglogFlowMessage.message;
    try {
      const sessionPath = this.sessionClient.projectAgentSessionPath(
        this.configService.get<string>(GOOGLE_PROJECT_ID),
        diaglogFlowMessage.session,
      );

      let request: google.cloud.dialogflow.v2.IDetectIntentRequest;

      request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: textToDialogFlow,
            languageCode: this.configService.get<string>(DF_LANGUAGE_CODE),
          },
        },
        queryParams: {
          payload: {
            fields: diaglogFlowMessage.params,
          },
        },
      };

      if (diaglogFlowMessage.event) {
        request = {
          session: sessionPath,
          queryInput: {
            event: {
              name: diaglogFlowMessage.event,
              languageCode: this.configService.get<string>(DF_LANGUAGE_CODE),
            },
          },
        };
      }

      const responses = await this.sessionClient.detectIntent(request);

      this.logger.log({ message: 'In DialogflowService response', responses });

      const result = responses[0].queryResult;

      this.logger.log({ message: 'INTENT EMPAREJADO', intentName: result.intent.displayName });

      let defaultResponses = [];

      result.fulfillmentMessages.forEach((element) => {
        if (element.platform === diaglogFlowMessage.source) {
          defaultResponses.push(element);
        }
      });

      if (defaultResponses.length === 0) {
        result.fulfillmentMessages.forEach((element) => {
          if (element.platform === 'PLATFORM_UNSPECIFIED') {
            defaultResponses.push(element);
          }
        });
      }

      result.fulfillmentMessages = defaultResponses;

      return result;
    } catch (error) {
      this.logger.error({ message: 'Error DialogflowService', error });
      throw new Error('DialogflowService Error');
    }
  }
}
