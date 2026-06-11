import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Self,
} from '@angular/core';
import { BaseControlComponent } from '../../dumb/form-based/base-control.component';
import { InputModel } from '../../models/dumb-models/input.model';
import {
  Subject,
  OperatorFunction,
  Observable,
  debounceTime,
  distinctUntilChanged,
  merge,
  switchMap,
  of,
  map,
  BehaviorSubject,
  tap,
} from 'rxjs';
import { NgControl, ValidationErrors } from '@angular/forms';
import { Media } from '../../models/media.model';
import { MediaService } from 'src/app/order/services/media.service';
import { BaseResponse } from 'src/app/order/models/base-response.model';

@Component({
  selector: 'app-image-search',
  templateUrl: './image-search.component.html',
  styleUrls: ['./image-search.component.scss'],
})
export class ImageSearchComponent
  extends BaseControlComponent
  implements OnInit
{
  @Input() imageSearchModel!: InputModel;
  @Output() blur: EventEmitter<void> = new EventEmitter<void>();
  controlName!: string;
  errorMessages: { [key: string]: string } = {};
  hideErrors = false;

  mediaList: Media[] = [];
  focusMedia$ = new Subject<string>();
  clickMedia$ = new Subject<string>();
  mediaFormatter = (result: Media) => result.nodeUrl;
  mediaOnHover = false;
  mediaLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    @Self() public controlDir: NgControl,
    private _mediaService: MediaService
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
  }

  writeValue(value: any): void {
    this.value = value;
    if (
      this.controlDir.control?.value !== value &&
      value !== '' &&
      value &&
      !isNaN(value)
    ) {
      this._mediaService
        .getMediaById(Number.parseInt(value))
        .pipe(
          tap(() => this.mediaLoading$.next(true)),
          map((res: BaseResponse) => JSON.parse(res.data).mediaById[0]),
          tap(() => this.mediaLoading$.next(false))
        )
        .subscribe((media: Media) => this.controlDir.control?.setValue(media));
    }
  }

  private setErrorMessages() {
    this.errorMessages = {
      required: `${this.imageSearchModel.label} is mandatory.`,
    };
  }

  onSelectMediaImage($event: any) {
    this.onChange($event.item.mediaId);
  }

  removeMedia(): void {
    this.value = '';
    this.onChange(this.value);
  }

  checkMediaImageValue(): void {
    this._mediaService
      .getMediaByKeyword(this.value)
      .pipe(
        tap(() => this.mediaLoading$.next(true)),
        map((res) => {
          return JSON.parse(res.data)
            .mediaByKeyword.filter(
              (v: { keyword: string }) =>
                v.keyword.toLowerCase().indexOf(this.value.toLowerCase()) > -1
            )
            .slice(0, 10);
        }),
        tap(() => this.mediaLoading$.next(false))
      )
      .subscribe({
        next: (mediaList: Media[]) => {
          const findMedia = mediaList.find(
            (media) => media.keyword.toLowerCase() === this.value.toLowerCase()
          );
          if (findMedia) {
            this.writeValue(findMedia);
            this.onChange(findMedia.mediaId);
          } else {
            this.writeValue('');
            this.onChange('');
          }
        },
      });
  }

  searchMediaImages: OperatorFunction<string, readonly Media[]> = (
    text$: Observable<string>
  ) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const inputFocus$ = this.focusMedia$;
    return merge(debouncedText$, inputFocus$).pipe(
      tap(() => this.mediaLoading$.next(true)),
      switchMap((term) => {
        if (term === '') {
          return of([]);
        } else {
          return this._mediaService.getMediaByKeyword(term).pipe(
            map((res) =>
              JSON.parse(res.data)
                .mediaByKeyword.filter(
                  (v: { keyword: string }) =>
                    v.keyword.toLowerCase().indexOf(term.toLowerCase()) > -1
                )
                .slice(0, 10)
            )
          );
        }
      }),
      tap(() => this.mediaLoading$.next(false))
    );
  };
}
