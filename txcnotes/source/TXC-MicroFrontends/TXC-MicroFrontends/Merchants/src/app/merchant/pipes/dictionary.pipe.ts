import { Pipe, PipeTransform } from '@angular/core';
import { Dictionary } from '../models/dictionary.model';

@Pipe({ name: 'dictionarypipe' })
export class DictionaryPipe implements PipeTransform {
    transform(key: number, dictionaryEntries: Dictionary[]): string {
        const dictionary = dictionaryEntries.find(dictionary => dictionary.dictionaryId == key);
        return key === -1 ? '-' :  dictionary?.displayName ?? '--';
    }

    transformStringToId(displayName: string, dictionaryEntries: Dictionary[]) {
        const dictionary = dictionaryEntries.find(
          (dictionary) => dictionary.displayName === displayName
        );
        return !displayName ? 0 : dictionary?.dictionaryId ?? -1;
    }
}