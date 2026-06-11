import { Injectable } from '@angular/core';
import { DictionaryService } from '../dictionary.service';
import { Dictionary } from '../../models/dictionary.model';
import { StateService } from './state.service';

export interface LanguageState {
  languages: Dictionary[];
}

@Injectable({
  providedIn: 'root',
})
export class LanguageStateService extends StateService<LanguageState> {
  selectedLanguageList$ = this.select((state) => state.languages);

  constructor(private dictionaryService: DictionaryService) {
    super({ languages: [] });
  }

  setLanguageList() {
    this.dictionaryService
      .getLanguages()
      .subscribe((dictionary: Dictionary[]) => {
        this.setState({ languages: [...dictionary] });
      });
  }
}
