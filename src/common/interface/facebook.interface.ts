export interface HopContext {
  app_id: number;
  metadata: string;
}

export interface Payload {
  url: string;
}

export interface Attachment {
  payload: Payload;
  type: string;
}

export interface Message {
  attachments?: Attachment[];
  mid: string;
  text?: string;
}

export interface Postback {
  mid: string;
  payload: string;
  title: string;
}

export interface Recipient {
  id: string;
}

export interface Sender {
  id: string;
}

export interface Messaging {
  message?: Message;
  recipient: Recipient;
  sender: Sender;
  timestamp: number;
  postback?: Postback;
}

export interface Entry {
  hop_context: HopContext[];
  id: string;
  messaging: Messaging[];
  time: number;
}

export interface FacebookEntry {
  entry: Entry[];
  object: string;
}

export interface FacebookButtonElement {
  type: string;
  title: string;
  url?: string;
  payload?: string;
}

export interface FacebookCardElement {
  title: string;
  image_url: string;
  subtitle: string;
  buttons: FacebookButtonElement[];
}

export interface FacebookSendMessageText {
  recipient: {
    id: string;
  };
  message: {
    text: string;
  };
}

export interface FacebookSendMessageCards {
  recipient: {
    id: string;
  };
  message: {
    attachment: {
      type: string;
      payload: {
        template_type: string;
        elements: FacebookCardElement[];
      };
    };
  };
}
