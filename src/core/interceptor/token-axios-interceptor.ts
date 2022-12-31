import { ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, of } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { RefreshTokenService } from '@core/config';

@Injectable()
export class TokenAxiosInterceptor implements NestInterceptor {
  private logger = new Logger(TokenAxiosInterceptor.name);
  constructor(
    private httpService: HttpService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  intercept(_context: ExecutionContext, next: any): Observable<any> {
    this.httpService.axiosRef.defaults.headers.common['Authorization'] =
      'bearer ' + this.refreshTokenService.tokenAuth0;

    return next.handle().pipe(
      catchError((error) => {
        this.logger.error('Error in response of API SKY BOT');
        this.logger.error(error);
        return of(error);
      }),
    );
  }
}
