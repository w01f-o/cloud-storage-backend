import { User } from '@prisma/client';

export class AuthResponse {
  public readonly user: Pick<User, 'id' | 'name' | 'email'>;
  public readonly accessToken: string;

  constructor({ user, accessToken }: { user: User; accessToken: string }) {
    this.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    this.accessToken = accessToken;
  }
}
