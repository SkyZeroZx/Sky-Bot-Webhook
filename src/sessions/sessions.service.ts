import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { REDIS_CACHE_DURATION } from '@common/constants/config';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);
  private readonly REDIS_CACHE_DURATION: string;
  constructor(
    @InjectRedis('default') private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {
    this.REDIS_CACHE_DURATION = this.configService.get<string>(REDIS_CACHE_DURATION);
  }

  async setSession(sessionId: string, sessionUser: string) {
    return await this.redis.set(sessionId, sessionUser, 'EX', this.REDIS_CACHE_DURATION);
  }

  async getSession(sessionId: string) {
    return await this.redis.get(sessionId);
  }

  async setSessionAndUser(sessionId: string) {
    try {
      const session = await this.getSession(sessionId);
      if (!session) {
        await this.setSession(sessionId, uuidv4());
      }
      return await this.getSession(sessionId);
    } catch (error) {
      this.logger.error({ message: 'Sucedio un error en register session', error });
      throw new Error('Sucedio un error en setSessionAndUser');
    }
  }
}
