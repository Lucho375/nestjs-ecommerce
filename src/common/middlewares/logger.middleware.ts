import { Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(LoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl } = req;

    this.logger.log(`Incoming Request: ${method} ${originalUrl}`);

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.log(
        `Outgoing Response: ${method} ${originalUrl} ${res.statusCode} - ${duration}ms`,
      );
    });
    next();
  }
}
