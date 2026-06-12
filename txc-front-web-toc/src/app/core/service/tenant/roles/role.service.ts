import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoleModel } from 'src/app/core/models/roles/role-model';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private readonly controller = "amm/Role";
  constructor(private api:ApiService) { }

  getRoles():Observable<RoleModel[]>{
    return this.api.get(this.controller);
  }
}
