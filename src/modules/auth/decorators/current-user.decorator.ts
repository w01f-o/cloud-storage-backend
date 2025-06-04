import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { InvalidAccessTokenException } from '../exceptions/InvalidAccessToken.exception';

type RequestWithUser = FastifyRequest & { user: User };

export const CurrentUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext): User | User[keyof User] => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user) {
      throw new InvalidAccessTokenException();
    }

    return data ? user[data] : user;
  }
);
