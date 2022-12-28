import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppMetadata, ManagementClient, ManagementClientOptions, UserMetadata } from 'auth0';
import {
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_AUDIENCE,
} from '@core/constants';

@Injectable()
export class RefreshTokenService implements OnModuleInit {
  private readonly logger = new Logger(RefreshTokenService.name);
  private _tokenAuth0: string = '';
  management: ManagementClient<AppMetadata, UserMetadata>;

  constructor(private readonly config: ConfigService) {
    const managementOptions: ManagementClientOptions = {
      domain: this.config.get(AUTH0_DOMAIN),
      clientId: this.config.get(AUTH0_CLIENT_ID),
      clientSecret: this.config.get(AUTH0_CLIENT_SECRET),
      audience: this.config.get(AUTH0_AUDIENCE),
    };

    this.management = new ManagementClient(managementOptions);
  }

  get tokenAuth0() {
    return this._tokenAuth0;
  }

  async onModuleInit() {
    this.logger.log('Initializing refresh token service');
    await this.getAccessToken();
    this.refreshTokenAuth0();
  }

  private refreshTokenAuth0() {
    setInterval(async () => {
      this.logger.log('Refreshing refresh token service');
      await this.getAccessToken();
    }, this.config.get<number>('AUTH0_REFRESH_TOKEN_MS'));
  }

  private async getAccessToken() {
    try {
      this._tokenAuth0 = await this.management.getAccessToken();
    } catch (error) {
      this.logger.error({ message: 'Error al obtener API Token Auth0 WebHook', error });
    }
  }
}
