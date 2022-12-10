import { google } from '@google-cloud/dialogflow/build/protos/protos';

export interface IDialogflowMessage extends google.cloud.dialogflow.v2.Intent.IMessage {
  message?: string;
}

export interface DialogFlowMessage {
  message?: string;
  session: string;
  source: string;
  params?: { [k: string]: google.protobuf.IValue } | null;
  event?: string;
}
