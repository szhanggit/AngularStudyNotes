import { LoginUserRolesResponse } from './login-user-roles-response.model';
import { LoginUserTenantsResponse } from "./login-user-tenants-response";

export class LoginResponse {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    token?: string;
    tenants : LoginUserTenantsResponse[] = [];
    roles : LoginUserRolesResponse[] = [];
}
