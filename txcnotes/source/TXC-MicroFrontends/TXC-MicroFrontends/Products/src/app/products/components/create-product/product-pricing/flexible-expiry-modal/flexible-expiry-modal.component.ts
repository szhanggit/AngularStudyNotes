import { Component, EventEmitter, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Data } from 'ng-select2-component';
import { Subject, debounceTime } from 'rxjs';
import { ExpirationPolicyTypeEnum } from 'src/app/products/enums/expiration-policy-type.enum';
import { ExpiryTypeEnum } from 'src/app/products/enums/expiry-type.enum';
import { ExpiryScheme } from 'src/app/products/models/expiry-scheme.model';

@Component({
  selector: 'app-flexible-expiry-modal',
  templateUrl: './flexible-expiry-modal.component.html',
  styleUrls: ['./flexible-expiry-modal.component.scss']
})
export class FlexibleExpiryModalComponent implements OnInit {
  expirySchemeFilterSelect2Data: Select2Data = [];
  displayedExpirySchemes: ExpiryScheme[] = [];
  selectedExpirySchemes: ExpiryScheme[] = [];
  tableExpirySchemes: ExpiryScheme[] = [];
  expirySchemes: ExpiryScheme[] = [];

  onSelectedExpirySchemesChanged = new EventEmitter<{expirySchemes: ExpiryScheme[], selectedExpirySchemes: ExpiryScheme[]}>();

  expirationPolicyTypeEnum = ExpirationPolicyTypeEnum;
  
 
  get toggleCheckboxStatus(): boolean {
    let status = true;

    this.displayedExpirySchemes.forEach((expiryScheme: ExpiryScheme) => {
      if (expiryScheme.checked === false) {
        status = false;
      }
    });

    return status;
  }

  getSelectedSchemes(): ExpiryScheme[] {
    return this.selectedExpirySchemes;
  }
  _selectedFilter: string = 'All';
  private _filter$ = new Subject<string>();
  get selectedFilter(): string {
    return this._selectedFilter;
  }
  set selectedFilter(value: string) {
    this._selectedFilter = value;
    this._filter$.next(value);
  }

  

  constructor(public activeModal: NgbActiveModal) {
    this._filter$.pipe(
      debounceTime(200)
    ).subscribe((filter: string) => {
      if (filter === 'All') {
        this.displayedExpirySchemes = [...this.expirySchemes];
      } else {
        this.displayedExpirySchemes = this.expirySchemes.filter(xs => this.expirationPolicyTypeEnum[xs.type] == filter);
      }

      this.selectedExpirySchemes = this.tableExpirySchemes;

      for (let expiryScheme of this.displayedExpirySchemes) {
        expiryScheme.checked = false;

        this.selectedExpirySchemes.forEach((selectedScheme: ExpiryScheme) => {
          if (expiryScheme.displayName === selectedScheme.displayName) {
            expiryScheme.checked = true;
          }
        })
      }
    });
   }

  ngOnInit(): void {
  }

  toggleAllCheckboxes(checked: boolean): void {
    for (let expiryScheme of this.displayedExpirySchemes) {
      expiryScheme.checked = checked;

      if (expiryScheme.checked) {
        if (!this.selectedExpirySchemes.some(selected => selected.id === expiryScheme.id))
        this.selectedExpirySchemes.push(expiryScheme);
      } else {
        this.selectedExpirySchemes.splice(this.selectedExpirySchemes.findIndex(ex => ex.id === expiryScheme.id), 1);
      }
    }
  }

  toggleCheckboxCheck(expiryScheme: ExpiryScheme): void {
    expiryScheme.checked = !expiryScheme.checked;
    if (expiryScheme.checked) {
      this.selectedExpirySchemes.push(expiryScheme);
    } else {
      this.selectedExpirySchemes.splice(this.selectedExpirySchemes.findIndex(ex => ex.id === expiryScheme.id), 1);
    }
  }

  closeModal(isConfirm: boolean) {
    if (isConfirm) {
      this.onSelectedExpirySchemesChanged.emit({
        expirySchemes: this.expirySchemes,
        selectedExpirySchemes: this.selectedExpirySchemes,
      });
      this.activeModal.close({
        expirySchemes: this.expirySchemes,
        selectedExpirySchemes: this.selectedExpirySchemes.map(e => ({
          ...e,
          fixExpiryDate: null,
          isFixedExpiryPolicy: false
        })),
        expiryType: ExpiryTypeEnum.FLEXIBLE,
      });
    } else {
      this.activeModal.close();
    }
  }
  
}
