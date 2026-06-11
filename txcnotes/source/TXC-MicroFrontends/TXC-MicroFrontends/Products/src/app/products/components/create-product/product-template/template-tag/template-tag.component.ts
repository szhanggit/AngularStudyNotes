import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SafeHtml } from '@angular/platform-browser';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { debounceTime, distinctUntilChanged, map, merge, Observable, of, OperatorFunction, Subject, switchMap } from 'rxjs';
import { Media } from 'src/app/products/models/media.model';
import { TagCategory, TagType } from 'src/app/products/models/product-template.model';
import { TemplateTag } from 'src/app/products/models/template-tag.model';
import { MediaService } from 'src/app/products/services/media.service';
import { TemplateService } from 'src/app/products/services/template.service';
import { TextEditorService } from 'src/app/products/services/text-editor.service';
import { decode } from 'html-entities';
@Component({
  selector: 'app-template-tag',
  templateUrl: './template-tag.component.html',
  styleUrls: ['./template-tag.component.scss']
})
export class TemplateTagComponent implements OnInit {
  public get tagType(): typeof TagType {
    return TagType;
  }

  public get tagCategory(): typeof TagCategory {
    return TagCategory;
  }

  @Input() templateTag!: TemplateTag;
  @Input() templateFormGroup!: FormGroup;
  @Input() index!: number;

  mediaList: Media[] = [];
  focusMediaKeyword$ = new Subject<string>();
  clickMediaKeyword$ = new Subject<string>();
  mediaFormatter = (result: Media) => result.nodeUrl;
  mediaOnHover = false;

  tagValues: { applyConditionName: string, applyConditionId: number, tagValueId: number, htmlValue: string }[] = [];

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
    ],
    toolbarHiddenButtons: [
      [
        'customClasses',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule'
      ]
    ]
  };

  richTextValue: SafeHtml = '';

  constructor(private readonly _mediaService: MediaService,
    private readonly _templateService: TemplateService,
    private readonly textEditorService: TextEditorService) {
  }

  // productTemplateListControl
  public getTemplateListFormGroup(index: number): FormGroup {
    const productTemplateList = <FormArray>this.templateFormGroup.controls['productTemplateList'];
    return <FormGroup>productTemplateList.controls[index];
  }

  ngOnInit(): void {
    if (this.templateTag.type === TagType.RichText) {
      (this.getTemplateListFormGroup(this.index).controls[this.templateTag.displayName] as FormControl).valueChanges.subscribe((value: string) => {
        this.richTextValue = this.textEditorService.convertHtmlToPlainText(decode(value));
      });

      const value = this.getTemplateListFormGroup(this.index).controls[this.templateTag.displayName].value;
      if (!value) return;
      this.richTextValue = this.textEditorService.convertHtmlToPlainText(decode(value));
    }

    if (this.templateTag.type === TagType.RadioGroup) {
      this._templateService.getTagValuesByTagId(this.templateTag.tagId).subscribe(
        res => {
          const tagValues = JSON.parse(res.data).tagValueByTagId;

          if (!tagValues || !tagValues.length) {
            return;
          }

          for (const tagValue of tagValues) {
            this.tagValues.push({
              applyConditionName: tagValue.applyConditions[0].name,
              applyConditionId: tagValue.applyConditions[0].applyConditionId,
              htmlValue: tagValue.htmlValue,
              tagValueId: tagValue.tagValueId
            });
          }

          let value = Number.parseInt(this.getTemplateListFormGroup(this.index).controls[this.templateTag.displayName].value);
          if (!value) {
            value = tagValues.find((tv: { isDefault: boolean }) => tv.isDefault === true).applyConditions[0].applyConditionId
          }
          this.getTemplateListFormGroup(this.index).controls[this.templateTag.displayName].setValue(value);
        },
        () => {
          // error loading template tags
        },
        () => {
        }
      )
    }
  }

  onRichTextChanged($event: any, formControlName: any): void {
    let content = this.getTemplateListFormGroup(this.index).value[formControlName];
    content = content ? content.replace(/&#10;/g, '').trim().replaceAll('</li>', '</li>\r\n') : content;
    this.richTextValue = this.textEditorService.convertHtmlToPlainText(decode(content));
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
  

  focusMedia(value: string) {
    this.focusMediaKeyword$.next(value)
    this.getTemplateListFormGroup(this.index).controls[this.templateTag.displayName].markAsTouched();
    this.getTemplateListFormGroup(this.index).controls[this.templateTag.displayName].markAsDirty();
  }

  removeMedia(): void {
    this.getTemplateListFormGroup(this.index).controls[this.templateTag.displayName].setValue('');
    this.getTemplateListFormGroup(this.index).controls[this.templateTag.displayName].markAsTouched();
    this.getTemplateListFormGroup(this.index).controls[this.templateTag.displayName].markAsDirty();
  }

  checkMediaImageValue(): void {
    const value = this.getTemplateListFormGroup(this.index).controls[this.templateTag.displayName].value;
    const getbannerImageValue = this.mediaList?.find(media => media.keyword.toLowerCase() === value.toLowerCase())
    if (getbannerImageValue) {
      this.getTemplateListFormGroup(this.index).controls[this.templateTag.displayName].setValue(getbannerImageValue);
    } else {
      this.getTemplateListFormGroup(this.index).controls[this.templateTag.displayName].setValue('');
    }
  }
}
