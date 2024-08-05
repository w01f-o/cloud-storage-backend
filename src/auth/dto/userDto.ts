export class UserDto {
  public id: string;
  public email: string;
  public isActivated: boolean;

  public constructor(id: string, email: string, isActivated: boolean) {
    this.id = id;
    this.email = email;
    this.isActivated = isActivated;
  }
}
