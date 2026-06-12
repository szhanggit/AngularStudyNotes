export class UpdateAdminUser {
  userId : number;
  createdBy : string;
  appTenants : UpdateAdminUserAppTenant[] = []
}

export class UpdateAdminUserAppTenant{
  uatId : number;
  userRoleId : number;
  tenantId : number;
  appId : number;
  adminRoleId : number;
  expirationDate? : Date;
  activeDate : Date;
  isAssigned : boolean;
}
