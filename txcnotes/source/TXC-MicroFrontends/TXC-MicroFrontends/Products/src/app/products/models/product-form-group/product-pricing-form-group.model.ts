import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NumberValidator } from "../../validators/number.validator";
import { IDefineFormGroup } from "../define-form-group.model";

abstract class BaseDefinitionProductPricingFormGroup {
    // common definitions for ProductDetails form group
    // params, formBuilder
    protected commonDef(_formBuilder: FormBuilder): FormGroup {
        let result: FormGroup;
        result = _formBuilder.group({
            requiredExpiryList: new FormControl({ value: '', disabled: false }, [Validators.required]),
            fixExpiryDate: new FormControl({value: '', disabled: false}),
            isFixedExpiryPolicy: new FormControl({value: null, disabled: false}),
        });
        return result;
    }
}

export class ProductBasedPricingFormGroup extends BaseDefinitionProductPricingFormGroup implements IDefineFormGroup {
    productType = 1;

    // define product based pricing form group
    define(_formBuilder: FormBuilder): FormGroup {
        const result = this.commonDef(_formBuilder);
        result.addControl('sellingPricePrepaidWithTax', new FormControl({ value: 0, disabled: false }, [Validators.required, NumberValidator.isValidNumber(), Validators.min(0)]));
        result.addControl('sellingPricePrepaid', new FormControl({ value: 0, disabled: true }));
        result.addControl('sellingPricePostpaidWithTax', new FormControl({ value: 0, disabled: false }, [Validators.required, NumberValidator.isValidNumber(), Validators.min(0)]));
        result.addControl('sellingPricePostpaid', new FormControl({ value: 0, disabled: true }));

        return result;
    }
}

export class SmartBookletPricingFormGroup extends BaseDefinitionProductPricingFormGroup implements IDefineFormGroup {
    productType = 3;
    // define SmartBooklet pricing form group
    define(_formBuilder: FormBuilder): FormGroup {
        const result = this.commonDef(_formBuilder);
        result.addControl('sellingPricePrepaidWithTax', new FormControl({ value: 0, disabled: false }, [Validators.required, NumberValidator.isValidNumber(), Validators.min(0)]));
        result.addControl('sellingPricePrepaid', new FormControl({ value: 0, disabled: true }));
        result.addControl('sellingPricePostpaidWithTax', new FormControl({ value: 0, disabled: false }, [Validators.required, NumberValidator.isValidNumber(), Validators.min(0)]));
        result.addControl('sellingPricePostpaid', new FormControl({ value: 0, disabled: true }));
        
        return result;
    }
}

export class ValueBasedPricingFormGroup extends BaseDefinitionProductPricingFormGroup implements IDefineFormGroup {
    productType = 2;
    // define ValueBased pricing form group
    define(_formBuilder: FormBuilder): FormGroup {
        const result = this.commonDef(_formBuilder);
        result.addControl('sellingPricePrepaidWithTax', new FormControl({ value: 0, disabled: false }, [Validators.required, NumberValidator.isValidNumber(), Validators.min(0)]));
        result.addControl('sellingPricePrepaid', new FormControl({ value: 0, disabled: true }));
        result.addControl('customerFeePrepaidWithTax', new FormControl({ value: 0, disabled: true }));
        return result;
    }
}

export class DynamicFaceValuePricingFormGroup extends BaseDefinitionProductPricingFormGroup implements IDefineFormGroup {
    productType = 4;
    // define DynamicFaceValue pricing form group
    define(_formBuilder: FormBuilder): FormGroup {
        const result = this.commonDef(_formBuilder);
        result.addControl('customerFeePrepaidWithTax', new FormControl({ value: 0, disabled: false }, Validators.required));
        return result;
    }
}

export class SuperVoucherPricingFormGroup extends BaseDefinitionProductPricingFormGroup implements IDefineFormGroup {
    productType = 8;
    // define SuperVoucher pricing form group
    define(_formBuilder: FormBuilder): FormGroup {
        const result = this.commonDef(_formBuilder);
        result.addControl('sellingPricePrepaidWithTax', new FormControl({ value: 0, disabled: false }, [Validators.required, NumberValidator.isValidNumber(), Validators.min(0)]));
        result.addControl('sellingPricePrepaid', new FormControl({ value: 0, disabled: true }));
        result.addControl('sellingPricePostpaid', new FormControl({ value: 0, disabled: true }));

        return result;
    }
}

export class SmartChoiceVoucherPricingFormGroup extends BaseDefinitionProductPricingFormGroup implements IDefineFormGroup {
    productType = 5;
    // define SuperVoucher pricing form group
    define(_formBuilder: FormBuilder): FormGroup {
        const result = this.commonDef(_formBuilder);
        result.addControl('sellingPricePrepaidWithTax', new FormControl({ value: 0, disabled: false }, [Validators.required, NumberValidator.isValidNumber(), Validators.min(0)]));
        result.addControl('sellingPricePrepaid', new FormControl({ value: 0, disabled: true }));
        result.addControl('sellingPricePostpaidWithTax', new FormControl({ value: 0, disabled: false }, [Validators.required, NumberValidator.isValidNumber(), Validators.min(0)]));
        result.addControl('sellingPricePostpaid', new FormControl({ value: 0, disabled: true }));
        
        return result;
    }
}