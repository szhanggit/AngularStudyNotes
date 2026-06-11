import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NumberValidator } from "../../validators/number.validator";
import { IDefineFormGroup } from "./../define-form-group.model";

// base class for ProductDetails form group
abstract class BaseDefinitionProductDetailsFormGroup {
    // common definitions for ProductDetails form group
    // params, formBuilder
    protected commonDef(_formBuilder: FormBuilder): FormGroup {
        let result: FormGroup;
        result = _formBuilder.group({
            productName: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]),
            productCode: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100), Validators.pattern(/^[a-zA-Z0-9_#$*-.]{1,50}$/)]),
            externalProductCode: new FormControl({ value: '', disabled: false }, [Validators.maxLength(100)]),
            //TODO: adjust once description model is aligned with backend
            productDescription: new FormControl({ value: '', disabled: false }, [Validators.maxLength(500)]),
            productIssuer: new FormControl({ value: 0, disabled: false }),
            isIssueMerchantGroup: new FormControl({ value: false, disabled: false }),
            issueMerchant: new FormControl({ value: 0, disabled: false }),
            issueMerchantGroupId: new FormControl({ value: 0, disabled: false }),
            resellerMerchantName: new FormControl({ value: '', disabled: true }),
            productType: new FormControl({ value: '', disabled: true }, [Validators.required]),

            // merchant & sku
            isMerchantGroup: new FormControl({ value: false, disabled: false }),
            merchantGroupId: new FormControl({ value: 0, disabled: false }),
            merchantId: new FormControl({ value: '', disabled: false }, [Validators.required]),
            programId: new FormControl({ value: '', disabled: true }, [Validators.required]),
            merchantName: new FormControl({ value: '', disabled: false }),
            skuName: new FormControl({ value: '', disabled: false }, [Validators.required]),
            skuId: new FormControl({ value: '', disabled: false }, [Validators.required]),
            acceptanceLoopId: new FormControl({ value: '', disabled: false }, [Validators.required]),
            vnrId: new FormControl({ value: '', disabled: false}, [Validators.required]),
            validFrom: new FormControl({ value: null, disabled: false }),
            validTo: new FormControl({ value: null, disabled: false }),
            stopIssueTime: new FormControl({ value: null, disabled: false }),
            extensionEndDate: new FormControl({ value: null, disabled: false }),

            operationNote: new FormControl({ value: '', disabled: false }, [Validators.maxLength(2000)]),
            salesNote: new FormControl({ value: '', disabled: false }, [Validators.maxLength(500)]),
            customerServiceNote: new FormControl({ value: '', disabled: false }, [Validators.maxLength(2000)]),
        });

        return result;
    }
}

// taiwan ProductDetails form group implementation
export class TaiwanProductDetailsFormGroup extends BaseDefinitionProductDetailsFormGroup implements IDefineFormGroup {
    // tenant code = TW
    tenantCode: string = "TW";

    // define taiwan ProductDetails form group, pass true on isTaiwan flag
    define(_formBuilder: FormBuilder): FormGroup {
        const result = this.commonDef(_formBuilder);
        result.addControl('productTag', new FormControl({ value: 4, disabled: false }));
        result.addControl('multipleSelectionType', new FormControl({ value: 0, disabled: false }));
        //brand
        result.addControl('brandName', new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]));
        result.addControl('brandId', new FormControl({ value: null, disabled: false }, [Validators.required, Validators.maxLength(100)]));
        result.addControl('brandImage', new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]));

        return result;
    }
}

export class GlobalProductDetailsFormGroup extends BaseDefinitionProductDetailsFormGroup implements IDefineFormGroup {
    // tenant code = GL
    tenantCode: string = "GL";

    // define global ProductDetails form group
    define(_formBuilder: FormBuilder): FormGroup {
        const result = this.commonDef(_formBuilder);
        result.addControl('voucherIssuerId', new FormControl({ value: null, disabled: false }, [Validators.required]));
        //brand
        result.addControl('brandName', new FormControl({ value: '', disabled: false }, [Validators.maxLength(100)]));
        result.addControl('brandId', new FormControl({ value: null, disabled: false }, [Validators.maxLength(100)]));
        result.addControl('brandImage', new FormControl({ value: '', disabled: false }, [Validators.maxLength(100)]));

        return result;
    }
}

export class IndiaProductDetailsFormGroup extends BaseDefinitionProductDetailsFormGroup implements IDefineFormGroup {
    // tenant code = IN
    tenantCode: string = "IN";

    // define india ProductDetails form group
    define(_formBuilder: FormBuilder): FormGroup {
        const result = this.commonDef(_formBuilder);
        // add pinType exclusively for taiwan
        result.addControl('productCategory', new FormControl({ value: 1, disabled: false }, [Validators.maxLength(100)]));
        //brand
        result.addControl('brandName', new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]));
        result.addControl('brandId', new FormControl({ value: null, disabled: false }, [Validators.required, Validators.maxLength(100)]));
        result.addControl('brandImage', new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]));

        return result;
    }
}

export class GlobalRewardsProductDetailsFormGroup extends BaseDefinitionProductDetailsFormGroup implements IDefineFormGroup {
    // tenant code = GR
    tenantCode: string = "GR";

    // define global rewards ProductDetails form group
    define(_formBuilder: FormBuilder): FormGroup {
        const result = this.commonDef(_formBuilder);

        return result;
    }
}

export class SingaporeProductDetailsFormGroup extends BaseDefinitionProductDetailsFormGroup implements IDefineFormGroup {
    // tenant code = SG
    tenantCode: string = "SG";

    // define singapore ProductDetails form group
    define(_formBuilder: FormBuilder): FormGroup {
        const result = this.commonDef(_formBuilder);
        result.addControl('brandName', new FormControl({ value: '', disabled: false }, [Validators.maxLength(100)]));
        result.addControl('brandId', new FormControl({ value: null, disabled: false }, [Validators.maxLength(100)]));
        result.addControl('brandImage', new FormControl({ value: '', disabled: false }, [Validators.maxLength(100)]));

        return result;
    }
}
