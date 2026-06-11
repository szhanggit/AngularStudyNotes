import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { DirectDeliveryDetailsComponent } from './direct-delivery-details.component';
import { of } from 'rxjs';
import { FromUploadStateService } from 'src/app/order/services/state-service/from-upload-state.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '@txc-angular/component-library';
import { ProductTypeEnum } from 'src/app/shared/enums/product-type.enum';
import { AddDeliveryDetailsModalComponent } from './add-delivery-details-modal/add-delivery-details-modal.component';

describe('DirectDeliveryDetailsComponent', () => {
  const fromUploadStateServiceSpy = jasmine.createSpyObj(
    'FromUploadStateService',
    ['setDeliveryDetailsFromUpload'],
    {
      fromUpload$: of({
        fromUploadState: [
          {
            productId: 1,
            deliveryDetailsFromUpload: true,
          },
        ],
      }),
    }
  );
  const modalSvcSpy = jasmine.createSpyObj('NgbModal', ['open']);
  let component: DirectDeliveryDetailsComponent;
  let fixture: ComponentFixture<DirectDeliveryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirectDeliveryDetailsComponent],
      providers: [
        {
          provide: FromUploadStateService,
          useValue: fromUploadStateServiceSpy,
        },
        {
          provide: NgbModal,
          useValue: modalSvcSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectDeliveryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deliveryDetailsTableModel should return table model', () => {
    // arrange
    component.tableHeaders = [];
    component.tableRows = [];

    // act
    const result = component.deliveryDetailsTableModel;

    // assert
    expect(result).toEqual({
      tableHeaders: [],
      tableRows: [],
    });
  });

  it('mappedTableRows should return mapped table rows', () => {
    // arrange
    component.tableRows = [
      { data: [{ field: 'postCodeAddress', value: 'value' }] },
    ];

    // act
    const result = component.mappedTableRows;

    // assert
    expect(result.length).toBe(1);
  });

  it('initializeDeliveryListTableEdit should emit direct delivery props', () => {
    // arrange
    component.editMode = true;
    component.selectedProduct = {
      directDeliveryDetails: [
        {
          beneficiaryName: 'test',
          contactInfoEmailAddress: 'test',
          contactInfoPhoneNumber: 'test',
          faceValue: 10,
          voucherQuantity: 10,
          edOrderNumber: 'test',
          language: 'test',
          postCodeAddress: 'test',
          emailQty: 10,
          smsQty: 10,
        },
      ],
    } as any;
    const emitDirectDeliveryPropsSpy = spyOn(
      component,
      'emitDirectDeliveryDetailProps'
    );

    // act
    component.initializeDeliveryListTableEdit();

    // assert
    expect(emitDirectDeliveryPropsSpy).toHaveBeenCalledWith(true);
  });

  describe('downloadTemplate', () => {
    it('should stop propagation', () => {
      // arrange
      environment.local = true;
      const event = {
        stopPropagation: jasmine.createSpy(),
      };

      // act
      component.downloadTemplate(event as any);

      // assert
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should stop propagation on deploy', () => {
      // arrange
      environment.local = false;
      const event = {
        stopPropagation: jasmine.createSpy(),
      };

      // act
      component.downloadTemplate(event as any);

      // assert
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('onBatchUploadClicked', () => {
    it('should click inputFile', () => {
      // arrange
      component.tableRows = [];
      const clickSpy = spyOn(component.inputFile.nativeElement, 'click');

      // act
      component.onBatchUploadClicked();

      // assert
      expect(clickSpy).toHaveBeenCalled();
    });

    it('should open confirmation modal and confirm and click inputFile', fakeAsync(() => {
      // arrange
      const clickSpy = spyOn(component.inputFile.nativeElement, 'click');
      modalSvcSpy.open.and.returnValue({
        result: Promise.resolve('confirm'),
        componentInstance: {},
      });
      component.tableRows = [{} as any];

      // act
      component.onBatchUploadClicked();
      tick();

      // assert
      expect(modalSvcSpy.open).toHaveBeenCalledWith(
        ConfirmationModalComponent,
        {
          size: 'md',
          backdrop: 'static',
          centered: true,
        }
      );
      expect(clickSpy).toHaveBeenCalled();
    }));
  });

  describe('onFileSelected', () => {
    beforeEach(() => {
      // arrange
      component.deliveryDetailsErrorMessages = [{} as any];
      component.tableRows = [{} as any];
      component.inputFile.nativeElement.value = '';
      component.mockSimulation = {
        simulateDuplicateError: false,
        simulateValidationError: false,
      };
      component.selectedProduct = {
        id: 1,
        productType: ProductTypeEnum.DynamicFaceValue,
      } as any;
    });

    it('should set inputFile as null and reset error messages', () => {
      // act
      component.onFileSelected({ target: { files: [{ name: 'file.xls' }] } });

      // assert
      expect(component.deliveryDetailsErrorMessages).toEqual([]);
      expect(component.inputFile.nativeElement.value).toBeFalsy();
      expect(
        fromUploadStateServiceSpy.setDeliveryDetailsFromUpload
      ).toHaveBeenCalledWith(1, true);
    });

    it('should return error if file uploaded it invalid extension', () => {
      // act
      component.onFileSelected({ target: { files: [{ name: 'file.pdf' }] } });

      // assert
      expect(component.deliveryDetailsErrorMessages.length).toEqual(1);
      expect(component.inputFile.nativeElement.value).toBeFalsy();
    });

    it('should return error if file uploaded has duplicate', () => {
      // arrange
      component.mockSimulation = {
        simulateDuplicateError: true,
        simulateValidationError: false,
      };

      // act
      component.onFileSelected({ target: { files: [{ name: 'file.xls' }] } });

      // assert
      expect(component.deliveryDetailsErrorMessages.length).toEqual(1);
      expect(component.inputFile.nativeElement.value).toBeFalsy();
      expect(
        fromUploadStateServiceSpy.setDeliveryDetailsFromUpload
      ).toHaveBeenCalledWith(1, true);
    });

    it('should return error if file uploaded has validation error', () => {
      // arrange
      component.mockSimulation = {
        simulateDuplicateError: false,
        simulateValidationError: true,
      };

      // act
      component.onFileSelected({ target: { files: [{ name: 'file.xls' }] } });

      // assert
      expect(component.deliveryDetailsErrorMessages.length).toEqual(1);
      expect(component.inputFile.nativeElement.value).toBeFalsy();
      expect(
        fromUploadStateServiceSpy.setDeliveryDetailsFromUpload
      ).toHaveBeenCalledWith(1, true);
    });
  });

  it('openAddDeliveryDetailsModal should open add delivery details modal', () => {
    // arrange
    component.deliveryDetailsErrorMessages = [{} as any];
    component.tableRows = [{} as any];
    component.inputFile.nativeElement.value = '';
    component.mockSimulation = {
      simulateDuplicateError: false,
      simulateValidationError: false,
    };
    component.selectedProduct = {
      id: 1,
      productType: ProductTypeEnum.DynamicFaceValue,
    } as any;
    const emitDetailPropSpy = spyOn(component, 'emitDirectDeliveryDetailProps');
    const setModalPropSpy = spyOn(component, 'setModalProperties');
    modalSvcSpy.open.and.returnValue({
      result: Promise.resolve('confirm'),
      dismissed: of([{} as any]),
      componentInstance: {},
    });

    // act
    component.openAddDeliveryDetailsModal();

    // assert
    expect(modalSvcSpy.open).toHaveBeenCalledWith(
      AddDeliveryDetailsModalComponent,
      {
        size: 'lg',
        backdrop: 'static',
        centered: true,
      }
    );
    expect(
      fromUploadStateServiceSpy.setDeliveryDetailsFromUpload
    ).toHaveBeenCalledWith(1, false);
    expect(emitDetailPropSpy).toHaveBeenCalled();
    expect(setModalPropSpy).toHaveBeenCalled();
  });

  it('deleteClicked should emit direct delivery detail props ', () => {
    // arrange
    const emitDetailPropSpy = spyOn(component, 'emitDirectDeliveryDetailProps');

    // act
    component.deleteClicked();

    // assert
    expect(emitDetailPropSpy).toHaveBeenCalled();
  });

  it('editClicked should open add delivery details modal', fakeAsync(() => {
    // arrange
    modalSvcSpy.open.and.returnValue({
      result: Promise.resolve('confirm'),
      dismissed: of([
        { data: 'test', field: 'postCodeAddress', value: 'test' },
      ]),
      componentInstance: {},
    });
    const emitDetailPropSpy = spyOn(component, 'emitDirectDeliveryDetailProps');
    const setModalPropSpy = spyOn(component, 'setModalProperties');
    component.tableRows = [{ data: {} as any }];

    // act
    component.editClicked({
      row: [{ data: 'test', field: 'postCodeAddress', value: 'test' }],
      index: 0,
    });
    tick();

    // assert
    expect(modalSvcSpy.open).toHaveBeenCalledWith(
      AddDeliveryDetailsModalComponent,
      {
        size: 'lg',
        backdrop: 'static',
        centered: true,
      }
    );
    expect(emitDetailPropSpy).toHaveBeenCalled();
    expect(setModalPropSpy).toHaveBeenCalled();
  }));

  it('setModalProperties should set modalRef to current values', () => {
    // arrange
    component.selectedProduct = {
      faceValueRange: '1 to 10',
      productType: ProductTypeEnum.ProductBased,
    } as any;
    const actualModalRef = { componentInstance: {} as any };
    const expectedMappedTableRows = component.mappedTableRows;

    // act
    component.setModalProperties(actualModalRef as any);

    // assert
    expect(actualModalRef.componentInstance.faceValueRange).toBe('1 to 10');
    expect(actualModalRef.componentInstance.productType).toBe(
      ProductTypeEnum.ProductBased
    );
    expect(actualModalRef.componentInstance.existingTableRows).toEqual(
      expectedMappedTableRows
    );
  });
});
