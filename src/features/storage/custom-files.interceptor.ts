import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';

export function CustomFilesInterceptor(fieldName: string): Type<NestInterceptor> {
  @Injectable()
  class MixinFilesInterceptor implements NestInterceptor {
    private fileInterceptor: NestInterceptor;
    private maxCount: number;

    constructor(private readonly configService: ConfigService) {
      this.fileInterceptor = new (FilesInterceptor(fieldName))();
      this.maxCount = this.configService.get<number>('MAX_FILES_ALLOWED', 3);
    }

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
      await this.fileInterceptor.intercept(context, next);

      const request = context.switchToHttp().getRequest();
      const files = request.files[fieldName];
      if (files && files.length > this.maxCount)
        throw new BadRequestException(`Upload limit exceeded: ${this.maxCount} ${fieldName} allowed`);

      return next.handle();
    }
  }

  const interceptor = mixin(MixinFilesInterceptor);
  return interceptor;
}
