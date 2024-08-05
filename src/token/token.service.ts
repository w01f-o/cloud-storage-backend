import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  public constructor(private readonly jwtService: JwtService) {}

  private async generateAccessToken(payload: any): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_ACCESS_SECRET,
    });
  }

  private async generateRefreshToken(payload: any): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_REFRESH_SECRET,
    });
  }

  public async generateTokens(
    payload: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }
}
