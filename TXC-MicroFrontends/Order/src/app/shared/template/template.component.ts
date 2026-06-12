import { Component, OnInit } from '@angular/core';
import { Template } from '../models/template.model';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Tab } from '../models/dumb-models/tab.model';
import { TagTypeEnum, TemplateTypeEnum } from '../enums/template.enum';
import { QuotationStateService } from 'src/app/order/services/state-service/quotation-state.service';
import { OrderModeEnum } from 'src/app/order/enums/order-mode.enum';
import { OrderMode } from 'src/app/order/models/quotation-type.model';
import { MediaService } from 'src/app/order/services/media.service';
import { Media } from '../models/media.model';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
})
export class TemplateComponent implements OnInit {
  activeTab: number = 1;
  emailTemplate!: Template;
  smsTemplate!: Template;
  selectedTemplate!: Template;
  orderModes = OrderModeEnum;
  selectedOrderMode!: OrderMode;
  showVoucherTemplate = false;

  navigationTabs!: Tab[];

  templateType = TemplateTypeEnum;
  withTabs: boolean = true;
  loadingImages = 0;

  constructor(
    private sanitizer: DomSanitizer,
    public activeModal: NgbActiveModal,
    private quotationStateService: QuotationStateService,
    private mediaService: MediaService
  ) {}

  ngOnInit() {
    this.setSelectedQuotationType();
    this.navigationTabs = [
      {
        id: TemplateTypeEnum.Email,
        name: 'Voucher Page',
      },
      {
        id: TemplateTypeEnum.SMS,
        name: 'SMS',
      },
    ];
  }

  applyTagValues() {
    // set selected template
    this.selectedTemplate =
      this.activeTab === TemplateTypeEnum.Email
        ? this.emailTemplate
        : this.smsTemplate;

    if (!this.selectedTemplate) return;

    if (
      this.selectedTemplate.templateTags &&
      this.selectedTemplate.templateTagValue
    ) {
      for (const templateTag of this.selectedTemplate.templateTags) {
        for (const tagValue of this.selectedTemplate.templateTagValue) {
          if (tagValue.tagId === templateTag.tagId) {
            const value: any = tagValue.value;
            if (!value) continue;
            if (templateTag.type === TagTypeEnum.Image) {
              if (!value.nodeUrl) {
                this.mediaService.getMediaById(value).subscribe((res) => {
                  if (res.success) {
                    const media: Media = JSON.parse(res.data).mediaById[0];
                    this.replaceText(
                      templateTag,
                      media.nodeUrl,
                      this.emailTemplate
                    );
                  }
                });
              } else {
                this.replaceText(
                  templateTag,
                  value.nodeUrl,
                  this.emailTemplate
                );
              }
            } else if (templateTag.type === TagTypeEnum.RadioGroup) {
              const htmlValue = templateTag.options?.find(
                (opt) => opt.value === value
              )?.htmlValue;
              this.replaceText(
                templateTag,
                htmlValue ?? value,
                this.selectedTemplate
              );
            } else {
              this.replaceText(templateTag, value, this.selectedTemplate);
            }
          }
        }
      }
    }
  }

  replaceTags() {
    const selectedTemplate = this.selectedTemplate;
    if (selectedTemplate) {
      for (const templateTag of selectedTemplate.templateTags!) {
        for (const tagValue of selectedTemplate.templateTagValue!) {
          if (tagValue.tagId === templateTag.tagId) {
            const value = tagValue.value;
            if (!value) continue;
            this.replaceText(templateTag, value, selectedTemplate);
          }
        }
      }
    }
  }

  setSelectedQuotationType() {
    this.quotationStateService.selectedOrderMode$.subscribe(
      (orderMode) => (this.selectedOrderMode = orderMode)
    );
  }

  sanitizeTemplate(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  private replaceText(
    templateTag: { tagName: string },
    value: string,
    template: Template
  ) {
    const regex = new RegExp(templateTag.tagName, 'g');
    template.subject1 = template.subject1
      ? template.subject1.replace(regex, value)
      : '';
    template.subject2 = template.subject2
      ? template.subject2.replace(regex, value)
      : '';
    template.subject3 = template.subject3
      ? template.subject3.replace(regex, value)
      : '';
    template.content1 = template.content1
      ? template.content1.replace(regex, value)
      : '';
    template.content2 = template.content2
      ? template.content2.replace(regex, value)
      : '';
    template.content3 = template.content3
      ? template.content3.replace(regex, value)
      : '';
  }

  onTabChange($event: number) {
    this.activeTab = $event;
    this.applyTagValues();
  }
}
