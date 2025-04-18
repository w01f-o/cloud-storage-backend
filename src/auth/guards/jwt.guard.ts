import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { InvalidAccessTokenException } from '../exceptions/InvalidAccessToken.exception';
import { NotConfirmedAccountException } from '../exceptions/NotConfirmedAccount.exception';

export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = User>(
    err: unknown,
    user: User,
    info: unknown,
    context: ExecutionContext,
    status?: HttpStatus
  ): TUser {
    if (info instanceof Error && info.message === 'No auth token') {
      throw new InvalidAccessTokenException();
    }

    if (info instanceof JsonWebTokenError) {
      throw new InvalidAccessTokenException();
    }

    if (typeof user?.isActivated === 'boolean' && !user.isActivated) {
      throw new NotConfirmedAccountException();
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
