import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDateMaskInput]',
})
export class DateMaskInputDirective {
  @Input() datePickerType!: 'simple' | 'range';

  get placeholder() {
    return this.datePickerType === 'simple'
      ? '____/__/__'
      : '____/__/__ ~ ____/__/__';
  }

  get placeholderWhenInputEmpty() {
    return this.datePickerType === 'simple'
      ? '___/__/__'
      : '___/__/__ ~ ____/__/__';
  }

  constructor() {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue: string = inputElement.value;
    const caretPosition: number = inputElement.selectionStart || 0;
    const formattedValue = this.formatInputValue(inputValue);
    const caretOffset = this.calculateCaretOffset(
      inputValue,
      formattedValue,
      caretPosition,
      event as InputEvent
    );
    const selectionRange = caretPosition + caretOffset;
    inputElement.value = formattedValue;
    inputElement.setSelectionRange(selectionRange, selectionRange);
  }

  private formatInputValue(inputValue: string): string {
    const cleanedValue = inputValue.replace(/[^\d]/g, '');
    let formattedValue = '';
    let placeholderIndex = 0;
    let inputValueIndex = 0;
    if (inputValue === this.placeholderWhenInputEmpty || !inputValue) {
      return formattedValue;
    }

    while (
      placeholderIndex < this.placeholder.length &&
      inputValueIndex < cleanedValue.length
    ) {
      if (this.placeholder.charAt(placeholderIndex) === '_') {
        formattedValue += cleanedValue.charAt(inputValueIndex);
        inputValueIndex++;
      } else {
        formattedValue += this.placeholder.charAt(placeholderIndex);
      }
      placeholderIndex++;
    }

    while (placeholderIndex < this.placeholder.length) {
      formattedValue += this.placeholder.charAt(placeholderIndex);
      placeholderIndex++;
    }

    return formattedValue;
  }

  private calculateCaretOffset(
    inputValue: string,
    formattedValue: string,
    previousCaretPosition: number,
    event: InputEvent
  ): number {
    const valueDiff = formattedValue.length - inputValue.length;
    const movementOffset = Math.max(0, valueDiff);
    const newCaretPosition = previousCaretPosition + movementOffset;
    const charInFront = formattedValue.charAt(newCaretPosition);

    if (event.inputType === 'deleteContentBackward') {
      return 0;
    }

    switch (charInFront) {
      case '/':
        return 1;
      case ' ':
        return 3;
      case '~':
        return 2;
      default:
        return 0;
    }
  }
}
