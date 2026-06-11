import { Select2Data } from 'ng-select2-component';
import { TemplateTag } from './template-tag.model';

export interface Template {
  templateId: number;
  templateName: string;
  type: number;
  subType?: number;
  status?: number;
  description?: string;
  languageId: number;
  subject1: string | null;
  content1: string | null;
  subject2: string | null;
  content2: string | null;
  subject3: string | null;
  content3: string | null;
  attachmentTemplateVersionId: string | null;
  isCurrentVersion: boolean;
  templateVersionId: number;
  version: number;
  defaultLanguage?: number;
  defaultLanguageId?: number;
  templateTagValue?: TagValue[];
  templateTags?: TemplateTag[];
  keyword?: string;
  productTemplateVersion?: TemplateVersion[];
  defaultTemplateVersion?: TemplateVersion;
  templateVersions?: TemplateVersion[];
  templateVersionLanguages?: Select2Data;
}

export interface ProductTemplate {
  emailTemplate: Template | null;
  smsTemplate: Template | null;
}

export interface TemplateVersion {
  templateVersionId: number;
  languageId: number;
  templateId: number;
  templateName: string;
  type: number;
  subType?: number;
  status?: number;
  description?: string;
  subject1: string | null;
  content1: string | null;
  subject2: string | null;
  content2: string | null;
  subject3: string | null;
  content3: string | null;
  attachmentTemplateVersionId: string | null;
  isCurrentVersion: boolean;
  version: number;
  defaultLanguage?: number;
  defaultLanguageId?: number;
  keyword?: string;
  templateTagValue: TagValue[];
  templateTags?: TemplateTag[];
}

export interface TemplateVersionLanguage {
  templateVersionId: number;
  isDefaultLanguage: boolean;
  languageId: number;
}


export interface TagValue {
  tagId: number;
  tagName?: string;
  value: string;
  textValue: string | null;
}
