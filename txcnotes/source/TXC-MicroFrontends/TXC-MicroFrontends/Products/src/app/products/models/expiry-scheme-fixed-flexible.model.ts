import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { ExpirationPolicy } from "./expiry-scheme.model";

// ExpirySchemeFixedFlexibleComponent
export interface FixedFlexibleComponentSetup {
    toValidateOnInit: boolean,
    isEdenredProgram: boolean,
    expirySchemeList: ExpirationPolicy[],
    selectedSchemeIds: number[],
    productExpiryDate?: Date,
    isFixedExpiryPolicy: boolean,
    todayDate: Date,
}
export interface FixedFlexibleComponentEvent {
    selectedSchemeIds: number[],
    productExpiryDate?: Date,
    isFixedExpiryPolicy: boolean,
}

// ExpirySchemeFixedComponent
export interface FixedExpiryModalSetup extends BaseModalSetup {
    fixEndOfDayId: number,
    fixedExpiryDate?: NgbDateStruct,
    minDate: NgbDateStruct,
}
export interface FixedExpiryModalResponse extends BaseModalResponse {
    fixedExpiryDate?: NgbDateStruct,
}

// ExpirySchemeFlexibleComponent
export interface FlexibleExpiryModalSetup extends BaseModalSetup {
}
export interface FlexibleExpiryModalResponse extends BaseModalResponse {
}

// common for ExpirySchemeFixedComponent and ExpirySchemeFlexibleComponent 
export interface BaseModalSetup {
    expirySchemeList: ExpirationPolicy[],
}
export interface BaseModalResponse {
    expirySchemeList: ExpirationPolicy[],
    isFixedExpiryPolicy: boolean,
}