import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { ModResOpModel } from 'src/app/core/models/security/mod-res-op.model';

@Injectable({
  providedIn: 'root'
})
export class CheckUserPermissionService {

  constructor() { }

  isUserAllowedToOperation(operationId : number) : boolean
  {
    let isAllowed : boolean = false;
    const modResOp = jwt_decode(localStorage.getItem("amm")) as ModResOpModel;

    if(!(Array.isArray(modResOp.operations))){
      modResOp.operations = [modResOp.operations];
    }
    const user_operations = modResOp.operations;
    isAllowed = user_operations.some(e => e === operationId);
    return isAllowed;
  }
  isUserAllowedToResource(resourceId : number) : boolean
  {
    let isAllowed : boolean = false;
    const modResOp = jwt_decode(localStorage.getItem("amm")) as ModResOpModel;

    if(!(Array.isArray(modResOp.resources))){
      modResOp.resources = [modResOp.resources];
    }
    const user_resource = modResOp.resources;
    isAllowed = user_resource.some(e => e === resourceId);
    return isAllowed;
  }
  isUserAllowedToModule(moduleId : number) : boolean
  {
    let isAllowed : boolean = false;
    const modResOp = jwt_decode(localStorage.getItem("amm")) as ModResOpModel;

    if(!(Array.isArray(modResOp.modules))){
      modResOp.modules = [modResOp.modules];
    }
    const user_modules = modResOp.modules;
    isAllowed = user_modules.some(e => e === moduleId);
    return isAllowed;
  }
  getUserType() : string
  {
    const modResOp = jwt_decode(localStorage.getItem("amm")) as ModResOpModel;
    return modResOp.userType;
  }
  getUserTenantId() : number[]{

    const userClaim = jwt_decode(localStorage.getItem("amm")) as ModResOpModel;
    if(!(Array.isArray(userClaim.tenants))){
      userClaim.tenants = [userClaim.tenants];
    }
    return userClaim.tenants.map((e : any) =>
      {
        return Number.parseInt(e);
      });
  }
}
