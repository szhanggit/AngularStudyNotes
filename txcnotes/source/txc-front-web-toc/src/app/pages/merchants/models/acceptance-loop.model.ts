import { AcceptanceLoopDetails } from "./acceptance-loop-details.model";
import { AcceptanceLoopMerchant } from "./acceptance-loop-merchant.model";

export interface AcceptanceLoop {
    acceptanceLoopId : number;
    code : string;
    description : string;
    status : boolean;
    createdBy : string;
    createdOn : string;
    acceptanceLoopMerchants : AcceptanceLoopMerchant[];

}
