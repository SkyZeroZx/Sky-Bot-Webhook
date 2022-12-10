import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { URL_API_REST_BOT } from '@common/constants/config';
import { DocumentService } from './document.service';
 

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: 15000,
        maxRedirects: 35,
        baseURL: configService.get<string>(URL_API_REST_BOT),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DocumentService],
  exports : [DocumentService]
})
export class DocumentModule {}