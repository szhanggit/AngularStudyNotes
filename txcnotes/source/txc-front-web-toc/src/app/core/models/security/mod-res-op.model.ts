export class ModResOpModel {
    constructor(){
        this.userStatus = 0;
        this.modules = [];
        this.operations = [];
        this.resources = [];
        this.role = [];
        this.userId = "";
        this.displayedRole = "";
        this.userName = "";
        this.email = "";
        this.fullName = "";
        this.userType = "";
        this.tenants = []
    }
    userStatus: number;
    modules: number | number[];
    operations: number[];
    resources: number[];
    role:number[];
    userId:string;
    userName:string;
    email:string;
    displayedRole:string;
    fullName:string;
    userType:string;
    tenants:number[];
}

export class UserAuthClaim {
  constructor(){
      this.modules = [];
      this.operations = [];
      this.resources = [];
      this.roles = [];
      this.tenants = [];
      this.user = new UserClaimInfo();
  }
  modules: number | number[];
  operations: number[];
  resources: number[];
  roles:number[];
  tenants:number[];
  user:UserClaimInfo;
}
export class UserClaimInfo {
constructor(){
  this.userStatus = 0;
  this.userId = "";
  this.displayedRole = "";
  this.userName = "";
  this.email = "";
  this.fullName = "";
  this.userType = "";
}
userId:string;
fullName:string;
userName:string;
email:string;
displayedRole:string;
userStatus:number;
userType:string;
userOid:string;
}
