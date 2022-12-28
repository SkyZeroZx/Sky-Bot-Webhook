import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { WebhookModule } from './webhook/webhook.module';
import { DialogflowModule } from './dialogflow/dialogflow.module';
import { DocumentaryProcedureModule } from './documentary-procedure/documentary-procedure.module';
import { HealthModule, RefreshTokenModule, SessionsModule } from '@core/config';
import {
  DocumentModule,
  StatusDocumentModule,
  StudentModule,
  AttachmentModule,
} from '@core/services';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpLoggingInterceptor, TokenAxiosInterceptor } from '@core/interceptor';
import { metricsPrometheus } from '@core/metrics';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrometheusModule.register(),
    HealthModule,
    WebhookModule,
    DialogflowModule,
    DocumentaryProcedureModule,
    SessionsModule,
    RefreshTokenModule,
    DocumentModule,
    StatusDocumentModule,
    StudentModule,
    AttachmentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TokenAxiosInterceptor,
    },
    ...metricsPrometheus,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggingInterceptor)
      .exclude(
        { path: 'metrics', method: RequestMethod.GET },
        { path: 'health', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
