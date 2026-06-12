import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Media } from 'src/app/products/models/media.model';
import { TagType } from 'src/app/products/models/product-template.model';
import { TemplateTag } from 'src/app/products/models/template-tag.model';
import { Template } from 'src/app/products/models/template.model';
import { MediaService } from 'src/app/products/services/media.service';
import { TemplateService } from 'src/app/products/services/template.service';

@Component({
  selector: 'app-template-preview',
  templateUrl: './template-preview.component.html',
  styleUrls: ['./template-preview.component.scss']
})
export class TemplatePreviewComponent implements OnInit {
  @Input() templateFormGroup!: FormGroup;
  @Input() templateTags!: TemplateTag[];
  @Input() templateType!: number;
  @Input() index!: number;
  @Input() isCurrentVersion = true;

  preview: number = 1;
  previewPart: number = 1;
  selectedTemplate!: Template;
  constructor(
    public activeModal: NgbActiveModal,
    private readonly _sanitizer: DomSanitizer,
    private readonly _mediaService: MediaService,
    private readonly _templateService: TemplateService) { }

  get f(): any {
    return this.templateFormGroup.controls;
  }

  ngOnInit(): void {
  }

  applyTextToHtml() {
    Object.keys(this.f.productTemplateList.controls[this.index].controls).forEach(key => {
      for (let templateTag of this.templateTags) {
        if (key === templateTag.displayName && this.f.productTemplateList.controls[this.index].controls[key].value) {
          const value = this.f.productTemplateList.controls[this.index].controls[key].value;
          if (templateTag.type === TagType.Image) {
            if (!value.nodeUrl) {
              this._mediaService.getMediaById(value).subscribe(res => {
                if (res.success) {
                  const media: Media = JSON.parse(res.data).mediaById[0];
                  this._replaceText(templateTag, media.nodeUrl);
                }
              });
            } else {
              this._replaceText(templateTag, value.nodeUrl);
            }
          } else if (templateTag.type === TagType.RadioGroup) {
            this._templateService.getTagValuesByTagId(templateTag.tagId).subscribe(
              res => {
                const tagValues = JSON.parse(res.data).tagValueByTagId;
                const htmlValue = tagValues.find((tv: { applyConditions: { applyConditionId: number }[] }) => tv.applyConditions[0].applyConditionId === Number.parseInt(value)).htmlValue;

                if (!htmlValue) return;

                this._replaceText(templateTag, htmlValue);
              }
            );
          }
          else {
            this._replaceText(templateTag, value);
          }
        }
      }
    });
  }

  sanitizeTemplate(content: string) {
    return this._sanitizer.bypassSecurityTrustHtml(content);
  }

  private _replaceText(templateTag: ({ tagName: string }), value: string) {
    const regex = new RegExp(templateTag.tagName, 'g');
    this.selectedTemplate.subject1 = this.selectedTemplate.subject1 ? this.selectedTemplate.subject1.replace(regex, value) : '';
    this.selectedTemplate.subject2 = this.selectedTemplate.subject2 ? this.selectedTemplate.subject2.replace(regex, value) : '';
    this.selectedTemplate.subject3 = this.selectedTemplate.subject3 ? this.selectedTemplate.subject3.replace(regex, value) : '';
    this.selectedTemplate.content1 = this.selectedTemplate.content1 ? this.selectedTemplate.content1.replace(regex, value) : '';
    this.selectedTemplate.content2 = this.selectedTemplate.content2 ? this.selectedTemplate.content2.replace(regex, value) : '';
    this.selectedTemplate.content3 = this.selectedTemplate.content3 ? this.selectedTemplate.content3.replace(regex, value) : '';
  }
}
