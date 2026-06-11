// import { Component, Input, OnDestroy, OnInit } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Subject, debounceTime, takeUntil } from 'rxjs';
// import { TemplateService } from 'src/app/order/services/template.service';
// import { FormEmitterService } from 'src/app/shared/dumb/form/form-emitter.service';
// import { TemplateTypeEnum } from 'src/app/shared/enums/template.enum';
// import { FormModel } from 'src/app/shared/models/dumb-models/form.model';
// import { SelectModel } from 'src/app/shared/models/dumb-models/select.model';
// import { SmsDesignFieldsDefinition } from 'src/app/shared/models/fields-definition/sms-design-fields-definition.model';
// import { TemplateTag } from 'src/app/shared/models/template-tag.model';
// import { Template } from 'src/app/shared/models/template.model';

// @Component({
//   selector: 'app-sms-design',
//   templateUrl: './sms-design.component.html',
//   styleUrls: ['./sms-design.component.scss'],
// })
// export class SmsDesignComponent implements OnInit, OnDestroy {
//   @Input() deliveryDetailsFormGroup!: FormGroup;
//   @Input() smsDesignFormGroup!: FormGroup;

//   get templatePartFormGroup() {
//     return this.smsDesignFormGroup.get('templatePart') as FormGroup;
//   }

//   get smsVoucherTemplate() {
//     return this.smsDesignFormGroup.get('smsVoucherTemplate');
//   }

//   get productName() {
//     return this.smsDesignFormGroup.get('productName');
//   }

//   get language() {
//     return this.smsDesignFormGroup.get('language');
//   }

//   get smsGreetings() {
//     return this.smsDesignFormGroup.get('smsGreetings');
//   }

//   get templatePart() {
//     return this.templatePartFormGroup.get('templatePart');
//   }

//   get parts() {
//     return this.templatePartFormGroup.get('parts') as FormArray;
//   }

//   get tagCategory() {
//     return this.templatePartFormGroup.get('tagCategory');
//   }

//   get smsDesignFormModel(): FormModel {
//     return {
//       formGroup: this.smsDesignFormGroup,
//       fieldsDefinition: this.smsDesignFieldsDefinition.define(),
//     };
//   }

//   smsDesignFieldsDefinition!: SmsDesignFieldsDefinition;

//   selectedPartIndex: number = 0;
//   selectedTagValue: string = '';
//   tagCategories!: SelectModel;
//   templateParts!: SelectModel;

//   smsTags: TemplateTag[] = [];
//   filteredTags: TemplateTag[] = [];
//   templateList: Template[] = [];

//   selectedTagCategory!: string;
//   selectedTemplatePart: string = 'One part';
//   productId!: number;
//   currentSmsTemplate!: Template;
//   partMessageValues: string[] = [];

//   destroyed$ = new Subject<void>();
//   textAreaCaretPos: number = 0;

//   constructor(
//     private formBuilder: FormBuilder,
//     private templateService: TemplateService,
//     private formEmitterService: FormEmitterService
//   ) {}

//   ngOnInit() {
//     this.listenToTemplatePartChange();
//     this.listenToTagCategoryChange();
//     this.listenToVoucherTemplateChange();
//     this.listenToPreviewClick();
//     this.listenToPartsMessageChange();
//   }

//   ngOnDestroy() {
//     this.destroyed$.next();
//     this.destroyed$.complete();
//   }

//   listenToPartsMessageChange() {
//     this.parts.valueChanges.pipe(debounceTime(200)).subscribe((value) => {});
//   }

//   listenToPreviewClick() {
//     this.formEmitterService.emitEvent
//       .pipe(takeUntil(this.destroyed$))
//       .subscribe((formControl) => {
//         if (formControl === 'smsVoucherTemplate') {
//           // TODO: remove, value should come from parent
//           const smsTemplate = this.getUpdatedSmsTemplate(
//             this.smsVoucherTemplate?.value
//           );
//           if (smsTemplate) {
//             this.templateService.templatePreviewSingle(smsTemplate, false);
//           }
//         }
//       });
//   }

