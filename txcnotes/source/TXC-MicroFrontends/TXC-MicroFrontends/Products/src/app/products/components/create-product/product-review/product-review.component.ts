import { Component, OnInit, Output, EventEmitter, Input, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { AcceptanceLoop } from 'src/app/products/models/acceptance-loop.model';
import { Dictionary } from 'src/app/products/models/dictionary.model';
import { ExternalProperty } from 'src/app/products/models/external-property';
import { Merchant } from 'src/app/products/models/merchant.model';
import { ProductType } from 'src/app/products/models/product-type.model';
import { IProgram } from 'src/app/products/models/program.model';
import { SKU } from 'src/app/products/models/sku.model';
import { TemplateTag } from 'src/app/products/models/template-tag.model';
import { VoucherNumberRule } from 'src/app/products/models/voucher-number-rule.model';
import { DictionaryService } from 'src/app/products/services/dictionary.service';
import { ProductTypeEnum } from '../../../enums/product-type.enum';
import { TemplatePreviewComponent } from '../product-template/template-preview/template-preview.component';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ProductService } from 'src/app/products/services/product.service';
import { ReverseLimit } from 'src/app/products/models/reverselimit.model';
import { TemplateService } from 'src/app/products/services/template.service';
import { TemplateVersionTemplateTag } from 'src/app/products/models/product-template/template-version-template-tag.model';
import { TagCategory, TagType } from 'src/app/products/models/product-template.model';
import { ProductTemplate } from 'src/app/products/models/product-wizard-dto.model';
import { MediaService } from 'src/app/products/services/media.service';
import { Media } from 'src/app/products/models/media.model';
import { ProductApiService } from 'src/app/products/services/product-api.service';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.scss']
})
export class ProductReviewComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() toast!: NgbdToastGlobal;
  @Input() selectedTenant!: string;
  @Input() selectedType!: ProductType;

  // product details
  @Input() detailsFormGroup!: FormGroup;
  @Input() selectedMerchant: Merchant | undefined;
  @Input() isMonoMerchant = true;
  @Input() selectedSKU!: SKU | undefined;
  @Input() acceptanceLoopList: AcceptanceLoop[] = [];
  @Input() selectedAcceptanceLoop!: AcceptanceLoop;
  @Input() merchantProgram!: IProgram;
  @Input() voucherNumberRuleList: VoucherNumberRule[] = [];
  @Input() shopCount!: number;
  @Input() merchantAcquirers: Dictionary[] = [];
  @Input() emailVersionTemplateTags!: TemplateVersionTemplateTag[];
  @Input() smsVersionTemplateTags!: TemplateVersionTemplateTag[];
  @Input() productTemplateList!: ProductTemplate[];

  // product pricing
  @Input() pricingFormGroup!: FormGroup;
  @Input() expirySchemeList: number[] = [];
  @Input() wizardKey!: string;

  // product templates
  @Input() templateFormGroup!: FormGroup;

  // product advanced settings
  @Input() selectedExternalProperties: ExternalProperty[] = [];
  @Input() advanceSettingsFormGroup!: FormGroup;


  @Output() editStep = new EventEmitter<number>();
  @Output() stepHasIssue = new EventEmitter<number>();
  @Output() stepRemoveIssue = new EventEmitter<number>();

  ProductType = ProductTypeEnum;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);


  productDetailsCollapsed = false;
  pricingContractExpiryCollapsed = false;
  productTemplateImageCollapsed = false;
  externalPropertiesCollapsed = false;
  fixExpiryDate!: string;

  reminders: Dictionary[] = [];
  reversalLimits: ReverseLimit[] = [];

  parseFloat = parseFloat;

  // forms
  get detailsControls(): any {
    return this.detailsFormGroup.controls;
  }
  get pricingControls(): any {
    return this.pricingFormGroup.controls;
  }
  get templateControls(): any {
    return this.templateFormGroup.controls;
  }
  get advanceSettingsControls(): any {
    return this.advanceSettingsFormGroup.controls;
  }

  public getTemplateListFormGroup(index: number): FormGroup {
    const productTemplateList = <FormArray>this.templateFormGroup.controls['productTemplateList'];
    return <FormGroup>productTemplateList.controls[index];
  }

  constructor(
    private readonly _modalService: NgbModal,
    private readonly _dictionaryService: DictionaryService,
    private readonly _templateService: TemplateService,
    private readonly _productService: ProductService,
    private readonly _mediaService: MediaService,
    private readonly _productApiService: ProductApiService,
    private cdr: ChangeDetectorRef) {
  }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    if (this.detailsControls['brandName'].status === 'INVALID') {
      this.OnStepHasIssue(1)
      this.detailsControls['brandName'].statusChanges.subscribe((_status: string) => {
        if (_status === 'VALID') {
          this.OnStepRemoveIssue(1)
        }
      })
    }
  }

  ngOnInit(): void {
    this.getFixExpiryDateFromWizard();
    this._dictionaryService.getDictionaryItemsByCategory('ProductReminder').pipe(
      takeUntil(this.destroyed$)
    ).subscribe(
      res => {
        this.reminders = JSON.parse(res.data).dictionaries;
      },
      () => {
        this.toast.showDanger('Error loading reminders. Please try again later.');
      }
    );

    this._productService.getProductReverseLimit().subscribe(res => {
      this.reversalLimits = JSON.parse(res.data).productReverseLimit?.items
    }, () => {
      this.toast.showDanger('Error loading reversal limits. Please try again later.');
    })

  }

  getFixExpiryDateFromWizard() {
    this._productApiService
      .getProductWizard(this.wizardKey)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.fixExpiryDate = res.data.productWizardStepThree.fixExpiryDate;
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  jumpStep(step: number) {
    this.editStep.emit(step);
  }

  ShowPreview(type: number): void {
    const templateVersionId = this.getTemplateListFormGroup(type - 1).controls['templateVersionId'].value;
    const templateId = this.getTemplateListFormGroup(type - 1).controls['templateId'].value;
    this._templateService.getTemplateDetailsByVersionIdAndTemplateId(type, templateId, [templateVersionId]).subscribe((res: { data: string; }) => {
      const template = JSON.parse(res.data).templateVersionInfo.items.find((i: { languageId: number; defaultLanguage: number; }) => i.languageId === i.defaultLanguage);
      if (template) {
        const templateTags = type === 1 ? this.emailVersionTemplateTags.find(templateVersionTag => templateVersionTag.template.templateVersionId === template.templateVersionId)?.templateTags :
          this.smsVersionTemplateTags.find(templateVersionTag => templateVersionTag.template.templateVersionId === template.templateVersionId)?.templateTags;
        this.setFormValues({ productTemplate: template, templateVersionId: template.templateVersionId, index: type - 1 }, templateTags);
      } else {
        this.toast.showDanger('Error loading template. Please try again later.');
      }
    });
  }

  OnStepHasIssue($event: number) {
    this.stepHasIssue.emit($event);
  }

  OnStepRemoveIssue($event: number) {
    this.stepRemoveIssue.emit($event)
  }

  setFormValues(setFormValueObj: { productTemplate: ProductTemplate, templateVersionId: number, index: number }, templateTags: TemplateTag[] | undefined) {
    //reset value 
    if (setFormValueObj.productTemplate.tagValueList) {
      for (let templateTag of setFormValueObj.productTemplate.tagValueList) {
        const control = this.getTemplateListFormGroup(setFormValueObj.index).controls[templateTag.tagName.replace(/[{}]/g, "")];
        if (!control) return;
        control.patchValue('');
      }
    }

    for (const productTemplate of this.productTemplateList) {
      if (productTemplate.templateVersionId === setFormValueObj.templateVersionId) {
        this.getTemplateListFormGroup(setFormValueObj.index).patchValue({
          applyLanguage: true
        });

        if (productTemplate.tagValueList && productTemplate.tagValueList?.length) {
          let tagCount = setFormValueObj.index === 0 ? 
          this.emailVersionTemplateTags.find(evtt => evtt.template.templateVersionId === setFormValueObj.templateVersionId)?.templateTags.filter((tag: any) =>
          [TagCategory.UserInput, TagCategory.UserInputWithDefault, TagCategory.SelectedBySystem].includes(tag.category)).length ?? 0 : 
          this.smsVersionTemplateTags.find(svtt => svtt.template.templateVersionId === setFormValueObj.templateVersionId)?.templateTags.filter((tag: any) =>
          [TagCategory.UserInput, TagCategory.UserInputWithDefault, TagCategory.SelectedBySystem].includes(tag.category)).length ?? 0;

        for (let templateTag of productTemplate.tagValueList) {
          let tag: TemplateTag | undefined;
          if (setFormValueObj.index === 0) {
            tag = this.emailVersionTemplateTags.find(evtt => evtt.template.templateVersionId === setFormValueObj.templateVersionId)?.
              templateTags.filter((ett: TemplateTag) => ett.tagId === templateTag.contentTagId)[0];
          } else {
            tag = this.smsVersionTemplateTags.find(evtt => evtt.template.templateVersionId === setFormValueObj.templateVersionId)?.
              templateTags.filter((ett: TemplateTag) => ett.tagId === templateTag.contentTagId)[0];
          }

          if (!tag) break;

          if (tag.type === TagType.Image) {
            if (templateTag.value) {
              this._mediaService.getMediaById(Number.parseInt(templateTag.value)).pipe(takeUntil(this.destroyed$))
              .subscribe(
                res => {
                  const media: Media = JSON.parse(res.data).mediaById[0];
                  if (!tag) return;
                  this.getTemplateListFormGroup(setFormValueObj.index).controls[tag.displayName].patchValue(media);
                  tagCount--;

                  if (tagCount === 0) {
                    this.openModal(setFormValueObj.productTemplate, templateTags, setFormValueObj.index);
                  }
                },
                () => {
                  this.toast.showDanger('Error loading media image. Please try again later.');
                }
              )
            } else {
              tagCount--;
              if (tagCount === 0) {
                this.openModal(setFormValueObj.productTemplate, templateTags, setFormValueObj.index);
              }
            }
          } else {
            this.getTemplateListFormGroup(setFormValueObj.index).controls[tag.displayName].patchValue(templateTag.value);
            tagCount--;
          }

          if (tagCount === 0) {
            this.openModal(setFormValueObj.productTemplate, templateTags, setFormValueObj.index);
          }
        }
        } else {
          this.openModal(setFormValueObj.productTemplate, templateTags, setFormValueObj.index);
        }
        
      }
    }

  }

  openModal(productTemplate: ProductTemplate, templateTags: any, index: number) {
    const modalRef = this._modalService.open(TemplatePreviewComponent, { size: 'md', backdrop: 'static', centered: true, keyboard: false, modalDialogClass: this._templateService.type === 1 ? 'table-centered' : '' });
    modalRef.componentInstance.selectedTemplate = { ...productTemplate };
    modalRef.componentInstance.templateFormGroup = this.templateFormGroup;
    modalRef.componentInstance.templateTags = templateTags;
    modalRef.componentInstance.templateType = index + 1;
    modalRef.componentInstance.index = index;
    modalRef.componentInstance.applyTextToHtml();
  }
}
