import { Role } from '../prisma/generated-client/client';

export type UserRoleEnum = Role;
export type UserEntity = {
  id?: number;
  name: string;
  email: string;
  password: string;
  divisi: string;
  position: string;
  role: UserRoleEnum;
};

export const userSelects = {
    id: true,
    name: true,
    email: true,
    password: true,
    divisi: true,
    position: true,
    role: true,
    token: true,
};
