import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'productwizardnext'})
export class ProductWizardNextPipe implements PipeTransform {
  transform(step: number): string {
    switch (step) {
        case 5 : return 'Create';
        default: return 'Next';
    }
  }
}