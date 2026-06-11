import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, fromEvent, map, merge, Observable, OperatorFunction, Subject, Subscription, switchMap, takeUntil } from 'rxjs';
import { BaseResponse } from 'src/app/products/models/base-response.model';
import { MasterProduct, MasterProductProductTemplate, MasterProductProductTemplateObject, TagValueObject } from 'src/app/products/models/master-product/master-product.model';
import { TagType, TagCategory, TemplateSubType, TemplateType } from 'src/app/products/models/product-template.model';
import { GeneralService } from 'src/app/products/services/general.service';
import { MasterProductTemplateService } from 'src/app/products/services/master-product-template.service';
import { MasterProductProductTemplatePreviewComponent } from '../master-product-product-template-preview/master-product-product-template-preview.component';

const LANGUAGE_DICTIONARY_CATEGORY = "CultureCode";

@Component({
  selector: 'app-sms-template',
  templateUrl: './sms-template.component.html',
  styleUrls: ['./sms-template.component.scss']
})
export class SmsTemplateComponent implements OnInit {
  @Input() productTemplateList: MasterProductProductTemplateObject[] = [];
  @Output() showErrorMessage = new EventEmitter<string>();
  @Output() updateMasterProduct = new EventEmitter<string>();
  @ViewChild('searchTemplate') searchTemplate!: NgbTypeahead;
  @ViewChild('searchTemplateRef') searchTemplateRef!: ElementRef;

  public get tagType(): typeof TagType {
    return TagType;
  }

  public get tagCategory(): typeof TagCategory {
    return TagCategory;
  }

  templateType: TemplateType = TemplateType.Text;
  templateSubType: TemplateSubType = TemplateSubType.SMS;
  templates: any;
  template: any;
  templateVersion: any;

  languageId: number = 0;
  languages: any = [];
  tags: any;

  masterProduct?: MasterProduct;

  errorMessage: string = "";

  model: any;

  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  destroy$ = new Subject();
  compositionEnd$ = new BehaviorSubject<string>("");

  isCompositionStarted: boolean = false;

  lastSearchTerm: string = "";
  trySearchTerm: string = "";

  constructor(
    private readonly modalService: NgbModal,
    private readonly masterProductTemplateService: MasterProductTemplateService,
    private readonly generalService: GeneralService,) {

  }

  ngOnInit(): void {
    if (this.productTemplateList?.length > 0) {
      this.template = this.productTemplateList[0]
      this.getTemplateDetail(this.productTemplateList);
    }
  }

