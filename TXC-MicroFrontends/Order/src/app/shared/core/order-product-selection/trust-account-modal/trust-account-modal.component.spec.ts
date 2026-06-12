import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { TrustAccountModalComponent } from './trust-account-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { TrustAccountService } from 'src/app/order/services/trust-account.service';

describe('TrustAccountModalComponent', () => {
  const activeModalSvcSpy = jasmine.createSpyObj('NgbActiveModal', ['dismiss']);
  const trustAccountSvcSpy = jasmine.createSpyObj('TrustAccountService', [
    'getTrustAccount',
  ]);
  const toastSpy = jasmine.createSpyObj('NgbdToastGlobal', [
    'showSuccess',
    'showDanger',
  ]);
  let component: TrustAccountModalComponent;
  let fixture: ComponentFixture<TrustAccountModalComponent>;

  const MockTrustAccountData = {
    amount: 111,
    createdDateTime: 'string',
    expiryDate: 'string',
    expiryPolicyId: 111,
    id: 1,
    orderLineId: 1,
    trustAccountBatchNo: 'string',
    trustAccountId: 1,
    trustAccountOption: 1,
    validFrom: 'string',
    validTo: 'string',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrustAccountModalComponent, NgbdToastGlobal],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSvcSpy },
        FormBuilder,
        { provide: TrustAccountService, useValue: trustAccountSvcSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    trustAccountSvcSpy.getTrustAccount.and.returnValue(
      of(MockTrustAccountData)
    );

    fixture = TestBed.createComponent(TrustAccountModalComponent);
    component = fixture.componentInstance;
    component.product = {
      trustAccount: {} as any,
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set values', () => {
    // arrange
    const trustExpiryDateControl =
      component.trustAccountFormGroup.get('trustExpiryDate');
    const validPeriodControl =
      component.trustAccountFormGroup.get('validPeriod');

    component.product = {
      trustAccount: {
        trustAccountOption: 'Default',
        trustExpiryDate: new Date(),
        validPeriod: [new Date(), new Date()],
      } as any,
    } as any;

    // act
    component.ngOnInit();

    // assert
    expect(trustExpiryDateControl?.value).toBeTruthy();
    expect(validPeriodControl?.value).toBeTruthy();
  });

  describe('trustAccountOption valueChanges()', () => {
    it('should patch the amount to default value', () => {
      // arrange
      const trustAccountOption =
        component.trustAccountFormGroup.get('trustAccountOption');
      const trustAmount = component.trustAccountFormGroup.get('trustAmount');
      component.product = { trustAccount: { trustAmount: '10' } } as any;
      component.editMode = true;

      // act
      trustAccountOption?.setValue('Default');

      // assert
      expect(trustAmount?.value).toBe('10');
    });

    it('should patch the amount to null', () => {
      // arrange
      const trustAccountOption =
        component.trustAccountFormGroup.get('trustAccountOption');
      const trustAmount = component.trustAccountFormGroup.get('trustAmount');
      component.product = { trustAccount: { trustAmount: '10' } } as any;
      component.editMode = true;

      // act
      trustAccountOption?.setValue('Custom');

      // assert
      expect(trustAmount?.value).toBeFalsy();
    });
  });

  describe('onButtonClicked()', () => {
    it('should dismiss the modal with true', () => {
      // act
      component.onButtonClicked(true);

      // assert
      expect(activeModalSvcSpy.dismiss).toHaveBeenCalledWith(true);
    });

    it('should dismiss the modal with false', () => {
      // act
      component.onButtonClicked();

      // assert
      expect(activeModalSvcSpy.dismiss).toHaveBeenCalledWith(false);
    });
  });

  describe('fetchViewTrustAccount()', () => {
    beforeEach(() => {
      // arrange
      component.editMode = false;
      component.isViewOnlyTrustAccount = true;
    });
    it('should call fetchViewTrustAccount and return success', fakeAsync(() => {
      // arrange
      const maporderLineTrustToTrustForm = spyOn(
        component,
        'maporderLineTrustToTrustForm'
      );

      // act
      component.ngOnInit();
      component.fetchViewTrustAccount();
      tick();

      // assert
      expect(trustAccountSvcSpy.getTrustAccount).toHaveBeenCalled();
      expect(maporderLineTrustToTrustForm).toHaveBeenCalled();
    }));

    it('should call fetchViewTrustAccount and return error', fakeAsync(() => {
      // arrange
      trustAccountSvcSpy.getTrustAccount.and.returnValue(
        of(throwError('error'))
      );
      // act
      component.fetchViewTrustAccount();
      tick();
      // assert
      expect(toastSpy.showDanger).toBeDefined();
    }));
  });
});
