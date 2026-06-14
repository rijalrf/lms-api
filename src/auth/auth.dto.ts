import { UserResponseDTO } from '../user/user.dto';

export class LoginRequestDTO {
  email!: string;
  password!: string;
}

export class LoginResponseDTO {
  token: string;
  data: UserResponseDTO;

  constructor(user: UserResponseDTO, token: string) {
    this.data = user;
    this.token = token;
  }

  static set(user: UserResponseDTO, token: string) {
    return new LoginResponseDTO(user, token);
  }
}
