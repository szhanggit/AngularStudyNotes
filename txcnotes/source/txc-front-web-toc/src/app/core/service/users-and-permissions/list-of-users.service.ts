import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserRowItemModel } from 'src/app/core/models/users-and-permissions/get-user-list-model';
import { GetUserListQueryModel } from 'src/app/core/models/users-and-permissions/get-user-list-query-model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ListOfUsersService {

  private _userListQueryModel: GetUserListQueryModel;
  userListQueryModel: BehaviorSubject<GetUserListQueryModel> = new BehaviorSubject<GetUserListQueryModel>(null);

  listOfUsers: BehaviorSubject<UserRowItemModel[]> = new BehaviorSubject<UserRowItemModel[]>(null);
  constructor(private readonly userSvc:UserService) {
    this.subscribeToUserQuery();
   }

  private subscribeToUserQuery(){
    this.userListQueryModel.subscribe({
      next: res=> this._userListQueryModel = res
    })
  }

  getListOfUsers(): Observable<UserRowItemModel[]>{
    return this.listOfUsers.asObservable();
  }

  getUsers(){
    this.userSvc.getUsers(this._userListQueryModel)
    .subscribe({
      next: res=> {
        this._userListQueryModel.totalRows = res.totalCount;
        this.userListQueryModel.next(this._userListQueryModel);
        this.listOfUsers.next(res.users)
      }
    })    
  }
}
