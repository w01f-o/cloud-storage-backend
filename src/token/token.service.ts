import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TokenService {
  public constructor(
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
  ) {}

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

  public async saveToken(userId: string, refreshToken: string) {
    const tokenData = await this.databaseService.token.findFirst({
      where: { userId },
    });

    if (tokenData) {
      await this.databaseService.token.update({
        where: { id: tokenData.id },
        data: { refreshToken },
      });
    } else {
      await this.databaseService.token.create({
        data: { userId, refreshToken },
      });
    }

    return tokenData;
  }

  public async removeToken(refreshToken: string) {
    await this.databaseService.token.deleteMany({
      where: { refreshToken },
    });
  }

  public async findToken(refreshToken: string) {
    return await this.databaseService.token.findFirst({
      where: { refreshToken },
    });
  }

  public async validateAccesToken(token: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_ACCESS_SECRET,
    });
  }

  public async validateRefreshToken(token: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
  }

  public async getTokenByUser(userId: string) {
    return await this.databaseService.token.findFirst({
      where: { userId },
    });
  }
}
