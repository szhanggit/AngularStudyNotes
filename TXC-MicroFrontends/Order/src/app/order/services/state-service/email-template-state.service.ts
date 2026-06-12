import { Injectable } from '@angular/core';
import { Template } from 'src/app/shared/models/template.model';
import { StateService } from './state.service';
import { TemplateService } from '../template.service';
import {
  TemplateSubTypeEnum,
  TemplateTypeEnum,
} from 'src/app/shared/enums/template.enum';
import { map } from 'rxjs';
import { BusinessUnitEnum } from 'src/app/shared/enums/tenant.enum';

export interface EmailTemplateState {
  templates: Template[];
}

const ORIGINAL_TEMPLATE = { templateId: 1, templateName: 'Original' };

@Injectable({
  providedIn: 'root',
})
export class EmailTemplateStateService 
  extends StateService<EmailTemplateState> {
  selectedTenant: string = '';
  selectedEmailTemplates$ = this.select((state) => state.templates);

  constructor(private templateService: TemplateService) {
    super({ templates: [] });
  }

  setEmailTemplates() {
    return this.templateService
      .getTemplatesList(TemplateTypeEnum.Other, TemplateSubTypeEnum.Other)
      .pipe(
        map((templates: Template[]) => {
          const tenantFromLocalStorage = localStorage.getItem('tenant');
          if (tenantFromLocalStorage) {
            this.selectedTenant = JSON.parse(tenantFromLocalStorage).name;
          }
          const newtemplates =
            this.selectedTenant &&
            this.selectedTenant !== BusinessUnitEnum.Global
              ? [ORIGINAL_TEMPLATE as Template, ...templates]
              : [...templates];
          this.setState({
            templates: newtemplates,
          });
        })
      );
  }

  resetEmailTemplates() {
    this.setState({ templates: [] });
  }
}
