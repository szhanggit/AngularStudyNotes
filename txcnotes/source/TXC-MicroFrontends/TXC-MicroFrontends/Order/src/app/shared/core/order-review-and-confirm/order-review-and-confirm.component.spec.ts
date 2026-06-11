import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';

import { OrderReviewAndConfirmComponent } from './order-review-and-confirm.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivationTypeEnum } from '../../enums/activation-type.enum';

describe('OrderReviewAndConfirmComponent', () => {
  let mockDatePipe: DatePipe;
  let component: OrderReviewAndConfirmComponent;
  let fixture: ComponentFixture<OrderReviewAndConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderReviewAndConfirmComponent],
      imports: [HttpClientTestingModule],
      providers: [DatePipe, FormBuilder],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(OrderReviewAndConfirmComponent);
    mockDatePipe = new DatePipe('en-US');
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
    component.settingsFormGroup = fb.group({
      excelFormat: '',
      excelShortUrl: '',
      barcodeInfo: '',
      emailAttachment: '',
      shortUrlAuthCodeGenerationWay: '',
      generateSequenceNumber: '',
      channelId: '',
    });
    component.memoFormGroup = fb.group({
      memo: '',
    });
    component.attachmentFormGroup = fb.group({
      attachments: '',
    });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.deliveryDetailsFormModel).toBeDefined();
    expect(component.productSelectionTableModel).toBeDefined();
  });

  it('ngOnChanges should call assignSelectedProductsSummaryValues', () => {
    // arrange
    // const assignSelectedProductsSummaryValues = spyOn(component as any, 'assignSelectedProductsSummaryValues');
    const expectedTotalProductQuantity = 1;
    const expectedVoucherQuantity = 10;
    const expectedEmailQuantity = 5;
    const expectedSmsQuantity = 5;
    component.productList = [
      {
        isChildProduct: false,
        voucherQuantity: 10,
        emailQuantity: 5,
        smsQuantity: 5,
      } as any,
    ];

    // act
    component.ngOnChanges();

    // assert
    expect(component.totalProductQuantity).toBe(expectedTotalProductQuantity);
    expect(component.totalVoucherQuantity).toBe(expectedVoucherQuantity);
    expect(component.totalEmailQuantity).toBe(expectedEmailQuantity);
    expect(component.totalSmsQuantity).toBe(expectedSmsQuantity);
  });

  describe('getNdaysFromPublishDate()', () => {
    it('should return --', () => {
      // arrange
      const expectedLabel = '--';
      component.basicInfoFormGroup.get('afterPublished')?.setValue(10);

      // act
      const actualLabel = component.getNdaysFromPublishDate();

      // assert
      expect(actualLabel).toBe(expectedLabel);
    });

    it('should return correct label', () => {
      // arrange
      const expectedLabel = '10 days from publish date';
      component.basicInfoFormGroup.get('afterPublished')?.setValue(10);
      component.basicInfoFormGroup
        .get('activationType')
        ?.setValue(ActivationTypeEnum.NDaysFromPublishDate);

      // act
      const actualLabel = component.getNdaysFromPublishDate();

      // assert
      expect(actualLabel).toBe(expectedLabel);
    });
  });

  it('onShowChildProduct should set showChildProduct ', () => {
    // act
    component.onShowChildProduct(true);

    // assert
    expect(component.showChildProduct).toBeTrue();
  });

  it('onEditClicked should emit jumpToStep ', () => {
    // arrange
    const jumpToStep = spyOn(component.jumpToStep, 'emit');
    // act
    component.onEditClicked(1);

    // assert
    expect(jumpToStep).toHaveBeenCalledWith(1);
  });

  describe('getComputedActivatedDate', () => {
    it('should return "NA" when date or n is not provided', () => {
      // act
      const actualDate = component.getComputedActivatedDate();
      // assert
      expect(actualDate).toEqual('NA');
    });
  
    it('should return "NA" when date is invalid', () => {
      // arrange
      component.basicInfoFormGroup.get('publishDate')?.setValue({ _d: 'Invalid date' });
      component.basicInfoFormGroup.get('afterPublished')?.setValue(5);
  
      // act
      const actualDate = component.getComputedActivatedDate();
  
      // assert
      expect(actualDate).toEqual('NA');
    });
  
    it('should return the computed activated date', () => {
      // arrange
      component.basicInfoFormGroup.get('publishDate')?.setValue({ _d: new Date('2023-08-16') });
      component.basicInfoFormGroup.get('afterPublished')?.setValue(5);
      const expectedDate = new Date('2023-08-16');
      expectedDate.setDate(expectedDate.getDate() + 5);
      const expectedTransformedDate = mockDatePipe.transform(expectedDate, 'YYYY/MM/dd hh:mm a');
  
      // act
      const actualDate = component.getComputedActivatedDate();
      // assert
      expect(actualDate)
        .toEqual(expectedTransformedDate);
    });
  });
});
