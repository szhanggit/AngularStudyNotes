import {
  ComponentFixture,
  TestBed,
  inject,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { ProductDetailsFormComponent } from './product-details-form.component';
import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { QuotationStateService } from 'src/app/order/services/state-service/quotation-state.service';
import { of } from 'rxjs';
import { FormService } from 'src/app/order/services/form.service';
import { ExpirySchemeTypeEnum } from 'src/app/shared/enums/expiry-scheme-type.enum';

describe('ProductDetailsFormComponent', () => {
  const quotationSvcSpy = jasmine.createSpyObj(
    'QuotationStateService',
    ['getQuotations'],
    { selectedOrderMode$: of({}) }
  );
  const formSvcSpy = jasmine.createSpyObj('FormService', [
    'handleSchemeChange',
  ]);
  let component: ProductDetailsFormComponent;
  let fixture: ComponentFixture<ProductDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductDetailsFormComponent],
      providers: [
        FormBuilder,
        {
          provide: QuotationStateService,
          useValue: quotationSvcSpy,
        },
        {
          provide: FormService,
          useValue: formSvcSpy,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(ProductDetailsFormComponent);
    component = fixture.componentInstance;

    /* This is where we can simulate / test our component
       and pass in a value for formGroup where it would've otherwise
       required it from the parent
    */
    component.productDetailsFormGroup = fb.group({
      expiryScheme: '',
      expiryDate: '',
      voucherQuantity: { value: '', disabled: true },
      reservationCode: '',
      clientOrderNumber: '',
      isShortUrlNeeded: '',
    });

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expirySchemeField.valueChanges should call form service handle scheme change', fakeAsync(() => {
    // arrange
    const expirySchemeControl =
      component.productDetailsFormGroup.get('expiryScheme');

    // act
    expirySchemeControl?.setValue(ExpirySchemeTypeEnum.FixEndOfDay);

    // assert
    expect(formSvcSpy.handleSchemeChange).toHaveBeenCalled();
  }));
});
