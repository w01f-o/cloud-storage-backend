import { DatabaseService } from '@/database/database.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';
import { InvalidAccessTokenException } from './exceptions/InvalidAccessToken.exception';
import { JwtPayload } from './types/tokens.type';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly database: DatabaseService
  ) {
    const extractJwtFromCookie: () => JwtFromRequestFunction =
      () => (req: FastifyRequest) =>
        req.cookies.accessToken ?? null;

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractJwtFromCookie(),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  public async validate({ id }: JwtPayload): Promise<User | null> {
    const user = await this.database.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new InvalidAccessTokenException();
    }

    return user;
  }
}
