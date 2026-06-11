import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, delay, filter, Subject, switchMap } from 'rxjs';
import { ExpiryScheme } from '../../../models/expiry-scheme.model';
import { ProductType } from '../../../models/product-type.model';

@Component({
  selector: 'app-product-pricing',
  templateUrl: './product-pricing.component.html',
  styleUrls: ['./product-pricing.component.scss']
})
export class ProductPricingComponent implements OnInit {
  @Input() pricingFormGroup: FormGroup;
  @Input() selectedTenant!: string;
  @Input() editMode: boolean = false;
  @Input() selectedType!: ProductType;

  selectedExpirySchemes: ExpiryScheme[] = [
    {
      expiryDateType: 'Fixed',
      expiryCondition: 'No expiration date (2999/12/31)',
      checked: false
    },
    {
      expiryDateType: 'Fixed',
      expiryCondition: 'Fixed end of day',
      checked: false
    },
  ];
  edenredExpirySchemes: ExpiryScheme[] = [
    {
      expiryDateType: 'Fixed',
      expiryCondition: 'No expiration date (2999/12/31)',
      checked: false
    },
    {
      expiryDateType: 'Fixed',
      expiryCondition: 'Fixed end of day',
      checked: false
    },
    {
      expiryDateType: 'Days',
      expiryCondition: 'Within 6 days expired after activation',
      checked: false
    },
    {
      expiryDateType: 'Days',
      expiryCondition: 'Within 13 days expired after activation',
      checked: false
    },
    {
      expiryDateType: 'Days',
      expiryCondition: 'Within 29 days expired after activation',
      checked: false
    },
    {
      expiryDateType: 'Days',
      expiryCondition: 'Within 30 days expired after activation',
      checked: false
    },
    {
      expiryDateType: 'Months',
      expiryCondition: 'Within 6 months expired after activation',
      checked: false
    },
    {
      expiryDateType: 'Months',
      expiryCondition: 'Within 13 months expired after activation',
      checked: false
    },
    {
      expiryDateType: 'Months',
      expiryCondition: 'Within 29 months expired after activation',
      checked: false
    },
    {
      expiryDateType: 'Months',
      expiryCondition: 'Within 30 months expired after activation',
      checked: false
    },
    {
      expiryDateType: 'End of Months',
      expiryCondition: 'End of Months Example 1',
      checked: false
    },
    {
      expiryDateType: 'End of Months',
      expiryCondition: 'End of Months Example 2',
      checked: false
    },
    {
      expiryDateType: 'End of Months',
      expiryCondition: 'End of Months Example 3',
      checked: false
    },
    {
      expiryDateType: 'End of Months',
      expiryCondition: 'End of Months Example 4',
      checked: false
    }
  ];
  thirdPartyExpirySchemes: ExpiryScheme[] = [
    {
      expiryDateType: 'Fixed',
      expiryCondition: 'No expiration date (2999/12/31)',
      checked: false
    },
    {
      expiryDateType: 'Fixed',
      expiryCondition: 'Fixed end of day',
      checked: false
    },
    {
      expiryDateType: 'Flexible Depends on Third-party',
      expiryCondition: 'Flexible deferred within end of 1 month expired after activation',
      checked: false
    },
    {
      expiryDateType: 'Flexible Depends on Third-party',
      expiryCondition: 'Flexible deferred within end of 2 month expired after activation',
      checked: false
    },
    {
      expiryDateType: 'Flexible Depends on Third-party',
      expiryCondition: 'Flexible deferred within end of 3 month expired after activation',
      checked: false
    },
    {
      expiryDateType: 'Flexible Depends on Third-party',
      expiryCondition: 'Flexible deferred within end of 4 month expired after activation',
      checked: false
    },
    {
      expiryDateType: 'Flexible Depends on Third-party',
      expiryCondition: 'Flexible deferred within end of 12 month expired after activation',
      checked: false
    }
  ];
  edenredExpirySchemeFilters = [
    {
      key: 1,
      value: 'Days'
    },
    {
      key: 2,
      value: 'Months'
    },
    {
      key: 3,
      value: 'End of Months'
    }
  ];
  thirdPartyExpirySchemeFilters = [
    {
      key: 1,
      value: 'Fixed'
    },
    {
      key: 2,
      value: 'Flexible Date Depends on Third-party'
    },
    {
      key: 3,
      value: 'Child Flexible Date Depends on Master Expiry'
    }
  ];

  displayedExpirySchemes: ExpiryScheme[] = [];

  getSelectedSchemes(): ExpiryScheme[] {
    return this.displayedExpirySchemes.filter(expiryScheme => expiryScheme.checked === true);
  }

  get toggleCheckboxStatus(): boolean {
    let status = true;

    this.displayedExpirySchemes.forEach((expiryScheme: ExpiryScheme) => {
      if (expiryScheme.checked === false) {
        status = false;
      }
    });

    return status;
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

  // form
  get f() {
    return this.pricingFormGroup.controls;
  }

  constructor(private readonly _modalService: NgbModal) {
    this._filter$.pipe(
      debounceTime(200)
    ).subscribe((filter: string) => {
      if (filter === 'All') {
        this.displayedExpirySchemes = [...this.edenredExpirySchemes];
      } else {
        this.displayedExpirySchemes = this.edenredExpirySchemes.filter(xs => xs.expiryDateType == filter);
      }

      for (let expiryScheme of this.displayedExpirySchemes) {
        expiryScheme.checked = false;

        this.selectedExpirySchemes.forEach((selectedScheme: ExpiryScheme) => {
          if (expiryScheme.expiryDateType === selectedScheme.expiryDateType) {
            expiryScheme.checked = true;
          }
        })
      }
    });

    this._filter$.next('All');
  }

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ formControl });
    }
  }

  ngOnInit(): void {
  }

  OnSubmit(): void {
  }

  openModal(content: TemplateRef<NgbModal>): void {
    const modalRef = this._modalService.open(content, { size: 'xl', backdrop: 'static', centered: true });

    modalRef.result.then((data) => {
      if (data === 'Confirm') {
        this.selectedExpirySchemes = [];
        this.displayedExpirySchemes.forEach((expiryScheme: ExpiryScheme) => {
          if (expiryScheme.checked) {
            this.selectedExpirySchemes.push(expiryScheme);
          }
        })
      }
    })
  }

  toggleCheckboxes(checked: boolean): void {
    for (let expiryScheme of this.displayedExpirySchemes) {
      expiryScheme.checked = checked;
    }
  }
}
