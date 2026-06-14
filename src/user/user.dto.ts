import { Pagination } from '../common/dto/pagination.dto';
import { UserEntity, UserRoleEnum } from './user.entity';

export class UserRequestDTO {
  name!: string;
  email!: string;
  password!: string;
  divisi!: string;
  position!: string;
  role!: UserRoleEnum;
}

export class UserResponseDTO {
  id: number;
  name: string;
  email: string;
  divisi: string;
  position: string;
  role: UserRoleEnum;

  constructor(user: UserEntity) {
    this.id = user.id!;
    this.name = user.name;
    this.email = user.email;
    this.divisi = user.divisi;
    this.position = user.position;
    this.role = user.role;
  }

  static fromEntity(user: UserEntity): UserResponseDTO {
    return new UserResponseDTO(user);
  }

  static fromEntities(users: UserEntity[]): UserResponseDTO[] {
    return users.map(UserResponseDTO.fromEntity);
  }
}

export class UserAuthDTO extends UserResponseDTO {
  password!: string;

  constructor(user: UserEntity) {
    super(user);
    this.password = user.password;
  }

  static fromEntity(user: UserEntity): UserAuthDTO {
    return new UserAuthDTO(user);
  }
}

export class UserResponseDTOwithPagination {
  data: UserResponseDTO[];
  pagination: Pagination;

  constructor(data: UserEntity[], pagination: Pagination) {
    this.data = data.map(UserResponseDTO.fromEntity);
    this.pagination = pagination;
  }

  static set(data: UserEntity[], pagination: Pagination) {
    return new UserResponseDTOwithPagination(data, pagination);
  }
}
