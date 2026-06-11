import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { userType } from 'src/app/core/models/constants/user-type';
import { UpdateRoleCommand } from 'src/app/core/models/maintenance/command/role/update-role-command';
import { RefApplicationDto } from 'src/app/core/models/maintenance/dto/application/ref-application-dto';
import { RoleQryByIdDto, RoleResourceQryByIdDto } from 'src/app/core/models/maintenance/dto/role/role-query-by-id-dto';
import { RefTenantDto } from 'src/app/core/models/maintenance/dto/tenant/ref-tenant-dto';
import { UserAuthClaim } from 'src/app/core/models/security/mod-res-op.model';
import { RefApplicationService } from 'src/app/core/service/maintenance/ref-application.service';
import { RefTenantService } from 'src/app/core/service/maintenance/ref-tenant.service';
import { RoleService } from 'src/app/core/service/maintenance/role/role.service';
import { AuthService } from 'src/app/core/service/security/auth.service';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];

  roleIdQueryParam: number;

  // dropdown
  applications!: RefApplicationDto[];
  tenants!: RefTenantDto[];

  // dto
  roleToEdit = <RoleQryByIdDto><unknown> {
    roleId: 0,
    status: false,
    tenantId: 0,
    appId: 0,
    resources: []
  };

  // request
  editRoleRequest = <UpdateRoleCommand><unknown> {
    roleId: 0,
    isEnabled: false,
    tenantId: 0,
    appId: 0,
    removeOperationIds: [],
    newOperationIds: []
  }

  //temporary fixed to scope out data depend into user role between super admin, admin and bu manager
  exclude_operation : number[] = [];
  tenant_mngmt_ops : number[] = [Number(environment.add_tenant_op_id), Number(environment.upd_tenant_op_id), Number(environment.view_tenant_op_id)];
  role_mngmt_ops : number[] = [Number(environment.add_role_op_id), Number(environment.upd_role_op_id), Number(environment.view_role_op_id)];
  admin_mngmt_ops: number[] = [Number(environment.add_admin_op_id), Number(environment.upd_admin_op_id), Number(environment.view_admin_op_id)];
  userClaim = new UserAuthClaim();
  enabledUpdate : boolean;

  constructor(private readonly activatedRoute: ActivatedRoute
    , private readonly roleSvc: RoleService
    , private readonly router: Router
    , private readonly refTenantSvc: RefTenantService
    , private readonly refApplicationSvc: RefApplicationService
    , private readonly authSvc: AuthService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.roleIdQueryParam = params.id;
    });
    this.authSvc.userAuthClaim.subscribe(data =>
      {
        if(data == null || data == undefined){
          this.router.navigate(['401']);
        }
        this.userClaim = data;
        this.fillExcludeData();
        this.subscribeToRole();
        this.checkAllowedOperation();
      });

  }

  private subscribeToRole() {
    this.roleSvc.getById(this.roleIdQueryParam).subscribe({
      next: (res) => this.setRole(res.data as RoleQryByIdDto)
    });
  }

  private setRole(data: RoleQryByIdDto) {

    this.roleToEdit = data;
    this.roleToEdit.resources = this.excludeSomeData(this.roleToEdit.resources);
    // set operation existing field for storing remove/new operation Ids
    this.roleToEdit.resources.forEach(r => {
      r.operations.forEach(o => {
        if(o.isSelected) {
          o.existing = true;
        }else{
          o.existing = false;
        }
      })
    });

    this.subscribeToTenantAsRef();
    this.subscribeToApplicationAsRef();

  }

  private subscribeToTenantAsRef() {
    this.refTenantSvc.get().subscribe({
      next: (res) => {
        this.tenants = res.data as RefTenantDto[];
        this.roleToEdit.tenant = this.tenants.find(x => x.tenantId == this.roleToEdit.tenantId).tenantName;
      }
    });
  }

  private subscribeToApplicationAsRef() {
    this.refApplicationSvc.get().subscribe({
      next: (res) => {
        this.applications = res.data as RefApplicationDto[];
        this.roleToEdit.application = this.applications.find(x => x.appId == this.roleToEdit.appId).appName;
      }
    });
  }

  editRole() {

    this.editRoleRequest.roleId = this.roleToEdit.roleId;
    this.editRoleRequest.roleName = this.roleToEdit.roleName;
    this.editRoleRequest.description = this.roleToEdit.description;
    this.editRoleRequest.isEnabled = this.roleToEdit.status;
    this.editRoleRequest.tenantId = this.roleToEdit.tenantId;
    this.editRoleRequest.appId = this.roleToEdit.appId;

    this.roleToEdit.resources.forEach(r => {
      r.operations.forEach(o => {
        if(o.existing && !o.isSelected) {
          this.editRoleRequest.removeOperationIds.push(o.operationId);
        }
        if(!o.existing && o.isSelected) {
          this.editRoleRequest.newOperationIds.push(o.operationId);
        }
      })
    });

    const subscriber = this.roleSvc.put(this.editRoleRequest)
      .subscribe({
        next: (res) => {
          this.router.navigateByUrl('/maintenance/role-management', { state: { editRole: true } });
        }, error: (error) => {
          if ((error.error) && (error.error.message)) {
          }
        }, complete: () => {
          subscriber.unsubscribe();
        }
      });
  }

  private fillExcludeData(){
    let currentUserType : string = this.userClaim.user.userType;
    if(currentUserType == userType.superAdmin){
      this.exclude_operation = this.tenant_mngmt_ops;
    }else if (currentUserType == userType.buAdmin){
      this.exclude_operation = this.tenant_mngmt_ops.concat(this.role_mngmt_ops).concat(this.admin_mngmt_ops);
    }
  }

  private excludeSomeData(resources : RoleResourceQryByIdDto[]) : RoleResourceQryByIdDto[]{
    //exclude resource based on login user role and always exclude tenant management
    let exclude_resource : RoleResourceQryByIdDto[] = [];
    if(Array.isArray(resources)){
      resources.forEach(r => {
        let is_include_excluded_data : boolean = r.operations.some(o => this.exclude_operation.includes(o.operationId))
        if(is_include_excluded_data){
          exclude_resource.push(r);
        }
      });
    }

    let newAssigningResources : RoleResourceQryByIdDto[] = resources.filter(r => !exclude_resource.includes(r));
    return newAssigningResources;
  }

  checkAllowedOperation()
  {
    let updateRoleOpsId = parseInt(environment.upd_role_op_id);
    if(this.userClaim.operations.length)
    {
      this.enabledUpdate = this.userClaim.operations.some(e => e === updateRoleOpsId);
    }
  }

}
