import { getRedisToken } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SessionsServiceMock } from './sessions.mock.spec';
import { SessionsService } from './sessions.service';

describe('SessionsService', () => {
  let sessionsService: SessionsService;
  let redisServiceMock: SessionsServiceMock = new SessionsServiceMock();
  let configService: ConfigService;
  const sessionId = '123456789';
  const sessionUser = '987654321';
  const REDIS_CACHE_DURATION = '86400';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.template',
        }),
      ],
      providers: [
        SessionsService,
        { provide: getRedisToken('default'), useValue: redisServiceMock },
        ConfigService,
      ],
    }).compile();

    sessionsService = module.get<SessionsService>(SessionsService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(sessionsService).toBeDefined();
  });

  it('setSession should be called set method of redis service', async () => {
    const spySet = jest.spyOn(redisServiceMock, 'set').mockResolvedValueOnce('OK');
    jest.spyOn(configService, 'get').mockImplementationOnce(() => {
      return REDIS_CACHE_DURATION;
    });

    await sessionsService.setSession(sessionId, sessionUser);

    expect(spySet).toBeCalledWith(sessionId, sessionUser, 'EX', REDIS_CACHE_DURATION);
  });

  it('getSession should be called get method of redis service', async () => {
    const spyGet = jest.spyOn(redisServiceMock, 'get').mockResolvedValue(sessionUser);
    const sessionOfRedis = await sessionsService.getSession(sessionId);
    expect(sessionOfRedis).toBeDefined();
    expect(spyGet).toBeCalled();
    expect(sessionOfRedis).toEqual(sessionUser);
  });

  it('setSessionAndUser create session in case user not inicialized preview session', async () => {
    const spyGet = jest
      .spyOn(redisServiceMock, 'get')
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(sessionUser);
    const spySet = jest.spyOn(redisServiceMock, 'set').mockResolvedValueOnce('OK');
    const getSession = await sessionsService.setSessionAndUser(sessionId);

    expect(spyGet).toHaveBeenNthCalledWith(1, sessionId);
    expect(spyGet).toHaveBeenNthCalledWith(2, sessionId);
    expect(spySet).toBeCalled();
    expect(getSession).toEqual(sessionUser);
  });

  it('setSessionAndUser not set session in case user inicialized preview session', async () => {
    const spyGet = jest.spyOn(redisServiceMock, 'get').mockResolvedValue(sessionUser);
    const spySet = jest.spyOn(redisServiceMock, 'set');
    await sessionsService.setSessionAndUser(sessionId);

    expect(spyGet).toHaveBeenNthCalledWith(1, sessionId);
    expect(spyGet).toHaveBeenNthCalledWith(2, sessionId);
    expect(spySet).not.toBeCalled();
  });

  it('setSessionAndUser throw error get session from redis', async () => {
    const spyGet = jest.spyOn(redisServiceMock, 'get').mockRejectedValueOnce(new Error());
    await expect(sessionsService.setSessionAndUser(sessionId)).rejects.toThrowError(
      new Error('Sucedio un error en setSessionAndUser'),
    );
    expect(spyGet).toBeCalled();
  });
});
