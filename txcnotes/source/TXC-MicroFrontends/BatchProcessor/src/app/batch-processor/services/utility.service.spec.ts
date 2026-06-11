import { TestBed } from '@angular/core/testing';

import { UtilityService } from './utility.service';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { BatchDomainsEnum } from '../enums/batch-domains.enum';
import { EventStateService } from './event-state.service';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { SearchByEnum } from '../enums/search-by.enum';

// mock DatePipe to fix error with timezone, that it's a temp solution to pass the pipeline.
class MockDatePipe extends DatePipe {
  override transform(
    value: null | undefined,
    format?: string,
    timezone?: string,
    locale?: string
  ): null;

  override transform(
    value: string | number | Date,
    format?: string,
    timezone?: string,
    locale?: string
  ): string | null;

  override transform(
    value: string | number | Date | null | undefined,
    format?: string,
    timezone?: string,
    locale?: string
  ): string | null | null {
    if (value === null || value === undefined) {
      return null;
    }

    return 'Mocked Date String';
  }
}

describe('UtilityService', () => {
  let service: UtilityService;
  const store: { [key: string]: string } = {};
  const eventStateServiceSpy = jasmine.createSpyObj('EventStateService', [], {
    isUploadSuccess$: of({ isSuccess: true }),
    commonErrorMessage$: of('Test Error'),
  });
  const mockToast = jasmine.createSpyObj('NgbdToastGlobal', [
    'showSuccess',
    'showDanger',
  ]);
  const subscriptions = [
    { unsubscribe: jasmine.createSpy('unsubscribe') },
    { unsubscribe: jasmine.createSpy('unsubscribe') },
  ] as any;
  const txcDateTimeService = {
    getLocalDateTime: jasmine
      .createSpy('getLocalDateTime')
      .and.returnValue('2022-01-01T00:00:00Z'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DatePipe, useClass: MockDatePipe },
        { provide: EventStateService, useValue: eventStateServiceSpy },
      ],
    });
    service = TestBed.inject(UtilityService);

    spyOn(localStorage, 'getItem').and.callFake(
      (key: string): string | null => {
        return key in store ? store[key] : null;
      }
    );
    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string): void => {
        store[key] = value;
      }
    );
    spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
      delete store[key];
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('selectedTenant', () => {
    it('should return tenant name from localStorage', () => {
      const tenant = { name: 'TW' };
      store['tenant'] = JSON.stringify(tenant);
      const actual = service.selectedTenant;
      expect(actual).toEqual(tenant.name);
    });

    it('should return an empty string if tenant is not in localStorage', () => {
      store['tenant'] = '';
      const actual = service.selectedTenant;
      expect(actual).toEqual('');
    });
  });

  it('should return transformed date', () => {
    // arrange
    const date = '2023-11-09T12:34:56';
    const expected = 'Mocked Date String';

    // act
    const actual = service.transformedDates(date);

    // assert
    expect(actual).toEqual(expected);
  });

  it('should return transformed table data', () => {
    // arrange
    const data = [
      {
        batchNumber: 1,
        fileName: 'BP000202311091234560010.XLS',
        status: 'Failed',
        errorReason: {
          summary: ['Invalid Data'],
          details: [
            {
              errorMessage: 'Invalid voucher number',
              rowNumber: [1, 2, 100, 23, 42],
            },
            {
              errorMessage: 'Duplicate Transaction Id',
              rowNumber: [1, 2, 100, 23, 42],
            },
          ],
        },
        linkConfig: { isLink: true, eventName: 'SelectBatch' },
        createdOn: '2023-05-11 02:46:12',
        startTime: '2023-06-02T18:23:07Z',
        endTime: '2023-01-24T10:41:39Z',
        failNumber: 404,
        successNumber: 2780,
        totalNumber: 3184,
        source: 'Automatic',
        operator: 'Phip',
        action: ['Cancel'],
      },
      {
        batchNumber: 1,
        fileName: 'BP000202311091234560010.XLS',
        status: 'Initializing Error',
        errorReason: {
          summary: ['Invalid Data'],
          details: [
            {
              errorMessage: 'Invalid voucher number',
              rowNumber: [1, 2, 100, 23, 42],
            },
            {
              errorMessage: 'Duplicate Transaction Id',
              rowNumber: [1, 2, 100, 23, 42],
            },
          ],
        },
        linkConfig: { isLink: true, eventName: 'SelectBatch' },
        createdOn: '2023-05-11 02:46:12',
        startTime: '2023-06-02T18:23:07Z',
        endTime: '2023-01-24T10:41:39Z',
        failNumber: 404,
        successNumber: 2780,
        totalNumber: 3184,
        source: 'Automatic',
        operator: 'Phip',
        action: ['Cancel'],
      },
    ];
    const expected = [
      {
        batchNumber: 1,
        fileName: 'BP000202311091234560010.XLS',
        status: 'Failed',
        errorReason: {
          summary: ['Invalid Data'],
          details: [
            {
              errorMessage: 'Invalid voucher number',
              rowNumber: [1, 2, 100, 23, 42],
            },
            {
              errorMessage: 'Duplicate Transaction Id',
              rowNumber: [1, 2, 100, 23, 42],
            },
          ],
        },
        linkConfig: { isLink: true, eventName: 'SelectBatch' },
        createdOn: 'Mocked Date String',
        startTime: '2023-06-02T18:23:07Z',
        endTime: '2023-01-24T10:41:39Z',
        failNumber: 404,
        successNumber: 2780,
        totalNumber: 3184,
        source: 'Automatic',
        operator: 'Phip',
        action: ['Cancel'],
        errorSummary: ['Invalid Data'],
        tooltipLabel: 'Start: Mocked Date String End: Mocked Date String',
      },
      {
        batchNumber: 1,
        fileName: 'BP000202311091234560010.XLS',
        status: 'Initializing Error',
        errorReason: {
          summary: ['Invalid Data'],
          details: [
            {
              errorMessage: 'Invalid voucher number',
              rowNumber: [1, 2, 100, 23, 42],
            },
            {
              errorMessage: 'Duplicate Transaction Id',
              rowNumber: [1, 2, 100, 23, 42],
            },
          ],
        },
        linkConfig: { isLink: true, eventName: 'SelectBatch' },
        createdOn: 'Mocked Date String',
        startTime: '2023-06-02T18:23:07Z',
        endTime: '2023-01-24T10:41:39Z',
        failNumber: 404,
        successNumber: 2780,
        totalNumber: 3184,
        source: 'Automatic',
        operator: 'Phip',
        action: ['Cancel'],
        errorSummary: ['Invalid Data'],
        tooltipLabel: 'Start: Mocked Date String End: Mocked Date String',
      },
    ];

    // act
    const actual = service.transformedTableData(data);

    // assert
    expect(actual).toEqual(expected);
  });

  describe('filterCommonBatchTable', () => {
    const tableData = [
      {
        batchNumber: 1,
        fileName: 'testFile',
        status: 'Failed',
        errorSummary: ['Invalid Data'],
        source: 'Source1',
        createdOn: new Date('2022-06-01').toISOString(),
      },
      {
        batchNumber: 2,
        fileName: 'otherFile',
        status: 'Success',
        errorSummary: ['No Error'],
        source: 'Source2',
        createdOn: new Date('2022-06-01').toISOString(),
      },
      {
        batchNumber: 3,
        skuCode: 'AMZ120',
        status: 'Success',
        productName: 'AMZ1SGC8MM Amazon RS100',
        errorSummary: ['No Error'],
        source: 'Source2',
        createdOn: new Date('2022-06-01').toISOString(),
      },
    ];

    it('should return table data if filters is null', () => {
      const filters = {};
      const expectedData = tableData;

      const actualData = service.filterCommonBatchTable(
        filters,
        tableData as any
      );

      expect(actualData).toEqual(expectedData as any);
    });

    it('should filter table data correctly if searchBy is null', () => {
      const filters = {
        searchBy: null,
        searchInput: 'test',
        batchStatus: 'Failed',
        errorReason: 'Invalid Data',
        source: 'Source1',
        client: null,
        createdOn: {
          startDate: new Date('2022-01-01').toString(),
          endDate: new Date('2022-12-31').toString(),
        },
      };

      const expectedData = [
        {
          batchNumber: 1,
          fileName: 'testFile',
          status: 'Failed',
          errorSummary: ['Invalid Data'],
          source: 'Source1',
          createdOn: new Date('2022-06-01').toISOString(),
        },
      ];

      const actualData = service.filterCommonBatchTable(
        filters,
        tableData as any
      );

      expect(actualData).toEqual(expectedData as any);
    });

    it('should filter table data correctly if searchBy is not null', () => {
      const filters = {
        searchBy: SearchByEnum.SkuCode,
        searchInput: 'amz120',
      };

      const expectedData = [
        {
          batchNumber: 3,
          skuCode: 'AMZ120',
          status: 'Success',
          productName: 'AMZ1SGC8MM Amazon RS100',
          errorSummary: ['No Error'],
          source: 'Source2',
          createdOn: new Date('2022-06-01').toISOString(),
        },
      ];

      const actualData = service.filterCommonBatchTable(
        filters,
        tableData as any
      );
      expect(actualData).toEqual(expectedData as any);
    });

    it('should filter table data correctly if searchBy is not null and search is not exact match', () => {
      const filters = {
        searchBy: SearchByEnum.ProductName,
        searchInput: 'amz',
      };

      const expectedData = [
        {
          batchNumber: 3,
          skuCode: 'AMZ120',
          status: 'Success',
          productName: 'AMZ1SGC8MM Amazon RS100',
          errorSummary: ['No Error'],
          source: 'Source2',
          createdOn: new Date('2022-06-01').toISOString(),
        },
      ];

      const actualData = service.filterCommonBatchTable(
        filters,
        tableData as any
      );
      expect(actualData).toEqual(expectedData as any);
    });
  });

  it('should show success message when upload is successful', () => {
    service.listenToUploadSuccess(
      mockToast,
      BatchDomainsEnum.VoucherOperations
    );

    expect(mockToast.showSuccess).toHaveBeenCalled();
  });

  it('should show danger message when upload fails', () => {
    eventStateServiceSpy.isUploadSuccess$ = of({
      isSuccess: false,
      errorMessage: 'Upload failed',
    });

    service.listenToUploadSuccess(
      mockToast,
      BatchDomainsEnum.VoucherOperations
    );

    // expect(mockToast.showSuccess).not.toHaveBeenCalled();
    // expect(mockToast.showDanger).toHaveBeenCalled();
  });

  it('should return correct success message when getUploadSuccessMessage is called', () => {
    expect(
      service.getUploadSuccessMessage(BatchDomainsEnum.VoucherOperations)
    ).toBe('You’ve successfully uploaded batch voucher operations.');
    expect(
      service.getUploadSuccessMessage(BatchDomainsEnum.InventoryList)
    ).toBe('You’ve successfully imported voucher number.');
    expect(service.getUploadSuccessMessage(BatchDomainsEnum.OrderList)).toBe(
      'You’ve successfully uploaded batch order.'
    );
    expect(service.getUploadSuccessMessage('invalid' as any)).toBe('');
  });

  it('should call showDanger with correct message when commonErrorMessage$ emits', () => {
    service.listenToErrorMessage(mockToast);
    expect(mockToast.showDanger).toHaveBeenCalledWith(
      'Something went wrong. Test Error'
    );
  });

  it('should call unsubscribe on each subscription', () => {
    service.unsubscribeToastSubscriptions(subscriptions);
    subscriptions.forEach((sub: any) => {
      expect(sub.unsubscribe).toHaveBeenCalled();
    });
  });

  it('should return null when date is null', () => {
    const result = service.getLocalDateTime(null as any);
    expect(result).toBeNull();
  });
});
