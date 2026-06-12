import { ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { DfvFormComponent } from './dfv-form.component';
import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DfvFormComponent', () => {
  let component: DfvFormComponent;
  let fixture: ComponentFixture<DfvFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DfvFormComponent],
      providers: [FormBuilder],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(DfvFormComponent);
    component = fixture.componentInstance;

    /* This is where we can simulate / test our component
       and pass in a value for formGroup where it would've otherwise
       required it from the parent
    */
    component.dfvDetailsFormGroup = fb.group({
      dfvDetailsFormArray: fb.array([
        fb.group({
          faceValue: '',
          voucherQuantity: '',
        }),
      ]),
    });

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.dfvDetailsFormGroup).toBeDefined();
    expect(component.dfvDetailsFormArray).toBeDefined();
  });

  it('createFormGroup should add on formArray', () => {
    // arrange
    component.selectedProduct = {
      faceValueRange: '1 to 20'
    } as any;

    // act
    component.createFormGroup();

    // assert
    expect(component.dfvDetailsFormArray.length).toBe(2);
  });

  
  
  describe('addFields', () => {
    it('should call create form group', () => {
      // arrange
      const createFormGroupSpy = spyOn(component, 'createFormGroup');
  
      // act
      component.addFields();
  
      // assert
      expect(createFormGroupSpy).toHaveBeenCalled();
    });

    it('should call create form group up until 10', () => {
      // arrange
      component.selectedProduct = {
        faceValueRange: '1 to 20'
      } as any;

      // act
      while (component.dfvDetailsFormArray.length <= 9) {
        component.addFields();
      }
  
      // assert
      expect(component.isAddBtnDisabled).toBeTrue();
      expect(component.dfvDetailsFormArray.length).toBe(10);
    });
  });

  it('removeFields should remove field', () => {
    // arrange
    component.selectedProduct = {
      faceValueRange: '1 to 20'
    } as any;

    // act
    while (component.dfvDetailsFormArray.length <= 9) {
      component.addFields();
    }

    component.removeFields(0);

    // assert
    expect(component.isAddBtnDisabled).toBeFalse();
    expect(component.dfvDetailsFormArray.length).toBe(9);
  });
  
});
