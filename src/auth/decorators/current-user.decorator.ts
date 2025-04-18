import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { InvalidAccessTokenException } from '../exceptions/InvalidAccessToken.exception';

export const CurrentUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext): User | User[keyof User] => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) {
      throw new InvalidAccessTokenException();
    }

    return data ? user[data] : user;
  }
);
