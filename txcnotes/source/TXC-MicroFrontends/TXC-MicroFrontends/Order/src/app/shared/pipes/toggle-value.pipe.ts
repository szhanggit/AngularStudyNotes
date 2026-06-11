import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toggleValue',
})
export class ToggleValuePipe implements PipeTransform {
  transform(value: unknown) {
    return value ? 'Yes' : 'No';
  }
}
