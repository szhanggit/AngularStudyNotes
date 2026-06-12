import { Component, IterableDiffers, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select2Data } from 'ng-select2-component';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
// services
import { RefAppPermissionService } from 'src/app/core/service/maintenance/ref-app-permission.service';
import { RefApplicationService } from 'src/app/core/service/maintenance/ref-application.service';
import { RefTenantService } from 'src/app/core/service/maintenance/ref-tenant.service';
import { RoleService } from 'src/app/core/service/maintenance/role/role.service';
// DTOs/models
import { RefAppPermissionDto } from 'src/app/core/models/maintenance/dto/application/ref-app-permission-dto';
import { RefApplicationDto } from 'src/app/core/models/maintenance/dto/application/ref-application-dto';
import { RefTenantDto } from 'src/app/core/models/maintenance/dto/tenant/ref-tenant-dto';
// queries/commands
import { CreateRoleCommand } from 'src/app/core/models/maintenance/command/role/create-role-command';
import { environment } from 'src/environments/environment';
import { userType } from 'src/app/core/models/constants/user-type';
import { UserAuthClaim } from 'src/app/core/models/security/mod-res-op.model';
import { AuthService } from 'src/app/core/service/security/auth.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];

  // dropdown
  applications!: Select2Data;
  tenants!: Select2Data;

  // Resources reference
  resourcesRef: RefAppPermissionDto[] = [];

  createRoleRequest = <CreateRoleCommand><unknown>{
    isEnabled: true,
    tenantId: 0,
    appId: 0,
    operationIds: []
  }

  //temporary fixed to scope out data depend into user role between super admin, admin and bu manager
  exclude_operation : number[] = [];
  tenant_mngmt_ops : number[] = [Number(environment.add_tenant_op_id), Number(environment.upd_tenant_op_id), Number(environment.view_tenant_op_id)];
  role_mngmt_ops : number[] = [Number(environment.add_role_op_id), Number(environment.upd_role_op_id), Number(environment.view_role_op_id)];
  admin_mngmt_ops: number[] = [Number(environment.add_admin_op_id), Number(environment.upd_admin_op_id), Number(environment.view_admin_op_id)];
  userClaim = new UserAuthClaim();

  constructor(private readonly refTenantSvc: RefTenantService
    , private readonly refApplicationSvc: RefApplicationService
    , private readonly refAppPermissionSvc: RefAppPermissionService
    , private readonly roleSvc: RoleService
    , private readonly router: Router
    , private readonly authSvc: AuthService) { }

  ngOnInit(): void {
    this.authSvc.userAuthClaim.subscribe(data =>
      {
        if(data == null || data == undefined){
          this.router.navigate(['401']);
        }
        this.userClaim = data;
        let addRoleOpdId = parseInt(environment.add_role_op_id);
        if(! this.userClaim.operations.some(e => e === addRoleOpdId))
        {
          this.router.navigate(['401']);
          return;
        }
        this.fillExcludeData();
        this.subscribeToTenantAsRef();
        this.subscribeToApplicationAsRef();
      });
  }

  private subscribeToTenantAsRef() {
    this.refTenantSvc.get().subscribe({
      next: (res) => {
        this.tenants = (res.data as RefTenantDto[]).map(m => {
          return {
            label: m.tenantName,
            value: m.tenantId
          }
        });
      }
    });
  }

  private subscribeToApplicationAsRef() {
    this.refApplicationSvc.get().subscribe({
      next: (res) => {
        this.applications = (res.data as RefApplicationDto[]).map(m => {
          return {
            label: m.appName,
            value: m.appId
          }
        });
      }
    });
  }

  onAppSelectChange() {
    this.refAppPermissionSvc.get(this.createRoleRequest.appId).subscribe({
      next: (res) => {
        //this.resourcesRef = res.data as RefAppPermissionDto[];
        let resources = res.data as RefAppPermissionDto[];
        if(Array.isArray(resources)){
          this.resourcesRef = this.excludeSomeData(resources);
        }
      }
    });
  }

  clearFields() {

    // Resources reference
    this.resourcesRef = [];

    this.createRoleRequest = <CreateRoleCommand><unknown>{
      isEnabled: true,
      tenantId: 0,
      appId: 0,
      operationIds: []
    }
  }

  addNewRole() {

    this.resourcesRef.forEach(r => {
      r.operations.forEach(o => {
        if(o.isSelected == true){
          this.createRoleRequest.operationIds.push(o.operationId);
        }
      })
    });

    const subscriber = this.roleSvc.post(this.createRoleRequest)
      .subscribe({
        next: (res) => {
          this.router.navigateByUrl('/maintenance/role-management', { state: { createRole: true } });
        }, error: (error) => {
          if ((error.error) && (error.error.message)) {
            subscriber.unsubscribe();
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

  private excludeSomeData(resources : RefAppPermissionDto[]) : RefAppPermissionDto[]{
    //exclude resource based on login user role and always exclude tenant management
    let exclude_resource : RefAppPermissionDto[] = [];
    if(Array.isArray(resources)){
      resources.forEach(r => {
        let is_include_excluded_data : boolean = r.operations.some(o => this.exclude_operation.includes(o.operationId))
        if(is_include_excluded_data){
          exclude_resource.push(r);
        }
      });
    }
    let newAssigningResources : RefAppPermissionDto[] = resources.filter(r => !exclude_resource.includes(r));
    return newAssigningResources;
  }




}
