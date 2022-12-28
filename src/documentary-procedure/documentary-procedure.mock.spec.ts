import { DocumentaryProcedure } from '@core/interface';

export class DocumentaryProcedureServiceMock {
  public static readonly notMatchDocumentaryProcedure: DocumentaryProcedure = {
    responseDialogflow: {
      intent: {
        displayName: 'DISPLAY_NAME_DIFERENT',
      },
      fulfillmentText: '',
    },

    source: 'FACEBOOK',
  };
  public static readonly requiredDialogflowVariables: DocumentaryProcedure = {
    responseDialogflow: {
      intent: {
        displayName: 'documentary_procedure',
      },
      fulfillmentText: 'required variables of dialogflow',
    },

    source: 'FACEBOOK',
  };

  public static generateDocumentaryProcedureSteps(numberStep: number): DocumentaryProcedure {
    return {
      responseDialogflow: {
        intent: {
          displayName: `register_documentary_procedure_step_${numberStep}`,
        },
        fulfillmentText: '',
      },
      source: 'FACEBOOK',
    };
  }

  public static readonly statusDocumentaryProcedure: DocumentaryProcedure = {
    responseDialogflow: {
      intent: {
        displayName: 'status_documentary_procedure',
      },
      fulfillmentText: '',
    },
    source: 'FACEBOOK',
  };

  public static readonly dialogflowResponseWithFields: DocumentaryProcedure = {
    responseDialogflow: {
      intent: {
        displayName: 'status_documentary_procedure',
      },
      fulfillmentText: '',
      parameters: {
        fields: {
          idStatusDocument: {
            stringValue: '1234567890999',
          },
          documentaryProcedureName: {
            stringValue: 'BACHILLER',
          },
          studentCode: {
            stringValue: '88888888888',
          },
          dni: {
            numberValue: 77777777,
          },
          caracterValidation: {
            numberValue: 7,
          },
        },
      },
    },
    source: 'FACEBOOK',
    attachments: ['https://localhost:4200/AWESOME_IMG_1', 'https://localhost:4200/AWESOME_IMG_2'],
  };

  public static readonly getStatusMock: string = 'Iam a mock status documentary';

  public getStatusDocument = jest.fn().mockReturnThis();
  public getDocumentByName = jest.fn().mockReturnThis();
  public getStudentById = jest.fn().mockReturnThis();
  public getStudentByIdAndDni = jest.fn().mockReturnThis();
  public registerStatusDocument = jest.fn().mockReturnThis();
  public registerStatus  = jest.fn().mockReturnThis();
  public uploadAttachment = jest.fn().mockReturnThis();
}
