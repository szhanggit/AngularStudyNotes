export class GetAllSuperAdminListQryRes {
  superAdminUsers: SuperAdminListQryDto[] = [];
  totalCount: number;
}

export class SuperAdminListQryDto {
  userId: number;
  name: string;
  userName: string;
  email: string;
  userStatus: number;
  roleName: string;
  roleDescription:string;
  roleActive?: Date;
  roleExpired?: Date;
  createdDate?: Date;
  roleStatus: number;
  createdBy: string
}
