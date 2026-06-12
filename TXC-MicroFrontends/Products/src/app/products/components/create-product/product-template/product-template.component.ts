import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { Template } from 'src/app/products/models/template.model';
import { TemplateService } from 'src/app/products/services/template.service';
import { ProductType } from '../../../models/product-type.model';
import { ProductCustomizationService } from '../../../services/product-customization.service';
import { DictionaryService } from 'src/app/products/services/dictionary.service';
import { Dictionary } from 'src/app/products/models/dictionary.model';
import { TemplatePreviewComponent } from './template-preview/template-preview.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, merge, Observable, OperatorFunction, ReplaySubject, Subject, takeUntil, BehaviorSubject, switchMap, of } from 'rxjs';
import { TemplateTag } from 'src/app/products/models/template-tag.model';
import { Media } from 'src/app/products/models/media.model';
import { MediaService } from 'src/app/products/services/media.service';
import { VoucherNumberRule } from 'src/app/products/models/voucher-number-rule.model';
import { Select2Data } from 'ng-select2-component';
import { TagCategory, TagType, TemplateType } from 'src/app/products/models/product-template.model';
import { ProductTemplate } from 'src/app/products/models/product-wizard-dto.model';
import { MasterProductTemplateService } from 'src/app/products/services/master-product-template.service';
import { GeneralProductTemplateFormGroup } from 'src/app/products/models/product-form-group/product-template-form-group.model';
import { TextEditorService } from 'src/app/products/services/text-editor.service';
import { TemplateVersionTemplateTag } from 'src/app/products/models/product-template/template-version-template-tag.model';

@Component({
  selector: 'app-product-template',
  templateUrl: './product-template.component.html',
  styleUrls: ['./product-template.component.scss']
})
export class ProductTemplateComponent implements OnInit, OnChanges {
  readonly DETAILS_NOT_FOUND = 'Template details not found';

  @Input() toast!: NgbdToastGlobal;
  @Input() selectedTenant!: string;
  @Input() selectedType!: ProductType;
  @Input() voucherNumberRuleList!: VoucherNumberRule[];
  @Input() hideWalletImageSettings = false;
  @Input() editMode = false;

  _templateFormGroup!: FormGroup;
  get templateFormGroup(): FormGroup {
    return this._templateFormGroup;
  }
  @Input() set templateFormGroup(value: FormGroup) {
    this._templateFormGroup = value;
    this.OnNavShown();
  }
  @Input() emailVersionTemplateTags: TemplateVersionTemplateTag[] = [];
  @Input() smsVersionTemplateTags: TemplateVersionTemplateTag[] = [];
  @Input() productTemplateList: ProductTemplate[] = [];

  @Output() templateChanged = new EventEmitter<({ emailVersionTemplateTags: TemplateVersionTemplateTag[], smsVersionTemplateTags: TemplateVersionTemplateTag[] })>();
  @Output() templateLanguageChanged = new EventEmitter<{ productTemplate: ProductTemplate, reset: boolean, type: number }>();
  @Output() templateLanguageRemoved = new EventEmitter<number>();

  focusTemplateName$ = new Subject<string>();
  clickTemplateName$ = new Subject<string>();
  templateFormatter = (result: Template) => result.templateName;

  mediaList: Media[] = [];
  focusMediaKeyword$ = new Subject<string>();
  clickMediaKeyword$ = new Subject<string>();
  mediaFormatter = (result: Media) => result.nodeUrl;
  mediaOnHover = false;

  templateList: Template[] = [];
  latestVersionTemplate!: Template;
  selectedEmailTemplate!: Template | undefined;
  selectedSMSTemplate!: Template | undefined;
  selectedEmailLanguage!: Dictionary | undefined;
  selectedSMSLanguage!: Dictionary | undefined;
  emailLanguageLoading$ = new BehaviorSubject<boolean>(true);
  smsLanguageLoading$ = new BehaviorSubject<boolean>(true);
  originalTemplateType!: number;
  emailTemplateCurrentVersions: Template[] = [];
  smsTemplateCurrentVersions: Template[] = [];
  languages: Dictionary[] = [];
  emailLanguagesSelect2Data: Select2Data = [];
  smsLanguagesSelect2Data: Select2Data = [];

  navChanged = false;
  onLoad = true;
  templateChangedFlag = false;
  firstLoad = true;

  destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  saveLastData$: ReplaySubject<boolean> = new ReplaySubject(1);
  editDoneWaitingSaveLastData$: ReplaySubject<boolean> = new ReplaySubject(1);

  // form
  get f(): any {
    return this.templateFormGroup.controls;
  }

  // productTemplateListControl
  public getTemplateListFormGroup(index: number): FormGroup {
    const productTemplateList = <FormArray>this.templateFormGroup.controls['productTemplateList'];
    return <FormGroup>productTemplateList.controls[index];
  }

  constructor(
    public productCustomizationSvc: ProductCustomizationService,
    public templateService: TemplateService,
    private masterProductTemplateService: MasterProductTemplateService,
    private readonly _modalService: NgbModal,
    private readonly _mediaService: MediaService,
    private readonly _dictionaryService: DictionaryService,
    private readonly _textEditorService: TextEditorService
  ) {
  }

