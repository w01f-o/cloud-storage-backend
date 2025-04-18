import { ConfigService as NestConfigService } from '@nestjs/config';

declare module '@nestjs/config' {
  interface Config {
    NODE_ENV: 'development' | 'production';
    PORT: number;
    JWT_SECRET: string;
    SERVER_DOMAIN: string;
    CLIENT_DOMAIN: string;
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USER: string;
    SMTP_PASSWORD: string;
    DATABASE_URL: string;
    APP_NAME: string;
    SERVER_URL: string;
    CLIENT_URL: string;
  }

  interface ConfigService extends Omit<NestConfigService, 'get'> {
    get<T extends keyof Config>(key: T): Config[T];
  }
}
