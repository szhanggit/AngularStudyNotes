import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal, NgbTypeahead, NgbTypeaheadSelectItemEvent, } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, map, Observable, OperatorFunction, Subject, switchMap, throwError, fromEvent, takeUntil, BehaviorSubject, combineLatest, ObservableInput } from 'rxjs';
import { MasterProductProductTemplateObject, TagValueObject } from 'src/app/products/models/master-product/master-product.model';
import { TagCategory, TagType, TemplateSubType, TemplateType } from 'src/app/products/models/product-template.model';
import { GeneralService } from 'src/app/products/services/general.service';
import { MediaService } from 'src/app/products/services/media.service';
import { MasterProductTemplateService } from '../../../services/master-product-template.service';
import { MasterProductProductTemplatePreviewComponent } from '../master-product-product-template-preview/master-product-product-template-preview.component';
import { decode } from 'html-entities';
import { TextEditorService } from 'src/app/products/services/text-editor.service';

@Component({
  selector: 'app-voucher-template',
  templateUrl: './voucher-template.component.html',
  styleUrls: ['./voucher-template.component.scss']
})
export class VoucherTemplateComponent implements OnInit, OnDestroy {
  @Input() productTemplateList: MasterProductProductTemplateObject[] = [];
  @Output() showErrorMessage = new EventEmitter<string>();
  @Output() updateMasterProduct = new EventEmitter<string>();

  public get tagType(): typeof TagType {
    return TagType;
  }

  public get tagCategory(): typeof TagCategory {
    return TagCategory;
  }

