import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from 'src/token/token.service';
import { CustomRequest } from 'src/types/request.type';

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
      throw new UnauthorizedException();
    }

    try {
      const userData = await this.tokenService.validateAccesToken(
        token as string,
      );

      if (!userData) {
        throw new UnauthorizedException();
      }

      // if (!userData.isActivated) {
      //   throw new UnauthorizedException();
      // }

      request.user = userData;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
