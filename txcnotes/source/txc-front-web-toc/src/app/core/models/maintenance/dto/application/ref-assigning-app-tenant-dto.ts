import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { RefResourceResOpsDto } from "../role/ref-app-tnt-role-res-ops-dto";

export class RefAppTenantAssigningRoleDto {
    userRoleId: number;
    roleId: number;
    roleName: string;
    roleActive: Date;
    roleExpiration: Date;
    roleDescription: string;
    roleStatus: number;
    isAssigned: boolean;

    // needed for page behaviors
    setCustomExpiry: boolean;
    resources: RefResourceResOpsDto[];
    // date range config
    selectedDateRange: string = '';
    hoveredDate: NgbDate | null = null;
    fromDate!: NgbDate;
    toDate: NgbDate | null = null;
}

export class RefAssigningAppTenantRoleDto {
    uatId: number;
    appId: number;
    tenantId: number;
    tenantAppActive: Date;
    tenantAppExpiration: Date;
    tenantAppStatus: number;
    roles: RefAppTenantAssigningRoleDto[] = [];
}
