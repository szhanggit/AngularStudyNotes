import { FormBuilder, FormGroup } from "@angular/forms";

export interface IDefineFormGroup {
    tenantCode?: string;
    productType?: number;
    productTypes?: number[];
    define(_formBuilder: FormBuilder, isEdit: boolean): FormGroup;
}