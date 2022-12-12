import { Document } from '../../interface';

export class DocumentServiceMock {
  public static readonly document: Document = {
    idDocument: 1,
    name: 'BACHILLER',
    requirements: 'WAITING FOR BACHILLER HALF OF YEAR',
  };
}
