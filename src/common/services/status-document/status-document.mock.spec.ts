import { Status } from '@common/interface';
import { CreateStatusDocumentDto } from './dto/create-status-document.dto';
import { CreateStatusDto } from './dto/create-status.dto';

export class StatusDocumentServiceMock {
  public static readonly createStatusDocumentDto: CreateStatusDocumentDto = {
    idStatusDocument: '78965412364',
    idStudent: '777777',
    idDocument: 1,
  };

  public static readonly createStatusDto: CreateStatusDto = {
    idStatusDocument: '78965412364',
    status: 'Mock Status Document',
    observations: 'Mock Observations',
  };

  public static listStatus: Status[] = [
    {
      idStatus: 1,
      registerDate: '2022-12-09T23:54:55.821Z',
      idStatusDocument: '78965412364',
      status: 'Mock Status Document',
      observations: 'Mock Observations',
    },
    {
      idStatus: 2,
      registerDate: '2022-12-09T23:54:55.821Z',
      idStatusDocument: '78965412364',
      status: 'Mock Status Document 2',
      observations: 'Mock Observations 2',
    },
  ];
}
