import { User } from '@prisma/client';

export class AuthResponse {
  public readonly user: Pick<User, 'id' | 'name' | 'email' | 'isActivated'>;
  public readonly accessToken: string;

  constructor({ user, accessToken }: { user: User; accessToken: string }) {
    this.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      isActivated: user.isActivated,
    };
    this.accessToken = accessToken;
  }
}
