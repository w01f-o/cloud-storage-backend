import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { CustomRequest } from 'src/types/request.type';

@Injectable()
export class FileAccessMiddleware implements NestMiddleware {
  async use(req: CustomRequest, res: Response, next: NextFunction) {
    // const { user } = req;

    next();
  }
}
