import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  TagCategoryEnum,
  TagTypeEnum,
  TemplateSubTypeEnum,
  TemplateTypeEnum,
} from 'src/app/shared/enums/template.enum';
import {
  TagValue,
  Template,
  TemplateVersion,
} from 'src/app/shared/models/template.model';
import { TemplateService } from '../../services/template.service';
import { FormModel } from 'src/app/shared/models/dumb-models/form.model';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { InputModel } from 'src/app/shared/models/dumb-models/input.model';
import { TemplateTag } from 'src/app/shared/models/template-tag.model';
import { FormInputTypeEnum } from 'src/app/shared/enums/form-input-type.enum';
import { SelectModel } from 'src/app/shared/models/dumb-models/select.model';
import { TypeaheadModel } from 'src/app/shared/models/dumb-models/typeahead.model';
import {
  ReplaySubject,
  takeUntil,
  of,
  map,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  Subject,
  pairwise,
  startWith,
  filter,
} from 'rxjs';
import { ButtonModel } from 'src/app/shared/models/dumb-models/button-model';
import { ButtonClassEnum } from 'src/app/shared/enums/button-class.enum';
import { ProductTemplateStateService } from '../../services/state-service/product-template-state.service';
import { CurrentProductTemplates } from '../../interface/product-template-state.interface';
import { TextEditorService } from '../../services/text-editor.service';
import { decode } from 'html-entities';
import { FormEmitterService } from 'src/app/shared/dumb/form/form-emitter.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TemplateComponent } from 'src/app/shared/template/template.component';
import { QuotationStateService } from '../../services/state-service/quotation-state.service';
import { OrderMode } from '../../models/quotation-type.model';
import { OrderModeEnum } from '../../enums/order-mode.enum';
import {
  TemplateNameList,
  TemplateNameListStateService,
} from '../../services/state-service/template-name-state.service';
import { Select2Data } from 'ng-select2-component';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-edit-delivery-content',
  templateUrl: './edit-delivery-content.component.html',
  styleUrls: ['./edit-delivery-content.component.scss'],
})
export class EditDeliveryContentComponent implements OnInit, OnDestroy {
  @Input() deliveryDetailsFormGroup!: FormGroup;
  @Output() goBackToOrderWizard = new EventEmitter<{
    orderTemplateId: number;
    productVersionId: number;
  }>();

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  listening = false;
  firstLoad = true;

  disableLoading = false;
  fromSearching = false;
  productVersionId!: number;
  orderTemplateId!: number | null;
  activeTab: number = TemplateTypeEnum.Email;

  voucherPageTemplate!: Template;
  voucherPageTags?: TemplateTag[] = [];
  voucherPageFormGroup!: FormGroup;
  voucherPageTemplateFieldsDefinition!: InputModel[];
  currentVoucherTemplate: Template | null = null;
  tempVoucherTemplate!: Template | undefined;
  focusVoucherTemplate: Subject<boolean> = new Subject();

  smsTemplate!: Template;
  smsTags?: TemplateTag[] = [];
  smsFormGroup!: FormGroup;
  smsTemplateFieldsDefinition!: InputModel[];
  currentSMSTemplate: Template | null = null;
  tempSMSTemplate!: Template | undefined;
  focusSMSTemplate: Subject<boolean> = new Subject();

  // sms template parts
  templatePartFormGroup!: FormGroup;
  selectedPartIndex: number = 0;
  selectedTagValue: string = '';
  tagCategoriesModel!: SelectModel;
  templatePartsModel!: SelectModel;
  filteredTags?: TemplateTag[] = [];

  selectedTagCategory!: string;
  selectedTemplatePart: string = 'One part';
  productId!: number;
  currentSmsTemplate!: Template;
  partMessageValues: string[] = [];
  textAreaCaretPos: number = 0;

  selectedOrderMode!: OrderMode;
  orderTypes = OrderModeEnum;

  voucherTemplateList: Template[] = [];
  smsTemplateList: Template[] = [];
  navigationTabs = [
    {
      id: TemplateTypeEnum.Email,
      name: 'Voucher Page Design',
      content: this.voucherPageTemplate,
    },
    {
      id: TemplateTypeEnum.SMS,
      name: 'SMS Design',
      content: this.smsTemplate,
    },
  ];

  endButtons: ButtonModel[] = [
    {
      label: 'Cancel',
      class: ButtonClassEnum.Secondary,
      disabled: false,
    },
    {
      label: 'Save',
      class: ButtonClassEnum.Primary,
      disabled: true,
    },
  ];

  get TITLE() {
    return this.selectedOrderMode.key === OrderModeEnum.IndirectNonAPI
      ? 'Edit Voucher Page'
      : 'Edit Delivery Content';
  }

  get emailFormModel(): FormModel {
    return {
      formGroup: this.voucherPageFormGroup,
      fieldsDefinition: this.voucherPageTemplateFieldsDefinition,
    };
  }

  get smsFormModel(): FormModel {
    return {
      formGroup: this.smsFormGroup,
      fieldsDefinition: this.smsTemplateFieldsDefinition,
    };
  }

  get voucherTemplateControl() {
    return this.voucherPageFormGroup.get('voucherTemplate');
  }

  get voucherTemplateVersionControl() {
    return this.voucherPageFormGroup.get('templateVersionId');
  }

  get voucherTemplateApplyLanguageControl() {
    return this.voucherPageFormGroup.get('applyLanguage');
  }

  get smsTemplateControl() {
    return this.smsFormGroup?.get('voucherTemplate');
  }

  get smsTemplateVersionControl() {
    return this.smsFormGroup?.get('templateVersionId');
  }

  get smsTemplateApplyLanguageControl() {
    return this.smsFormGroup?.get('applyLanguage');
  }

  get TemplateTypeEnum() {
    return TemplateTypeEnum;
  }

  get templatePart() {
    return this.templatePartFormGroup.get('templatePart');
  }

  get parts() {
    return this.templatePartFormGroup.get('parts') as FormArray;
  }

  get tagCategory() {
    return this.templatePartFormGroup.get('tagCategory');
  }

  get smsVoucherTemplate() {
    return this.smsFormGroup.get('smsVoucherTemplate');
  }

  listenToTemplatePartChange() {
    this.setPartControl(this.templatePart?.value);
    this.templatePart?.valueChanges.subscribe((value) => {
      this.selectedPartIndex = 0;
      if (!isNaN(value)) {
        while (this.parts.length > 0) {
          this.parts.removeAt(0);
        }

        this.setPartControl(value);
      }
    });
  }

  setPartControl(parts: number) {
    if (this.templatePart?.value !== this.parts.controls.length) {
      for (let i = 0; i < parts; i++) {
        this.parts.push(this.formBuilder.control(''));
      }
    }

    const updateVersion = this.tempSMSTemplate?.productTemplateVersion?.find(
      (template) =>
        template.templateVersionId === this.smsTemplateVersionControl?.value
    );

    this.parts.controls[0]?.setValidators(Validators.required);
    switch (parts) {
      case 3: {
        this.parts.controls[0]?.setValue(updateVersion?.content1 || '');
        this.parts.controls[1]?.setValue(updateVersion?.content2 || '');
        this.parts.controls[2]?.setValue(updateVersion?.content3 || '');
        if (!updateVersion) break;

        updateVersion.content1 = updateVersion.content1 ?? '';
        updateVersion.content2 = updateVersion.content2 ?? '';
        updateVersion.content3 = updateVersion.content3 ?? '';
        break;
      }
      case 2: {
        this.parts.controls[0]?.setValue(updateVersion?.content1 || '');
        this.parts.controls[1]?.setValue(updateVersion?.content2 || '');
        this.parts.controls[2]?.setValue('');
        if (!updateVersion) break;

        updateVersion.content1 = updateVersion.content1 ?? '';
        updateVersion.content2 = updateVersion.content2 ?? '';
        updateVersion.content3 = '';
        break;
      }
      default: {
        this.parts.controls[0]?.setValue(updateVersion?.content1 || '');
        this.parts.controls[1]?.setValue('');
        this.parts.controls[2]?.setValue('');

        if (!updateVersion) break;

        updateVersion.content1 = updateVersion.content1 ?? '';
        updateVersion.content2 = '';
        updateVersion.content3 = '';
        break;
      }
    }
  }

