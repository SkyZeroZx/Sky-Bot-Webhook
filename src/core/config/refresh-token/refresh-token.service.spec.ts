import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenService } from './refresh-token.service';

// instanceof auth0 method of required mock for unit testing
const mockInstance = {
  getAccessToken: jest.fn().mockReturnThis(),
};

// Mock the auth0 library
jest.mock('auth0', () => {
  return { ManagementClient: jest.fn(() => mockInstance) };
});

describe('RefreshTokenService', () => {
  let refreshTokenService: RefreshTokenService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.template',
        }),
      ],
      providers: [RefreshTokenService, ConfigService],
    }).compile();
    jest.useFakeTimers();

    refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(refreshTokenService).toBeDefined();
  });

  it('should initialize onModuleInit', async () => {
    //@ts-ignore
    const spyGetAccessToken = jest.spyOn(refreshTokenService, 'getAccessToken');
    //@ts-ignore
    const spyRefreshTokenAuth0 = jest.spyOn(refreshTokenService, 'refreshTokenAuth0');
    await refreshTokenService.onModuleInit();
    expect(spyGetAccessToken).toBeCalled();
    expect(spyRefreshTokenAuth0).toBeCalled();
  });

  it('should inicialized refreshTokenAuth0 and call getAccessToken', async () => {
    const initTime: number = 60000;
    const numberOfCall = 3;
    //@ts-ignore
    const spyGetAccessToken = jest.spyOn(refreshTokenService, 'getAccessToken');
    //@ts-ignore
    refreshTokenService.refreshTokenAuth0();
    jest.advanceTimersByTime(initTime * numberOfCall);
    expect(spyGetAccessToken).toBeCalledTimes(numberOfCall);
  });

  it('should getAccessToken call management auth0 getAccessToken', async () => {
    const mockToken = 'AwesomeTokenService';
    const spyGetAccessTokensAuth0 = jest
      .spyOn(mockInstance, 'getAccessToken')
      .mockResolvedValueOnce(mockToken);
    //@ts-ignore
    await refreshTokenService.getAccessToken();
    expect(spyGetAccessTokensAuth0).toBeCalled();
    expect(refreshTokenService.tokenAuth0).toEqual(mockToken);
  });

  it('should getAccessToken throw exception in auth0', async () => {
    const spyGetAccessTokensAuth0 = jest
      .spyOn(mockInstance, 'getAccessToken')
      .mockRejectedValueOnce(new Error());
    //@ts-ignore
    await refreshTokenService.getAccessToken();
    expect(spyGetAccessTokensAuth0).toBeCalled();
    expect(refreshTokenService.tokenAuth0).toEqual('');
  });
});
