import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NumberValidator } from "../../validators/number.validator";
import { IDefineFormGroup } from "../define-form-group.model";

export abstract class BaseDefinitionProductTemplateFormGroup {
    // common definitions for ProductDetails form group
    // params, formBuilder
    productTemplateList(): FormGroup {
        return new FormGroup({
            'templateType': new FormControl({ value: '', disabled: false }),
            'templateSubType': new FormControl({ value: '', disabled: false }),
            'templateVersionId': new FormControl({ value: '', disabled: false }),
            'templateId': new FormControl({ value: '', disabled: false }),
            'templateName': new FormControl({ value: '', disabled: false }),
            'languageId': new FormControl({ value: 0, disabled: false}),
            'defaultlanguageId': new FormControl({ value: 0, disabled: false}),
            'applyLanguage': new FormControl({ value: true, disabled: true}),
            'templateTags': new FormControl({ value: [], disabled: true}),
        });
    }

    protected commonDef(_formBuilder: FormBuilder): FormGroup {
        let result: FormGroup;
        result = _formBuilder.group({
            productTemplateList: _formBuilder.array([this.productTemplateList(), this.productTemplateList()]),
            addToWallet: new FormControl({ value: true, disabled: false }),
            walletStatus: new FormControl({ value: 1, disabled: false }),
            walletImage: new FormControl({ value: '', disabled: false }),
            walletDescription: new FormControl({ value: '', disabled: false }),
        });

        return result;
    }
}

export class GeneralProductTemplateFormGroup extends BaseDefinitionProductTemplateFormGroup implements IDefineFormGroup {
    productTypes = [1, 2, 3];

    // define product based Template form group
    define(_formBuilder: FormBuilder): FormGroup {
        const result = this.commonDef(_formBuilder);
        return result;
    }
}

export class DynamicFaceValueTemplateFormGroup extends BaseDefinitionProductTemplateFormGroup implements IDefineFormGroup {
    productTypes = [4];
    // define DynamicFaceValue Template form group
    define(_formBuilder: FormBuilder): FormGroup {
        const result = this.commonDef(_formBuilder);
        result.addControl('hexColor', new FormControl({ value: null, disabled: false }, [Validators.minLength(6), Validators.maxLength(6)])),
        result.addControl('fontSize', new FormControl({ value: null, disabled: false }));
        result.addControl('pointX', new FormControl({ value: null, disabled: false }, [Validators.max(999999.99)]));
        result.addControl('pointY', new FormControl({ value: null, disabled: false }, [Validators.max(999999.99)]));
        return result;
    }
}