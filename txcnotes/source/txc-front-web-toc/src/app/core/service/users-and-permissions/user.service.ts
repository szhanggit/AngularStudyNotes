import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUserModel } from 'src/app/core/models/users-and-permissions/create-user-model';
import { GetUserListModel } from 'src/app/core/models/users-and-permissions/get-user-list-model';
import { GetUserListQueryModel } from 'src/app/core/models/users-and-permissions/get-user-list-query-model';
import { UpdateUserModel } from 'src/app/core/models/users-and-permissions/update-user-model';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly controller = "User";
  constructor(private readonly apiSvc: ApiService) { }

  getUsers(parameter: GetUserListQueryModel) :Observable<GetUserListModel>{
    let param = "?";
    const p = parameter as any;
    const keys = Object.keys(p);
    keys.forEach((fe,i)=>
    {  
      if(i < keys.length -1){
        param += `${fe}=${p[fe]}&`;
      } else{
        param += `${fe}=${p[fe]}`;
      }
      
    });
    return this.apiSvc.get(this.controller + param);
  }

  createUser(model:CreateUserModel){
    return this.apiSvc.post(this.controller,model);
  }

  updateUser(model: UpdateUserModel){
    return this.apiSvc.put(this.controller,model);
  }

  deleteUser(id: number){
    return this.apiSvc.delete(this.controller + "?id=" + id);
  }

  
}
