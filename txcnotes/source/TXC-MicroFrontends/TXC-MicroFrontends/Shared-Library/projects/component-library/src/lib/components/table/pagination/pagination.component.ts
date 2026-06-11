import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lib-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationLibComponent implements OnInit {
  @Input() page!: number;
  @Input() pageSize!: number;
  @Input() total: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  get itemStart() {
    return this.page === 1
      ? 1
      : this.total < 1
      ? this.total
      : (this.page - 1) * this.pageSize + 1;
  }

  get itemEnd() {
    return this.page === this.pageCount ||
      this.total < this.page * this.pageSize
      ? this.total
      : this.page * this.pageSize;
  }

  get pageCount() {
    return Math.ceil(this.total / this.pageSize);
  }

  constructor() {}

  ngOnInit() {}

  onPageChange(value: number) {
    this.page = value;
    this.pageChange.emit(value);
  }
}
