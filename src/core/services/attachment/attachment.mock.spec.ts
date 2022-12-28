import { Attachment } from '@core/interface';
import { UploadAttachment } from './dto/upload-attachment.dto';

export class AttachmentServiceMock {
  public static readonly Attachment: Attachment = {
    payload: {
      url: 'http://localhost/awesome_attachment',
    },
    type: 'image',
  };

  public static readonly uploadAttachment: UploadAttachment = {
    idStatusDocument: '7896541236',
    listUrl: ['http://localhost/awesome_attachment', 'http://localhost/awesome_basilisco'],
  };
}
