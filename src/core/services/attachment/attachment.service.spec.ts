import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { CommomMock } from '../../mocks/common.mock.spec';
import { AttachmentServiceMock } from './attachment.mock.spec';
import { AttachmentService } from './attachment.service';

describe('AttachmentService', () => {
  let attachmentService: AttachmentService;
  let httpService: HttpService;
  const mockService = new CommomMock();
  const uploadAttachment = AttachmentServiceMock.uploadAttachment;
  const dataResponseAxios: any = {
    data: CommomMock.response,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttachmentService,
        {
          provide: HttpService,
          useValue: mockService,
        },
      ],
    }).compile();

    attachmentService = module.get<AttachmentService>(AttachmentService);
    httpService = module.get<HttpService>(HttpService);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(attachmentService).toBeDefined();
  });

  it('uploadAttachment should be return response in case success', async () => {
    const spyAxiosRefPost = jest.spyOn(httpService, 'post').mockImplementationOnce(() => {
      return dataResponseAxios;
    });
    const response = await attachmentService.uploadAttachment(uploadAttachment);
    expect(response).toBeDefined();
    expect(response).toEqual(CommomMock.response);
    expect(spyAxiosRefPost).toBeCalledWith('/attachment', uploadAttachment);
  });

  it('uploadAttachment should throw error if axios is rejects of promise', async () => {
    const spyAxiosRefPost = jest.spyOn(httpService, 'post').mockImplementationOnce(() => {
      throw new Error();
    });
    await expect(attachmentService.uploadAttachment(uploadAttachment)).rejects.toThrowError(
      new Error('Attachment Upload Error'),
    );
    expect(spyAxiosRefPost).toBeCalled();
  });
});
