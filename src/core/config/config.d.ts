import { ConfigService as NestConfigService } from '@nestjs/config';

declare module '@nestjs/config' {
  interface Config {
    NODE_ENV: 'development' | 'production';
    PORT: number;

    JWT_SECRET: string;

    DATABASE_URL: string;
    SERVER_URL: string;
    CLIENT_URL: string;

    APP_NAME: string;
  }

  interface ConfigService extends Omit<NestConfigService, 'get'> {
    get<T extends keyof Config>(key: T): Config[T];
  }
}
