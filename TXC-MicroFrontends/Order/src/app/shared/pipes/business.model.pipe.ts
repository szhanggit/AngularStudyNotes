import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'businessmodel' })
export class BusinessModelPipe implements PipeTransform {
    transform(key: number): string {
        switch(key) {
            default: return 'Prepaid';
        }
    }
}