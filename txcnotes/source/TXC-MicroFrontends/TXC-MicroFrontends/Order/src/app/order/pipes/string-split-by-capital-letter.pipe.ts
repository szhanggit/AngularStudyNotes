import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'stringSplitByCapitalLetter'})
// This is a pipe to split a string by capital letter and digital number
// ex. "ThisIsTheStringTo123AASplit" --> 'This Is The String To 123 A A Split'
export class StringSplitByCapitalLetterPipe implements PipeTransform {
  transform(value: string | undefined ): string {
    const arr = value?.match(/([A-Z]?[a-z]+|[A-Z]|[0-9]+)/g) ?? [];
    return !value ? '' : arr.join(' ');
  }
}