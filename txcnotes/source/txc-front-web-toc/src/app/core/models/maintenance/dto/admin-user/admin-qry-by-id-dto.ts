import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

export class AdminQryByIdDto {
  userId: number;
  userName: string;
  isAdUser: boolean;
  appTenants: AdminUserAppTenantQryByIdDto[] = [];
}

export class AdminUserAppTenantQryByIdDto {
  uatId: number;
  userRoleId: number;
  tenantId: number;
  appId: number;
  adminRoleId: number;
  tenantAppExpiration?: Date;
  tenantAppActive?: Date;
  roleActive?: Date;
  roleExpiration?: Date;
  isAssigned: boolean;
  tenantAppStatus: number;
  userRoleStatus: number;

  tenantName: string;
  appName: string;

  //config for date range
  specifyExpiration!: boolean;
  selectedDateRange: string = '';
  hoveredDate: NgbDate | null = null;
  fromDate!: NgbDate;
  toDate: NgbDate | null = null;
}
