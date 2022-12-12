import { google } from '@google-cloud/dialogflow/build/protos/protos';
import { IDialogflowMessage, DialogFlowMessage } from '@common/interface';

export class DialogflowServiceMock {
  public static readonly defaultWelcomeIntent: google.cloud.dialogflow.v2.IQueryResult = {
    fulfillmentText: 'Mock FulfillmentText',
    intent: {
      displayName: 'Welcome_Intent_Default',
    },
  };

  public static readonly dialogflowMessage: DialogFlowMessage = {
    message: 'text',
    session: 'SDFSDFSDFSD',
    source: 'FACEBOOK',
  };

  public static readonly dialogflowMessageWithEvent: DialogFlowMessage = {
    event: 'FACEBOOK_MEDIA',
    session: 'SDFSDFSDFSD',
    source: 'FACEBOOK',
  };

  // For fixed IQueryResult of Dialogflow not add message but exist in the object response
  public static readonly dialogflowMessages: IDialogflowMessage[] = [
    {
      text: {
        text: ['Mock 1', 'Mock 2'],
      },
      message: 'text',
      platform: null,
    },
  ];

  public static readonly resultWithMessages: google.cloud.dialogflow.v2.IQueryResult = {
    intent: {
      displayName: 'MultiMessage_Intent',
    },
    fulfillmentMessages: this.dialogflowMessages,
    fulfillmentText: '',
    action: null,
  };

  public static readonly undefinedIntent: google.cloud.dialogflow.v2.IQueryResult = {
    intent: {
      displayName: 'unknown_intent',
    },
    fulfillmentMessages: null,
    fulfillmentText: '',
    action: null,
  };

  public static readonly buttons: google.cloud.dialogflow.v2.Intent.Message.Card.IButton[] = [
    {
      text: 'Button Text Mock 1',
      postback: 'Postback Mock1',
    },
    {
      text: 'Button Text Mock 2',
      postback: 'Postback Mock 2',
    },
    {
      text: 'Button URL Mock 3',
      postback: 'http://localhost:4200/awesome-page-angular',
    },
    {
      text: 'Button String Void Mock 4 ',
      postback: '',
    },
  ];