  ngAfterViewInit(): void {
    this.compositionEnd$.asObservable().pipe(takeUntil(this.destroy$));

    fromEvent(this.searchTemplateRef.nativeElement, 'compositionstart')
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.isCompositionStarted = true
        }
      });

    fromEvent(this.searchTemplateRef.nativeElement, 'compositionend')
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.isCompositionStarted = false
          this.compositionEnd$.next(this.trySearchTerm);
        }
      });
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(500), distinctUntilChanged());
    const isCompositing$ = this.compositionEnd$.pipe(debounceTime(500), distinctUntilChanged());

    return combineLatest([debouncedText$, isCompositing$]).pipe(
      map(([searchTerm, _]) => searchTerm),
      filter(searchTerm => {
        if (searchTerm.length === 0) {
          this.onCleanTemplateClick();
        }
        return !this.isCompositionStarted && searchTerm.length > 0
      }),
      switchMap(searchTerm => {
        this.lastSearchTerm = searchTerm;
        return this.masterProductTemplateService.getTemplatesList(this.templateType, this.templateSubType, searchTerm);
      }),
      map((response) => {
        if (response.success) {
          const data = JSON.parse(response.data).templates;
          this.templates = data.items;
          return this.templates
        }
      }),
    );
  };

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  formatter(x: { templateName: string }) {
    return x.templateName;
  }

  selectedItem(e: NgbTypeaheadSelectItemEvent<any>) {
    this.template = e.item;
    this.getTemplateDetail(null);
  }

  getTemplateDetail(smsTemplates: MasterProductProductTemplateObject[] | null) {
    const templateVersionIds: number[] = [];
    smsTemplates?.forEach(x => templateVersionIds.push(x.templateVersionId ?? 0));

    let templateDetails$: Observable<BaseResponse>;
    if (smsTemplates == null) {
      templateDetails$ = this.masterProductTemplateService.getTemplateDetailsCurrentVersion(this.templateType, this.template.templateId);
    }
    else {
      templateDetails$ = this.masterProductTemplateService.getTemplateDetailsByVersionIdAndTemplateId(this.templateType, this.template.templateId, templateVersionIds);
    }
    templateDetails$.pipe(
      switchMap((response) => {
        const data = JSON.parse(response.data).templateVersionInfo;
        this.template.versions = data.items
        let exsistVersions = this.template.versions.filter((x: any) => templateVersionIds.includes(x.templateVersionId));
        exsistVersions.forEach((element: any) => {
          this.template.versions = this.template.versions.filter((x: any) => x.languageId != element.languageId || x.templateVersionId == element.templateVersionId);
        });

        const languageIds = this.template.versions.map((x: any) => x.languageId);
        return this.generalService.getDictionariesByIds(languageIds, LANGUAGE_DICTIONARY_CATEGORY);
      }
      )).subscribe({
        next: (response) => {
          const data = JSON.parse(response.data).dictionaries;
          this.languages = data

          if (smsTemplates) {
            smsTemplates?.forEach((productTemplate) => {
              const exsitVersion = this.template.versions.find((x: any) => x.templateVersionId === productTemplate.templateVersionId)
              if (exsitVersion) {
                exsitVersion.applyLanguage = true;
                exsitVersion.tagValueList = [];
                productTemplate.tagValueList?.forEach((tag) => {
                  let storageTag: any = new Object();
                  storageTag.tagId = tag.contentTagId;
                  storageTag.value = tag.value;
                  exsitVersion.tagValueList.push(storageTag);
                })
              }
            })

            let existTemplateVesion = this.template.versions.find((x: any) => x.applyLanguage && x.languageId == x.defaultLanguage)
            if (!existTemplateVesion) {
              existTemplateVesion = this.template.versions.find((x: any) => x.applyLanguage)
            }
            const existLanguage = this.languages.find((x: any) => x.dictionaryId === existTemplateVesion.languageId)
            if (existLanguage) {
              this.languageId = existLanguage.dictionaryId;
              this.setTemplateVersionId();
            }
          }
          else {
            const defaultLanguage = this.languages.find((x: any) => x.dictionaryId === this.template.defaultLanguage)
            if (defaultLanguage) {
              this.languageId = defaultLanguage.dictionaryId;
              this.setTemplateVersionId();
              this.templateVersion.applyLanguage = true;
            }
          }
        },
        error: (err) => {
          this.showErrorMessage.emit(err.message ?? err.error.message);
          this.onCleanTemplateClick();
        }
      });
  }

  setTemplateVersionId() {
    this.templateVersion = this.template.versions.find((x: any) => x.languageId == this.languageId);
    this.getTags();
  }

  getTags() {
    if (!this.templateVersion || !this.templateVersion.templateVersionId) {
      this.tags = [];
      return;
    }

    this.masterProductTemplateService
      .getTagsByTemplateVersionId(this.templateVersion.templateVersionId)
      .subscribe({
        next: (response) => {
          if (response.success) {
            const tagsByTemplateVersionId = JSON.parse(response.data).tagsByTemplateVersionId;
            this.tags = tagsByTemplateVersionId.filter((tag: any) => [TagCategory.UserInput, TagCategory.UserInputWithDefault].includes(tag.category))
            this.templateVersion?.tagValueList?.forEach((storageTag: any) => {
              let inputTag = this.tags.find((tag: any) => tag.tagId == storageTag.tagId)
              if (inputTag) {
                inputTag.value = storageTag.value
              }
            });
            const invalidTag = this.tags.find((tag: any) => tag.type != TagType.Text);
            if (invalidTag) {
              this.showErrorMessage.emit(`${invalidTag.tagName} isn't a text tag. Please exclude it from the template.`);
              this.onCleanTemplateClick();
            }
            this.updateMasterProduct.emit();
          }
        },
        error: (err) => {
          this.showErrorMessage.emit(err.message ?? err.error.message);
          this.onCleanTemplateClick();
        }
      })
  }

  onCleanTemplateClick() {
    this.productTemplateList = [];
    this.template = null;
    this.languages = [];
    this.languageId = 0;
    this.templateVersion = null;
    this.tags = [];
    this.updateMasterProduct.emit();
  }

  onApplyLanguageChange(value: boolean) {
    if (this.templateVersion == null) {
      return;
    }
    this.templateVersion.applyLanguage = value;
  }

  onPreviewClick() {
    if (this.templateVersion == null) {
      return;
    }
    this.popupPreview(this.templateVersion, false);
  }

  onPreviewLatestVersionClick() {
    //Get Latest Vesion
    let latestVersion: any = null;
    this.masterProductTemplateService
      .getTemplateDetailsCurrentVersion(this.templateType, this.templateVersion.templateId!)
      .subscribe({
        next: (response) => {
          const data = JSON.parse(response.data).templateVersionInfo;

          latestVersion = data.items.find((x: any) => x.languageId == this.templateVersion.languageId);
          latestVersion.applyLanguage = this.templateVersion.applyLanguage;
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

    this.updateProductTemplateList();

    let subject1 = templateVersion.subject1;
    let content1 = templateVersion.content1;
    let subject2 = templateVersion.subject2;
    let content2 = templateVersion.content2;
    let subject3 = templateVersion.subject3;
    let content3 = templateVersion.content3;

    if (this.templateVersion.tagValueList) {
      this.templateVersion.tagValueList.forEach((value: any) => {
        if (value.value) {
          subject1 = subject1?.replaceAll(value.tagName, value.value ?? "") ?? subject1
          content1 = content1?.replaceAll(value.tagName, value.value ?? "") ?? content1
          subject2 = subject2?.replaceAll(value.tagName, value.value ?? "") ?? subject2
          content2 = content2?.replaceAll(value.tagName, value.value ?? "") ?? content2
          subject3 = subject3?.replaceAll(value.tagName, value.value ?? "") ?? subject3
          content3 = content3?.replaceAll(value.tagName, value.value ?? "") ?? content3
        }
      });
    }

    const modalRef = this.modalService.open(MasterProductProductTemplatePreviewComponent, { backdrop: 'static', size: 'lg', centered: true });
    modalRef.componentInstance.templatePreview = {
      templateType: 2,
      subject1: subject1,
      content1: content1,
      subject2: subject2,
      content2: content2,
      subject3: subject3,
      content3: content3,
      isPreviewLatestVersion: isPreviewLatestVersion
    }

    modalRef.componentInstance.apllyLatestVersionChecked.subscribe((x: any) => {
      this.template.versions = this.template.versions.filter((version: any) => version.languageId != templateVersion.languageId);
      let productTemplate = this.productTemplateList.find((version: any) => version.languageId == templateVersion.languageId);
      if (productTemplate != null) {
        productTemplate.templateVersionId = templateVersion.templateVersionId;
      }
      this.template.versions.push(templateVersion);
      this.setTemplateVersionId()
    });
  }

  onTagfocusout() {
    this.templateVersion.tagValueList = this.tags;
  }

  updateProductTemplateList() {
    this.productTemplateList = [];
    if (this.templateVersion) {
      this.templateVersion.tagValueList = this.tags;
    }

    this.template?.versions?.forEach((element: any) => {
      if (element.applyLanguage) {
        let tagValueList: TagValueObject[] = []
        element.tagValueList?.forEach((tag: any) => {
          tagValueList.push({
            contentTagId: tag.tagId,
            tagName: tag.tagName,
            value: tag.value,
            textValue: tag.value
          });
        });
        this.productTemplateList.push({
          templateType: this.templateType,
          templateSubType: this.templateSubType,
          templateName: element.templateName,
          tagValueList: tagValueList,
          templateVersionId: element.templateVersionId,
          templateId: element.templateId
        });
      }
    })

    return this.productTemplateList;
  }
}
