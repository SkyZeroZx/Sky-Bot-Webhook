export function DOCUMENTARY_PROCEDURE_BY_STEP(message: string) {
  return {
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
              text: message,
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
}

const URL_FILE_HOST =
  'https://skyzerozx.com/upload/attachment/ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdQs5iJh6Vk13mun0Q62BRJ3CjEcP_C2YSH5WmD37IfVmQ&oe=63BB2F67.jpg;';

const URL_FILE_FACEBOOK =
  'https://scontent.flim15-1.fna.fbcdn.net/v/t1.15752-9/321630647_1551020992036976_3807258952911406802_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=ae9488&_nc_eui2=AeEZrMEIXT7xX4WA84eFn3hPgcXLwsEsWjGBxcvCwSxaMQxbfDF3xsK3qf0a6b02hML3aU06ecNLXcrg9k9IQ8LH&_nc_ohc=QNF480zQnbAAX_3WOzf&tn=eOxyHO_5nHW4OPRx&_nc_ht=scontent.flim15-1.fna&oh=03_AdTRjiFJlHkvncsZrGQeqTRwOMs-7NW13WOWbkyHAwwu5A&oe=63D49490';

export const FACEBOOK_ATTACHMENT_ERROR = {
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
            attachments: [
              {
                payload: {
                  url: URL_FILE_HOST,
                },
                type: 'image',
              },
              {
                payload: {
                  url: URL_FILE_HOST,
                },
                type: 'image',
              },
              {
                payload: {
                  url: URL_FILE_HOST,
                },
                type: 'image',
              },
            ],
            mid: 'm_BVdxu1Hn9F-zHffX0FxE29VYjsAHHbZ3vpA4AHVIKKgVigx9d0v1LgLPo5fETAROSTy5O_VYHzpXorkXpV4ytA',
          },
          recipient: {
            id: '110145950848846',
          },
          sender: {
            id: '3130067507116744',
          },
          timestamp: 1670609809838,
        },
      ],
      time: 1670609810149,
    },
  ],
  object: 'page',
};

export const FACEBOOK_ATTACHMENT_OK = {
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
            attachments: [
              {
                payload: {
                  url: URL_FILE_FACEBOOK,
                },
                type: 'image',
              },
              {
                payload: {
                  url: URL_FILE_FACEBOOK,
                },
                type: 'image',
              },
              {
                payload: {
                  url: URL_FILE_FACEBOOK,
                },
                type: 'image',
              },
            ],
            mid: 'm_BVdxu1Hn9F-zHffX0FxE29VYjsAHHbZ3vpA4AHVIKKgVigx9d0v1LgLPo5fETAROSTy5O_VYHzpXorkXpV4ytA',
          },
          recipient: {
            id: '110145950848846',
          },
          sender: {
            id: '3130067507116744',
          },
          timestamp: 1670609809838,
        },
      ],
      time: 1670609810149,
    },
  ],
  object: 'page',
};
