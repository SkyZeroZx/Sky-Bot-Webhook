import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { CommomMock } from '../../mocks/common.mock.spec';
import { DocumentServiceMock } from './document.mock.spec';
import { DocumentService } from './document.service';

describe('DocumentService', () => {
  let documentService: DocumentService;
  let httpService: HttpService;
  const mockService = new CommomMock();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: HttpService,
          useValue: mockService,
        },
      ],
    }).compile();

    documentService = module.get<DocumentService>(DocumentService);
    httpService = module.get<HttpService>(HttpService);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(documentService).toBeDefined();
  });

  it('getDocumentByName should be return document in case success', async () => {
    const name = 'mockDocumentName';
    const spyAxiosRefGet = jest.spyOn(httpService, 'get').mockImplementationOnce((): any => {
      return {
        data: DocumentServiceMock.document,
      };
    });
    const document = await documentService.getDocumentByName(name);
    expect(document).toEqual(DocumentServiceMock.document);
    expect(spyAxiosRefGet).toBeCalledWith(`/document/${name}`);
  });
});
