import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TemplatePreview } from 'src/app/products/models/master-product/template.model';
import { TemplateType } from 'src/app/products/models/product-template.model';

@Component({
  selector: 'app-master-product-product-template-preview',
  templateUrl: './master-product-product-template-preview.component.html',
  styleUrls: ['./master-product-product-template-preview.component.scss']
})
export class MasterProductProductTemplatePreviewComponent implements OnInit {
  @Input() templatePreview!: TemplatePreview
  @Output() apllyLatestVersionChecked = new EventEmitter<string>();

  get TEMPLATETYPE() {
    return TemplateType;
  }

  emailSubject1: string = '';
  emailSubject2: string = '';
  emailSubject3: string = '';
  emailContent1: string = '';
  emailContent2: string = '';
  emailContent3: string = '';
  smsContent1: string = '';
  smsContent2: string = '';
  smsContent3: string = '';
  isPreviewLatestVersion: boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    if (this.templatePreview?.templateType == 1) {
      this.emailSubject1 = this.templatePreview.subject1
      this.emailContent1 = this.templatePreview.content1
      this.emailSubject2 = this.templatePreview.subject2
      this.emailContent2 = this.templatePreview.content2
      this.emailSubject3 = this.templatePreview.subject3
      this.emailContent3 = this.templatePreview.content3
    }
    else if (this.templatePreview?.templateType == 2) {
      this.smsContent1 = this.templatePreview.content1
      this.smsContent2 = this.templatePreview.content2
      this.smsContent3 = this.templatePreview.content3
    }
    this.isPreviewLatestVersion = this.templatePreview.isPreviewLatestVersion
  }

  public sanitizeTemplate(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content)
  }

  public closeModal(): void {
    this.activeModal.close();
  }

  public onApllyLatestVersionCheck(): void {
    this.apllyLatestVersionChecked.emit();
    this.activeModal.close();
  }
}
