// import { CustomFilesInterceptor } from '../../src/features/storage';
import { CustomFilesInterceptor } from '@/features/storage';
import { ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

describe(`${CustomFilesInterceptor.name} test case:`, () => {
  let interceptor: any;
  let mockConfigService: ConfigService;
  const fieldName = 'files';

  const mockCallHandler = (): CallHandler => ({
    handle: jest.fn(() => of('test-response')),
  });

  const createMockExecutionContext = (files: any[] = []) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ files }),
      }),
    }) as unknown as ExecutionContext;

  const mock_2_files = createMockExecutionContext([{}, {}]);
  const mock_4_files = createMockExecutionContext([{}, {}, {}, {}]);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(3),
          },
        },
      ],
    }).compile();

    mockConfigService = module.get<ConfigService>(ConfigService);
    const CustomInterceptor = CustomFilesInterceptor(fieldName);
    interceptor = new CustomInterceptor(mockConfigService);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should allow files within the limit', async () => {
    interceptor.intercept(mock_2_files, mockCallHandler()).subscribe(() => {
      expect(mockCallHandler().handle).toHaveBeenCalled();
    });
  });

  it('should throw BadRequestException if file limit is exceeded', async () => {
    expect(() => interceptor.intercept(mock_4_files, mockCallHandler())).toThrow(BadRequestException);
  });
});
