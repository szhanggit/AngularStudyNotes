import {
  async,
  ComponentFixture,
  TestBed,
  inject,
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { TrustAccountFormComponent } from './trust-account-form.component';
import { FormService } from 'src/app/order/services/form.service';
import { of } from 'rxjs';
import { FormBuilder } from '@angular/forms';

describe('TrustAccountFormComponent: ', () => {
  const formServiceSpy = jasmine.createSpyObj('FormService', [
    'getControlByName',
    'getFieldByName',
    'handleSchemeChange',
    'disableField',
    'enableField',
  ]);
  let component: TrustAccountFormComponent;
  let fixture: ComponentFixture<TrustAccountFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrustAccountFormComponent],
      providers: [
        FormBuilder,
        { provide: FormService, useValue: formServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
  }));

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(TrustAccountFormComponent);
    component = fixture.componentInstance;

    /* This is where we can simulate / test our component
       and pass in a value for formGroup where it would've otherwise
       required it from the parent
    */
    component.trustAccountFormGroup = fb.group({
      isTrustAccountNeeded: '',
      trustAccount: '',
      trustAccountFee: '',
      trustAccountBatchNumber: '',
      trustAccountOption: '',
      trustAmount: '',
      trustExpiryScheme: '',
      trustExpiryDate: '',
    });

    formServiceSpy.getControlByName.and.returnValue({
      value: 'test',
      valueChanges: of(''),
    });
    formServiceSpy.getFieldByName.and.returnValue({
      select2Data: [],
    });
    component.isMVP = true;
    fixture.detectChanges();
  }));

  describe('should be created', () => {
    it('and define formGrup ', () => {
      // assert
      expect(component).toBeTruthy();
      expect(component.trustAccountFormGroup).toBeDefined();
      expect(component.trustAccountFormModel).toBeDefined();
      expect(formServiceSpy.handleSchemeChange).toHaveBeenCalled();
    });

    it('and call disableField for Default Value', () => {
      // arrange
      formServiceSpy.getControlByName.and.returnValue({
        value: '',
        valueChanges: of('Default'),
      });

      // act
      component.ngOnInit();

      // assert
      expect(component).toBeTruthy();
      expect(component.trustAccountFormGroup).toBeDefined();
      expect(component.trustAccountFormModel).toBeDefined();
      expect(formServiceSpy.handleSchemeChange).toHaveBeenCalled();
      expect(formServiceSpy.disableField).toHaveBeenCalled();
    });

    it('and call enableField for Custom Value', () => {
      // arrange
      formServiceSpy.getControlByName.and.returnValue({
        value: null,
        valueChanges: of('Custom'),
      });

      // act
      component.ngOnInit();

      // assert
      expect(component).toBeTruthy();
      expect(component.trustAccountFormGroup).toBeDefined();
      expect(component.trustAccountFormModel).toBeDefined();
      expect(formServiceSpy.handleSchemeChange).toHaveBeenCalled();
      expect(formServiceSpy.enableField).toHaveBeenCalled();
    });
  });
});
