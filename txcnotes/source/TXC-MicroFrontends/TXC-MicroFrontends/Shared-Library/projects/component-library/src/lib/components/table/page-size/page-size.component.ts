import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-page-size',
  templateUrl: './page-size.component.html',
  styleUrls: ['./page-size.component.scss'],
})
export class PageSizeLibComponent {
  @Input() pageSizes: { value: number; label: string }[] = PAGE_SIZES;
  @Input() pageSizeModel: number = 20;
  @Output() pageSizeModelChange = new EventEmitter<number>();
}

export const PAGE_SIZES = [
  {
    value: 20,
    label: '20',
  },
  {
    value: 40,
    label: '40',
  },
  {
    value: 100,
    label: '100',
  },
];
