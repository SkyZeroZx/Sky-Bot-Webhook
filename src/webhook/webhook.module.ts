import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { DialogflowModule } from '../dialogflow/dialogflow.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FB_API_URL, FB_PAGE_TOKEN } from '@common/constants/config';
import { DocumentaryProcedureModule } from '../documentary-procedure/documentary-procedure.module';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [
    DialogflowModule,
    DocumentaryProcedureModule,
    SessionsModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: 15000,
        maxRedirects: 35,
        baseURL : configService.get(FB_API_URL),
        params: { access_token: configService.get<string>(FB_PAGE_TOKEN) },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}