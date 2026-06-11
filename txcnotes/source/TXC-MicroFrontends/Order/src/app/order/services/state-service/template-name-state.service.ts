import { Injectable } from '@angular/core';
import { StateService } from './state.service';
import { Template } from 'src/app/shared/models/template.model';
import { TemplateService } from '../template.service';
import {
  TemplateSubTypeEnum,
  TemplateTypeEnum,
} from 'src/app/shared/enums/template.enum';
import { switchMap, map } from 'rxjs';

export interface TemplateNameState {
  emailTemplateNameList: TemplateNameList | undefined;
  smsTemplateNameList: TemplateNameList | undefined;
}

export interface TemplateNameList {
  keyword: string;
  templateList: Template[];
}

export const INITIAL_TEMPLATE_NAME_STATE: TemplateNameState = {
  emailTemplateNameList: undefined,
  smsTemplateNameList: undefined,
};

@Injectable({
  providedIn: 'root',
})
export class TemplateNameListStateService 
  extends StateService<TemplateNameState> {
  selectedEmailTemplateList$ = this.select(
    (state) => state.emailTemplateNameList
  );
  selectedSMSTemplateList$ = this.select((state) => state.smsTemplateNameList);

  constructor(private templateService: TemplateService) {
    super(INITIAL_TEMPLATE_NAME_STATE);
  }

  setSelectedTemplateNameState(emailTemplateName = '', smsTemplateName = '') {
    return this.templateService
      .getTemplatesList(
        TemplateTypeEnum.Email,
        TemplateSubTypeEnum.Voucher,
        emailTemplateName
      )
      .pipe(
        switchMap((emailTemplateList: Template[]) => {
          return this.templateService
            .getTemplatesList(
              TemplateTypeEnum.SMS,
              TemplateSubTypeEnum.SMS,
              smsTemplateName
            )
            .pipe(
              map((smsTemplateList: Template[]) => {
                this.setState({
                  emailTemplateNameList: {
                    keyword: emailTemplateName,
                    templateList: emailTemplateList,
                  },
                  smsTemplateNameList: {
                    keyword: smsTemplateName,
                    templateList: smsTemplateList,
                  },
                });
              })
            );
        })
      )
      .subscribe();
  }

  setSelectedEmailTemplateNameState(emailTemplateName = '') {
    return this.templateService
      .getTemplatesList(
        TemplateTypeEnum.Email,
        TemplateSubTypeEnum.Voucher,
        emailTemplateName
      )
      .pipe(
        map((emailTemplateList: Template[]) => {
          this.setState({
            emailTemplateNameList: {
              keyword: emailTemplateName,
              templateList: emailTemplateList,
            },
          });
        })
      )
      .subscribe();
  }

  setSelectedSMSTemplateNameState(smsTemplateName = '') {
    return this.templateService
      .getTemplatesList(
        TemplateTypeEnum.SMS,
        TemplateSubTypeEnum.SMS,
        smsTemplateName
      )
      .pipe(
        map((smsTemplateList: Template[]) => {
          this.setState({
            smsTemplateNameList: {
              keyword: smsTemplateName,
              templateList: smsTemplateList,
            },
          });
        })
      )
      .subscribe();
  }
}
