import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { ModResOpModel } from 'src/app/core/models/security/mod-res-op.model';

@Injectable({
  providedIn: 'root'
})
export class ClaimManagerService {

  constructor() { }

  getCurrentUserName() : string {
    const modResOp = jwt_decode(localStorage.getItem("amm")) as ModResOpModel;
    let userName : string = modResOp.userName;
    return userName;
  }

  getCurrentEmail() : string {
    const modResOp = jwt_decode(localStorage.getItem("amm")) as ModResOpModel;
    let email : string = modResOp.email;
    return email;
  }

  getCurrentRoleDisplayed() : string {
    const modResOp = jwt_decode(localStorage.getItem("amm")) as ModResOpModel;
    let displayedRole : string = modResOp.displayedRole;
    return displayedRole;
  }

  getCurrentFullName() : string {
    const modResOp = jwt_decode(localStorage.getItem("amm")) as ModResOpModel;
    let fullName : string = modResOp.fullName;
    return fullName;
  }

}
