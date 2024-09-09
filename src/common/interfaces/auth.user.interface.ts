import { Role } from '../enums/roles.enum';

export interface IAuthUser {
  sub: string;
  firstName: string;
  email: string;
  role: Role;
}
