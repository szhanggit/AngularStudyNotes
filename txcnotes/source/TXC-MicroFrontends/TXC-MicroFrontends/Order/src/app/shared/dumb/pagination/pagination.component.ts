import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  @Input() page!: number;
  @Input() pageSize!: number;
  /**
   * TODO: Can remove and just use total:number as input in future. 
   * See signed quotation table for reference.
   */
  @Input() total$!: Observable<number>;
  @Output() pageChange = new EventEmitter<number>();

  total: number = 0;

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

  constructor(){}

  ngOnInit(){
    this.total$.pipe(takeUntil(this.destroyed$)).subscribe((total) => {
      this.total = total;
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  onPageChange(value: number) {
    this.page = value;
    this.pageChange.emit(value);
  }
}
