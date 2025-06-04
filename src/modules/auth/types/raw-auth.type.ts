import { User } from '@prisma/client';
import { JwtTokens } from './tokens.type';

export interface RawAuthData extends JwtTokens {
  user: User;
}
