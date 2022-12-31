import { FacebookEntry } from '../../src/core/interface';

export class WebhookMockE2E {
  public static readonly facebookEntryVoid: FacebookEntry = {
    entry: [
      {
        hop_context: [],
        id: '',
        messaging: [
          { message: null, recipient: null, sender: null, timestamp: null, postback: null },
        ],
        time: null,
      },
    ],
    object: 'page',
  };

  public static readonly facebookEntryWithMessage: FacebookEntry = {
    entry: [
      {
        hop_context: [
          {
            app_id: 340091383739159,
            metadata: '',
          },
        ],
        id: '110145950848846',
        messaging: [
          {
            message: {
              mid: 'm_09sAbnurR8BH_51TrWBpyNVYjsAHHbZ3vpA4AHVIKKhSPk9IPGnAAFga0Wp3Tau8cf0ijfy7Gn9n8BF80O_zMQ',
              text: 'Deseo tramite bachiller',
            },
            recipient: {
              id: '110145950848846',
            },
            sender: {
              id: '3130067507116744',
            },
            timestamp: 1672202637120,
          },
        ],
        time: 1672202637412,
      },
    ],
    object: 'page',
  };

  public static readonly facebookEntryMessageCardWithPayload: FacebookEntry = {
    entry: [
      {
        hop_context: [
          {
            app_id: 340091383739159,
            metadata: '',
          },
        ],
        id: '110145950848846',
        messaging: [
          {
            message: {
              mid: 'm_09sAbnurR8BH_51TrWBpyNVYjsAHHbZ3vpA4AHVIKKhSPk9IPGnAAFga0Wp3Tau8cf0ijfy7Gn9n8BF80O_zMQ',
              text: 'Hola',
            },
            recipient: {
              id: '110145950848846',
            },
            sender: {
              id: '3130067507116744',
            },
            timestamp: 1672202637120,
          },
        ],
        time: 1672202637412,
      },
    ],
    object: 'page',
  };

  public static readonly facebookEntryWithPostback: FacebookEntry = {
    entry: [
      {
        hop_context: [
          {
            app_id: 340091383739159,
            metadata: '',
          },
        ],
        id: '110145950848846',
        messaging: [
          {
            postback: {
              mid: 'm_qx8N96DXH7-EZXp74ge539VYjsAHHbZ3vpA4AHVIKKgFuTZzl9Rru-AsLw8ziUcgfspPxtmjzdxqcyTHDAwzlA',
              payload: 'MATRICULA',
              title: 'Matricula',
            },
            recipient: {
              id: '110145950848846',
            },
            sender: {
              id: '3130067507116744',
            },
            timestamp: 1672269466723,
          },
        ],
        time: 1672269467061,
      },
    ],
    object: 'page',
  };
}
