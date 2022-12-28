import { google } from '@google-cloud/dialogflow/build/protos/protos';

export interface DocumentaryProcedure {
  responseDialogflow: google.cloud.dialogflow.v2.IQueryResult;
  attachments?: string[];
  source: string;
}
