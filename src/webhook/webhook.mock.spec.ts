import { FacebookEntry, Messaging } from '@common/interface';

export class WebhookServiceMock {
  public receivedMessage = jest.fn().mockReturnThis();

  public receivedPostback = jest.fn().mockReturnThis();
  public sendToDialogFlow = jest.fn().mockReturnThis();

  public setSessionAndUser = jest.fn().mockReturnThis();

  public getSession = jest.fn().mockReturnThis();

  public isDocumentaryProcedure = jest.fn().mockReturnThis();

  public post = jest.fn().mockReturnThis();

  public axiosRef = {
    post: this.post,
  };

  public static readonly eventPostback: Messaging = {
    postback: {
      mid: 'EXAMPLE_MID',
      payload: 'Postback Mock Payload',
      title: 'PostBack Title Mock Payload',
    },
    recipient: {
      id: '2',
    },
    sender: {
      id: '2',
    },
    timestamp: 2,
  };

  public static readonly requestFacebook: any = {
    query: {
      hub: {
        mode: 'MockMode',
        verify_token: 'MockToken',
        challenge: 'MockChallenge',
      },
    },
  };

  public static readonly facebookEntryUnkown: FacebookEntry = {
    entry: [
      {
        hop_context: [
          {
            app_id: 2,
            metadata: '',
          },
        ],
        id: '2',
        messaging: [
          {
            postback: null,
            message: null,
            recipient: {
              id: '1',
            },
            sender: {
              id: '1',
            },
            timestamp: 1,
          },
        ],
        time: 2,
      },
    ],
    object: 'page',
  };

  public static readonly facebookEntryWithPostBack: FacebookEntry = {
    entry: [
      {
        hop_context: [
          {
            app_id: 2,
            metadata: '',
          },
        ],
        id: '2',
        messaging: [this.eventPostback],
        time: 2,
      },
    ],
    object: 'page',
  };

  public static readonly messagingEventWithAttachments: Messaging = {
    message: {
      mid: 'EXAMPLE_MID',
      attachments: [
        {
          payload: {
            url: 'FACEBOOK_MOCK_URL',
          },
          type: 'image',
        },
      ],
    },
    recipient: {
      id: '1',
    },
    sender: {
      id: '1',
    },
    timestamp: 1,
  };

  public static readonly messagingEventWithText: Messaging = {
    message: {
      mid: 'EXAMPLE_MID',
      text: 'deseo tramite bachiller',
    },
    recipient: {
      id: '1',
    },
    sender: {
      id: '1',
    },
    timestamp: 1,
  };

  public static readonly facebookEntryWithMessage: FacebookEntry = {
    entry: [
      {
        hop_context: [
          {
            app_id: 1,
            metadata: '',
          },
        ],
        id: '1',
        messaging: [this.messagingEventWithText],
        time: 1,
      },
    ],
    object: 'page',
  };
}
