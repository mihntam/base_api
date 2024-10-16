import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './features/user/user.module';
import { LoggerModule } from './features/logger/logger.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, cache: true, expandVariables: true }), UserModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
