import { User } from '@prisma/client';

export class UserResponse implements Partial<User> {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly avatar: string;
  public readonly isConfirmed: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.avatar = user.avatar;
    this.isConfirmed = user.isConfirmed;
  }
}
