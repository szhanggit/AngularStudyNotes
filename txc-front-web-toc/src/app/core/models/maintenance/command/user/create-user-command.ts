import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { RefAppPermissionDto } from "../../dto/application/ref-app-permission-dto";
import { RefAppTenantAssigningRoleDto } from "../../dto/application/ref-assigning-app-tenant-dto";

export class CreateUserRoleReq {
    roleId: number;
    roleActive: Date;
    roleExpiration: Date;
}

export class CreateUserAppTenant {
    tenantId: number;
    appId: number;
    tenantAppActive: Date;
    tenantAppExpiration: Date;
    roles: CreateUserRoleReq[] = [];

    // needed for page behaviors
    specifyExpiration: boolean;
    rolesRef: RefAppTenantAssigningRoleDto[] = [];
    filteredRolesRef: RefAppTenantAssigningRoleDto[] = [];
    resourcesFilterRef: RefAppPermissionDto[] = [];

    smartSearchValue: string = '';

    // date range config
    selectedDateRange: string = '';
    hoveredDate: NgbDate | null = null;
    fromDate!: NgbDate;
    toDate: NgbDate | null = null;
}

export class CreateUserCommand {
    userName: string;
    isAdUser: boolean;
    createdBy: string;
    applicationTenants: CreateUserAppTenant[] = [];
}
