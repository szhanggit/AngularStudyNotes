import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NumberValidator } from "../validators/number.validator";
import { IDefineFormGroup } from "./define-form-group.model";

// base class for VNR form group
abstract class BaseDefinitionVNRFormGroup {
    // common definitions for VNR form group
    // params, formBuilder and isTaiwanFlag to set enable or disable
    protected commonDef(_formBuilder: FormBuilder, isTaiwan: boolean, isEdenred: boolean): FormGroup {
        let result: FormGroup;
        if (isEdenred) {
            result = _formBuilder.group({
                voucherNumberPrefix: new FormControl({ value: '', disabled: false }, [Validators.pattern('^[A-Z0-9]*$')]),
                voucherNumberType: new FormControl({ value: 1, disabled: false }),
                voucherNumberLength: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.min(5), Validators.max(30), NumberValidator.isValidNumber()]),
                displayVoucherNumberUnderBarcode: new FormControl({ value: false, disabled: false }),
                barcodeTypeId: new FormControl({ value: 1, disabled: false }, [Validators.required]),
                algorithmId: new FormControl({ value: 1, disabled: !isTaiwan }, [Validators.required]),
                ruleName: new FormControl({ value: '', disabled: false }, [Validators.required]),
                voucherNumberGenerator: new FormControl({ value: 1, disabled: !isTaiwan }, [Validators.required]),
            });
        } else {
            result = _formBuilder.group({
                displayVoucherNumberUnderBarcode: new FormControl({ value: false, disabled: false }),
                barcodeTypeId: new FormControl({ value: 1, disabled: false }, [Validators.required]),
                ruleName: new FormControl({ value: '', disabled: false }, [Validators.required]),
                requestExpiryDate: new FormControl({ value: true, disabled: false }),
                programName: new FormControl({value: '', disabled: true })
            });
        }

        return result;
    }
}

// taiwan VNR form group implementation
export class TaiwanVNRFormGroup extends BaseDefinitionVNRFormGroup implements IDefineFormGroup {
    // tenant code = TW
    tenantCode: string = "TW";

    // define taiwan vnr form group, pass true on isTaiwan flag
    define(_formBuilder: FormBuilder, isEdenred = true): FormGroup {
        const result = this.commonDef(_formBuilder, true, isEdenred);

        if (!isEdenred) {
            result.addControl('hasMultipartBarcode', new FormControl({ value: false, disabled: false }));
            // result.addControl('onDemand', new FormControl({ value: false, disabled: false }));
            // result.addControl('vendorId', new FormControl({ value: '', disabled: false }));
        }
        return result;
    }
}

export class GlobalVNRFormGroup extends BaseDefinitionVNRFormGroup implements IDefineFormGroup {
    // tenant code = GL
    tenantCode: string = "GL";

    // define global vnr form group, pass false on isTaiwan flag
    define(_formBuilder: FormBuilder, isEdenred = true): FormGroup {
        const result = this.commonDef(_formBuilder, false, isEdenred);

        if (!isEdenred) {
            result.addControl('onDemand', new FormControl({ value: false, disabled: false }));
            result.addControl('vendorId', new FormControl({ value: '', disabled: false }));
        }
        return result;
    }
}

export class IndiaVNRFormGroup extends BaseDefinitionVNRFormGroup implements IDefineFormGroup {
    // tenant code = IN
    tenantCode: string = "IN";

    // define india vnr form group, pass false on isTaiwan flag
    define(_formBuilder: FormBuilder, isEdenred = true): FormGroup {
        const result = this.commonDef(_formBuilder, false, isEdenred);
        // add pinType exclusively for taiwan
        result.addControl('pinType', new FormControl({ value: 0, disabled: false }, [Validators.required]));
        if (!isEdenred) {
            result.addControl('onDemand', new FormControl({ value: false, disabled: false }));
            result.addControl('vendorId', new FormControl({ value: '', disabled: false }));
        }
        return result;
    }
}

export class GlobalRewardsVNRFormGroup extends BaseDefinitionVNRFormGroup implements IDefineFormGroup {
    // tenant code = GR
    tenantCode: string = "GR";

    // define global rewards vnr form group, pass false on isTaiwan flag
    define(_formBuilder: FormBuilder, isEdenred = true): FormGroup {
        const result = this.commonDef(_formBuilder, false, isEdenred);

        if (!isEdenred) {
            result.addControl('onDemand', new FormControl({ value: false, disabled: false }));
            result.addControl('vendorId', new FormControl({ value: '', disabled: false }));
        }
        return result;
    }
}

export class SingaporeVNRFormGroup extends BaseDefinitionVNRFormGroup implements IDefineFormGroup {
    // tenant code = SG
    tenantCode: string = "SG";

    // define singapore vnr form group, pass false on isTaiwan flag
    define(_formBuilder: FormBuilder, isEdenred = true): FormGroup {
        const result = this.commonDef(_formBuilder, false, isEdenred);
        return result;
    }
}

// merchant group VNR for all tenants
export class MerchantGroupFormGroup extends BaseDefinitionVNRFormGroup  {
    define(_formBuilder: FormBuilder, isEdit: boolean = false): FormGroup {
        let result: FormGroup;

        result = _formBuilder.group({
            voucherNumberPrefix: new FormControl({ value: '', disabled: false }, [Validators.maxLength(14), Validators.pattern('[A-Z0-9]*')]),
            voucherNumberType: new FormControl({ value: 1, disabled: false }, [Validators.required]),
            voucherNumberLength: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.min(5), Validators.max(30), NumberValidator.isValidNumber()]),
            displayVoucherNumberUnderBarcode: new FormControl({ value: false, disabled: false }),
            barcodeTypeId: new FormControl({ value: 1, disabled: false }, [Validators.required]),
            algorithmId: new FormControl({ value: 1, disabled: true }, [Validators.required]),
            ruleName: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]),
            voucherNumberGenerator: new FormControl({ value: 1, disabled: true }, [Validators.required]),
        });

        return result;
    }
}