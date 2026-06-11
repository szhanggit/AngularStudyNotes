import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RoleModel } from 'src/app/core/models/roles/role-model';

@Injectable({
  providedIn: 'root'
})
export class RolesAsRefService {

  list = new BehaviorSubject<RoleModel[]>(null);
  constructor() { }

  getList():Observable<RoleModel[]>{
    return this.list;
  }
}
