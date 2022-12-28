export class SessionsServiceMock {
  public static readonly session: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabc';

  public set = jest.fn().mockReturnThis();
  public get = jest.fn().mockReturnThis();
}
