export interface TemplateTag {
  displayName: string;
  applyToHtmlTemplate: boolean;
  applyToTextTemplate: boolean;
  category: number;
  defaultValue: string | null;
  description: string;
  reflectionType: any;
  scopeLevel: number;
  tagId: number;
  tagName: string;
  type: number;
  isSelected?: boolean;
  options?: {
    label: string;
    value: string;
    htmlValue?: string;
    isDefault?: boolean;
  }[];
}
