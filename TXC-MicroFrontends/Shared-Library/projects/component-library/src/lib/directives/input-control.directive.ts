import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';

@Directive({
  selector: 'input[inputControl]',
  standalone: true,
})
/**
 *  How to use:
 *  Adding following into input can activate the control
 *  inputControl="decimal-4" --> allow positive numbers and with 4th decimal place, number of decimal places is changable(1-9)
 *  inputControl="PNdecimal-4." --> allow positive and negative numbers and with 4th decimal place, number of decimal places is changable(1-9)
 *  inputControl="number-only" --> allow positive numbers including zero
 */



export class InputControlDirective implements AfterViewInit {
  @Input('inputControl') control!: string;

  inputElement = this.el.nativeElement;


  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit(): void {
    const keydownEvent$ = fromEvent(this.inputElement, 'keydown') as Observable<KeyboardEvent>;
    keydownEvent$.subscribe(event => {
      if (this.control.startsWith('decimal')) { this.positiveDecimal(event) }
      if (this.control.includes('PNdecimal')) { this.positiveNegativeDecimal(event) }
      if (this.control.includes('number-only')) { this.numberOnly(event) }
    })


  }

  positiveDecimal(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) { return; }
    if (event.ctrlKey === true) { return; }

    const decimalPlace = isNaN(+this.control.slice(-1)) ? 2 : +this.control.slice(-1);
    const string = `\^\\d+[\.]?\\d{0,${decimalPlace}}$`;
    const regex: RegExp = new RegExp(string, 'g');

    const position = this.el.nativeElement.selectionStart;
    const next: string = [(this.inputElement.value).slice(0, position), event.key == 'Decimal' ? '.' : event.key, (this.inputElement.value).slice(position)].join('');
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }
  }

  positiveNegativeDecimal(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    const specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
    if (specialKeys.indexOf(event.key) !== -1) { return; }
    if (event.ctrlKey === true) { return; }

    const decimalPlace = isNaN(+this.control.slice(-1)) ? 2 : +this.control.slice(-1);
    const string = `\^\-?\\d+[\.]?\\d{0,${decimalPlace}}$`;
    const regex: RegExp = new RegExp(string, 'g');

    const position = this.el.nativeElement.selectionStart;
    const next: string = [(this.inputElement.value).slice(0, position), event.key == 'Decimal' ? '.' : event.key, (this.inputElement.value).slice(position)].join('');
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }
  }

  numberOnly(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    if (event.ctrlKey === true) { return; }
    if (isNaN(+event.key) && +event.key !== 0) {
      event.preventDefault();
    }
  }

}
