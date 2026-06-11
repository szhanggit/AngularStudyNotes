import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appCpcolor]'
})
export class CpcolorDirective {

  constructor(private elRef: ElementRef) { }
    ngAfterViewInit() {
    this.elRef.nativeElement.style.color = 'red';
   }
  change(changedColor: String) {
      this.elRef.nativeElement.style.color = changedColor;
  }
}
