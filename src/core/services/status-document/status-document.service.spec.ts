import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { CommomMock } from '../../mocks/common.mock.spec';
import { StatusDocumentServiceMock } from './status-document.mock.spec';
import { StatusDocumentService } from './status-document.service';

describe('StatusDocumentService', () => {
  let statusDocumentService: StatusDocumentService;
  let httpService: HttpService;
  const mockService = new CommomMock();
  const createStatusDocumentDto = StatusDocumentServiceMock.createStatusDocumentDto;
  const createStatus = StatusDocumentServiceMock.createStatusDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatusDocumentService,
        {
          provide: HttpService,
          useValue: mockService,
        },
      ],
    }).compile();

    statusDocumentService = module.get<StatusDocumentService>(StatusDocumentService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(statusDocumentService).toBeDefined();
  });

  it('registerStatusDocument should be return correct status in sucess case', async () => {
    const spyAxiosRefPost = jest.spyOn(httpService, 'post').mockImplementationOnce((): any => {
      return {
        data: CommomMock.response,
      };
    });
    const response = await statusDocumentService.registerStatusDocument(createStatusDocumentDto);
    expect(response).toEqual(CommomMock.response);
    expect(spyAxiosRefPost).toBeCalledWith('/status-document', createStatusDocumentDto);
  });

  it('registerStatus should be return correct status in sucess case', async () => {
    const spyAxiosRefPost = jest.spyOn(httpService, 'post').mockImplementationOnce((): any => {
      return {
        data: CommomMock.response,
      };
    });
    const response = await statusDocumentService.registerStatus(createStatus);
    expect(response).toEqual(CommomMock.response);
    expect(spyAxiosRefPost).toBeCalledWith('/status', createStatus);
  });

  it('getStatusDocument should be return correct string status in sucess case', async () => {
    const idStatusDocument = '78965412364';
    const spyAxiosRefGet = jest.spyOn(httpService, 'get').mockImplementationOnce((): any => {
      return {
        data: StatusDocumentServiceMock.listStatus,
      };
    });
    const getStatusString = await statusDocumentService.getStatusDocument(idStatusDocument);
    expect(getStatusString).toBeDefined();
    expect(spyAxiosRefGet).toBeCalledWith(`/status/${idStatusDocument}`);
  });
});
