import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

export class CreateAdminCmd {
  userName!: string;
  isAdUser!: boolean;
  createdBy: string;
  applicationTenants: CreateAdminUserAppTenant[] = [];
}
export class CreateAdminUserAppTenant {
  tenantId! : number;
  appId! : number;
  adminRoleId! : number;
  expirationDate! : Date;
  activeDate! : Date;

  //config for date range
  specifyExpiration!: boolean;
  selectedDateRange: string = '';
  hoveredDate: NgbDate | null = null;
  fromDate!: NgbDate;
  toDate: NgbDate | null = null;
}
