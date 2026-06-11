import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'productwizardback'})
export class ProductWizardBackPipe implements PipeTransform {
  transform(step: number): string {
    switch (step) {
        case 0 : return 'Cancel';
        case 1 : return 'Cancel'
        default: return 'Back';
    }
  }
}