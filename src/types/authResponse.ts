import { UserDto } from 'src/auth/dto/user.dto';

export interface AuthResponse {
  user: UserDto;
  tokens: {
    refresh: string;
    access: string;
  };
}
