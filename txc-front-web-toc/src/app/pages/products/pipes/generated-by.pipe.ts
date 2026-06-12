import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'generatedby'})
export class GeneratedByPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
        case 0 : return 'Edenred';
        default: return '3rd Party';
    }
  }
}