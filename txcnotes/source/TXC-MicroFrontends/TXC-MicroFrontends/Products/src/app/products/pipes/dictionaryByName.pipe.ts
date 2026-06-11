import { Pipe, PipeTransform } from '@angular/core';
import { Dictionary } from '../models/dictionary.model';

@Pipe({ name: 'dictionarybynamepipe' })
export class DictionaryByNamePipe implements PipeTransform {
    transform(key: number, dictionaryEntries: Dictionary[]): string {
        const dictionary = dictionaryEntries.find(dictionary => dictionary.dictionaryId == key);
        return dictionary?.name ?? '--';
    }
}