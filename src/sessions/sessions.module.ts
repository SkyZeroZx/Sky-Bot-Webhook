import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD } from '@common/constants/config';
import { SessionsService } from './sessions.service';

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        readyLog: true,
        errorLog: true,
        config: {
          host: config.get<string>(REDIS_HOST),
          port: parseInt(config.get<string>(REDIS_PORT), 10),
          username: config.get<string>(REDIS_USERNAME),
          password: config.get<string>(REDIS_PASSWORD),
        },
      }),
    }),
  ],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
