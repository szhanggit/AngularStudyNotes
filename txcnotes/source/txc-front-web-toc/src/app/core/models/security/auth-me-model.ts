export class AuthMeModel {
    constructor(){
        this.access_token = "";
        this.expires_on = null;
        this.id_token = "";
        this.provider_name = "";
        this.user_claims = [];
        this.user_id = "";
    }
    access_token: string;
    expires_on?: Date;
    id_token: string;
    provider_name: string;
    user_claims: UserClaimsModel[];
    user_id: string;
}

export class UserClaimsModel {
    typ: string;
    val:string
}