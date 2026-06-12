import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { RefAppPermissionDto } from "../application/ref-app-permission-dto";
import { RefAppTenantAssigningRoleDto } from "../application/ref-assigning-app-tenant-dto";
import { RefResourceResOpsDto } from "../role/ref-app-tnt-role-res-ops-dto";

export class UserRolesQryByIdDto {
    userRoleId: number;
    roleId: number;
    roleName: string;
    roleDescription: string;
    roleActive: Date;
    roleExpiration: Date;
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

export class UserAppTenantQryByIdDto {
    uatId: number;
    appId: number;
    tenantId: number;
    tenantAppActive: Date;
    tenantAppExpiration: Date;
    tenantAppStatus: number;
    roles: UserRolesQryByIdDto[] = [];

    // needed for page behaviors
    specifyExpiration: boolean;
    rolesRef: RefAppTenantAssigningRoleDto[] = [];
    filteredRolesRef: RefAppTenantAssigningRoleDto[] = [];
    resourcesFilterRef: RefAppPermissionDto[] = [];

    tenantName: string;
    appName: string;

    smartSearchValue: string;

    // date range config
    selectedDateRange: string = '';
    hoveredDate: NgbDate | null = null;
    fromDate!: NgbDate;
    toDate: NgbDate | null = null;
}

export class UserQryByIdDto {
    userId: number;
    userName: string;
    isAdUser: boolean;
    appTenants: UserAppTenantQryByIdDto[] = [];
}
