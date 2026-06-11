export class GetAdminUserQryRes {
  adminUsers: AdminUserQryDto[] = [];
  totalCount: number;
}

export class AdminUserQryDto {
  userId: number;
  name: string;
  userName: string;
  email: string;
  application: string;
  tenant: string;
  userStatus: number;
  roleName: string;
  roleDescription:string;
  roleActive?: Date;
  roleExpired?: Date;
  createdDate?: Date;
  roleStatus: number;
  createdBy: string
}