  listenToTagCategoryChange() {
    this.tagCategory?.valueChanges.subscribe((value) => {
      this.filteredTags =
        value === 0
          ? this.smsTags
          : this.smsTags?.filter((tag) => tag.category === value);
      this.selectedTagValue = '';
    });
  }

  onInsertTag() {
    const part = this.parts?.controls[this.selectedPartIndex];
    const existingValue = part?.value;
    const newValue =
      this.textAreaCaretPos === 0
        ? existingValue + this.selectedTagValue
        : existingValue.substring(0, this.textAreaCaretPos) +
          this.selectedTagValue +
          existingValue.substring(this.textAreaCaretPos);
    part?.setValue(newValue);
  }

  onFocus(index: number) {
    this.selectedPartIndex = index;
  }

  updatedValueFromDirective(
    value: { caretPos: number; newValue?: string },
    index: number
  ) {
    if (value.newValue) {
      this.parts.controls[index]?.setValue(value.newValue);
    }
    this.textAreaCaretPos = value.caretPos;
  }

  onTagSelect(tag: TemplateTag) {
    this.selectedTagValue = tag.tagName;
    this.smsTags?.forEach((tag) => {
      tag.isSelected = this.selectedTagValue === tag.tagName;
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    private templateService: TemplateService,
    private templateStateService: ProductTemplateStateService,
    private textEditorService: TextEditorService,
    private formEmitterService: FormEmitterService,
    private modalService: NgbModal,
    private quotationStateService: QuotationStateService,
    private templateNameListStateService: TemplateNameListStateService
  ) {}

  ngOnInit(): void {
    this.setSelectedQuotationType();
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  onTabChange($event: TemplateTypeEnum) {
    this.activeTab = $event;
    const templateType =
      $event === TemplateTypeEnum.Email
        ? TemplateTypeEnum.SMS
        : TemplateTypeEnum.Email;
    const templateVersionId =
      $event === TemplateTypeEnum.Email
        ? this.smsTemplateVersionControl?.value
        : this.voucherTemplateVersionControl?.value;

    if (!this.firstLoad) {
      this.softSave(templateType, templateVersionId);

      this.templateStateService.setProductTemplatesByProductVersionId(
        this.productVersionId,
        this.orderTemplateId,
        this.currentVoucherTemplate
          ? ({ ...this.currentVoucherTemplate } as Template)
          : undefined,
        this.tempVoucherTemplate
          ? ({ ...this.tempVoucherTemplate } as Template)
          : undefined,
        this.currentSMSTemplate
          ? ({ ...this.currentSMSTemplate } as Template)
          : undefined,
        this.tempSMSTemplate
          ? ({ ...this.tempSMSTemplate } as Template)
          : undefined,
        true,
        undefined,
        undefined
      );
    }

    this.firstLoad = false;
  }

  setSelectedQuotationType() {
    this.quotationStateService.selectedOrderMode$.subscribe(
      (orderMode) => (this.selectedOrderMode = orderMode)
    );
  }

  initForm(): void {
    // get voucher template list
    this.templateNameListStateService.selectedEmailTemplateList$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((templateNameList: TemplateNameList | undefined) => {
        if (
          !templateNameList ||
          !this.voucherPageTemplateFieldsDefinition ||
          !this.voucherPageFormGroup
        )
          return;

        this.voucherTemplateList = templateNameList.templateList.map(
          (template) => ({ keyword: template.templateName, ...template })
        );

        // update list
        const voucherTemplateField: TypeaheadModel =
          this.emailFormModel.fieldsDefinition.find(
            (field) => field.formControlName === 'voucherTemplate'
          ) as TypeaheadModel;

        voucherTemplateField.list = [...this.voucherTemplateList];

        if (this.fromSearching) {
          this.focusVoucherTemplate.next(true);
          this.fromSearching = false;
        }

        // getTemplate
        const selectedVoucherTemplate: Template | undefined =
          this.voucherTemplateList.find(
            (template) => template.templateName === templateNameList.keyword
          );

        // patch voucherTemplate
        const currentSelected = this.voucherTemplateControl?.value;

        if (
          selectedVoucherTemplate &&
          selectedVoucherTemplate !== currentSelected
        ) {
          this.voucherPageFormGroup.patchValue(
            {
              voucherTemplate: { ...selectedVoucherTemplate },
            },
            {
              emitEvent: false,
              onlySelf: true,
            }
          );
        }
      });

    // get sms template list
    this.templateNameListStateService.selectedSMSTemplateList$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((templateNameList: TemplateNameList | undefined) => {
        if (
          !templateNameList ||
          !this.smsTemplateFieldsDefinition ||
          !this.smsFormGroup
        )
          return;

        this.smsTemplateList = templateNameList.templateList.map(
          (template) => ({ keyword: template.templateName, ...template })
        );

        // update list
        const smsTemplateField: TypeaheadModel =
          this.smsFormModel.fieldsDefinition.find(
            (field) => field.formControlName === 'voucherTemplate'
          ) as TypeaheadModel;

        smsTemplateField.list = [...this.smsTemplateList];

        if (this.fromSearching) {
          this.focusSMSTemplate.next(true);
          this.fromSearching = false;
        }

        // getTemplate
        const selectedVoucherTemplate: Template | undefined =
          this.smsTemplateList.find(
            (template) => template.templateName === templateNameList.keyword
          );

        // patch smsTemplate
        const currentSelected = this.smsTemplateControl?.value;

        if (
          selectedVoucherTemplate &&
          selectedVoucherTemplate !== currentSelected
        ) {
          this.smsFormGroup.patchValue(
            {
              voucherTemplate: { ...selectedVoucherTemplate },
            },
            {
              emitEvent: false,
              onlySelf: true,
            }
          );
        }
      });

    // product template state
    this.templateStateService.productTemplates$
      .pipe(
        takeUntil(this.destroyed$),
        filter(() => !this.disableLoading)
      )
      .subscribe((productTemplateState: CurrentProductTemplates) => {
        this.productVersionId = productTemplateState.currentProductVersionId!;
        if (!this.orderTemplateId) {
          this.orderTemplateId =
            productTemplateState.currentOrderTemplateId ?? null;
        }

        const getCurrentVoucherPageState =
          productTemplateState.productTemplates.find(
            (productTemplate) =>
              productTemplate.productVersionId === this.productVersionId
          );

        // temp templates
        const tempVoucherTemplate = {
          ...getCurrentVoucherPageState?.tempVoucherTemplate,
        };
        const tempSMSTemplate = {
          ...getCurrentVoucherPageState?.tempSmsTemplate,
        };

        // get default template version
        const defaultEmailTemplateVersion = {
          ...tempVoucherTemplate?.defaultTemplateVersion,
        };
        const defaultSMSTemplateVersion = {
          ...tempSMSTemplate?.defaultTemplateVersion,
        };

        // selected templateVersionId from state
        const selectedETVId =
          getCurrentVoucherPageState?.emailTemplateVersionId;
        const selectedSTVId = getCurrentVoucherPageState?.smsTemplateVersionId;

        // get selectedEmailTemplate or defaultTemplate if selected is null
        const selectedEmailTemplateVersion =
          tempVoucherTemplate?.templateVersions
            ?.filter((version) =>
              tempVoucherTemplate.templateVersionLanguages?.some(
                (vl: any) => vl.value === version.templateVersionId
              )
            )
            ?.find((version) => version.templateVersionId === selectedETVId) ??
          defaultEmailTemplateVersion;

        const selectedSMSTemplateVersion =
          tempSMSTemplate?.templateVersions
            ?.filter((version) =>
              tempSMSTemplate.templateVersionLanguages?.some(
                (vl: any) => vl.value === version.templateVersionId
              )
            )
            ?.find((version) => version.templateVersionId === selectedSTVId) ??
          defaultSMSTemplateVersion;

        // set current voucher template
        this.currentVoucherTemplate =
          getCurrentVoucherPageState?.voucherTemplate
            ? ({ ...getCurrentVoucherPageState?.voucherTemplate } as Template)
            : null;

        // set current sms template
        this.currentSMSTemplate = getCurrentVoucherPageState?.smsTemplate
          ? ({ ...getCurrentVoucherPageState?.smsTemplate } as Template)
          : null;

        // TEMPLATE
        if (getCurrentVoucherPageState && selectedEmailTemplateVersion) {
          // patch values to voucher page form group
          const mapTagValues = new Map();
          if (
            getCurrentVoucherPageState &&
            selectedEmailTemplateVersion.templateTagValue &&
            selectedEmailTemplateVersion.templateTagValue.length
          ) {
            selectedEmailTemplateVersion.templateTagValue.map((tagValue) => {
              if (
                selectedEmailTemplateVersion.templateTags?.find(
                  (tag) => tag.tagId === tagValue.tagId
                )?.type === TagTypeEnum.RadioGroup
              ) {
                tagValue.value = parseInt(tagValue.value) as any;
              }
              mapTagValues.set(tagValue.tagId, tagValue.value);
            });
          }
          const toObject: any = {};
          mapTagValues.forEach((value, key) => {
            toObject[key] = value;
          });

          // get voucher page tags
          this.voucherPageTags = selectedEmailTemplateVersion.templateTags
            ? [...selectedEmailTemplateVersion.templateTags]
            : [];

          // define voucher page
          this.definePageDesign(TemplateTypeEnum.Email, false);

          // set templateNameList options
          if (
            this.voucherTemplateControl?.value?.templateName !==
            selectedEmailTemplateVersion.templateName
          ) {
            this.templateNameListStateService.setSelectedEmailTemplateNameState(
              selectedEmailTemplateVersion.templateName
            );
          }

          // set template version language on the select2data
          const voucherTemplateVersionField =
            this.emailFormModel.fieldsDefinition.find(
              (field) => field.formControlName === 'templateVersionId'
            );
          voucherTemplateVersionField!.select2Data = [
            ...(tempVoucherTemplate?.templateVersionLanguages as Select2Data),
          ];

          // version, applyLanguageValue and dynamic values
          this.voucherPageFormGroup.patchValue(
            {
              templateVersionId: selectedEmailTemplateVersion.templateVersionId,
              applyLanguage:
                (selectedEmailTemplateVersion.templateTagValue &&
                  !!selectedEmailTemplateVersion.templateTagValue.length) ||
                selectedEmailTemplateVersion.templateVersionId ===
                  defaultEmailTemplateVersion?.templateVersionId,
              ...toObject,
            },
            {
              emitEvent: !this.voucherTemplateVersionControl?.value,
              onlySelf: this.voucherTemplateVersionControl?.value,
            }
          );

          // hide fields
          if (!selectedEmailTemplateVersion.templateVersionId) {
            this.voucherPageTemplateFieldsDefinition
              .filter((field) => field.formControlName !== 'voucherTemplate')
              .forEach((field) => (field.hidden = true));
            this.voucherPageTemplateFieldsDefinition
              .filter((field) => field.formControlName === 'voucherTemplate')
              .forEach((field) => {
                (field as TypeaheadModel).withPreview = false;
              });
          }

          // toggle voucherTemplateVersionControl
          if (
            tempVoucherTemplate?.templateVersionLanguages &&
            tempVoucherTemplate?.templateVersionLanguages?.length > 1
          ) {
            this.voucherTemplateVersionControl?.enable({
              emitEvent: false,
              onlySelf: true,
            });
          } else {
            this.voucherTemplateVersionControl?.disable({
              emitEvent: false,
              onlySelf: true,
            });
          }
          this.voucherTemplateVersionControl?.markAsPristine();
          this.voucherTemplateVersionControl?.updateValueAndValidity({
            emitEvent: false,
            onlySelf: true,
          });

          // toggle applyLanguage
          if (
            defaultEmailTemplateVersion &&
            this.voucherTemplateVersionControl?.value ===
              defaultEmailTemplateVersion.templateVersionId
          ) {
            this.voucherTemplateApplyLanguageControl?.disable();
          } else {
            this.voucherTemplateApplyLanguageControl?.enable();
          }
        } else {
          // empty tags
          this.voucherPageTags = [];

          // define voucher page
          this.definePageDesign(TemplateTypeEnum.Email, true);
        }

        // SMS
        if (getCurrentVoucherPageState && selectedSMSTemplateVersion) {
          // patch values to voucher page form group
          const mapTagValues = new Map();
          if (
            getCurrentVoucherPageState &&
            selectedSMSTemplateVersion.templateTagValue &&
            selectedSMSTemplateVersion.templateTagValue.length
          ) {
            selectedSMSTemplateVersion.templateTagValue.map((tagValue) =>
              mapTagValues.set(tagValue.tagId, tagValue.value)
            );
          }
          const toObject: any = {};
          mapTagValues.forEach((value, key) => {
            toObject[key] = value;
          });

          // get sms tags
          this.smsTags = selectedSMSTemplateVersion.templateTags
            ? [...selectedSMSTemplateVersion.templateTags]
            : [];

          // define sms form group
          this.definePageDesign(TemplateTypeEnum.SMS, false);

          // set templateNameList options
          if (
            this.smsTemplateControl?.value?.templateName !==
            selectedSMSTemplateVersion.templateName
          ) {
            this.templateNameListStateService.setSelectedSMSTemplateNameState(
              selectedSMSTemplateVersion.templateName
            );
          }

          // set template version language on the select2data
          const smsTemplateVersionField =
            this.smsFormModel.fieldsDefinition.find(
              (field) => field.formControlName === 'templateVersionId'
            );
          smsTemplateVersionField!.select2Data = [
            ...(tempSMSTemplate?.templateVersionLanguages as Select2Data),
          ];

          // version, applyLanguageValue and dynamic values
          this.smsFormGroup.patchValue(
            {
              templateVersionId: selectedSMSTemplateVersion.templateVersionId,
              applyLanguage:
                (selectedSMSTemplateVersion.templateTagValue &&
                  !!selectedSMSTemplateVersion.templateTagValue.length) ||
                selectedSMSTemplateVersion.templateVersionId ===
                  defaultSMSTemplateVersion?.templateVersionId,
              ...toObject,
            },
            {
              emitEvent: !this.smsTemplateVersionControl?.value,
              onlySelf: this.smsTemplateVersionControl?.value,
            }
          );

          if (this.orderTemplateId) {
            const tvId = selectedSMSTemplateVersion.templateVersionId;
            let templatePart: TemplateVersion | undefined =
              tempSMSTemplate.productTemplateVersion?.find(
                (template) => template.templateVersionId === tvId
              );

            if (!templatePart?.content1) {
              templatePart = selectedSMSTemplateVersion as TemplateVersion;
            }

            // template parts
            this.templatePartFormGroup.patchValue({
              templatePart: templatePart.content3
                ? 3
                : templatePart.content2
                ? 2
                : 1,
              parts: [
                templatePart.content1,
                templatePart.content2,
                templatePart.content3,
              ],
              tagCategory: null,
            });
          }

          // hide fields
          if (!selectedSMSTemplateVersion.templateVersionId) {
            this.smsTemplateFieldsDefinition
              .filter((field) => field.formControlName !== 'voucherTemplate')
              .forEach((field) => (field.hidden = true));
            this.smsTemplateFieldsDefinition
              .filter((field) => field.formControlName === 'voucherTemplate')
              .forEach((field) => {
                (field as TypeaheadModel).withPreview = false;
              });
          }

          // toggle smsTemplateVersionControl
          if (
            tempSMSTemplate?.templateVersionLanguages &&
            tempSMSTemplate?.templateVersionLanguages?.length > 1
          ) {
            this.smsTemplateVersionControl?.enable({
              emitEvent: false,
              onlySelf: true,
            });
          } else {
            this.smsTemplateVersionControl?.disable({
              emitEvent: false,
              onlySelf: true,
            });
          }
          this.smsTemplateVersionControl?.markAsPristine();
          this.smsTemplateVersionControl?.updateValueAndValidity({
            emitEvent: false,
            onlySelf: true,
          });

          // toggle applyLanguage
          if (
            defaultSMSTemplateVersion &&
            this.smsTemplateVersionControl?.value ===
              defaultSMSTemplateVersion.templateVersionId
          ) {
            this.smsTemplateApplyLanguageControl?.disable();
          } else {
            this.smsTemplateApplyLanguageControl?.enable();
          }
        } else {
          // empty tags
          this.smsTags = [];

          // define voucher page
          this.definePageDesign(TemplateTypeEnum.SMS, true);
        }

        // add content value for default SMS
        if (
          this.orderTemplateId &&
          tempSMSTemplate.templateVersionId ===
            this.smsTemplateVersionControl?.value
        ) {
          const defaultTVId = defaultSMSTemplateVersion?.templateVersionId;
          const getVersion = tempSMSTemplate?.productTemplateVersion?.find(
            (template) => template.templateVersionId === defaultTVId
          );

          if (getVersion) {
            getVersion.content1 =
              getVersion.content1 ??
              (defaultSMSTemplateVersion as Template).content1;
            getVersion.content2 =
              getVersion.content2 ??
              (defaultSMSTemplateVersion as Template).content2;
            getVersion.content3 =
              getVersion.content3 ??
              (defaultSMSTemplateVersion as Template).content3;
          } else {
            tempSMSTemplate.productTemplateVersion = [
              {
                templateVersionId: tempSMSTemplate.templateVersionId,
                templateTagValue: this.mapTagValueList(TemplateTypeEnum.SMS),
                content1: this.orderTemplateId
                  ? this.parts.controls[0]?.value
                  : tempSMSTemplate.content1,
                content2: this.orderTemplateId
                  ? this.parts.controls[1]?.value ?? ''
                  : tempSMSTemplate.content2,
                content3: this.orderTemplateId
                  ? this.parts.controls[2]?.value ?? ''
                  : tempSMSTemplate.content3,
              } as TemplateVersion,
            ];
          }
        }

        // listen once
        if (!this.listening) {
          this.listenToVoucherTemplateChange();
          this.listenToVoucherTemplateVersionChange(
            defaultEmailTemplateVersion?.templateVersionId ?? null
          );
          this.listenToSMSTemplateChange();
          this.listenToSMSTemplateVersionChange(
            defaultSMSTemplateVersion?.templateVersionId ?? null
          );

          this.listenToPreviewClick();

          if (this.orderTemplateId) {
            this.listenToTagCategoryChange();
            this.listenToTemplatePartChange();
          }
          this.listening = true;
        }

        this.applyVoucherPageDefaultValues();
        this.applySMSDefaultValues();

        this.tempVoucherTemplate =
          (tempVoucherTemplate as Template) ?? undefined;
        this.tempSMSTemplate = (tempSMSTemplate as Template) ?? undefined;
      });
  }

  listenToVoucherTemplateChange() {
    // email
    this.voucherTemplateControl?.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        filter(() => !this.disableLoading),
        switchMap((templateName) => {
          if (
            typeof templateName === 'string' ||
            templateName instanceof String ||
            !templateName
          ) {
            this.templateNameListStateService.setSelectedEmailTemplateNameState(
              templateName as string
            );
            this.fromSearching = true;
            this.voucherPageTemplateFieldsDefinition
              .filter((field) => field.formControlName !== 'voucherTemplate')
              .forEach((field) => (field.hidden = true));
            this.voucherPageTemplateFieldsDefinition
              .filter((field) => field.formControlName === 'voucherTemplate')
              .forEach((field) => {
                (field as TypeaheadModel).withPreview = false;
              });
            return of(null);
          } else {
            this.voucherPageTemplateFieldsDefinition.forEach(
              (field) => (field.hidden = false)
            );
            this.voucherPageTemplateFieldsDefinition
              .filter((field) => field.formControlName === 'voucherTemplate')
              .forEach((field) => {
                (field as TypeaheadModel).withPreview = true;
              });
            return of({ ...templateName });
          }
        }),
        // get template full details
        switchMap((template) => {
          if (!template) return of(null);

          return this.templateService
            .getTemplateFullDetails(template, TemplateTypeEnum.Email)
            .pipe(
              map((template) => {
                return template;
              })
            );
        })
      )
      .subscribe({
        next: (template: Template | null) => {
          if (!template) {
            this.templateStateService.setProductTemplatesByProductVersionId(
              this.productVersionId,
              this.orderTemplateId,
              { ...this.currentVoucherTemplate } as Template,
              undefined,
              { ...this.currentSMSTemplate } as Template,
              { ...this.tempSMSTemplate } as Template,
              true
            );
            return;
          }

          this.tempVoucherTemplate = { ...template };
          this.templateStateService.setProductTemplatesByProductVersionId(
            this.productVersionId,
            this.orderTemplateId,
            { ...this.currentVoucherTemplate } as Template,
            { ...template } as Template,
            { ...this.currentSMSTemplate } as Template,
            { ...this.tempSMSTemplate } as Template,
            true
          );
        },
      });

    this.voucherPageFormGroup.valueChanges.subscribe({
      next: () => {
        this.endButtons.find(
          (button) => button.label.toLowerCase() === 'save'
        )!.disabled = this.voucherPageFormGroup.invalid;
      },
    });
  }

  listenToSMSTemplateChange() {
    // sms
    this.smsTemplateControl?.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        filter(() => !this.disableLoading),
        switchMap((templateName) => {
          if (
            typeof templateName === 'string' ||
            templateName instanceof String ||
            !templateName
          ) {
            this.templateNameListStateService.setSelectedSMSTemplateNameState(
              templateName as string
            );
            this.fromSearching = true;
            this.smsTemplateFieldsDefinition
              .filter((field) => field.formControlName !== 'voucherTemplate')
              .forEach((field) => (field.hidden = true));
            this.smsTemplateFieldsDefinition
              .filter((field) => field.formControlName === 'voucherTemplate')
              .forEach((field) => {
                (field as TypeaheadModel).withPreview = false;
              });
            return of(null);
          } else {
            this.smsTemplateFieldsDefinition.forEach(
              (field) => (field.hidden = false)
            );
            this.smsTemplateFieldsDefinition
              .filter((field) => field.formControlName === 'voucherTemplate')
              .forEach((field) => {
                (field as TypeaheadModel).withPreview = true;
              });
            return of({ ...templateName });
          }
        }),
        // get template full details
        switchMap((template) => {
          if (!template) return of(null);

          return this.templateService
            .getTemplateFullDetails(template, TemplateTypeEnum.SMS)
            .pipe(
              map((template) => {
                return template;
              })
            );
        })
      )
      .subscribe({
        next: (template: Template | null) => {
          if (!template) {
            this.templateStateService.setProductTemplatesByProductVersionId(
              this.productVersionId,
              this.orderTemplateId,
              { ...this.currentVoucherTemplate } as Template,
              { ...this.tempVoucherTemplate } as Template,
              { ...this.currentSMSTemplate } as Template,
              undefined,
              true
            );
            return;
          }

          this.tempSMSTemplate = { ...template };
          this.templateStateService.setProductTemplatesByProductVersionId(
            this.productVersionId,
            this.orderTemplateId,
            { ...this.currentVoucherTemplate } as Template,
            { ...this.tempVoucherTemplate } as Template,
            { ...this.currentSMSTemplate } as Template,
            { ...template } as Template,
            true
          );
        },
      });

    this.smsFormGroup.valueChanges.subscribe({
      next: () => {
        this.endButtons.find(
          (button) => button.label.toLowerCase() === 'save'
        )!.disabled = this.smsFormGroup.invalid;
      },
    });
  }

  listenToVoucherTemplateVersionChange(emailTemplateVersionId: number | null) {
    // email
    this.voucherTemplateVersionControl?.valueChanges
      .pipe(
        distinctUntilChanged(),
        filter(() => !this.disableLoading),
        startWith(emailTemplateVersionId),
        pairwise(),
        switchMap(([prevVersion, nextVersion]) => {
          if (!nextVersion) return of(null);

          if (prevVersion) {
            this.softSave(TemplateTypeEnum.Email, prevVersion);
          }

          const getTemplateVersion =
            this.tempVoucherTemplate?.templateVersions?.filter(
              (version) => version.templateVersionId === nextVersion
            )[0];

          if (
            getTemplateVersion &&
            getTemplateVersion.templateTags &&
            getTemplateVersion.templateTags.length
          ) {
            this.loadSaveTagValues(getTemplateVersion, TemplateTypeEnum.Email);

            return of(nextVersion);
          } else {
            return this.templateService
              .getTemplateTagsByVersionId(nextVersion)
              .pipe(
                map((tags) => {
                  if (!getTemplateVersion) return nextVersion;
                  getTemplateVersion.templateTags = tags;
                  this.loadSaveTagValues(
                    getTemplateVersion,
                    TemplateTypeEnum.Email
                  );
                  return nextVersion;
                })
              );
          }
        })
      )
      .subscribe((value) => {
        if (!value) return;

        this.templateStateService.setProductTemplatesByProductVersionId(
          this.productVersionId,
          this.orderTemplateId,
          { ...this.currentVoucherTemplate } as Template,
          { ...this.tempVoucherTemplate } as Template,
          { ...this.currentSMSTemplate } as Template,
          { ...this.tempSMSTemplate } as Template,
          true,
          value
        );
      });
  }

  listenToSMSTemplateVersionChange(smsTemplateVersionId: number | null) {
    // sms
    this.smsTemplateVersionControl?.valueChanges
      .pipe(
        distinctUntilChanged(),
        filter(() => !this.disableLoading),
        startWith(smsTemplateVersionId),
        pairwise(),
        switchMap(([prevVersion, nextVersion]) => {
          if (!nextVersion) return of(null);

          if (prevVersion) {
            this.softSave(TemplateTypeEnum.SMS, prevVersion);
          }

          const getTemplateVersion =
            this.tempSMSTemplate?.templateVersions?.filter(
              (version) => version.templateVersionId === nextVersion
            )[0];

          if (
            getTemplateVersion &&
            getTemplateVersion.templateTags &&
            getTemplateVersion.templateTags.length
          ) {
            this.loadSaveTagValues(getTemplateVersion, TemplateTypeEnum.SMS);
            const updateVersion =
              this.tempSMSTemplate?.productTemplateVersion?.find(
                (template) => template.templateVersionId === nextVersion
              );
            if (!updateVersion) {
              this.tempSMSTemplate?.productTemplateVersion?.push({
                templateVersionId: nextVersion,
                content1: getTemplateVersion.content1,
                content2: getTemplateVersion.content2,
                content3: getTemplateVersion.content3,
              } as TemplateVersion);
              return of(nextVersion);
            }
            updateVersion.content1 =
              updateVersion.content1 ?? getTemplateVersion.content1;
            updateVersion.content2 =
              updateVersion.content2 ?? getTemplateVersion.content2;
            updateVersion.content3 =
              updateVersion.content3 ?? getTemplateVersion.content3;
            return of(nextVersion);
          } else {
            return this.templateService
              .getTemplateTagsByVersionId(nextVersion)
              .pipe(
                map((tags) => {
                  if (!getTemplateVersion) return nextVersion;
                  getTemplateVersion.templateTags = tags;
                  this.loadSaveTagValues(
                    getTemplateVersion,
                    TemplateTypeEnum.SMS
                  );

                  const updateVersion =
                    this.tempSMSTemplate?.productTemplateVersion?.find(
                      (template) => template.templateVersionId === nextVersion
                    );

                  if (!updateVersion) {
                    this.tempSMSTemplate?.productTemplateVersion?.push({
                      templateVersionId: nextVersion,
                      content1: getTemplateVersion.content1,
                      content2: getTemplateVersion.content2,
                      content3: getTemplateVersion.content3,
                    } as TemplateVersion);
                    return nextVersion;
                  }

                  updateVersion.content1 =
                    updateVersion.content1 ?? getTemplateVersion.content1;
                  updateVersion.content2 =
                    updateVersion.content2 ?? getTemplateVersion.content2;
                  updateVersion.content3 =
                    updateVersion.content3 ?? getTemplateVersion.content3;
                  return nextVersion;
                })
              );
          }
        })
      )
      .subscribe((value) => {
        if (!value) return;

        this.templateStateService.setProductTemplatesByProductVersionId(
          this.productVersionId,
          this.orderTemplateId,
          { ...this.currentVoucherTemplate } as Template,
          { ...this.tempVoucherTemplate } as Template,
          { ...this.currentSMSTemplate } as Template,
          { ...this.tempSMSTemplate } as Template,
          true,
          undefined,
          value
        );
      });
  }

  listenToPreviewClick() {
    this.formEmitterService.emitEvent
      .pipe(
        takeUntil(this.destroyed$),
        switchMap((formControlName: string) => {
          if (formControlName === 'voucherTemplate') {
            return this.templateService.getTemplateDetails(
              this.activeTab === TemplateTypeEnum.Email
                ? TemplateTypeEnum.Email
                : TemplateTypeEnum.SMS,
              this.activeTab === TemplateTypeEnum.Email
                ? TemplateSubTypeEnum.Voucher
                : TemplateSubTypeEnum.SMS,
              this.activeTab === TemplateTypeEnum.Email
                ? [this.voucherTemplateVersionControl?.value]
                : [this.smsTemplateVersionControl?.value]
            );
          } else {
            return of(null);
          }
        })
      )
      .subscribe((templateVersions: TemplateVersion[] | null) => {
        if (!templateVersions) return;

        const modalRef = this.modalService.open(TemplateComponent, {
          size: 'lg',
          backdrop: 'static',
          centered: true,
          modalDialogClass:
            templateVersions[0].type === TemplateTypeEnum.Email
              ? 'table-centered'
              : '',
        });
        const template: Template = {
          ...templateVersions[0],
        };
        template.templateTags =
          templateVersions[0].type === TemplateTypeEnum.Email
            ? this.voucherPageTags
            : this.smsTags;
        template.templateTagValue = this.mapTagValueList(
          templateVersions[0].type
        );
        modalRef.componentInstance.activeTab = template.type;
        modalRef.componentInstance.showVoucherTemplate = true;
        modalRef.componentInstance.emailTemplate =
          template.type === TemplateTypeEnum.Email ? template : undefined;
        modalRef.componentInstance.smsTemplate =
          template.type === TemplateTypeEnum.SMS ? template : undefined;
        modalRef.componentInstance.applyTagValues();
      });
  }

  applyVoucherPageDefaultValues() {
    const emailSubjectFormControlName =
      this.voucherPageTemplateFieldsDefinition.filter(
        (field) => field.label?.toLowerCase() === 'emailsubject'
      )[0]?.formControlName;
    const greetingsFormControlName =
      this.voucherPageTemplateFieldsDefinition.filter(
        (field) => field.label?.toLowerCase() === 'greetings'
      )[0]?.formControlName;

    const emailSubjectControl = this.voucherPageFormGroup.get(
      emailSubjectFormControlName
    );
    const defaultEmailSubjectValue =
      this.deliveryDetailsFormGroup.get('emailSubject')?.value;
    const emailGreetingsControl = this.voucherPageFormGroup.get(
      greetingsFormControlName
    );
    const defaultEmailGreetingValue =
      this.deliveryDetailsFormGroup.get('emailGreeting')?.value;

    if (
      emailSubjectControl &&
      defaultEmailSubjectValue &&
      !emailSubjectControl.value
    ) {
      emailSubjectControl.patchValue(defaultEmailSubjectValue, {
        emitEvent: false,
        onlySelf: true,
      });
    }

    if (
      emailGreetingsControl &&
      defaultEmailGreetingValue &&
      !emailGreetingsControl.value
    ) {
      emailGreetingsControl.patchValue(defaultEmailGreetingValue, {
        emitEvent: false,
        onlySelf: true,
      });
    }
  }

  applySMSDefaultValues() {
    const smsGreetingsFormControlName = this.smsTemplateFieldsDefinition.filter(
      (field) => field.label?.toLowerCase() === 'smsgreetings'
    )[0]?.formControlName;

    const smsGreetingsFormControl = this.smsFormGroup.get(
      smsGreetingsFormControlName
    );

    const defaultSMSGreetingValue =
      this.deliveryDetailsFormGroup.get('smsGreeting')?.value;

    if (
      smsGreetingsFormControl &&
      defaultSMSGreetingValue &&
      !smsGreetingsFormControl.value
    ) {
      smsGreetingsFormControl.patchValue(defaultSMSGreetingValue, {
        emitEvent: false,
        onlySelf: true,
      });
    }
  }

  definePageDesign(
    templateType: TemplateTypeEnum,
    hideTemplateVersionId = false
  ) {
    // create voucher page dynamic form
    if (!this.voucherPageFormGroup && templateType === TemplateTypeEnum.Email) {
      this.voucherPageFormGroup = this.createStaticFormGroup();
    }

    if (!this.smsFormGroup && templateType === TemplateTypeEnum.SMS) {
      this.smsFormGroup = this.createStaticFormGroup();

      if (this.orderTemplateId) {
        this.templatePartFormGroup = this.formBuilder.group({
          templatePart: {
            value: 1,
            disabled: false,
          },
          parts: this.formBuilder.array([]),
          tagCategory: null,
        });

        this.setTemplatePartFieldsDefinition();
      }
    }

    if (templateType === TemplateTypeEnum.Email) {
      this.resetDynamicControls(TemplateTypeEnum.Email);

      // create voucher page template definition
      if (!this.voucherPageTemplateFieldsDefinition) {
        this.voucherPageTemplateFieldsDefinition =
          this.createDynamicFieldsDefinition(
            TemplateTypeEnum.Email,
            hideTemplateVersionId
          );
      } else {
        this.resetDynamicFields(TemplateTypeEnum.Email);
      }
    } else {
      this.resetDynamicControls(TemplateTypeEnum.SMS);

      // create sms template definition
      if (!this.smsTemplateFieldsDefinition) {
        this.smsTemplateFieldsDefinition = this.createDynamicFieldsDefinition(
          TemplateTypeEnum.SMS,
          hideTemplateVersionId
        );
      } else {
        this.resetDynamicFields(TemplateTypeEnum.SMS);
      }
    }
  }

  createStaticFormGroup(): FormGroup {
    let formGroup: FormGroup | null = null;
    formGroup = this.formBuilder.group({
      voucherTemplate: {
        value: null,
        disabled: false,
      },
      templateVersionId: { value: null, disabled: false },
      applyLanguage: { value: true, disabled: false },
    });

    return formGroup as FormGroup;
  }

  resetDynamicControls(templateType: TemplateTypeEnum) {
    if (templateType === TemplateTypeEnum.Email) {
      if (!this.voucherPageTags) return;

      Object.keys(this.voucherPageFormGroup.controls).forEach((control) => {
        if (!isNaN(control as any)) {
          this.voucherPageFormGroup.removeControl(control);
        }
      });

      for (const templateTag of this.voucherPageTags) {
        let value = [
          TagCategoryEnum.UserInputWithDefault,
          TagCategoryEnum.SelectedBySystem,
        ].includes(templateTag.category)
          ? templateTag.defaultValue
          : null;

        if (templateTag.type === TagTypeEnum.RadioGroup) {
          value =
            templateTag.options?.find((opt) => opt.isDefault)?.value ?? null;
        }

        this.voucherPageFormGroup.addControl(
          templateTag.tagId.toString(),
          new FormControl({
            value: value,
            disabled: templateTag.category === TagCategoryEnum.SelectedBySystem,
          })
        );
      }
    } else {
      if (!this.smsTags) return;

      Object.keys(this.smsFormGroup.controls).forEach((control) => {
        if (!isNaN(control as any)) {
          this.smsFormGroup.removeControl(control);
        }
      });

      for (const templateTag of this.smsTags) {
        const value = [
          TagCategoryEnum.UserInputWithDefault,
          TagCategoryEnum.SelectedBySystem,
        ].includes(templateTag.category)
          ? templateTag.defaultValue
          : null;
        this.smsFormGroup.addControl(
          templateTag.tagId.toString(),
          new FormControl({
            value: value,
            disabled: templateTag.category === TagCategoryEnum.SelectedBySystem,
          })
        );
      }
    }
  }

  createDynamicFieldsDefinition(
    templateType: TemplateTypeEnum,
    hideTemplateVersionId = false
  ): InputModel[] {
    const voucherTemplate: TypeaheadModel = {
      type: FormInputTypeEnum.Typeahead,
      label: 'Voucher template',
      formControlName: 'voucherTemplate',
      placeholder: 'Search voucher template',
      required: false,
      withPreview: !hideTemplateVersionId,
      takeAllRow: true,
      list:
        templateType === TemplateTypeEnum.Email
          ? this.voucherTemplateList
          : this.smsTemplateList,
      focusTypeAhead:
        templateType === TemplateTypeEnum.Email
          ? this.focusVoucherTemplate
          : this.focusSMSTemplate,
    };

    const templateVersionId: SelectModel = {
      type: FormInputTypeEnum.Select,
      label: 'Language',
      formControlName: 'templateVersionId',
      required: false,
      hidden: hideTemplateVersionId,
      select2Data: [],
    };

    const applyLanguage: InputModel = {
      type: FormInputTypeEnum.ToggleButton,
      label: 'Apply Language',
      formControlName: 'applyLanguage',
      hidden: hideTemplateVersionId,
      required: false,
    };

    const dynamicFields: InputModel[] = [];
    const templateTags =
      (templateType === TemplateTypeEnum.Email
        ? this.voucherPageTags
        : this.smsTags) ?? [];

    for (const templateTag of [
      ...templateTags.filter(
        (tag) => ![TagCategoryEnum.System].includes(tag.category)
      ),
    ]) {
      switch (templateTag.type) {
        case TagTypeEnum.Image: {
          dynamicFields.push({
            type: FormInputTypeEnum.ImageSearch,
            label: templateTag.displayName,
            formControlName: templateTag.tagId.toString(),
            required: false,
            takeAllRow: true,
          });
          break;
        }
        case TagTypeEnum.RichText: {
          dynamicFields.push({
            type: FormInputTypeEnum.RichTextEditor,
            label: templateTag.displayName,
            formControlName: templateTag.tagId.toString(),
            required: false,
            takeAllRow: true,
          });
          break;
        }
        case TagTypeEnum.RadioGroup: {
          dynamicFields.push({
            type: FormInputTypeEnum.RadioButton,
            label: templateTag.displayName,
            formControlName: templateTag.tagId.toString(),
            required: false,
            options: templateTag.options,
          });
          break;
        }
        case TagTypeEnum.HTMLText: {
          dynamicFields.push({
            type: FormInputTypeEnum.HTMLEditor,
            label: templateTag.displayName,
            formControlName: templateTag.tagId.toString(),
            required: false,
          });
          break;
        }
        default: {
          dynamicFields.push({
            type: FormInputTypeEnum.Textbox,
            label: templateTag.displayName,
            formControlName: templateTag.tagId.toString(),
            required: false,
          });
          break;
        }
      }
    }

    return [
      voucherTemplate,
      templateVersionId,
      applyLanguage,
      ...dynamicFields,
    ];
  }

  staticFields = ['voucherTemplate', 'templateVersionId', 'applyLanguage'];

  resetDynamicFields(templateType: TemplateTypeEnum) {
    const templateTags =
      (templateType === TemplateTypeEnum.Email
        ? this.voucherPageTags
        : this.smsTags) ?? [];

    const dynamicFields: InputModel[] = [];

    for (const templateTag of [
      ...templateTags.filter(
        (tag) => ![TagCategoryEnum.System].includes(tag.category)
      ),
    ]) {
      switch (templateTag.type) {
        case TagTypeEnum.Image: {
          dynamicFields.push({
            type: FormInputTypeEnum.ImageSearch,
            label: templateTag.displayName,
            formControlName: templateTag.tagId.toString(),
            required: false,
            takeAllRow: true,
          });
          break;
        }
        case TagTypeEnum.RichText: {
          dynamicFields.push({
            type: FormInputTypeEnum.RichTextEditor,
            label: templateTag.displayName,
            formControlName: templateTag.tagId.toString(),
            required: false,
            takeAllRow: true,
          });
          break;
        }
        case TagTypeEnum.RadioGroup: {
          dynamicFields.push({
            type: FormInputTypeEnum.RadioButton,
            label: templateTag.displayName,
            formControlName: templateTag.tagId.toString(),
            required: false,
            options: templateTag.options,
          });
          break;
        }
        case TagTypeEnum.HTMLText: {
          dynamicFields.push({
            type: FormInputTypeEnum.HTMLEditor,
            label: templateTag.displayName,
            formControlName: templateTag.tagId.toString(),
            required: false,
          });
          break;
        }
        default: {
          dynamicFields.push({
            type: FormInputTypeEnum.Textbox,
            label: templateTag.displayName,
            formControlName: templateTag.tagId.toString(),
            required: false,
          });
          break;
        }
      }
    }

    if (templateType === TemplateTypeEnum.Email) {
      this.voucherPageTemplateFieldsDefinition = [
        // filter dynamic tags
        ...this.voucherPageTemplateFieldsDefinition.filter((field) =>
          this.staticFields.includes(field.formControlName)
        ),
        // add new tags
        ...dynamicFields,
      ];
    } else {
      this.smsTemplateFieldsDefinition = [
        // filter dynamic tags
        ...this.smsTemplateFieldsDefinition.filter((field) =>
          this.staticFields.includes(field.formControlName)
        ),
        // add new tags
        ...dynamicFields,
      ];
    }
  }

  softSave(templateType: TemplateTypeEnum, templateVersionId: number) {
    if (templateType === TemplateTypeEnum.Email) {
      if (
        !this.tempVoucherTemplate ||
        !this.tempVoucherTemplate.defaultTemplateVersion ||
        !this.voucherTemplateApplyLanguageControl?.value
      ) {
        return;
      }

      // for preview
      if (
        this.tempVoucherTemplate.defaultTemplateVersion &&
        this.tempVoucherTemplate.defaultTemplateVersion.templateVersionId ===
          templateVersionId
      ) {
        this.tempVoucherTemplate.defaultTemplateVersion.templateTagValue =
          this.mapTagValueList(TemplateTypeEnum.Email);
      }

      // for saving the version
      const templateVersion =
        this.tempVoucherTemplate.productTemplateVersion?.filter(
          (version) => version.templateVersionId === templateVersionId
        );

      // replace
      if (templateVersion && templateVersion.length) {
        templateVersion.forEach(
          (version) =>
            (version.templateTagValue = this.mapTagValueList(
              TemplateTypeEnum.Email
            ))
        );
      } else {
        // have productTemplateVersion but current templateVersionId doesnt exist
        if (
          this.tempVoucherTemplate.productTemplateVersion &&
          this.tempVoucherTemplate.productTemplateVersion.length
        ) {
          this.tempVoucherTemplate.productTemplateVersion = [
            ...this.tempVoucherTemplate.productTemplateVersion,
            {
              templateVersionId: templateVersionId,
              templateTagValue: this.mapTagValueList(TemplateTypeEnum.Email),
            } as TemplateVersion,
          ];
        } else {
          // doesnt have productTemplateVersion
          this.tempVoucherTemplate.productTemplateVersion = [
            {
              templateVersionId: templateVersionId,
              templateTagValue: this.mapTagValueList(TemplateTypeEnum.Email),
            } as TemplateVersion,
          ];
        }
      }
    } else {
      if (
        !this.tempSMSTemplate ||
        !this.tempSMSTemplate.defaultTemplateVersion ||
        !this.smsTemplateApplyLanguageControl?.value
      ) {
        return;
      }

      // for preview
      if (
        this.tempSMSTemplate.defaultTemplateVersion &&
        this.tempSMSTemplate.defaultTemplateVersion.templateVersionId ===
          templateVersionId
      ) {
        this.tempSMSTemplate.defaultTemplateVersion.templateTagValue =
          this.mapTagValueList(TemplateTypeEnum.SMS);
      }

      // for saving the version
      const templateVersion =
        this.tempSMSTemplate.productTemplateVersion?.filter(
          (version) => version.templateVersionId === templateVersionId
        );

      // replace
      if (templateVersion && templateVersion.length) {
        templateVersion.forEach((version) => {
          version.templateTagValue = this.mapTagValueList(TemplateTypeEnum.SMS);
          version.content1 = this.orderTemplateId
            ? this.parts.controls[0]?.value ?? ''
            : this.tempSMSTemplate?.content1;
          version.content2 = this.orderTemplateId
            ? this.parts.controls[1]?.value ?? ''
            : this.tempSMSTemplate?.content2;
          version.content3 = this.orderTemplateId
            ? this.parts.controls[2]?.value ?? ''
            : this.tempSMSTemplate?.content3;
        });
      } else {
        // have productTemplateVersion but current templateVersionId doesnt exist
        if (
          this.tempSMSTemplate.productTemplateVersion &&
          this.tempSMSTemplate.productTemplateVersion.length
        ) {
          this.tempSMSTemplate.productTemplateVersion = [
            ...this.tempSMSTemplate.productTemplateVersion,
            {
              templateVersionId: templateVersionId,
              templateTagValue: this.mapTagValueList(TemplateTypeEnum.SMS),
              content1: this.orderTemplateId
                ? this.parts.controls[0]?.value
                : this.tempSMSTemplate.content1,
              content2: this.orderTemplateId
                ? this.parts.controls[1]?.value ?? ''
                : this.tempSMSTemplate.content2,
              content3: this.orderTemplateId
                ? this.parts.controls[2]?.value ?? ''
                : this.tempSMSTemplate.content3,
            } as TemplateVersion,
          ];
        } else {
          // doesnt have productTemplateVersion
          this.tempSMSTemplate.productTemplateVersion = [
            {
              templateVersionId: templateVersionId,
              templateTagValue: this.mapTagValueList(TemplateTypeEnum.SMS),
              content1: this.orderTemplateId
                ? this.parts.controls[0]?.value
                : this.tempSMSTemplate.content1,
              content2: this.orderTemplateId
                ? this.parts.controls[1]?.value ?? ''
                : this.tempSMSTemplate.content2,
              content3: this.orderTemplateId
                ? this.parts.controls[2]?.value ?? ''
                : this.tempSMSTemplate.content3,
            } as TemplateVersion,
          ];
        }
      }
    }
  }

  loadSaveTagValues(
    templateVersion: TemplateVersion,
    templateType: TemplateTypeEnum
  ) {
    if (this.tempVoucherTemplate && templateType === TemplateTypeEnum.Email) {
      if (this.tempVoucherTemplate.productTemplateVersion) {
        const selectedProductTemplateVersion =
          this.tempVoucherTemplate.productTemplateVersion.find(
            (version) =>
              version.templateVersionId === templateVersion.templateVersionId
          );

        if (selectedProductTemplateVersion) {
          templateVersion.templateTagValue =
            selectedProductTemplateVersion.templateTagValue;
        }
      }
    }

    if (this.tempSMSTemplate && templateType === TemplateTypeEnum.SMS) {
      if (this.tempSMSTemplate.productTemplateVersion) {
        const selectedProductTemplateVersion =
          this.tempSMSTemplate.productTemplateVersion.find(
            (version) =>
              version.templateVersionId === templateVersion.templateVersionId
          );

        if (selectedProductTemplateVersion) {
          templateVersion.templateTagValue =
            selectedProductTemplateVersion.templateTagValue;
        }
      }
    }
  }

  onEndButtonClicked($event: string) {
    this.disableLoading = true;
    const doSave = $event.toLowerCase() === 'save';
    if (doSave) {
      // get voucher template and assign tags TODO on EDIT
      // const updatedSmsTemplate = this.getUpdatedSmsTemplate(
      //   this.smsVoucherTemplate?.value
      // );

      const value =
        this.activeTab === TemplateTypeEnum.Email
          ? this.voucherTemplateVersionControl?.value
          : this.smsTemplateVersionControl?.value;

      this.softSave(this.activeTab, value);

      this.templateStateService.setProductTemplatesByProductVersionId(
        this.productVersionId,
        this.orderTemplateId,
        this.tempVoucherTemplate
          ? ({ ...this.tempVoucherTemplate } as Template)
          : undefined,
        this.tempVoucherTemplate
          ? ({ ...this.tempVoucherTemplate } as Template)
          : undefined,
        this.tempSMSTemplate
          ? ({ ...this.tempSMSTemplate } as Template)
          : undefined,
        this.tempSMSTemplate
          ? ({ ...this.tempSMSTemplate } as Template)
          : undefined,
        true,
        undefined,
        undefined
      );
    } else {
      this.templateStateService.setProductTemplatesByProductVersionId(
        this.productVersionId,
        this.orderTemplateId,
        this.currentVoucherTemplate
          ? ({ ...this.currentVoucherTemplate } as Template)
          : undefined,
        this.currentVoucherTemplate
          ? ({ ...this.currentVoucherTemplate } as Template)
          : undefined,
        this.currentSMSTemplate
          ? ({ ...this.currentSMSTemplate } as Template)
          : undefined,
        this.currentSMSTemplate
          ? ({ ...this.currentSMSTemplate } as Template)
          : undefined,
        true,
        undefined,
        undefined
      );
    }

    this.goBackToOrderWizard.emit({
      orderTemplateId: doSave ? this.orderTemplateId ?? 0 : 0,
      productVersionId: doSave ? this.productVersionId ?? 0 : 0,
    });
  }

  mapTagValueList(type: TemplateTypeEnum): TagValue[] {
    const tagValueList: TagValue[] = [];
    if (type === TemplateTypeEnum.Email && this.voucherPageTags) {
      for (const templateTag of this.voucherPageTags) {
        const value = this.voucherPageFormGroup.get(
          templateTag.tagId.toString()
        )?.value;

        switch (templateTag.type) {
          case TagTypeEnum.RichText: {
            tagValueList.push({
              tagId: templateTag.tagId,
              value: value,
              textValue: this.textEditorService.convertHtmlToPlainText(
                decode(value)
              ),
            });
            break;
          }
          default: {
            tagValueList.push({
              tagId: templateTag.tagId,
              value: value,
              textValue: null,
            });
            break;
          }
        }
      }
    }

    if (type === TemplateTypeEnum.SMS && this.smsTags) {
      for (const templateTag of this.smsTags) {
        const value = this.smsFormGroup.get(
          templateTag.tagId.toString()
        )?.value;

        switch (templateTag.type) {
          case TagTypeEnum.RichText: {
            tagValueList.push({
              tagId: templateTag.tagId,
              value: value,
              textValue: this.textEditorService.convertHtmlToPlainText(
                decode(value)
              ),
            });
            break;
          }
          default: {
            tagValueList.push({
              tagId: templateTag.tagId,
              value: value,
              textValue: null,
            });
            break;
          }
        }
      }
    }

    return tagValueList;
  }

  setTemplatePartFieldsDefinition() {
    this.tagCategoriesModel = {
      type: FormInputTypeEnum.Select,
      required: false,
      label: 'Tag category',
      formControlName: 'tagCategory',
      placeholder: 'Please select tag category',
      select2Data: [
        { value: 0, label: 'Tag categories' },
        { value: 1, label: 'System tag used only' },
        { value: 2, label: 'System tag can modify' },
        { value: 3, label: 'Others' },
        {
          value: 4,
          label: '{E}TagCategory_SelectedBySystem',
        },
      ],
    };

    this.templatePartsModel = {
      type: FormInputTypeEnum.Select,
      required: false,
      label: 'Template part',
      formControlName: 'templatePart',
      select2Data: [
        { value: 1, label: 'One part' },
        { value: 2, label: 'Two part' },
        { value: 3, label: 'Three part' },
      ],
    };
  }
}
