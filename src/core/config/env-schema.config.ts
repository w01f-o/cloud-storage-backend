import { z } from 'zod';

export const envConfigSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().transform(val => {
    const parsed = Number(val);
    if (Number.isNaN(parsed)) throw new Error('PORT must be a number');

    return parsed;
  }),
  JWT_SECRET: z.string(),

  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().transform(val => {
    const parsed = Number(val);
    if (Number.isNaN(parsed)) throw new Error('SMTP_PORT must be a number');

    return parsed;
  }),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),

  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  DATABASE_URL: z.string(),
  SERVER_URL: z.string(),
  CLIENT_URL: z.string(),

  APP_NAME: z.string(),
});
