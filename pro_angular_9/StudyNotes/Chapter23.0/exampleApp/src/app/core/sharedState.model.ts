import { InjectionToken } from "@angular/core";

export enum MODES {
    CREATE, EDIT
}

export const SHARED_STATE = new InjectionToken("shared_state");
/*
using the InjectionToken
means that there will be no confusion between services.
In chapter 20
*/

export class SharedState {
    //mode: MODES = MODES.EDIT;
    //id: number;
    constructor(public mode: MODES, public id?: number) { }
}
