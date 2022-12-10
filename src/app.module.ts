import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule as ScheduleModuleNestJs } from '@nestjs/schedule';
import { HealthModule } from './health/health.module';
import {
  makeCounterProvider,
  makeHistogramProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';
import { HttpLoggingInterceptor } from './common/interceptor/http-logging.interceptor';
import { WebhookModule } from './webhook/webhook.module';
import { DialogflowModule } from './dialogflow/dialogflow.module';
import { DocumentaryProcedureModule } from './documentary-procedure/documentary-procedure.module';
import { SessionsModule } from './sessions/sessions.module';
import { AttachmentModule } from '@common/services/attachment/attachment.module';
import { DocumentModule } from '@common/services/document/document.module';
import { StatusDocumentModule } from '@common/services/status-document/status-document.module';
import { StudentModule } from '@common/services/student/student.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrometheusModule.register(),
    ScheduleModuleNestJs.forRoot(),
    HealthModule,
    WebhookModule,
    DialogflowModule,
    DocumentaryProcedureModule,
    SessionsModule,
    StudentModule,
    DocumentModule,
    StatusDocumentModule,
    AttachmentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    makeHistogramProvider({
      name: 'http_request_duration_ms',
      help: 'Duration of HTTP requests in ms',
      labelNames: ['route', 'method', 'code'],
      // buckets for response time from 0.1ms to 500ms
      buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
    }),
    makeCounterProvider({
      name: 'http_request_total',
      help: 'Total of HTTP request',
      labelNames: ['route', 'method', 'code'],
    }),
    makeHistogramProvider({
      name: 'http_response_size_bytes',
      help: 'Size in bytes of response',
      labelNames: ['route', 'method', 'code'],
      buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
    }),
    makeHistogramProvider({
      name: 'http_request_size_bytes',
      help: 'Size in bytes of request',
      labelNames: ['route', 'method', 'code'],
      buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
    }),
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
