export enum ErrorsEnum {
  MAILER_ERROR = 'mailer_error',
  USER_WITH_SUCH_EMAIL_ALREADY_EXISTS = 'user_with_such_email_already_exists',
  USER_WITH_SUCH_EMAIL_NOT_FOUND = 'user_with_such_email_not_found',
  WRONG_EMAIL_OR_PASSWORD = 'wrong_email_or_password',
  WRONG_ACTIVATION_CODE = 'wrong_code',
  USER_NOT_ACTIVATED = 'user_not_activated',
  NO_REFRESH_TOKEN = 'no_refresh_token',
  NO_ACCESS_TOKEN = 'no_access_token',
  WRONG_REFRESH_TOKEN = 'wrong_refresh_token',
  WRONG_ACCESS_TOKEN = 'wrong_access_token',
  EXPIRED_REFRESH_TOKEN = 'expired_refresh_token',
  EXPIRED_ACCESS_TOKEN = 'expired_access_token',
}
