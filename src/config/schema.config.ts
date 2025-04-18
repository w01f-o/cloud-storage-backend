import * as Joi from 'joi';

export const configSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().required(),
  SERVER_DOMAIN: Joi.string().required(),
  CLIENT_DOMAIN: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().required(),
  SMTP_USER: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
  APP_NAME: Joi.string().required(),
  SERVER_URL: Joi.string().required(),
  CLIENT_URL: Joi.string().required(),
});
