export class ModResOpModel {
    constructor(){
        this.aud = 0;
        this.nbf = 0;
        this.iat = 0;
        this.exp = 0;
        this.jti = "";
        this.sub = "";
        this.uid = 0;
        this.role = "";
        this.grantRole = "";
    }
    aud: number;
    nbf: number;
    iat: number;
    exp: number;
    jti: string;
    sub: string;
    uid: number;
    role: string;
    grantRole: string;
}