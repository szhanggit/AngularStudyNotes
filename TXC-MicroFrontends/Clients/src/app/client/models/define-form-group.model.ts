import { FormBuilder, FormGroup } from "@angular/forms";

export interface IDefineFormGroup {
    tenantCode: string;
    define(_formBuilder: FormBuilder, isEdit: boolean,addDefaultContact :boolean,controlId :string): FormGroup;
}