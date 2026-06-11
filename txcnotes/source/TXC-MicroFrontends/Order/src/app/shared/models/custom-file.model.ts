import { FileEventTypeEnum } from '../enums/file-event-type.enum';

export interface CustomFile extends File {
  isRecentlyUploaded?: boolean;
  hasDuplicate?: boolean;
}

export interface FileEvent {
  customFiles: CustomFile[];
  eventType: FileEventTypeEnum;
  index?: number;
}

