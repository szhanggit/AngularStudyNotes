import { Pipe, PipeTransform } from '@angular/core';
import { Dictionary } from '../models/dictionary.model';

@Pipe({ name: 'dictionarypipe' })
export class DictionaryPipe implements PipeTransform {
    transform(key: number, dictionaryEntries: Dictionary[]): string {
        const dictionary = dictionaryEntries.find(dictionary => dictionary.dictionaryId == key);
        return dictionary?.displayName ?? '--';
    }
}