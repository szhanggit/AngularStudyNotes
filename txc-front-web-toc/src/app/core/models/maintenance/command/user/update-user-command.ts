import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

export class UpdUserRoleReq {
    userRoleId: number;
    roleId: number;
    roleActive: Date;
    roleExpiration: Date;
    roleStatus: number;
    isAssigned: boolean;

    // date range config
    selectedDateRange: string = '';
    hoveredDate: NgbDate | null = null;
    fromDate!: NgbDate;
    toDate: NgbDate | null = null;
}

export class UpdUserAppTenant {
    uatId: number;
    appId: number;
    tenantId: number;
    tenantAppActive: Date;
    tenantAppExpiration: Date;
    tenantAppStatus: number;
    roles: UpdUserRoleReq[] = [];

    isRemove: boolean; // remove
}

export class UpdateUserCommand {
    userId: number;
    createdBy: string;
    appTenants: UpdUserAppTenant[] = [];
}