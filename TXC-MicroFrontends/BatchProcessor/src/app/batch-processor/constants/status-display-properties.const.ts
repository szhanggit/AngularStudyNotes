import { StatusProperty } from '@txc-angular/component-library';
import { StatusEnum } from '../enums/status.enum';

export const STATUS_DISPLAY_PROPERTIES: StatusProperty[] = [
  {
    values: [
      StatusEnum.Initializing,
      StatusEnum.Queuing,
      StatusEnum.Processing,
    ],
    textColor: '#2e3137',
    bgColor: '#d5d8dd',
  },
  {
    values: [StatusEnum.InitialzingError, StatusEnum.Failed],
    textColor: '#ff5978',
    bgColor: '#ffeff2',
  },
  {
    values: [StatusEnum.Completed],
    textColor: '#2e3137',
    bgColor: '#98f6db',
  },
];
