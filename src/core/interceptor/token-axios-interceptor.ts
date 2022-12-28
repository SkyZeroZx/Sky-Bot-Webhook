import { ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { RefreshTokenService } from '@core/config';

@Injectable()
export class TokenAxiosInterceptor implements NestInterceptor {
  constructor(
    private httpService: HttpService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  intercept(_context: ExecutionContext, next: any): Observable<any> {

    //TODO : ADD CATCH ERROR CASE
    this.httpService.axiosRef.defaults.headers.common['Authorization'] =
      'bearer ' + this.refreshTokenService.tokenAuth0;

    return next.handle().pipe();
  }
}
