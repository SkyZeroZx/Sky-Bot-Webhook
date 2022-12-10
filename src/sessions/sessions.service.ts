import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { REDIS_CACHE_DURATION } from '@common/constants/config';

//const sessionIds = new Map();
@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);
  private readonly REDIS_CACHE_DURATION: number;
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {
    this.REDIS_CACHE_DURATION = this.configService.get<number>(REDIS_CACHE_DURATION);
  }

  async setSession(sessionId: string, sessionUser: string) {
    return await this.redis.set(sessionId, sessionUser, 'EX', this.REDIS_CACHE_DURATION);
  }

  async getSession(sessionId: string) {
    return await this.redis.get(sessionId);
  }

  async setSessionAndUser(senderId: string) {
    try {
      if (!(await this.getSession(senderId))) {
        await this.setSession(senderId, uuidv4());
      }
    } catch (error) {
      this.logger.error('Sucedio un error en register session');
      this.logger.error(error);
      throw error;
    }
  }

  // async setSessionAndUser(senderId) {
  //   try {
  //     if (!sessionIds.has(senderId)) {
  //       sessionIds.set(senderId, uuidv4());
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async getSession(sessionId: string) {
  //   return sessionIds.get(sessionId);
  // }
}
