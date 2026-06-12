import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-page-size',
  templateUrl: './page-size.component.html',
  styleUrls: ['./page-size.component.scss']
})
export class PageSizeComponent {
  @Input() pageSizes:{ value: number; label: string; }[] = [];
  @Input() pageSizeModel: number = 20;
  @Output() pageSizeModelChange = new EventEmitter<number>();
}
