import { Response } from '@core/interface';
import { MSG_OK } from '../constants';

export class CommomMock {
  public post = jest.fn().mockReturnThis();
  public get = jest.fn().mockReturnThis();
  public put = jest.fn().mockReturnThis();
  public delete = jest.fn().mockReturnThis();
  public patch = jest.fn().mockReturnThis();

  public axiosRef = {
    post: this.post,
    get: this.get,
    put: this.put,
    delete: this.delete,
    patch: this.patch,
  };

  public static readonly response: Response = {
    info: 'info mock response',
    message: MSG_OK,
  };
}