  ngOnInit(): void {
    // check if wallet settings will be available
    if (this.selectedTenant === "GR" || (this.voucherNumberRuleList && this.voucherNumberRuleList[0]?.hasMultipleBarcode)) {
      this.f.addToWallet.setValue(false);
      this.f.walletImage.setValue(null);
      this.f.walletDescription.setValue(null);
      this.f.walletStatus.setValue(0);
    } else {
      this.f.addToWallet.setValue(true);
    }

    this.f.walletStatus.valueChanges.subscribe(() => {
      this.f.walletStatus.markAsTouched();
    });

    const productTemplateListFormArray = this.templateFormGroup.get('productTemplateList') as FormArray;
    productTemplateListFormArray.controls.forEach((formGroup: AbstractControl, index: number) => {
      ((formGroup as FormGroup)?.get('templateVersionId') as FormControl).valueChanges.pipe(
        distinctUntilChanged(),
        takeUntil(this.destroyed$)
      ).subscribe((value: any) => {
        // if templateVersionId value changed, trigger language changed event
        if (index === 0) {
          this.onLanguageChanged(value, 0);
        } else {
          this.onLanguageChanged(value, 1);
        }
      });
    });

    this.templateService.template$.pipe(takeUntil(this.destroyed$)).subscribe(templates => {
      this.templateList = templates;
      const templateNameControl = this.getTemplateListFormGroup(this.templateService.type - 1).controls['templateName'];
      const templateTypeControl = this.getTemplateListFormGroup(this.templateService.type - 1).controls['templateType'];
      const templateIdControl = this.getTemplateListFormGroup(this.templateService.type - 1).controls['templateId'];
      const templateVersionIdControl = this.getTemplateListFormGroup(this.templateService.type - 1).controls['templateVersionId'];

      if (templateNameControl.dirty && !this.onLoad && templateNameControl.value !== '' && this.templateChangedFlag) {
        this.focusTemplateName$.next(templateNameControl.value.templateName ?? templateNameControl.value);
      }

      if (this.onLoad) {
        // if the user changed tab, reload form control values
        if (!templateIdControl.value) return;
        this.masterProductTemplateService
          .getTemplateDetailsByVersionIdAndTemplateId(templateTypeControl.value, templateIdControl.value, [templateVersionIdControl.value])
          .pipe(
            takeUntil(this.destroyed$))
          .subscribe(res => {
            const data = JSON.parse(res.data).templateVersionInfo;
            if (data.items.length <= 0) {
              this.toast.showDanger(this.DETAILS_NOT_FOUND);
            } else {
              if (templateTypeControl.value === 1) {
                this.emailTemplateCurrentVersions = data.items;
              } else {
                this.smsTemplateCurrentVersions = data.items;
              }
              const selectedTemplate = data.items.find((tv: Template) => tv.templateVersionId === templateVersionIdControl.value);

              // outdated version
              if (!selectedTemplate) {
                this.templateService.getTemplateByVersionId(templateVersionIdControl.value).pipe(
                  distinctUntilChanged(),
                  takeUntil(this.destroyed$)
                ).subscribe(res => {
                  const outdatedVersion = JSON.parse(res.data).templateVersionInfo;
                  const selectedTemplate = outdatedVersion.items.find((tv: Template) => tv.templateVersionId === templateVersionIdControl.value);
                  this.OnSelectTemplateDesign({ item: selectedTemplate }, this.templateService.type - 1, false);
                },
                  () => {
                    this.toast.showDanger(this.DETAILS_NOT_FOUND);
                  });
              } else {
                this.OnSelectTemplateDesign({ item: selectedTemplate }, this.templateService.type - 1);
              }

              this.onLoad = false;
            }
          }, () => {
            this.toast.showDanger(this.DETAILS_NOT_FOUND);
          });
      }

      if (templateNameControl.disabled) {
        templateNameControl.enable();
      }
    });

    // watch for save last data, so user can save the last data on the view they are working
    this.saveLastData$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(res => {
      if (res) {
        this.saveLastData();
      }
    })
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this.editDoneWaitingSaveLastData$.next(false);
    this.editDoneWaitingSaveLastData$.complete();
    this.templateService.type = 1;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['voucherNumberRuleList'] && this.selectedTenant === "GR" || (this.voucherNumberRuleList && this.voucherNumberRuleList[0]?.hasMultipleBarcode)) {
      this.f.addToWallet.setValue(false);
      this.f.walletImage.setValue(null);
      this.f.walletDescription.setValue(null);
    } else {
      this.f.addToWallet.setValue(true);
    }
  }

  OnNavChanged() {
    this.navChanged = true;
    this.saveLastData$.next(true);
  }

  OnNavShown() {
    this.onLoad = true;
    this.templateChangedFlag = false;
    this.templateService.templateName = '';
  }

  OnSelectTemplateDesign($event: { item: Template }, index: number, isCurrentVersion = true): void {
    this.templateChangedFlag = false;
    const selectedTemplate = $event.item;

    if (index === 0) {
      this.selectedEmailTemplate = undefined;
      this.emailLanguageLoading$.next(true);
    } else {
      this.selectedSMSTemplate = undefined;
      this.smsLanguageLoading$.next(true);
    }

    if (!selectedTemplate || !selectedTemplate.type) return;

    if (!this.firstLoad) {
      this.templateLanguageChanged.emit({ productTemplate: {} as unknown as ProductTemplate, reset: !this.onLoad, type: selectedTemplate.type });
    } else {
      this.firstLoad = false;
    }

    // get diff versions of the templates
    this.masterProductTemplateService
      .getTemplateDetailsByVersionIdAndTemplateId(index + 1, selectedTemplate?.templateId!, [selectedTemplate.templateVersionId])
      .pipe(
        takeUntil(this.destroyed$))
      .subscribe(res => {
        const data = JSON.parse(res.data).templateVersionInfo;

        if (data.items.length <= 0) {
          this.toast.showDanger(this.DETAILS_NOT_FOUND);
        } else {
          if (!isCurrentVersion) {
            const currentVersionIndex = data.items.findIndex((template: Template) => template.languageId === selectedTemplate.languageId && template.isCurrentVersion === true);
            this.latestVersionTemplate = data.items[currentVersionIndex];
            data.items.splice(currentVersionIndex, 1, selectedTemplate);
          }

          if (index === 0) {
            this.emailTemplateCurrentVersions = data.items;
          } else {
            this.smsTemplateCurrentVersions = data.items;
          }

          const defaultVersion = data.items.find((tv: Template) => tv.languageId === selectedTemplate.defaultLanguage && tv.isCurrentVersion === true);

          if (!defaultVersion) return;

          // get template languages available of the selected template
          this.templateService.getTemplateLanguageByTemplateId(selectedTemplate.templateId).pipe(
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
          ).subscribe(res => {
            const languages: { templateVersionId: number, languageId: number, isDefault: boolean }[] = JSON.parse(res.data).languageListByTemplateId;
            // check productTemplateList versions and populate languages with correct version id
            this.productTemplateList.forEach(i1 => {
              const i2 = languages.find(i => i.languageId === i1.languageId && i1.templateType === selectedTemplate?.type);
              if (i2 && i2.templateVersionId !== i1.templateVersionId) {
                i2.templateVersionId = i1.templateVersionId;
                if (index === 0) {
                  this.emailTemplateCurrentVersions.forEach(etv => {
                    if (etv.languageId === i2.languageId) {
                      etv.templateVersionId = i2.templateVersionId;
                      etv.isCurrentVersion = false;
                    }
                  })
                } else {
                  this.smsTemplateCurrentVersions.forEach(stv => {
                    if (stv.languageId === i2.languageId) {
                      stv.templateVersionId = i2.templateVersionId;
                      stv.isCurrentVersion = false;
                    }
                  });
                }
              }
            });

            // change the dropdown values for the outdated templateVersion with the language
            if (!isCurrentVersion) {
              const currentVersioIndex = languages.findIndex((language: { languageId: number, isDefault: boolean }) => language.languageId === selectedTemplate.languageId && language.isDefault === true);
              languages[currentVersioIndex].templateVersionId = selectedTemplate.templateVersionId;
            }

            if (!languages.length) {
              return;
            }

            if (!this.languages.length) {
              this._dictionaryService.getDictionaryItemsByCategory('CultureCode').pipe(
                takeUntil(this.destroyed$)
              ).subscribe(
                res => {
                  this.languages = JSON.parse(res.data).dictionaries;
                  this.setTemplateAndLanguage(defaultVersion, languages, index);
                },
                () => {
                  this.toast.showDanger('Error loading languages. Please try again later.');
                }
              );
            } else {
              this.setTemplateAndLanguage(defaultVersion, languages, index);
            }
          });
        }


      }, () => {
        this.toast.showDanger(this.DETAILS_NOT_FOUND);
      });
  }

  // set selected template and language dropdown
  setTemplateAndLanguage(template: Template, templateLanguages: { templateVersionId: number, languageId: number, isDefault: boolean }[], index: number) {
    let select2Data: Select2Data = [];

    if (this.languages) {
      for (let language of templateLanguages) {
        const displayName = this.languages.find(lang => lang.dictionaryId === language.languageId)?.displayName;
        if (!displayName) {
          return;
        }

        select2Data.push({
          value: language.templateVersionId,
          label: displayName
        });
      }

      if (!index) {
        this.emailLanguagesSelect2Data = [...select2Data];
        this.selectedEmailLanguage = this.languages.find(lang => lang.dictionaryId === template.languageId);
        this.getTemplateListFormGroup(index).controls['languageId'].setValue(this.selectedEmailLanguage?.dictionaryId);
      } else {
        this.smsLanguagesSelect2Data = [...select2Data];
        this.selectedSMSLanguage = this.languages.find(lang => lang.dictionaryId === template.languageId);
        this.getTemplateListFormGroup(index).controls['languageId'].setValue(this.selectedSMSLanguage?.dictionaryId);
      }
    }

    if (index === 0) {
      this.selectedEmailTemplate = template;
    } else {
      this.selectedSMSTemplate = template;
    }

    Promise.allSettled([this.emailLanguagesSelect2Data, this.smsLanguagesSelect2Data]).then(() => {
      this.smsLanguageLoading$.next(false);
      this.emailLanguageLoading$.next(false);
      this._toggleApplyLanguageButton(index, template);
      this.f.productTemplateList[index] = (new GeneralProductTemplateFormGroup).productTemplateList();
      this.getTemplateListFormGroup(index).controls['templateType'].setValue(template.type);
      this.getTemplateListFormGroup(index).controls['templateSubType'].setValue(template.subType);
      this.getTemplateListFormGroup(index).controls['templateVersionId'].setValue(template.templateVersionId, { emitEvent: false });
      this.getTemplateListFormGroup(index).controls['templateId'].setValue(template.templateId);
      this.getTemplateListFormGroup(index).controls['templateName'].setValue(template, { emitEvent: false });
      this.getTemplateListFormGroup(index).controls['defaultlanguageId'].setValue(template.defaultLanguage);
      this.getContentTags(template, index, false, true, { productTemplate: { ...template, templateType: template.type, templateSubType: template.subType }, templateVersionId: template.templateVersionId, index });
      this.templateService.templateName = template.templateName ?? template;
    });
  }

  OnTemplateTextboxChanged(index: number) {
    let value = this.getTemplateListFormGroup(index).controls['templateName'].value;
    value = value.templateName ?? value;
    if (!this.templateList.some(template => value === template.templateName) && this.templateList.length) {
      this.getTemplateListFormGroup(index).controls['templateName'].setValue('');
      this._resetFormValues(index);
      this._removeTemplate(index);
      this.templateService.loading = false;
    }

    if (!this.templateList.length) {
      this._resetFormValues(index);
      this._removeTemplate(index);
      this.templateService.loading = false;
    }
  }

  OnTemplateTextboxKeyup($event: any, index: number) {
    const input = String.fromCharCode($event.keyCode)

    if (!/[a-zA-Z0-9 ]/.test(input) && !($event.key === 'Delete') && !($event.key === 'Backspace')) {
      return;
    }

    const value = this.getTemplateListFormGroup(index).controls['templateName'].value ?? '';
    this.templateService.templateName = value.templateName ?? value;
    this.templateChangedFlag = true;
    this.onLoad = false;

    if ((!this.templateList.some(template => value.templateName ?? value === template.templateName) && this.templateList.length) || !this.templateList.length) {
      this._resetFormValues(index);
      this._removeTemplate(index);
    }
  }

  private _resetFormValues(index: number){
    const templateVersionIdValue = this.getTemplateListFormGroup(index).controls['templateVersionId'].value ?? '';

    const tagValues = index === 0 ? this.emailVersionTemplateTags.find(evtt => evtt.template.templateVersionId === templateVersionIdValue)?.templateTags :
    this.smsVersionTemplateTags.find(svtt => svtt.template.templateVersionId === templateVersionIdValue)?.templateTags;

    if (!tagValues) return;

    for (let templateTag of tagValues) {
      this.getTemplateListFormGroup(index).controls[templateTag.displayName].patchValue('');
    }
  }

  private _removeTemplate(index: number): void {
    if (index) {
      this.selectedSMSTemplate = undefined;
      this.templateLanguageChanged.emit({ productTemplate: {} as unknown as ProductTemplate, reset: !this.onLoad, type: 2 });
    } else {
      this.selectedEmailTemplate = undefined;
      this.templateLanguageChanged.emit({ productTemplate: {} as unknown as ProductTemplate, reset: !this.onLoad, type: 1 });
    }

    this.getTemplateListFormGroup(index).controls['templateVersionId'].patchValue(null);
    this.getTemplateListFormGroup(index).controls['templateId'].patchValue(null);
  }

  public saveLastData() {
    const index = this.templateService.type - 1;
    const templateVersionIdControl = this.getTemplateListFormGroup(index).controls['templateVersionId'];
    this.onLanguageChanged(templateVersionIdControl.value, index, true);
  }

  // if there are changes on templateVersionId control, language changed event will be triggered
  onLanguageChanged(templateVersionId: number, index: number, saveLastData = false) {
    // reset current value of saveLastData subscribption
    this.templateService.loading = true;

    if (saveLastData) {
      this.editDoneWaitingSaveLastData$.next(false);
    }

    const applyLanguageControl = this.getTemplateListFormGroup(index).controls['applyLanguage'];
    const templateIdValue = index ? this.selectedSMSTemplate?.templateId : this.selectedEmailTemplate?.templateId;
    let languageIdValue = index ? this.selectedSMSLanguage?.dictionaryId : this.selectedEmailLanguage?.dictionaryId;
    languageIdValue = languageIdValue ?? this.getTemplateListFormGroup(index).controls['languageId'].value;
    if (!languageIdValue || !templateIdValue) {
      if (saveLastData) {
        this.editDoneWaitingSaveLastData$.next(true);
        return;
      } else {
        return;
      }
    }
    const getTemplateVersionIdByLanguageId = this.getTemplateVersionIdByLanguageIdAndTemplateId(languageIdValue, templateIdValue, index);
    this.templateService.getTemplateTagsByVersionId(getTemplateVersionIdByLanguageId!).pipe(takeUntil(this.destroyed$)).subscribe(
      res => {
        const templateTagsResponse = JSON.parse(res.data).tagsByTemplateVersionId;
        const templateTags = templateTagsResponse.filter((tag: any) =>
          [TagCategory.UserInput, TagCategory.UserInputWithDefault, TagCategory.SelectedBySystem].includes(tag.category));
        this.getTemplateListFormGroup(index).controls['templateTags'].setValue(templateTags);
        const values = this.getTemplateListFormGroup(index).getRawValue();
          
        // reset dynamic form values
        for (let templateTag of templateTags) {
          const control = this.getTemplateListFormGroup(index).controls[templateTag.tagName.replace(/[{}]/g, "")];
          if (control) {
            control.patchValue('');
          }
        }

        const newProduct: ProductTemplate = new ProductTemplate(values, this._textEditorService);
        newProduct.languageId = languageIdValue;
        if (applyLanguageControl.value) {
          const emitProductTemplate = { ...newProduct };
          if (getTemplateVersionIdByLanguageId)
            emitProductTemplate.templateVersionId = getTemplateVersionIdByLanguageId;

          this.templateLanguageChanged.emit({ productTemplate: emitProductTemplate, reset: false, type: emitProductTemplate.templateType });
        } else {
          if (this.productTemplateList.some(template => template.templateVersionId === getTemplateVersionIdByLanguageId)) {
            this.templateLanguageRemoved.emit(getTemplateVersionIdByLanguageId);
          }

          if (saveLastData) {
            this.editDoneWaitingSaveLastData$.next(true);
          }
        }

        if (saveLastData) {
          const defaultVersion = this.productTemplateList.find(ptl => ptl.templateType === this.templateService.type && ptl.defaultlanguageId === ptl.languageId);
          if (!defaultVersion) return;

          this._setFormValues({ productTemplate: defaultVersion, templateVersionId: defaultVersion.templateVersionId, index: index });
          this.editDoneWaitingSaveLastData$.next(true);
        } else {
          if (index === 0) {
            let selectedEmailTemplate = this.emailVersionTemplateTags.find(etv => etv.template.templateVersionId === templateVersionId)?.template as Template;
            if (!selectedEmailTemplate) {
              selectedEmailTemplate = this.emailTemplateCurrentVersions.find(etcv => etcv.templateVersionId === templateVersionId) as Template;
            }

            if (selectedEmailTemplate && this.emailTemplateCurrentVersions.length) {
              selectedEmailTemplate.isCurrentVersion = (this.emailTemplateCurrentVersions.find(etcv => etcv.templateVersionId === templateVersionId) as Template).isCurrentVersion ?? false;

              if (!selectedEmailTemplate.isCurrentVersion) {
                const allLanguageTemplates = this.emailTemplateCurrentVersions.filter((template: Template) => template.languageId === selectedEmailTemplate?.languageId && template.isCurrentVersion === true);
                this.latestVersionTemplate = allLanguageTemplates[allLanguageTemplates.length - 1];
              }
            }
            if (!selectedEmailTemplate) {
              selectedEmailTemplate = this.latestVersionTemplate;
            }

            this._toggleApplyLanguageButton(index, selectedEmailTemplate);

            if (selectedEmailTemplate) {
              this.selectedEmailLanguage = this.languages.find(lang => lang.dictionaryId === selectedEmailTemplate?.languageId);
              this.f.productTemplateList[0] = (new GeneralProductTemplateFormGroup).productTemplateList();
              this.getContentTags(selectedEmailTemplate, 0, false, true, { productTemplate: newProduct, templateVersionId: templateVersionId, index });
              this.selectedEmailTemplate = selectedEmailTemplate as Template;
            }
          } else {
            let selectedSMSTemplate = this.smsTemplateCurrentVersions.find(stv => stv.templateVersionId === templateVersionId);
            if (!selectedSMSTemplate) {
              selectedSMSTemplate = this.smsTemplateCurrentVersions.find(etcv => etcv.templateVersionId === templateVersionId) as Template;
            }

            if (selectedSMSTemplate) {
              selectedSMSTemplate.isCurrentVersion = (this.smsTemplateCurrentVersions.find(etcv => etcv.templateVersionId === templateVersionId) as Template).isCurrentVersion ?? false;

              if (!selectedSMSTemplate.isCurrentVersion) {
                const allLanguageTemplates = this.smsTemplateCurrentVersions.filter((template: Template) => template.languageId === selectedSMSTemplate?.languageId && template.isCurrentVersion === true);
                this.latestVersionTemplate = allLanguageTemplates[allLanguageTemplates.length - 1];
              }
            }

            if (!selectedSMSTemplate) {
              selectedSMSTemplate = this.latestVersionTemplate;
            }

            this._toggleApplyLanguageButton(index, selectedSMSTemplate);
            if (selectedSMSTemplate) {
              this.selectedSMSLanguage = this.languages.find(lang => lang.dictionaryId === selectedSMSTemplate?.languageId);
              this.f.productTemplateList[1] = (new GeneralProductTemplateFormGroup).productTemplateList();
              this.getContentTags(selectedSMSTemplate, 1, false, true, { productTemplate: newProduct, templateVersionId: templateVersionId, index });
              this.selectedSMSTemplate = selectedSMSTemplate;
            }
          }
        }
      },
      () => {
        this.toast.showDanger('Error loading template tags. Please try again later.');
      });
  }

  private _toggleApplyLanguageButton(index: number, selectedTemplate: Template) {
    const applyLanguageControl = this.getTemplateListFormGroup(index).controls['applyLanguage'];
    if (selectedTemplate?.languageId !== selectedTemplate?.defaultLanguage) {
      applyLanguageControl.setValue(false);
      applyLanguageControl.enable();
    } else {
      applyLanguageControl.disable();
    }
  }

  private _setFormValues(setFormValueObj: { productTemplate: ProductTemplate, templateVersionId: number, index: number }) {
    //reset value 
    if (setFormValueObj.productTemplate.tagValueList) {
      for (let templateTag of setFormValueObj.productTemplate.tagValueList) {
        const control = this.getTemplateListFormGroup(setFormValueObj.index).controls[templateTag.tagName.replace(/[{}]/g, "")];
        if (control) {
          control.patchValue('');
        }
      }
    }

    for (const productTemplate of this.productTemplateList) {
      if (productTemplate.templateVersionId === setFormValueObj.templateVersionId) {
        this.getTemplateListFormGroup(setFormValueObj.index).patchValue({
          applyLanguage: true
        });

        if (!productTemplate.tagValueList) return;
        for (let templateTag of productTemplate.tagValueList) {
          let tag: TemplateTag | null = null;
          if (setFormValueObj.index === 0) {
            const templateTags = this.emailVersionTemplateTags.find(evtt => evtt.template.templateVersionId === setFormValueObj.templateVersionId)?.templateTags;
            if (templateTags)
              tag = this.editMode ? templateTags.filter((ett: TemplateTag) => ett.tagId === templateTag.tagId)[0] :
                templateTags.filter((ett: TemplateTag) => ett.tagId === templateTag.contentTagId)[0];
          } else {
            const templateTags = this.smsVersionTemplateTags.find(evtt => evtt.template.templateVersionId === setFormValueObj.templateVersionId)?.templateTags;
            if (templateTags)
              tag = this.editMode ? templateTags.filter((ett: TemplateTag) => ett.tagId === templateTag.tagId)[0] :
                templateTags.filter((ett: TemplateTag) => ett.tagId === templateTag.contentTagId)[0];
          }

          if (tag) {
            if (tag.type === TagType.Image && templateTag.value) {
              this._mediaService.getMediaById(Number.parseInt(templateTag.value)).pipe(takeUntil(this.destroyed$))
                .subscribe(
                  res => {
                    const media: Media = JSON.parse(res.data).mediaById[0];
                    if (tag) this.getTemplateListFormGroup(setFormValueObj.index).controls[tag.displayName].patchValue(media);
                  }
                )
            } else {
              this.getTemplateListFormGroup(setFormValueObj.index).controls[tag.displayName].patchValue(templateTag.value);
            }
          }
        }
      }
    }
  }


  getContentTags(template: Template, index: number, onInitialize = false, setValue = false, setFormValueObj: { productTemplate: ProductTemplate, templateVersionId: number, index: number } | undefined = undefined): void {
    const getTemplateVersionTemplateTags: TemplateVersionTemplateTag[] = index === 0 ? this.emailVersionTemplateTags : this.smsVersionTemplateTags;
    if (getTemplateVersionTemplateTags && getTemplateVersionTemplateTags.length &&
      getTemplateVersionTemplateTags.findIndex(tvt => tvt.template.templateVersionId === template.templateVersionId) > -1) {
      if (!onInitialize) {
        const templateTags: TemplateTag[] | undefined = getTemplateVersionTemplateTags.find(templateVersionTemplateTag => templateVersionTemplateTag.template.templateVersionId === template.templateVersionId)?.templateTags;
        if (!templateTags) return;
        for (let templateTag of templateTags) {
          let value = [TagCategory.UserInputWithDefault, TagCategory.SelectedBySystem].includes(templateTag.category) ? templateTag.defaultValue : '';
          if (TagCategory.UserInputWithDefault && this.getTemplateListFormGroup(index).controls[templateTag.displayName]) {
            value = this.getTemplateListFormGroup(index).controls[templateTag.displayName].value;
          }
          this.getTemplateListFormGroup(index).addControl(templateTag.displayName, new FormControl({ value: value, disabled: templateTag.category === TagCategory.SelectedBySystem }))
        }
      }

      if (setValue && setFormValueObj) {
        this._setFormValues(setFormValueObj);
      }

      this.templateService.loading = false;
    } else {
      this.templateService.getTemplateTagsByVersionId(template.templateVersionId).pipe(
        distinctUntilChanged(),
        takeUntil(this.destroyed$)
      ).subscribe(res => {
        this.templateService.loading = true;
        const templateTagsResponse = JSON.parse(res.data).tagsByTemplateVersionId;
        const templateTags = templateTagsResponse.filter((tag: any) =>
          [TagCategory.UserInput, TagCategory.UserInputWithDefault, TagCategory.SelectedBySystem].includes(tag.category));
        if (index === 0) {
          this.emailVersionTemplateTags.push({ template, templateTags });
          this.getTemplateListFormGroup(index).controls['templateTags'].setValue(templateTags);
        } else {
          this.smsVersionTemplateTags.push({ template, templateTags });
          this.getTemplateListFormGroup(index).controls['templateTags'].setValue(templateTags);
        }
        this.templateChanged.emit({ emailVersionTemplateTags: this.emailVersionTemplateTags, smsVersionTemplateTags: this.smsVersionTemplateTags });

        if (!onInitialize) {
          for (let templateTag of templateTags) {
            let value = [TagCategory.UserInputWithDefault, TagCategory.SelectedBySystem].includes(templateTag.category) ? templateTag.defaultValue : '';
            if (TagCategory.UserInputWithDefault && this.getTemplateListFormGroup(index).controls[templateTag.displayName]) {
              value = this.getTemplateListFormGroup(index).controls[templateTag.displayName].value;
            }
            this.getTemplateListFormGroup(index).addControl(templateTag.displayName, new FormControl({ value: value, disabled: templateTag.category === TagCategory.SelectedBySystem }))
          }
        }

        if (setValue && setFormValueObj) {
          this._setFormValues(setFormValueObj);
        }
      },
        () => {
          // this.toast.showDanger('Error loading template tags. Please try again later.');
        },
        () => {
          this.templateService.loading = false;
        })
    }
  }

  getCurrentTags(index: number, templateVersionId: number | null = null) {
    const getTemplateVersionTemplateTags: TemplateVersionTemplateTag[] = index === 0 ? this.emailVersionTemplateTags : this.smsVersionTemplateTags;
    if (!templateVersionId) templateVersionId = this.getTemplateListFormGroup(index).controls['templateVersionId'].value ?? '';
    if (!(getTemplateVersionTemplateTags && getTemplateVersionTemplateTags.length)) return [];
    return getTemplateVersionTemplateTags.find(templateVersionTemplateTag => templateVersionTemplateTag.template.templateVersionId === templateVersionId)?.templateTags ?? [];
  }

  getTemplateVersionIdByLanguageIdAndTemplateId(languageId: number, templateId: number, index: number): number | undefined {
    if (this.editMode) {
      return index ? this.smsVersionTemplateTags.find(svtt => svtt.template.languageId === languageId && svtt.template.templateId === templateId)?.template.templateVersionId :
        this.emailVersionTemplateTags.find(ettv => ettv.template.languageId === languageId && ettv.template.templateId === templateId)?.template.templateVersionId
    } else {
      return index ? this.smsTemplateCurrentVersions.find(smstv => smstv.languageId === languageId && smstv.templateId === templateId)?.templateVersionId :
        this.emailTemplateCurrentVersions.find(emtv => emtv.languageId === languageId && emtv.templateId === templateId)?.templateVersionId;
    }

  }

  searchEmailTemplates: OperatorFunction<string, readonly Template[] | string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const inputFocus$ = this.focusTemplateName$;
    return merge(debouncedText$, inputFocus$).pipe(
      map((term: string | Template) => {
        if ((term as Template)?.templateName) {
          term = (term as Template)?.templateName;
        }
        let searchResults = this.templateList.filter(v => v.templateName?.toLowerCase().indexOf((term as string).toLowerCase()) > -1).slice(0, 10);
        return searchResults.length > 0 ? searchResults : ['No results found'];
      })
    )
  }

  searchMediaImages: OperatorFunction<string, readonly Media[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const inputFocus$ = this.focusMediaKeyword$;
    return merge(debouncedText$, inputFocus$).pipe(
      switchMap(term => {
        if (term === '') {
          return of([]);
        } else {
          return this._mediaService.getMediaByKeyword(term).pipe(
            map(res => {
              const items = JSON.parse(res.data).mediaByKeyword.filter((v: { keyword: string; }) => v.keyword.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
              this.mediaList = items;
              return items;
            })
          );
        }
      })
    );
  }

  checkMediaImageValue(): void {
    const value = this.f.walletImage.value;
    const getbannerImageValue = this.mediaList?.find(media => media.keyword.toLowerCase() === value.toLowerCase())
    if (getbannerImageValue) {
      this.f.walletImage.setValue(getbannerImageValue);
    } else {
      this.f.walletImage.setValue(null);
    }
  }

  OnMediaSelect() {
    this.f.walletImage.markAsTouched();
  }

  removeMedia(): void {
    this.f.walletImage.setValue(null);
    this.f.walletImage.markAsDirty();
    this.f.walletImage.markAsTouched();
  }

  ShowPreview(isPreviewLatestVersion = false, latestVersionTags?: TemplateTag[]): void {
    const modalRef = this._modalService.open(TemplatePreviewComponent, { size: 'md', backdrop: 'static', centered: true, keyboard: false, modalDialogClass: this.templateService.type === 1 ? 'table-centered' : '' });
    const index = this.templateService.type - 1;
    const isEmailTemplate = this.templateService.type === 1;
    const selectedTemplate = isEmailTemplate ? this.selectedEmailTemplate : this.selectedSMSTemplate;
    const templateCurrentVersions = isEmailTemplate ? this.emailTemplateCurrentVersions : this.smsTemplateCurrentVersions;
    let template = templateCurrentVersions.find(etcv => etcv.templateVersionId === selectedTemplate?.templateVersionId);
    const templateVersionTags = isEmailTemplate ? this.emailVersionTemplateTags : this.smsVersionTemplateTags;
    let templateTags = templateVersionTags.find(evtt => evtt.template.templateVersionId === template?.templateVersionId)?.templateTags;

    if (isPreviewLatestVersion) {
      template = this.latestVersionTemplate;
      templateTags = latestVersionTags as unknown as TemplateTag[];
      modalRef.componentInstance.isCurrentVersion = !isPreviewLatestVersion;
    }

    modalRef.componentInstance.selectedTemplate = { ...template };
    modalRef.componentInstance.templateFormGroup = this.templateFormGroup;
    modalRef.componentInstance.templateTags = templateTags;
    modalRef.componentInstance.templateType = this.templateService.type;
    modalRef.componentInstance.index = index;
    modalRef.componentInstance.applyTextToHtml();

    modalRef.closed.subscribe(res => {
      if (res.toLowerCase() === 'applylatestversion') {
        let oldTemplateVersionId: number = 0;
        this.productTemplateList.forEach((ptl) => {
          if (ptl.templateId === this.latestVersionTemplate.templateId && ptl.languageId === this.latestVersionTemplate.languageId) {
            oldTemplateVersionId = ptl.templateVersionId;
          }
        });
        if (this.templateService.type === TemplateType.HTML) {
          this.selectedEmailTemplate = this.latestVersionTemplate;

          const emailS2DataIndex = (this.emailLanguagesSelect2Data as any).findIndex((els2d: { value: number }) => els2d.value === oldTemplateVersionId);
          const prevEmailS2DataLabel = { ...this.emailLanguagesSelect2Data[emailS2DataIndex] }.label;
          this.emailLanguagesSelect2Data.splice(emailS2DataIndex, 1, {
            value: this.latestVersionTemplate.templateVersionId,
            label: prevEmailS2DataLabel
          });

          const ettvIndex = this.emailVersionTemplateTags.findIndex(templateTagVersion => templateTagVersion.template.templateVersionId === oldTemplateVersionId);
          if (!templateTags) return;
          this.emailVersionTemplateTags.splice(ettvIndex, 1, { template: this.latestVersionTemplate, templateTags: templateTags });

          const etcIndex = this.emailTemplateCurrentVersions.findIndex(templateVersion => templateVersion.templateVersionId === oldTemplateVersionId);
          this.emailTemplateCurrentVersions.splice(etcIndex, 1, this.latestVersionTemplate);
        } else {
          this.selectedSMSTemplate = this.latestVersionTemplate;

          const smsS2DataIndex = (this.smsLanguagesSelect2Data as any).findIndex((sls2d: { value: number }) => sls2d.value === oldTemplateVersionId);
          const prevSMSS2DataLabel = { ...this.smsLanguagesSelect2Data[smsS2DataIndex] }.label;
          this.smsLanguagesSelect2Data.splice(smsS2DataIndex, 1, {
            value: this.latestVersionTemplate.templateVersionId,
            label: prevSMSS2DataLabel
          });

          const sttvIndex = this.smsVersionTemplateTags.findIndex(templateTagVersion => templateTagVersion.template.templateVersionId === oldTemplateVersionId);
          if (!templateTags) return;
          this.smsVersionTemplateTags.splice(sttvIndex, 1, { template: this.latestVersionTemplate, templateTags: templateTags });

          const stcIndex = this.smsTemplateCurrentVersions.findIndex(templateVersion => templateVersion.templateVersionId === oldTemplateVersionId);
          this.smsTemplateCurrentVersions.splice(stcIndex, 1, this.latestVersionTemplate);
        }

        const ptlIndex = this.productTemplateList.findIndex(template => template.templateVersionId === oldTemplateVersionId);
        this.productTemplateList.splice(ptlIndex, 1);

        this.templateService.getTemplateTagsByVersionId(this.latestVersionTemplate.templateVersionId).pipe(takeUntil(this.destroyed$)).subscribe(
          res => {
            const templateTagsResponse = JSON.parse(res.data).tagsByTemplateVersionId;
            const templateTags = templateTagsResponse.filter((tag: any) =>
              [TagCategory.UserInput, TagCategory.UserInputWithDefault, TagCategory.SelectedBySystem].includes(tag.category));

            this.getTemplateListFormGroup(index).controls['templateTags'].setValue(templateTags);
            this.getTemplateListFormGroup(index).controls['templateVersionId'].setValue(this.latestVersionTemplate.templateVersionId);
            const values = this.getTemplateListFormGroup(index).getRawValue();
            const newProduct: ProductTemplate = new ProductTemplate(values, this._textEditorService);
            const emitProductTemplate = { ...newProduct };
            this.templateLanguageChanged.emit({ productTemplate: emitProductTemplate, reset: false, type: emitProductTemplate.templateType });
            this.templateLanguageRemoved.emit(oldTemplateVersionId);
          });
        // mark the form controls as dirty so user can save
        Object.keys(this.templateFormGroup.controls).forEach(key => {
          this.templateFormGroup.get(key)?.markAsDirty();
          this.templateFormGroup.get(key)?.markAsTouched();
        });
      }
    });
  }

  ShowLatestVersion(index: number): void {
    const templateVersionIdValue = this.getTemplateListFormGroup(index).get('templateVersionId')?.value;
    if (!templateVersionIdValue) return;
    const selectedTemplate = index === 0 ? this.selectedEmailTemplate : this.selectedSMSTemplate;
    this.templateService.getTemplateTagsByVersionId(templateVersionIdValue).pipe(takeUntil(this.destroyed$)).subscribe(res => {
      this.templateService.loading = true;
      const templateTagsResponse = JSON.parse(res.data).tagsByTemplateVersionId;
      const templateTags = templateTagsResponse.filter((tag: any) =>
        [TagCategory.UserInput, TagCategory.UserInputWithDefault, TagCategory.SelectedBySystem].includes(tag.category));

      this.masterProductTemplateService.getTemplateDetailsCurrentVersion(selectedTemplate!.type, selectedTemplate!.templateId)
        .pipe(
          takeUntil(this.destroyed$))
        .subscribe(res => {
          const templateVersions = JSON.parse(res.data).templateVersionInfo.items;
          for (const templateVersion of templateVersions) {
            if (selectedTemplate?.languageId === templateVersion.languageId) {
              this.latestVersionTemplate = { ...templateVersion };
            }
          }

          this.ShowPreview(true, templateTags);
        });
    },
      () => {
        this.toast.showDanger('Error loading template tags. Please try again later.');
      },
      () => {
        this.templateService.loading = false;
      })
  }
}
