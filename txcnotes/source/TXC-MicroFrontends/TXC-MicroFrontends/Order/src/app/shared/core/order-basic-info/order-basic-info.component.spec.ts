import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OrderBasicInfoComponent } from './order-basic-info.component';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivationTypeEnum } from '../../enums/activation-type.enum';
import { InputModel } from '../../models/dumb-models/input.model';
import { DatepickerModel } from '../../models/dumb-models/datepicker.model';

describe('OrderBasicInfoComponent', () => {
  let component: OrderBasicInfoComponent;
  let fixture: ComponentFixture<OrderBasicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderBasicInfoComponent],
      imports: [HttpClientTestingModule],
      providers: [FormBuilder, DatePipe],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(OrderBasicInfoComponent);
    component = fixture.componentInstance;

    /* This is where we can simulate / test our component
       and pass in a value for formGroup where it would've otherwise
       required it from the parent
    */
    component.basicInfoFormGroup = fb.group({
      orderName: '',
      publishDate: '',
      hasNoTargetPublishDate: '',
      activationType: '',
      activationDate: '',
      afterPublished: '',
    });
    fixture.detectChanges();
  }));

  it('should create', () => {
    // assert
    expect(component).toBeTruthy();
    expect(component.basicInfoFormGroup).toBeDefined();
  });

  it('should hide activation date if initial activationType is n days', () => {
    // arrange
    const hideActivationDateControlSpy = spyOn(
      component as any,
      'hideActivationDateControl'
    );
    component.activationType?.setValue(ActivationTypeEnum.NDaysFromPublishDate);

    // act
    component.ngOnInit();

    // assert
    expect(hideActivationDateControlSpy).toHaveBeenCalledWith(true);
  });

  describe('listenToActivationType()', () => {
    it('should reset date control and target and activation should be equal when value is SameAsPublishDate', () => {
      // arrange
      const resetDateControlSpy = spyOn(component as any, 'resetDateControl');
      const hideActivationDateControlSpy = spyOn(
        component as any,
        'hideActivationDateControl'
      );
      component.publishDate?.setValue('2022/12/12');

      // act
      component.activationType?.patchValue(
        ActivationTypeEnum.SameAsPublishDate
      );

      // assert
      expect(resetDateControlSpy).toHaveBeenCalled();
      expect(component.activationDate?.value).toEqual(
        component.publishDate?.value
      );
      expect(hideActivationDateControlSpy).toHaveBeenCalledWith(false);
    });

    it('should reset date control and compute activation when value is NDaysFromPublishDate', () => {
      // arrange
      const computeActivationDatePreviewSpy = spyOn(
        component as any,
        'computeActivationDatePreview'
      );
      const hideActivationDateControlSpy = spyOn(
        component as any,
        'hideActivationDateControl'
      );

      // act
      component.activationType?.patchValue(
        ActivationTypeEnum.NDaysFromPublishDate
      );

      // assert
      expect(component.afterPublished?.enabled).toBeTrue();
      expect(hideActivationDateControlSpy).toHaveBeenCalledWith(true);
      expect(computeActivationDatePreviewSpy).toHaveBeenCalledWith(
        component.afterPublished?.value
      );
    });

    it('should set the activation date to null and not hide activation date when value is Inactive', () => {
      // arrange
      const hideActivationDateControlSpy = spyOn(
        component as any,
        'hideActivationDateControl'
      );

      // act
      component.activationType?.patchValue(ActivationTypeEnum.Inactive);

      // assert
      expect(component.afterPublished?.value).toBeFalsy();
      expect(hideActivationDateControlSpy).toHaveBeenCalledWith(false);
    });

    it('should enable activation date and not hide activation date when value is FixedOfDate', () => {
      // arrange
      const hideActivationDateControlSpy = spyOn(
        component as any,
        'hideActivationDateControl'
      );
      const customMinDateSpy = spyOn(component as any, 'customMinDate');

      // act
      component.activationType?.patchValue(ActivationTypeEnum.FixedOfDate);

      // assert
      expect(component.activationDate?.enabled).toBeTrue();
      expect(hideActivationDateControlSpy).toHaveBeenCalledWith(false);
      expect(customMinDateSpy).toHaveBeenCalled();
    });

    it('should ot hide activation date when value is invalid', () => {
      // arrange
      const hideActivationDateControlSpy = spyOn(
        component as any,
        'hideActivationDateControl'
      );

      // act
      component.activationType?.patchValue(22);

      // assert
      expect(hideActivationDateControlSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('listenToTargetPublishDate()', () => {
    it('should set the activation date to same with target date', () => {
      // arrange
      component.activationType?.setValue(ActivationTypeEnum.SameAsPublishDate);

      // act
      component.publishDate?.setValue('2022/12/12');

      // assert
      expect(component.activationDate?.value).toEqual(
        component.publishDate?.value
      );
    });

    it('should compute activate date preview', () => {
      // arrange
      const computeActivationDatePreviewSpy = spyOn(
        component as any,
        'computeActivationDatePreview'
      );
      component.activationType?.setValue(
        ActivationTypeEnum.NDaysFromPublishDate
      );

      // act
      component.publishDate?.setValue('2022/12/12');

      // assert
      expect(computeActivationDatePreviewSpy).toHaveBeenCalledWith(
        component.activationType?.value
      );
    });

    it('should assign field def value', () => {
      // arrange
      const assignFieldDefValueSpy = spyOn(
        component as any,
        'assignFieldDefValue'
      );
      component.activationType?.setValue(
        ActivationTypeEnum.NDaysFromPublishDate
      );

      // act
      component.publishDate?.setValue('2022/12/12');

      // assert
      expect(assignFieldDefValueSpy).toHaveBeenCalled();
    });

    it('should assign field def value', () => {
      // arrange
      const assignFieldDefValueSpy = spyOn(
        component as any,
        'assignFieldDefValue'
      );
      component.activationType?.setValue(
        ActivationTypeEnum.NDaysFromPublishDate
      );
      component.hasNoTargetPublishDate?.setValue(true);

      // act
      component.publishDate?.setValue('2022/12/12');

      // assert
      expect(assignFieldDefValueSpy).toHaveBeenCalled();
    });

    it('should set the customMinDate', () => {
      // arrange
      const activationDate = component.basicInfoFormModel.fieldsDefinition.find(
        (field: InputModel) => field.formControlName === 'activationDate'
      )! as DatepickerModel;
      component.activationType?.setValue(ActivationTypeEnum.FixedOfDate);

      // act
      component.publishDate?.setValue('2022/12/12');

      // assert
      expect(activationDate.minDate).toBeDefined();
    });

    it('should set the customMinDate when picker is calendar type', () => {
      // arrange
      const activationDate = component.basicInfoFormModel.fieldsDefinition.find(
        (field: InputModel) => field.formControlName === 'activationDate'
      )! as DatepickerModel;
      activationDate.datepickerType = 'calendar';
      component.activationType?.setValue(ActivationTypeEnum.FixedOfDate);

      // act
      component.publishDate?.setValue('2022/12/12');

      // assert
      expect(activationDate.minDate).toBeDefined();
    });
  });

  describe('listenTohasNoTargetPublishDate()', () => {
    it('should set the activation type to null', () => {
      // act
      component.hasNoTargetPublishDate?.setValue(false);

      // assert
      expect(component.activationType?.value).toBeFalsy();
    });

    it('should compute activate date preview when type is n days', () => {
      // arrange
      const computeActivationDatePreviewSpy = spyOn(
        component as any,
        'computeActivationDatePreview'
      );
      component.activationType?.setValue(
        ActivationTypeEnum.NDaysFromPublishDate
      );

      // act
      component.hasNoTargetPublishDate?.setValue(true);

      // assert
      expect(computeActivationDatePreviewSpy).toHaveBeenCalledWith(
        component.activationType?.value
      );
    });
  });
});
