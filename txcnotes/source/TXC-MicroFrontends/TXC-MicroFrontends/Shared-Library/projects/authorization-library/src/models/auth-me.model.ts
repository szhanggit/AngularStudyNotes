export class AuthMe {
  constructor(){
    this.access_token = "";
    this.expires_on = "";
    this.id_token = "";
    this.provider_name = "";
    this.user_claims = [];
    this.user_id = "";
  }
  access_token: string;
  expires_on: string;
  id_token: string;
  provider_name: string;
  user_claims: UserClaimsModel[];
  user_id: string;
}
export class UserClaimsModel {
  constructor(){
    this.typ = null;
    this.val = null;
  }
  typ: string | null;
  val: string | null;
}
