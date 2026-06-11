import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appRemoveTag]',
})
export class RemoveTagDirective {
  @Output() updatedValue = new EventEmitter<{
    caretPos: number;
    newValue?: string;
  }>();
  previousValue: string = '';
  constructor(private el: ElementRef) {}

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    let startPos;
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const selectionStart = inputElement.selectionStart!;
    const selectionEnd = inputElement.selectionEnd!;
    const currentValue = inputElement.value;

    startPos = selectionStart;
    if (event.key === 'Backspace' || event.key === 'Delete') {
      startPos = selectionStart - 1;
      let leftClosestOpenBrace = startPos;
      let leftClosestCloseBrace = startPos;

      while (
        leftClosestOpenBrace >= 0 &&
        this.previousValue[leftClosestOpenBrace] !== '{'
      ) {
        leftClosestOpenBrace--;
      }

      while (
        leftClosestCloseBrace >= 0 &&
        this.previousValue[leftClosestCloseBrace] !== '}'
      ) {
        leftClosestCloseBrace--;
      }

      if (leftClosestCloseBrace > leftClosestOpenBrace) {
        return;
      }

      const t = currentValue[startPos - 1];
      while (startPos >= 0 && this.previousValue[startPos] !== '{') {
        startPos--;
      }

      let endPos = selectionEnd;
      while (
        endPos < currentValue.length &&
        this.previousValue[endPos] !== '}'
      ) {
        endPos++;
      }

      if (startPos >= 0 && endPos <= currentValue.length && startPos < endPos) {
        const newValue =
          currentValue.substring(0, startPos) + currentValue.substring(endPos);
        inputElement.value = newValue;

        inputElement.setSelectionRange(startPos, startPos);
        this.updatedValue.emit({ caretPos: startPos, newValue: newValue });
      }
      return;
    }

    this.updatedValue.emit({ caretPos: startPos });
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: Event) {
    const textarea: HTMLTextAreaElement = event.target as HTMLTextAreaElement;
    this.updatedValue.emit({ caretPos: textarea.selectionStart });
    this.previousValue = textarea.value;
  }
}