  readonly VOUCHER_TEMPLATE_TYPE: TemplateType = TemplateType.HTML;
  readonly VOUCHER_TEMPLATE_SUB_TYPE: TemplateSubType = TemplateSubType.Voucher;
  readonly LANGUAGE_DICTIONARY_CATEGORY = "CultureCode";
  readonly DETAILS_NOT_FOUND = "Template details are not found";
  readonly VERSION_NOT_FOUND = "Template version is not found";
  readonly EVENT_COMPOSITION_START = "compositionstart";
  readonly EVENT_COMPOSITION_END = "compositionend";
  readonly DEBOUNCE_TIME = 500;
  readonly HTML_EDITOR_CONFIG: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'br',
    toolbarHiddenButtons: [
      [
        'customClasses',
        'insertImage',
        'insertVideo',
        'fontName',
        'insertHorizontalRule',
        'backgroundColor',
      ]
    ]
  };

  templateList: any;
  templateVersions: any[] = [];
  tagList: any[] = [];
  mediaList: any;
  languageList: any = [];

  selectedTemplate: {} = {};
  selectedLanguageId: number = 0;
  selectedTemplateVersion: any;

  isLanguageApplied: boolean = false;
  isDefaultLanguage: boolean = false;
  isCurrentVersion: boolean = false;
  isCompositing: boolean = false;

  errorMessage: string = "";

  currentProductTemplate!: MasterProductProductTemplateObject;
  existedProductTemplate: MasterProductProductTemplateObject | undefined;

  @ViewChild("templateSelectorNgb") templateSelectorNgb!: NgbTypeahead;
  @ViewChild("templateSelectorRef") templateSelectorRef!: ElementRef;
  @ViewChildren('imageSelectorRef') imageSelectorRefs!: QueryList<ElementRef>;

  isCompositing$ = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject();
  templateVersionDestroy$ = new Subject();

  constructor(
    private readonly modalService: NgbModal,
    private readonly masterProductTemplateService: MasterProductTemplateService,
    private readonly generalService: GeneralService,
    private readonly mediaService: MediaService,
    private readonly textEditorService: TextEditorService,
  ) {
  }

  ngOnInit(): void {
    if (this.productTemplateList.length > 0) {
      this.currentProductTemplate = {
        templateId: this.productTemplateList[0].templateId,
        templateName: this.productTemplateList[0].templateName,
        templateType: TemplateType.HTML,
        templateSubType: TemplateSubType.Voucher
      }
      this.selectedTemplate = {
        templateId: this.productTemplateList[0].templateId,
        templateName: this.productTemplateList[0].templateName,
        templateType: TemplateType.HTML,
        templateSubType: TemplateSubType.Voucher
      }
      this.getExistTemplateDetailsAndLanguages();
    }
  }

  ngAfterViewInit(): void {
    this.setCompositionEvents(this.templateSelectorRef, this.destroy$);
  }

  ngAfterViewChecked(): void {
    this.imageSelectorRefs.forEach((imageSelector: ElementRef) => {
      this.setCompositionEvents(imageSelector, this.templateVersionDestroy$);
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  setExistedProductTemplate() {
    this.existedProductTemplate = this.productTemplateList.find((x) => x.languageId?.toString() === this.selectedLanguageId.toString()) ?? undefined;
  }

  setCompositionEvents(element: ElementRef, notifier: ObservableInput<any>) {
    this.isCompositing$
      .asObservable()
      .pipe(takeUntil(notifier))
      .subscribe({
        next: (isStarted) => this.isCompositing = isStarted
      });

    fromEvent(element.nativeElement, this.EVENT_COMPOSITION_START)
      .pipe(
        takeUntil(notifier)
      ).subscribe({
        next: () => {
          this.isCompositing$.next(true);
        }
      });

    fromEvent(element.nativeElement, this.EVENT_COMPOSITION_END)
      .pipe(
        takeUntil(notifier)
      ).subscribe({
        next: () => {
          this.isCompositing$.next(false);
        }
      });
  }

  searchTemplate: OperatorFunction<string, readonly any[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(this.DEBOUNCE_TIME), distinctUntilChanged());
    const isCompositing$ = this.isCompositing$.pipe(debounceTime(this.DEBOUNCE_TIME), distinctUntilChanged());

    return combineLatest([debouncedText$, isCompositing$]).pipe(
      map(([searchTerm, _]) => searchTerm),
      filter(searchTerm => {
        if (searchTerm.length === 0) {
          this.onCleanTemplateClick();
        }
        return !this.isCompositing && searchTerm.length > 0
      }),
      switchMap((searchTerm) => this.masterProductTemplateService
        .getTemplatesList(this.VOUCHER_TEMPLATE_TYPE, this.VOUCHER_TEMPLATE_SUB_TYPE, searchTerm)),
      map((response) => {
        if (response.success) {
          const data = JSON.parse(response.data).templates;
          this.templateList = data.items ?? [];
          return this.templateList
        }
      })
    );
  };

  searchImage: OperatorFunction<string, readonly any[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(this.DEBOUNCE_TIME), distinctUntilChanged());
    const isCompositing$ = this.isCompositing$.pipe(debounceTime(this.DEBOUNCE_TIME), distinctUntilChanged());

    return combineLatest([debouncedText$, isCompositing$]).pipe(
      map(([searchTerm, _]) => searchTerm),
      filter(searchTerm => !this.isCompositing && searchTerm.length > 0),
      switchMap(searchTerm => this.mediaService.getMediaByKeyword(searchTerm)),
      map((response) => {
        if (response.success) {
          const data = JSON.parse(response.data).mediaByKeyword;
          this.mediaList = data.slice(0, 10);
          return this.mediaList
        }
      })
    );
  };

  selecteTemplate(e: NgbTypeaheadSelectItemEvent<any>) {
    this.productTemplateList = [];
    this.currentProductTemplate = {};
    this.languageList = [];
    this.selectedLanguageId = 0;
    this.selectedTemplateVersion = null;
    this.selectedTemplate = {};
    this.tagList = [];

    this.templateVersionDestroy$.next(null);
    this.templateVersionDestroy$.complete();

    this.currentProductTemplate = {
      templateId: e.item.templateId,
      templateName: e.item.templateName,
      languageId: e.item.defaultLanguage,
      templateType: TemplateType.HTML,
      templateSubType: TemplateSubType.Voucher
    }
    this.getTemplateDetailsAndLanguages();
  }

  selectImage(imageTag: any, media: any) {
    const tag = this.tagList.find((x) => x.tagId === imageTag.tagId)
    if (tag && media.nodeUrl) {
      tag.value = media.mediaId;
      tag.nodeUrl = media.nodeUrl;
    }
  }

  getTemplateDetailsAndLanguages() {
    this.masterProductTemplateService
      .getTemplateDetailsCurrentVersion(TemplateType.HTML, this.currentProductTemplate.templateId!)
      .pipe(
        switchMap(response => {
          const data = JSON.parse(response.data).templateVersionInfo;

          if (data.items.length <= 0)
            throw throwError(() => new Error(this.DETAILS_NOT_FOUND));

          this.templateVersions = data.items;
          if (!this.currentProductTemplate.languageId) {
            this.currentProductTemplate.languageId = this.templateVersions[0].defaultLanguage
          }
          const languageIds = data.items.map((x: any) => x.languageId);
          return this.generalService.getDictionariesByIds(languageIds, this.LANGUAGE_DICTIONARY_CATEGORY)
        })
      ).subscribe({
        next: (response) => {
          this.languageList = JSON.parse(response.data).dictionaries;
          const currentLanguage = this.languageList.find((x: any) => x.dictionaryId === this.currentProductTemplate.languageId);

          if (currentLanguage) {
            this.selectedLanguageId = currentLanguage.dictionaryId;
            this.selecteTemplateVersion();
          }
        },
        error: (err) => {
          this.showErrorMessage.emit(err.message ?? err.error.message);
        }
      })
  }

  getExistTemplateDetailsAndLanguages() {

    const templateVersionIds: number[] = [];
    this.productTemplateList?.forEach(x => templateVersionIds.push(x.templateVersionId ?? 0));

    this.masterProductTemplateService
      .getTemplateDetailsByVersionIdAndTemplateId(TemplateType.HTML, this.currentProductTemplate.templateId!, templateVersionIds)
      .pipe(
        switchMap(response => {
          const data = JSON.parse(response.data).templateVersionInfo;

          if (data.items.length <= 0)
            throw throwError(() => new Error(this.DETAILS_NOT_FOUND));

          this.templateVersions = data.items;

          let exsistVersions = this.templateVersions.filter((x: any) => templateVersionIds.includes(x.templateVersionId));
          exsistVersions.forEach(element => {
            this.templateVersions = this.templateVersions.filter(x => x.languageId != element.languageId || x.templateVersionId == element.templateVersionId);
          });

          if (!this.currentProductTemplate.languageId) {
            this.currentProductTemplate.languageId = this.templateVersions[0].defaultLanguage
          }
          const languageIds = data.items.map((x: any) => x.languageId);
          return this.generalService.getDictionariesByIds(languageIds, this.LANGUAGE_DICTIONARY_CATEGORY)
        })
      ).subscribe({
        next: (response) => {
          this.languageList = JSON.parse(response.data).dictionaries;
          const currentLanguage = this.languageList.find((x: any) => x.dictionaryId === this.currentProductTemplate.languageId);

          if (currentLanguage) {
            this.selectedLanguageId = currentLanguage.dictionaryId;
            this.selecteTemplateVersion();
          }
        },
        error: (err) => {
          this.showErrorMessage.emit(err.message ?? err.error.message);
        }
      })
  }

  selecteTemplateVersion() {
    this.setExistedProductTemplate();

    const templateVersion = this.templateVersions.find((x) => x.languageId.toString() === this.selectedLanguageId.toString())

    if (templateVersion) {
      this.currentProductTemplate.templateVersionId = templateVersion.templateVersionId;
      this.currentProductTemplate.languageId = this.selectedLanguageId;

      this.isDefaultLanguage = templateVersion.defaultLanguage.toString() === this.selectedLanguageId.toString();
      this.isLanguageApplied = this.isDefaultLanguage;
      this.isCurrentVersion = templateVersion.isCurrentVersion;

      if (this.existedProductTemplate?.languageId?.toString() === this.selectedLanguageId.toString()) {
        this.isLanguageApplied = true;
      }

      this.selectedTemplateVersion = templateVersion;
      this.templateVersionDestroy$.next(null);
      this.templateVersionDestroy$.complete();

      this.getTags();

    } else {
      this.showErrorMessage.emit(this.VERSION_NOT_FOUND);
      this.isLanguageApplied = false;
    }
  }

  getTags() {
    if (!this.selectedTemplateVersion || !this.selectedTemplateVersion?.templateVersionId) {
      this.tagList = [];
      return;
    }

    this.masterProductTemplateService
      .getTagsByTemplateVersionId(this.selectedTemplateVersion.templateVersionId)
      .subscribe({
        next: (response) => {
          if (response.success) {
            const tagsByTemplateVersionId = JSON.parse(response.data).tagsByTemplateVersionId;
            this.tagList = tagsByTemplateVersionId.filter((tag: any) =>
              [TagCategory.UserInput, TagCategory.UserInputWithDefault, TagCategory.SelectedBySystem].includes(tag.category));

            if (this.existedProductTemplate && this.existedProductTemplate.tagValueList && this.existedProductTemplate.tagValueList.length > 0) {
              this.tagList.forEach((x) => {
                const existedTag = this.existedProductTemplate!.tagValueList!.find((y) => y.contentTagId === x.tagId);
                if (existedTag) {
                  x.value = existedTag.value;
                  x.textValue = existedTag.textValue;
                }
              })
            }
            else {
              this.tagList.forEach((x) => {
                if (x.category === TagCategory.UserInputWithDefault || x.category === TagCategory.SelectedBySystem) {
                  x.value = x.defaultValue;
                }
              })
            }

            this.updateMasterProduct.emit();

            let radioTagList = this.tagList.filter((tag: any) => tag.type == this.tagType.RadioGroup);

            if (radioTagList?.length > 0) {
              let radioTagIds: number[] = [];
              radioTagList.forEach((element) => radioTagIds.push(element.tagId));
              if (radioTagIds.length > 0) {
                this.masterProductTemplateService.getTagValueByTagIds(radioTagIds)
                  .subscribe
                  ({
                    next: (response) => {
                      const tagValueByTagId = JSON.parse(response.data).tagValues.items;
                      tagValueByTagId?.forEach((tagValue: any) => {
                        const tag = this.tagList.find((y) => y.tagId === tagValue.tagId);
                        if (tag) {
                          if (!tag.tagValueList) {
                            tag.tagValueList = []
                          }
                          tag.tagValueList.push(tagValue);
                          if (tag.value == tagValue.tagValueId) {
                            tag.selectedItem = tagValue
                          }
                          if (!tag.selectedItem && tagValue.isDefault) {
                            tag.selectedItem = tagValue
                            tag.value = tagValue.tagValueId
                          }
                        }
                      })
                    },
                  })
              }
            }

            let imageTagList = this.tagList.filter((tag: any) => tag.type == this.tagType.Image);

            if (imageTagList?.length > 0) {
              const imageMediaIds: number[] = imageTagList.filter((element) => element.value).map((element) => element.value);
              if (imageMediaIds.length > 0) {
                this.mediaService.getMediaByIds(imageMediaIds)
                  .subscribe
                  ({
                    next: (response) => {
                      const allMediaURL = JSON.parse(response.data).allMediaURL.items;
                      allMediaURL?.forEach((media: any) => {
                        const tag = this.tagList.find((tag: any) => tag.type == this.tagType.Image && tag.value == media.mediaId.toString());
                        if (tag) {
                          tag.nodeUrl = media.nodeUrl
                        }
                      })
                    },
                  })
              }
            }
          }
        },
        error: (err) => {
          this.showErrorMessage.emit(err.message ?? err.error.message);
        },
        complete: () => {
          this.templateVersionDestroy$ = new Subject();
        }
      })
  }

  templateSelecorFormatter(item: { templateName: string }) {
    return item.templateName;
  }

  imageSelectorFormatter(item: any) {
    return item.nodeUrl;
  }

  onCleanTemplateClick() {
    this.productTemplateList = [];
    this.currentProductTemplate = {};
    this.languageList = [];
    this.selectedLanguageId = 0;
    this.selectedTemplateVersion = null;
    this.selectedTemplate = {};
    this.tagList = [];

    this.templateVersionDestroy$.next(null);
    this.templateVersionDestroy$.complete();

    this.updateMasterProduct.emit();
  }

  onDeleteImageClick(imageTag: any) {
    const tag = this.tagList.find((x) => x.tagId === imageTag.tagId)
    if (tag) {
      tag.image = null;
      tag.value = "";
      tag.nodeUrl = "";
    }
  }

  onRadioChange(radioTag: any) {
    const tag = this.tagList.find((x) => x.tagId === radioTag.tagId)
    if (tag) {
      tag.value = tag.selectedItem?.tagValueId?.toString() ?? "";
    }
  }

  onPreviewClick() {
    if (this.selectedTemplateVersion == null) {
      return;
    }
    this.popupPreview(this.selectedTemplateVersion, false);
  }

  onPreviewLatestVersionClick() {
    //Get Latest Vesion
    let latestVersion: any = null;
    this.masterProductTemplateService
      .getTemplateDetailsCurrentVersion(TemplateType.HTML, this.currentProductTemplate.templateId!)
      .subscribe({
        next: (response) => {
          const data = JSON.parse(response.data).templateVersionInfo;

          if (data.items.length <= 0)
            throw throwError(() => new Error(this.DETAILS_NOT_FOUND));

          latestVersion = data.items.find((x: any) => x.languageId == this.selectedTemplateVersion.languageId);
          this.popupPreview(latestVersion, true);
        },
        error: (err) => {
          this.showErrorMessage.emit(err.message ?? err.error.message);
        }
      })
  }

  popupPreview(templateVersion: any, isPreviewLatestVersion: boolean) {
    if (templateVersion == null) {
      return;
    }

    let subject1 = templateVersion.subject1;
    let content1 = templateVersion.content1;
    let subject2 = templateVersion.subject2;
    let content2 = templateVersion.content2;
    let subject3 = templateVersion.subject3;
    let content3 = templateVersion.content3;

    if (this.tagList) {
      this.tagList.forEach((value: any) => {
        let replaceValue = value.value;
        if (value.type == TagType.RadioGroup) {
          replaceValue = value.selectedItem?.htmlValue ?? "";
        }
        if (value.type == TagType.Image) {
          replaceValue = value.nodeUrl ?? "";
        }
        if (value.category == TagCategory.SelectedBySystem) {
          replaceValue = value.tagName;
        }
        if (replaceValue) {
          subject1 = subject1?.replaceAll(value.tagName, replaceValue ?? "") ?? subject1
          content1 = content1?.replaceAll(value.tagName, replaceValue ?? "") ?? content1
          subject2 = subject2?.replaceAll(value.tagName, replaceValue ?? "") ?? subject2
          content2 = content2?.replaceAll(value.tagName, replaceValue ?? "") ?? content2
          subject3 = subject3?.replaceAll(value.tagName, replaceValue ?? "") ?? subject3
          content3 = content3?.replaceAll(value.tagName, replaceValue ?? "") ?? content3
        }
      });
    }

    const modalRef = this.modalService.open(MasterProductProductTemplatePreviewComponent, { backdrop: 'static', size: 'lg', centered: true });
    modalRef.componentInstance.templatePreview = {
      templateType: 1,
      subject1: subject1,
      content1: content1,
      subject2: subject2,
      content2: content2,
      subject3: subject3,
      content3: content3,
      isPreviewLatestVersion: isPreviewLatestVersion
    }
    modalRef.componentInstance.apllyLatestVersionChecked.subscribe((x: any) => {
      this.templateVersions = this.templateVersions.filter((version: any) => version.languageId != templateVersion.languageId);
      let productTemplate = this.productTemplateList.find((version: any) => version.languageId == templateVersion.languageId);
      if (productTemplate != null) {
        productTemplate.templateVersionId = templateVersion.templateVersionId;
      }
      this.templateVersions.push(templateVersion);
      this.selecteTemplateVersion()
    });
  }

  onLanguageChanged() {
    this.updateProductTemplateList();
    this.selecteTemplateVersion();
  }

  onRichTextChange(richTextTag: any) {
    const tag = this.tagList.find((x) => x.tagId === richTextTag.tagId);
    const content = tag.value.replace(/&#10;/g, '').trim().replaceAll('</li>', '</li>\r\n');
    if (tag) {
      tag.textValue = this.textEditorService.convertHtmlToPlainText(decode(content));
    }
  }



  updateProductTemplateList() {
    this.productTemplateList = this.productTemplateList.filter((x) => x.templateVersionId !== this.currentProductTemplate?.templateVersionId);
    if (this.isLanguageApplied && this.currentProductTemplate?.templateVersionId !== undefined) {
      const productTemplate = {
        templateId: this.currentProductTemplate?.templateId,
        templateType: this.currentProductTemplate?.templateType,
        templateSubType: TemplateSubType.Voucher,
        templateVersionId: this.currentProductTemplate?.templateVersionId,
        templateName: this.currentProductTemplate?.templateName,
        defaultLanguageId: this.currentProductTemplate?.defaultLanguageId,
        languageId: this.currentProductTemplate?.languageId,
        tagValueList: this.tagList.map((x) => {
          const tagDetails = {
            contentTagId: x.tagId,
            tagName: x.tagName,
            value: x.value,
            textValue: x.textValue,
          }
          if (x.tagName === '{FOOTNOTE}') {
            tagDetails.value = tagDetails.value.trim().replace(/&#10;/g, '').replaceAll('</li>', '</li>\r\n');
          } 
          return tagDetails
        })
      };
      this.productTemplateList.push(productTemplate)
    }
    return this.productTemplateList;
  }
}
