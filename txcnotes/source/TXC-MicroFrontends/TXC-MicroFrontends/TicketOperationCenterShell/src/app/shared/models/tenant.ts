export class Tenant {
    constructor(){
      this.currentUTCOffset = "";
      this.name = null;
      this.id = null;
    }
    currentUTCOffset: string | null;
    id: number | null;
    name: string | null;
}