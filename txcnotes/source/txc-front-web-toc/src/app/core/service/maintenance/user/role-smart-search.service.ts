import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CreateUserAppTenant } from 'src/app/core/models/maintenance/command/user/create-user-command';
import { RefAppTenantAssigningRoleDto } from 'src/app/core/models/maintenance/dto/application/ref-assigning-app-tenant-dto';
import { UserAppTenantQryByIdDto } from 'src/app/core/models/maintenance/dto/user/user-query-by-id-dto';

@Injectable({
  providedIn: 'root'
})
export class RoleSmartSearchService {

  private rolesRef: RefAppTenantAssigningRoleDto[] = [];
  private filteredRolesRef: RefAppTenantAssigningRoleDto[] = [];

  private appTenantsCreate: CreateUserAppTenant[] = [];
  private appTenantsEdit: UserAppTenantQryByIdDto[] = [];

  dataCreate = new BehaviorSubject<CreateUserAppTenant[]>(null);
  dataEdit = new BehaviorSubject<UserAppTenantQryByIdDto[]>(null);

  constructor() { }

  clear(){
    this.filteredRolesRef = [];
  }

  addCreate(input: string, index: number) {
    input = input.toLowerCase();

    var list = this.appTenantsCreate[index].rolesRef.filter(f => {
      var a = f.roleName.toLowerCase().indexOf(input) > -1;
      var b = false;
      var x = f.resources.filter(r => {
        b = r.resourceName.toLowerCase().indexOf(input) > -1;
        var item = r.operations.filter(o => o.operationName.toLowerCase().indexOf(input) > -1).length > 0;
        return item;
      });
      return x.length > 0 || a || b;
    });

    this.appTenantsCreate[index].filteredRolesRef = [];
    list.forEach(fe => this.appTenantsCreate[index].filteredRolesRef.push(fe));
    this.dataCreate.next(this.appTenantsCreate);
  }

  addEdit(input: string, index: number) {
    input = input.toLowerCase();

    var list = this.appTenantsEdit[index].rolesRef.filter(f => {
      var a = f.roleName.toLowerCase().indexOf(input) > -1;
      var b = false;
      var x = f.resources.filter(r => {
        b = r.resourceName.toLowerCase().indexOf(input) > -1;
        var item = r.operations.filter(o => o.operationName.toLowerCase().indexOf(input) > -1).length > 0;
        return item;
      });
      return x.length > 0 || a || b;
    });

    this.appTenantsEdit[index].filteredRolesRef = [];
    list.forEach(fe => this.appTenantsEdit[index].filteredRolesRef.push(fe));
    this.dataEdit.next(this.appTenantsEdit);
  }

  setCreate(appTenants: CreateUserAppTenant[]){
    Object.assign<CreateUserAppTenant[], CreateUserAppTenant[]>(this.appTenantsCreate, appTenants);
  }

  setEdit(appTenants: UserAppTenantQryByIdDto[]){
    Object.assign<UserAppTenantQryByIdDto[], UserAppTenantQryByIdDto[]>(this.appTenantsEdit, appTenants);
  }

}
