export class UserDto {
  public id: string;
  public email: string;
  public name: string;
  public image: string;
  public isActivated: boolean;

  public constructor(
    id: string,
    email: string,
    name: string,
    image: string,
    isActivated: boolean,
  ) {
    this.id = id;
    this.email = email;
    this.isActivated = isActivated;
    this.name = name;
    this.image = image;
  }
}
