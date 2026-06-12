import { AcceptanceLoopDetails } from "./acceptance-loop-details.model";

export interface AcceptanceLoopRequest {
    acceptanceLoopId : number;
    code : string;
    description : string;
    status : boolean;
    isDefault : boolean;
    createdBy : string;
    createdOn : string;
    lastModifiedBy : string;
    lastModifiedOn : string;
    acceptanceLoopDetails : AcceptanceLoopDetails[];
}
