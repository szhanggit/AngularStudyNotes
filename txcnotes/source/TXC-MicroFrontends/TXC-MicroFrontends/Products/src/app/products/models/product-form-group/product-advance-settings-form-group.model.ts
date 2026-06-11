import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { NumberValidator } from "../../validators/number.validator";
import { IDefineFormGroup } from "../define-form-group.model";

abstract class BaseDefinitionProductAdvanceSettingsFormGroup {
    // common definitions for AdvanceSettings form group
    // params, formBuilder
    protected createRedemptionDays(): FormGroup {
        return new FormGroup({
            'redemptionDay': new FormControl({ value: null, disabled: false }),
            'redemptionFrom': new FormControl({ value: '00:00', disabled: false }),
            'redemptionTo': new FormControl({ value: '23:59', disabled: false }),
        });
    }

    protected createRedemptionExcludeDates(): FormGroup {
        return new FormGroup({
            'redemptionExcludeDate': new FormControl({ value: null, disabled: false }),
        });
    }

    protected commonDef(_formBuilder: FormBuilder): FormGroup {
        let result: FormGroup;
        result = _formBuilder.group({
            minRedeemQuantity: new FormControl({ value: null, disabled: false }, [NumberValidator.isValidNumber()]),
            maxIssuingQuantity: new FormControl({ value: null, disabled: false }, [NumberValidator.isValidNumber(), Validators.min(1)]),
            reminderId: new FormControl({ value: null, disabled: false }),
            reversalLimitId: new FormControl({ value: null, disabled: false }),
            preAuthorizationExpiryUnit: new FormControl({ value: 0, disabled: false }),
            preAuthorizationExpiryInterval: new FormControl({ value: 0, disabled: false }),
            productExternalPropertyList: new FormControl({ value: null, disabled: false }),

            redemptionDays: _formBuilder.array([this.createRedemptionDays()]),
            redemptionExcludeDates: _formBuilder.array([this.createRedemptionExcludeDates()]),
        });

        return result;
    }
}

export class GeneralProductAdvanceSettingsFormGroup extends BaseDefinitionProductAdvanceSettingsFormGroup implements IDefineFormGroup {
    productTypes = [1,3];
    // define product based Template form group
    define(_formBuilder: FormBuilder): FormGroup {
        const result = this.commonDef(_formBuilder);
        return result;
    }
}

export class ValueBasedAdvanceSettingsFormGroup extends BaseDefinitionProductAdvanceSettingsFormGroup implements IDefineFormGroup {
    productTypes = [2,4];
    // define product based Template form group
    define(_formBuilder: FormBuilder): FormGroup {
        const result = this.commonDef(_formBuilder);
        result.addControl('useTimeControl', new FormControl({ value: null, disabled: false }));
        result.addControl('useTimeControlInterval', new FormControl({ value: null, disabled: false }));
        return result;
    }
}