//   getUpdatedSmsTemplate(template: Template) {
//     if (!template) return;

//     template.content1 = this.parts.controls[0]?.value;
//     template.content2 = this.parts.controls[1]?.value;
//     template.content3 = this.parts.controls[2]?.value;
//     template.templateTags = this.smsTags;
//     this.templateService.mapSmsTags(
//       template,
//       this.productName?.value,
//       this.smsGreetings?.value
//     );

//     return template;
//   }

//   listenToVoucherTemplateChange() {
//     this.smsVoucherTemplate?.valueChanges.subscribe((template: Template) => {
//       this.hideFields(template ? true : false);
//       this.selectedTagCategory = '';

//       if (template) {
//         this.language?.setValue(template.templateVersionId);
//         this.parts.controls[0]?.setValue(template.content1);
//       }
//     });
//   }

//   listenToTemplatePartChange() {
//     this.setPartControl(this.templatePart?.value);
//     this.templatePart?.valueChanges.subscribe((value) => {
//       this.selectedPartIndex = 0;
//       if (!isNaN(value)) {
//         while (this.parts.length > 0) {
//           this.parts.removeAt(0);
//         }

//         this.setPartControl(value);
//       }
//     });
//   }

//   setPartControl(parts: number) {
//     const template = this.smsVoucherTemplate?.value;
//     if (this.templatePart?.value !== this.parts.controls.length) {
//       for (let i = 0; i < parts; i++) {
//         this.parts.push(this.formBuilder.control(''));
//       }
//     }

//     this.parts.controls[0]?.setValidators(Validators.required);
//     this.parts.controls[0]?.setValue(template?.content1 || '');
//     this.parts.controls[1]?.setValue(template?.content2 || '');
//     this.parts.controls[2]?.setValue(template?.content3 || '');
//   }

//   listenToTagCategoryChange() {
//     this.tagCategory?.valueChanges.subscribe((value) => {
//       this.filteredTags =
//         value === 0
//           ? this.smsTags
//           : this.smsTags.filter((tag) => tag.category === value);
//       this.selectedTagValue = '';
//     });
//   }

//   hideFields(hasTemplate: boolean) {
//     this.smsDesignFieldsDefinition.productName.hidden = !hasTemplate;
//     this.smsDesignFieldsDefinition.language.hidden = !hasTemplate;
//     this.smsDesignFieldsDefinition.applyLanguage.hidden = !hasTemplate;
//     this.smsDesignFieldsDefinition.smsGreetings.hidden = !hasTemplate;
//     this.smsDesignFieldsDefinition.voucherTemplate.withPreview = hasTemplate;
//   }

//   onInsertTag() {
//     const part = this.parts?.controls[this.selectedPartIndex];
//     const existingValue = part?.value;
//     const newValue =
//       this.textAreaCaretPos === 0
//         ? existingValue + this.selectedTagValue
//         : existingValue.substring(0, this.textAreaCaretPos) +
//           this.selectedTagValue +
//           existingValue.substring(this.textAreaCaretPos);
//     part?.setValue(newValue);
//   }

//   onFocus(index: number) {
//     this.selectedPartIndex = index;
//   }

//   updatedValueFromDirective(
//     value: { caretPos: number; newValue?: string },
//     index: number
//   ) {
//     if (value.newValue) {
//       this.parts.controls[index]?.setValue(value.newValue);
//     }
//     this.textAreaCaretPos = value.caretPos;
//   }

//   onTagSelect(tag: TemplateTag) {
//     this.selectedTagValue = tag.tagName;
//     this.smsTags.forEach((tag) => {
//       tag.isSelected = this.selectedTagValue === tag.tagName;
//     });
//   }
// }