  // Is any because the type interface of dialogflow not recognized the protoValues
  public static readonly payloadForFacebook: any = {
    fields: {
      facebook: {
        kind: 'structValue',
        structValue: {
          fields: {
            attachment: {
              kind: 'structValue',
              structValue: {
                fields: {
                  payload: {
                    kind: 'structValue',
                    structValue: {
                      fields: {
                        elements: {
                          kind: 'listValue',
                          listValue: {
                            values: [
                              {
                                kind: 'structValue',
                                structValue: {
                                  fields: {
                                    buttons: {
                                      kind: 'listValue',
                                      listValue: {
                                        values: [
                                          {
                                            kind: 'structValue',
                                            structValue: {
                                              fields: {
                                                payload: {
                                                  kind: 'stringValue',
                                                  stringValue: 'MATRICULA',
                                                },
                                                title: {
                                                  kind: 'stringValue',
                                                  stringValue: 'Matricula',
                                                },
                                                type: {
                                                  kind: 'stringValue',
                                                  stringValue: 'postback',
                                                },
                                              },
                                            },
                                          },
                                        ],
                                      },
                                    },
                                    image_url: {
                                      kind: 'stringValue',
                                      stringValue:
                                        'https://upload.wikimedia.org/wikipedia/commons/9/94/Gato_%282%29_REFON.jpg',
                                    },
                                    subtitle: {
                                      kind: 'stringValue',
                                      stringValue:
                                        'Proceso para matricula en el presente ciclo academico',
                                    },
                                    title: {
                                      kind: 'stringValue',
                                      stringValue: 'Matricula',
                                    },
                                  },
                                },
                              },
                              {
                                kind: 'structValue',
                                structValue: {
                                  fields: {
                                    buttons: {
                                      kind: 'listValue',
                                      listValue: {
                                        values: [
                                          {
                                            kind: 'structValue',
                                            structValue: {
                                              fields: {
                                                payload: {
                                                  kind: 'stringValue',
                                                  stringValue: 'CRONOGRAMA',
                                                },
                                                title: {
                                                  kind: 'stringValue',
                                                  stringValue: 'cronograma',
                                                },
                                                type: {
                                                  kind: 'stringValue',
                                                  stringValue: 'postback',
                                                },
                                              },
                                            },
                                          },
                                        ],
                                      },
                                    },
                                    image_url: {
                                      kind: 'stringValue',
                                      stringValue:
                                        'https://upload.wikimedia.org/wikipedia/commons/9/94/Gato_%282%29_REFON.jpg',
                                    },
                                    subtitle: {
                                      kind: 'stringValue',
                                      stringValue:
                                        'Cronograma actividades referente al ciclo academico en la FIIS UNAC',
                                    },
                                    title: {
                                      kind: 'stringValue',
                                      stringValue: 'Cronograma',
                                    },
                                  },
                                },
                              },
                              {
                                kind: 'structValue',
                                structValue: {
                                  fields: {
                                    buttons: {
                                      kind: 'listValue',
                                      listValue: {
                                        values: [
                                          {
                                            kind: 'structValue',
                                            structValue: {
                                              fields: {
                                                payload: {
                                                  kind: 'stringValue',
                                                  stringValue: 'constancia_egresado',
                                                },
                                                title: {
                                                  kind: 'stringValue',
                                                  stringValue: 'Constancia Egresado',
                                                },
                                                type: {
                                                  kind: 'stringValue',
                                                  stringValue: 'postback',
                                                },
                                              },
                                            },
                                          },
                                        ],
                                      },
                                    },
                                    image_url: {
                                      kind: 'stringValue',
                                      stringValue:
                                        'https://upload.wikimedia.org/wikipedia/commons/9/94/Gato_%282%29_REFON.jpg',
                                    },
                                    subtitle: {
                                      kind: 'stringValue',
                                      stringValue:
                                        'Certificado que indica que concluyo con exito su carrera profesional en la institucion',
                                    },
                                    title: {
                                      kind: 'stringValue',
                                      stringValue: 'Constancia Egresado',
                                    },
                                  },
                                },
                              },
                              {
                                kind: 'structValue',
                                structValue: {
                                  fields: {
                                    buttons: {
                                      kind: 'listValue',
                                      listValue: {
                                        values: [
                                          {
                                            kind: 'structValue',
                                            structValue: {
                                              fields: {
                                                payload: {
                                                  kind: 'stringValue',
                                                  stringValue: 'Consultar Estado Tramite',
                                                },
                                                title: {
                                                  kind: 'stringValue',
                                                  stringValue: 'Consultar Estado',
                                                },
                                                type: {
                                                  kind: 'stringValue',
                                                  stringValue: 'postback',
                                                },
                                              },
                                            },
                                          },
                                        ],
                                      },
                                    },
                                    image_url: {
                                      kind: 'stringValue',
                                      stringValue:
                                        'https://upload.wikimedia.org/wikipedia/commons/9/94/Gato_%282%29_REFON.jpg',
                                    },
                                    subtitle: {
                                      kind: 'stringValue',
                                      stringValue: 'Puede consultar el estado de su tramite',
                                    },
                                    title: {
                                      kind: 'stringValue',
                                      stringValue: 'Consulta Estado',
                                    },
                                  },
                                },
                              },
                              {
                                kind: 'structValue',
                                structValue: {
                                  fields: {
                                    buttons: {
                                      kind: 'listValue',
                                      listValue: {
                                        values: [
                                          {
                                            kind: 'structValue',
                                            structValue: {
                                              fields: {
                                                payload: {
                                                  kind: 'stringValue',
                                                  stringValue: 'Encuesta_Chatbot',
                                                },
                                                title: {
                                                  kind: 'stringValue',
                                                  stringValue: 'Encuesta',
                                                },
                                                type: {
                                                  kind: 'stringValue',
                                                  stringValue: 'postback',
                                                },
                                              },
                                            },
                                          },
                                        ],
                                      },
                                    },
                                    image_url: {
                                      kind: 'stringValue',
                                      stringValue:
                                        'https://upload.wikimedia.org/wikipedia/commons/9/94/Gato_%282%29_REFON.jpg',
                                    },
                                    subtitle: {
                                      kind: 'stringValue',
                                      stringValue:
                                        'Formulario para calificar el servicio brindado por nuestro chatbot',
                                    },
                                    title: {
                                      kind: 'stringValue',
                                      stringValue: 'Encuesta Chatbot',
                                    },
                                  },
                                },
                              },
                            ],
                          },
                        },
                        template_type: {
                          kind: 'stringValue',
                          stringValue: 'generic',
                        },
                      },
                    },
                  },
                  type: {
                    kind: 'stringValue',
                    stringValue: 'template',
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  public static readonly dialogflowMessagesWithMultiCase: IDialogflowMessage[] = [
    {
      text: {
        text: ['Mock 1', 'Mock 2'],
      },
      message: 'text',
      platform: 'FACEBOOK',
    },
    {
      message: 'card',
      card: {
        title: 'Mock Card',
        subtitle: 'Mock Card Subtitle',
        imageUri: 'http://localhost:4200/image/awesome.jpng',
        buttons: this.buttons,
      },
      platform: 'FACEBOOK',
    },
    {
      message: 'payload',
      payload: this.payloadForFacebook,
      platform: 'FACEBOOK',
    },
  ];

  public static readonly messageUnknow: IDialogflowMessage = {
    message: 'unknown',
    platform: 'FACEBOOK',
  };

  public static readonly dialogflowMessagesWithUnknownCase: IDialogflowMessage[] = [
    this.messageUnknow,
  ];

  public static readonly messageReponseOfDialogflow = [
    {
      outputAudio: {
        data: [],
        type: 'Buffer',
      },
      outputAudioConfig: null,
      queryResult: {
        action: '',
        allRequiredParamsPresent: true,
        cancelsSlotFilling: false,
        diagnosticInfo: null,
        fulfillmentMessages: [
          {
            message: 'text',
            platform: 'PLATFORM_UNSPECIFIED',
            text: {
              text: [''],
            },
          },
        ],
        fulfillmentText: '',
        intent: {
          action: '',
          defaultResponsePlatforms: [],
          displayName: 'register_documentary_procedure_step_1',
          endInteraction: false,
          events: [],
          followupIntentInfo: [],
          inputContextNames: [],
          isFallback: false,
          liveAgentHandoff: false,
          messages: [],
          mlDisabled: false,
          name: 'projects/fdgfdgfdgfdgfdgdf/agent/sessions/gfdgfdgfdgfdgfdgfdgfd',
          outputContexts: [],
          parameters: [],
          parentFollowupIntentName: '',
          priority: 0,
          resetContexts: false,
          rootFollowupIntentName: '',
          trainingPhrases: [],
          webhookState: 'WEBHOOK_STATE_UNSPECIFIED',
        },
        intentDetectionConfidence: 1,
        languageCode: 'es',
        outputContexts: [
          {
            lifespanCount: 12,
            name: 'projects/fdgfdgfdgfdgfdgdf/agent/sessions/gfdgfdgfdgfdgfdgfdgfd/contexts/register_documentary_procedure_step_1-followup',
            parameters: {
              fields: {
                documentaryProcedureName: {
                  kind: 'stringValue',
                  stringValue: 'bachiller',
                },
                'documentaryProcedureName.original': {
                  kind: 'stringValue',
                  stringValue: 'bachiller',
                },
              },
            },
          },
        ],
        parameters: {
          fields: {
            documentaryProcedureName: {
              kind: 'stringValue',
              stringValue: 'bachiller',
            },
          },
        },
        queryText: 'deseo tramite bachiller',
        sentimentAnalysisResult: null,
        speechRecognitionConfidence: 0,
        webhookPayload: null,
        webhookSource: '',
      },
      responseId: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabc',
      webhookStatus: null,
    },
    null,
    null,
  ];

  public static readonly messageReponseOfDialogflowWithPlataform = [
    {
      outputAudio: {
        data: [],
        type: 'Buffer',
      },
      outputAudioConfig: null,
      queryResult: {
        action: '',
        allRequiredParamsPresent: true,
        cancelsSlotFilling: false,
        diagnosticInfo: null,
        fulfillmentMessages: [
          {
            message: 'text',
            platform: 'FACEBOOK',
            text: {
              text: [''],
            },
          },
        ],
        fulfillmentText: '',
        intent: {
          action: '',
          defaultResponsePlatforms: [],
          displayName: 'register_documentary_procedure_step_1',
          endInteraction: false,
          events: [],
          followupIntentInfo: [],
          inputContextNames: [],
          isFallback: false,
          liveAgentHandoff: false,
          messages: [],
          mlDisabled: false,
          name: 'projects/fdgfdgfdgfdgfdgdf/agent/sessions/gfdgfdgfdgfdgfdgfdgfd',
          outputContexts: [],
          parameters: [],
          parentFollowupIntentName: '',
          priority: 0,
          resetContexts: false,
          rootFollowupIntentName: '',
          trainingPhrases: [],
          webhookState: 'WEBHOOK_STATE_UNSPECIFIED',
        },
        intentDetectionConfidence: 1,
        languageCode: 'es',
        outputContexts: [
          {
            lifespanCount: 12,
            name: 'projects/fdgfdgfdgfdgfdgdf/agent/sessions/gfdgfdgfdgfdgfdgfdgfd/contexts/register_documentary_procedure_step_1-followup',
            parameters: {
              fields: {
                documentaryProcedureName: {
                  kind: 'stringValue',
                  stringValue: 'bachiller',
                },
                'documentaryProcedureName.original': {
                  kind: 'stringValue',
                  stringValue: 'bachiller',
                },
              },
            },
          },
        ],
        parameters: {
          fields: {
            documentaryProcedureName: {
              kind: 'stringValue',
              stringValue: 'bachiller',
            },
          },
        },
        queryText: 'deseo tramite bachiller',
        sentimentAnalysisResult: null,
        speechRecognitionConfidence: 0,
        webhookPayload: null,
        webhookSource: '',
      },
      responseId: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabc',
      webhookStatus: null,
    },
    null,
    null,
  ];
}
