export class HttpAxiosMockE2E {
  public post = jest.fn().mockReturnThis();
  public axiosRef = {
    post: this.post,
  };
}
