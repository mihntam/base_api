import { LoggerService as BaseLoggerService, Injectable } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';
import * as Transport from 'winston-transport';

@Injectable()
export class LoggerService implements BaseLoggerService {
  private readonly _logger: Logger;

  constructor() {
    const logLevel = 'error';
    const logTransports: Transport[] = [];

    logTransports.push(
      new transports.Console({
        handleExceptions: true,
        format: format.combine(
          // format.cli(),
          format.colorize({ all: true }),
          format.printf(({ timestamp, level, message, context, trace }) => {
            return `[${timestamp}] ${level} [${context}] ${message}${trace ? `\n${trace}` : ''}`;
          }),
        ),
      }),
    );

    // logTransports.push(
    //   new transports.File({
    //     filename: 'logs/application.log',
    //     level: logLevel,
    //     handleExceptions: true,
    //     format: format.combine(
    //       format.splat(),
    //     ),
    //   }),
    // );

    this._logger = createLogger({
      exitOnError: false,
      level: logLevel,
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS A' }),
        format.errors({ stack: true }),
        format.json(),
      ),
      transports: logTransports,
    });
  }

  log(message: string, context?: string): void {
    this._logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string): void {
    this._logger.error(message, { context, trace });
  }

  warn(message: string, context?: string): void {
    this._logger.warn(message, { context });
  }

  debug?(message: string, context?: string): void {
    this._logger.debug(message, { context });
  }

  verbose?(message: string, context?: string): void {
    this._logger.debug(message, { context });
  }
}
