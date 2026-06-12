import { UserRoleService } from './user-role.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GetUserRoleListQuery } from 'src/app/core/models/user-role/request/get-user-role-list-query.model';
import { UserRoleDto } from 'src/app/core/models/user-role/Dto/user-role-dto.model';

@Injectable({
  providedIn: 'root'
})
export class ListOfUserRolesService {

  private _userRoleListQueryModel: GetUserRoleListQuery;
  public userRoleListQueryModel: BehaviorSubject<GetUserRoleListQuery> = new BehaviorSubject<GetUserRoleListQuery>(null);
  public listOfUsersRoles: BehaviorSubject<UserRoleDto[]> = new BehaviorSubject<UserRoleDto[]>(null);

  constructor(private readonly userRoleSvc : UserRoleService) {
    this.subscribeToUserRoleQuery();
  }

  private subscribeToUserRoleQuery(){
    this.userRoleListQueryModel.subscribe({
      next: res=> this._userRoleListQueryModel = res
    })
  }

  public getListUserRoles() {
    return this.listOfUsersRoles.asObservable();
  }

  public getUserRoles() {
     this.userRoleSvc.getUserRoles(this._userRoleListQueryModel)
    .subscribe({
      next: res=> {
        this._userRoleListQueryModel.totalRows = res.totalCount;
        this.userRoleListQueryModel.next(this._userRoleListQueryModel);
        this.listOfUsersRoles.next(res.userRoles)
      }
    })
  }


}
