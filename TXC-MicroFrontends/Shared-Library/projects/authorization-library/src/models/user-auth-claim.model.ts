export class UserAuthClaim {
  constructor(){
    this.modules = [];
    this.operations = [];
    this.resources = [];
    this.role = [];
    this.tenants = [];
    this.user = new UserClaimInfo();
}
  modules: number | number[];
  operations: number[];
  resources: number[];
  role:number[];
  tenants:number[];
  user:UserClaimInfo;
}
export class UserClaimInfo {
  constructor(){
    this.userStatus = 0;
    this.userId = null;
    this.displayedRole = null;
    this.userName = null;
    this.email = null;
    this.fullName = null;
    this.userType = null;
    this.userOid = null
  }
  userId:string | null;
  fullName:string | null;
  userName:string | null;
  email:string | null;
  displayedRole:string | null;
  userStatus:number | null;
  userType:string | null;
  userOid:string | null;
  }
