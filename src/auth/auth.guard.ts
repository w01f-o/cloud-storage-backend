import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from 'src/token/token.service';
import { CustomRequest } from 'src/types/request.type';
import { ErrorsEnum } from '../types/errors.type';
import { User } from '@prisma/client';
import { TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: CustomRequest = context.switchToHttp().getRequest();
    const token =
      request.path.split('/')[2] !== 'file'
        ? this.extractTokenFromHeader(request)
        : request.query.token;

    if (!token) {
      throw new UnauthorizedException({
        message: 'No access token',
        type: ErrorsEnum.NO_ACCESS_TOKEN,
      });
    }
    let userData: User;

    try {
      userData = await this.tokenService.validateAccesToken(token as string);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException({
          message: 'Expired access token',
          type: ErrorsEnum.EXPIRED_ACCESS_TOKEN,
        });
      }
    }

    if (!userData) {
      throw new UnauthorizedException({
        message: 'Wrong access token',
        type: ErrorsEnum.WRONG_ACCESS_TOKEN,
      });
    }

    // if (!userData.isActivated) {
    //   throw new UnauthorizedException({
    //     message: 'User not activated',
    //     type: ErrorsEnum.USER_NOT_ACTIVATED,
    //   });
    // }

    request.user = userData;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
