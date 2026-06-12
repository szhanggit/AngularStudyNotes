import { UserRoleDto } from './../../user-role/Dto/user-role-dto.model';

export class GetUserRoleListResponse {
  userRoles : Array<UserRoleDto>;
  totalCount : number;
}
