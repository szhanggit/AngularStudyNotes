import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Self,
} from '@angular/core';
import { BaseControlComponent } from '../base-control.component';
import { NgControl, ValidationErrors } from '@angular/forms';
import {
  Observable,
  OperatorFunction,
  Subject,
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
} from 'rxjs';
import { TypeaheadModel } from 'src/app/shared/models/dumb-models/typeahead.model';
import { FormEmitterService } from '../../form/form-emitter.service';

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
})
export class TypeaheadComponent extends BaseControlComponent implements OnInit {
  @Input() typeaheadModel!: TypeaheadModel;
  @Output() blur: EventEmitter<void> = new EventEmitter<void>();
  controlName!: string;
  errorMessages: { [key: string]: string } = {};
  hideErrors = false;

  // voucher template name
  formatter(result: { keyword: string }) {
    return result.keyword;
  }
  focusTypeahead$ = new Subject<string>();
  clickTypeahead$ = new Subject<string>();

  constructor(
    @Self() public controlDir: NgControl,
    private formEmitterService: FormEmitterService
  ) {
    super();
    controlDir.valueAccessor = this;
  }

  get controlErrors() {
    if (this.controlDir.control?.errors) {
      return Object.keys(this.controlDir.control?.errors as ValidationErrors);
    }

    return [];
  }

  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control?.validator ? [control.validator] : [];
    control?.setValidators(validators);
    this.controlName = this.controlDir.name as string;
    this.setErrorMessages();

    if (this.typeaheadModel.focusTypeAhead) {
      this.typeaheadModel.focusTypeAhead.subscribe((value) => {
        if (value) this.focusTypeahead$.next(this.value);
      });
    }
  }

  writeValue(value: any): void {
    this.value = value;
    if (this.controlDir.control?.value !== value) {
      this.controlDir.control?.setValue(value);
    }
  }

  onSelectItem(value: any): void {
    this.onChange(value.item);
  }

  onTypeAheadChanged() {
    const value = this.value.keyword ?? this.value;
    const selectItem = this.typeaheadModel.list!.find(
      (list) => list.keyword.toLowerCase() === value.toLowerCase()
    );
    if (selectItem) {
      this.value = selectItem;
      this.onChange(selectItem);
    } else {
      this.value = '';
      this.onChange(null);
    }
  }

  onClickPreview(): void {
    this.formEmitterService.emitEvent.next(this.typeaheadModel.formControlName);
  }

  private setErrorMessages() {
    this.errorMessages = {
      required: `${this.typeaheadModel.label} is mandatory.`,
    };
  }

  searchList: OperatorFunction<string, readonly any[] | string[]> = (
    text$: Observable<string>
  ) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const inputFocus$ = this.focusTypeahead$;
    return merge(debouncedText$, inputFocus$).pipe(
      map((term: any) =>
        (term === '' || !term
          ? this.typeaheadModel.list!
          : this.typeaheadModel.list!.filter(
              (v) =>
                v.keyword
                  .toLowerCase()
                  .indexOf(
                    term.keyword
                      ? term.keyword.toLowerCase()
                      : term.toLowerCase()
                  ) > -1
            )
        ).slice(0, 20)
      )
    );
  };
}
